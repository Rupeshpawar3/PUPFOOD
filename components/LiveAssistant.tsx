import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface LiveAssistantProps {
  onClose: () => void;
}

// Audio Utils
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  const binary = new Uint8Array(int16.buffer);
  let binaryString = '';
  for (let i = 0; i < binary.byteLength; i++) {
    binaryString += String.fromCharCode(binary[i]);
  }

  return {
    data: btoa(binaryString),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'error'>('connecting');
  const [transcription, setTranscription] = useState<string>('');

  // Refs for audio handling to avoid re-renders or closure staleness
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const aiRef = useRef<GoogleGenAI | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
    }

    // Stop all playing sources
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { }
    });
    sourcesRef.current.clear();

    // Close session if possible
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => {
        try { session.close(); } catch (e) { }
      });
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      aiRef.current = ai;

      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });

      const outputNode = audioContextRef.current.createGain();
      outputNode.connect(audioContextRef.current.destination);

      // Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Start Gemini Session
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');

            // Setup Input Stream
            if (!inputAudioContextRef.current) return;

            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;

            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              setStatus('speaking');
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                  setStatus('listening');
                }
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) { }
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }

            // Transcription (optional feedback)
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              setTranscription(message.serverContent.modelTurn.parts[0].text);
            }
          },
          onclose: () => {
            console.log("Session closed");
            onClose();
          },
          onerror: (e) => {
            console.error("Session error", e);
            setStatus('error');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: "You are a helpful, energetic AI assistant for a dog owner named 'Bruno'. Keep answers concise, friendly, and dog-focused."
        }
      });
      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error("Connection failed", err);
      setStatus('error');
    }
  }, [onClose]);

  useEffect(() => {
    connect();
    return () => cleanup();
  }, [connect, cleanup]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      {/* Decorative Top Right Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M150,-20 Q180,50 220,20" fill="none" stroke="white" strokeWidth="0.5"></path>
          <path d="M140,-20 Q170,60 220,30" fill="none" stroke="white" strokeWidth="0.5"></path>
          <path d="M130,-20 Q160,70 220,40" fill="none" stroke="white" strokeWidth="0.5"></path>
          <path d="M120,-20 Q150,80 220,50" fill="none" stroke="white" strokeWidth="0.5"></path>
          <path d="M110,-20 Q140,90 220,60" fill="none" stroke="white" strokeWidth="0.5"></path>
          <path d="M100,-20 Q130,100 220,70" fill="none" stroke="white" strokeWidth="0.5"></path>
          <path d="M90,-20 Q120,110 220,80" fill="none" stroke="white" strokeWidth="0.5"></path>
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative w-full h-full max-w-md flex flex-col items-center justify-between py-10 px-6">

        {/* Top Status Badge */}
        <div className="flex flex-col items-center z-10 w-full pt-8">
          <div className="bg-[#D4FF33] text-black px-5 py-2 rounded-full text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(212,255,51,0.4)]">
            AI Buddy
          </div>
          <div className="flex items-center mt-3 space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-[#D4FF33]'
              } ${status !== 'error' ? 'animate-pulse' : ''}`}></div>
            <span className="text-xs text-gray-400 font-medium">
              {status === 'connecting' && 'Connecting...'}
              {status === 'listening' && 'Online'}
              {status === 'speaking' && 'Speaking'}
              {status === 'error' && 'Offline'}
            </span>
          </div>
        </div>

        {/* Center Glass Sphere */}
        <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
          <div className={`w-64 h-64 relative transition-all duration-700 ${status === 'speaking' ? 'animate-float scale-110' : 'animate-float'
            }`}>
            {/* Glass Sphere with Gradients */}
            <div
              className="absolute inset-0 rounded-full opacity-90 mix-blend-screen"
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 20%),
                  radial-gradient(circle at 70% 60%, #6366F1 0%, transparent 50%),
                  radial-gradient(circle at 30% 70%, #EC4899 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, #A855F7 0%, transparent 50%)
                `,
                boxShadow: `
                  inset -10px -10px 20px rgba(0, 0, 0, 0.5),
                  inset 10px 10px 20px rgba(255, 255, 255, 0.4),
                  0 0 30px rgba(99, 102, 241, 0.3)
                `,
                backdropFilter: 'blur(10px)'
              }}
            ></div>

            {/* Inner Gradient Glow */}
            <div className={`absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 blur-xl ${status === 'speaking' ? 'opacity-80 animate-pulse' : 'opacity-60'
              }`}></div>

            {/* Top Left Highlight */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-white opacity-20 blur-2xl rounded-full"></div>

            {/* Bottom Right Accent */}
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-blue-400 opacity-30 blur-xl rounded-full"></div>

            {/* Iridescent Overlay Image */}
            <img
              alt="Iridescent fluid glass sphere"
              className="absolute inset-0 w-full h-full object-cover rounded-full mix-blend-overlay opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrsgRM3LSp-vjvYKQqFMokyHGgaK_C3dCeJxV5hMNImVOj5IiGUik-Ud_g7iRvIzDDFaKBbVaY2Pygcq3LvzQQ8XRBrmw0pTvfAo281_RIS0lQh420u09HOkckY1e30KGR59i34E0NPol6V975jXrI2VtzskCspdbxkhe860gxqh2DD0dHj3JHoMR8gzJzYftUbVS8eEFVn6aEEegnveZwgFDLKv86vrdC4qbkCI2_Lu30kaz7xCs_SVKKm52CjYMW7V2PpaGJxeI"
              style={{
                maskImage: 'radial-gradient(circle, white 40%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle, white 40%, transparent 70%)'
              }}
            />

            {/* Error State Overlay */}
            {status === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm rounded-full border-2 border-red-500">
                <span className="material-symbols-outlined text-red-500 text-6xl">error</span>
              </div>
            )}
          </div>
        </div>

        {/* Transcription Text */}
        <div className="w-full text-center px-4 mb-12 z-10">
          {transcription ? (
            <h1 className="text-2xl font-light leading-relaxed tracking-wide text-white/90">
              {transcription}
            </h1>
          ) : (
            <h1 className="text-xl font-light leading-relaxed tracking-wide text-white/70">
              {status === 'error'
                ? "Please check your microphone permissions and try again."
                : status === 'connecting'
                  ? "Getting ready to assist you..."
                  : (
                    <>
                      Ask me anything about{' '}
                      <span className="text-gray-500">dog care, nutrition,</span>
                      <br />
                      or health
                    </>
                  )}
            </h1>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="w-full flex items-center justify-between px-4 pb-8 z-10 relative">
          {/* Keyboard Button (History) */}
          <button
            className="w-12 h-12 rounded-full bg-[#8B7EAC] flex items-center justify-center hover:opacity-80 transition-opacity shadow-lg active:scale-95"
            onClick={() => {/* TODO: Add history */ }}
          >
            <span className="material-symbols-outlined text-white text-xl">history</span>
          </button>

          {/* Main Mic Button with Ripples */}
          <div className="relative flex items-center justify-center">
            {/* Ripple Rings - Only when listening or speaking */}
            {(status === 'listening' || status === 'speaking') && (
              <>
                <div
                  className="absolute w-24 h-24 border border-[#D4FF33]/30 rounded-full animate-ripple"
                  style={{ animationDelay: '0s' }}
                ></div>
                <div
                  className="absolute w-24 h-24 border border-[#D4FF33]/30 rounded-full animate-ripple"
                  style={{ animationDelay: '0.6s' }}
                ></div>
                <div
                  className="absolute w-24 h-24 border border-[#D4FF33]/30 rounded-full animate-ripple"
                  style={{ animationDelay: '1.2s' }}
                ></div>
              </>
            )}

            {/* Outer Ring */}
            <div className="absolute w-28 h-28 border border-white/10 rounded-full"></div>

            {/* Mic Button */}
            <button
              className={`w-20 h-20 rounded-full flex items-center justify-center z-20 active:scale-95 transition-all ${status === 'listening' || status === 'speaking'
                  ? 'bg-[#D4FF33] shadow-[0_0_20px_rgba(212,255,51,0.5)]'
                  : 'bg-white/10 border border-white/20'
                }`}
              disabled={status === 'connecting' || status === 'error'}
            >
              <span className={`material-symbols-outlined text-3xl ${status === 'listening' || status === 'speaking' ? 'text-black' : 'text-white/60'
                }`}>
                {status === 'listening' || status === 'speaking' ? 'mic' : 'mic_off'}
              </span>
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/5 active:scale-95"
          >
            <span className="material-symbols-outlined text-gray-400 text-xl">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;