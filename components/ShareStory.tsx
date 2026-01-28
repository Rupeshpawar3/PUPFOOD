import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../services/geminiService';

interface ShareStoryProps {
  onBack: () => void;
  onComplete: () => void;
}

const ShareStory: React.FC<ShareStoryProps> = ({ onBack, onComplete }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          audioChunksRef.current = [];

          recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
          recorder.onstop = async () => {
               const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
               const reader = new FileReader();
               reader.readAsDataURL(blob);
               reader.onloadend = async () => {
                   const base64Data = reader.result as string;
                   const base64Content = base64Data.split(',')[1];
                   setIsTranscribing(true);
                   try {
                       const transcript = await transcribeAudio(base64Content);
                       setText(prev => (prev ? prev + " " + transcript : transcript));
                   } finally {
                       setIsTranscribing(false);
                   }
               };
          };

          recorder.start();
          setIsRecording(true);
      } catch (e) {
          console.error("Mic error", e);
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
          setIsRecording(false);
      }
  };

  const toggleRecording = () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0d1c12] dark:text-[#f6f8f6] font-display min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-[#0d1c12]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm transition-colors">
        <button 
            onClick={onBack}
            aria-label="Go back" 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10 transition-colors"
        >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] pr-12">Share Story</h2>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-4 pb-32 pt-2 gap-8">
        {/* Photo Upload Section */}
        <section aria-label="Photo Upload">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center aspect-square w-full rounded-[2.5rem] border-2 border-dashed border-[#cfe8d7] dark:border-[#2a4533] bg-white dark:bg-[#1a2e22] hover:bg-[#f0fdf4] dark:hover:bg-[#1e3628] transition-all cursor-pointer overflow-hidden shadow-sm"
            >
                {imagePreview ? (
                    <img src={imagePreview} alt="Story upload" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-4 transition-transform group-hover:scale-105 duration-300">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9] dark:bg-[#2e4b3a] text-primary">
                            <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                        </div>
                        <p className="text-lg font-bold leading-tight tracking-tight text-center max-w-[200px]">Tap to Add Photo</p>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
            </button>
        </section>

        {/* Voice Recording Section */}
        <section aria-label="Voice Recording" className="flex flex-col items-center gap-6">
            <div className="text-center space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">Tell your story</h3>
                <p className="text-[#4b9b65] dark:text-[#6cc489] text-sm font-medium">
                    {isRecording ? "Recording..." : isTranscribing ? "Transcribing..." : "Tap to record voice caption"}
                </p>
            </div>
            
            {/* Microphone FAB */}
            <button 
                onClick={toggleRecording}
                disabled={isTranscribing}
                className={`relative group flex h-24 w-24 items-center justify-center rounded-full transition-all outline-none focus-visible:ring-4 ring-primary/30 ${isRecording ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary/20 dark:bg-primary/10 hover:bg-primary/30 active:scale-95 active:bg-primary/40'}`}
            >
                {isTranscribing ? (
                     <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
                ) : (
                    <span className={`material-symbols-outlined text-4xl transition-transform group-hover:scale-110 ${isRecording ? 'text-red-500 animate-pulse' : 'text-[#0d1c12] dark:text-primary'}`}>
                        {isRecording ? 'stop' : 'mic'}
                    </span>
                )}
                
                {/* Animated Rings (Visual cue) */}
                {!isRecording && !isTranscribing && (
                    <>
                        <div className="absolute inset-0 rounded-full border border-primary/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                        <div className="absolute inset-0 rounded-full border border-primary/10 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 delay-100"></div>
                    </>
                )}
                {isRecording && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-ping"></div>
                )}
            </button>

            {/* Audio Waveform Visualization Placeholder */}
            <div aria-hidden="true" className="flex items-center justify-center gap-1 h-8 w-full max-w-[180px] opacity-40">
                {[2, 3, 5, 3, 6, 4, 7, 4, 3, 2].map((h, i) => (
                    <div 
                        key={i} 
                        className={`w-1 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary'}`} 
                        style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                ))}
            </div>
        </section>

        {/* Optional Text Input */}
        <section className="w-full">
            <label className="sr-only" htmlFor="story-text">Additional Story Text</label>
            <div className="relative">
                <textarea 
                    id="story-text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full resize-none rounded-[1.5rem] border-none bg-white dark:bg-[#1a2e22] p-5 text-base shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus:ring-2 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow outline-none dark:text-white" 
                    placeholder="Write a short caption (optional)..." 
                    rows={3}
                ></textarea>
                <div className="absolute bottom-4 right-4 pointer-events-none">
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg">edit</span>
                </div>
            </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12 z-10">
        <div className="max-w-lg mx-auto">
            <button 
                onClick={onComplete}
                className="w-full flex h-16 cursor-pointer items-center justify-center gap-3 rounded-full bg-primary text-[#0d1c12] shadow-lg shadow-primary/25 hover:bg-[#0bc048] hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200"
            >
                <span className="text-lg font-bold tracking-wide">Share with Community</span>
                <span className="material-symbols-outlined text-xl font-bold">send</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareStory;