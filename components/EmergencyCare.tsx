import React, { useState } from 'react';
import { View } from '../types';

interface EmergencyCareProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
}

interface Hospital {
  name: string;
  distance: string;
  address: string;
}

const EmergencyCare: React.FC<EmergencyCareProps> = ({ onBack, onNavigate }) => {
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [showHospitalList, setShowHospitalList] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [permissionErrorMsg, setPermissionErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleCallVet = () => {
    try {
      window.location.href = 'tel:+1234567890';
    } catch (error) {
      setPermissionErrorMsg('Unable to make call. Please check permissions.');
      setShowPermissionError(true);
    }
  };

  const handleStartVoiceMode = async () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setPermissionErrorMsg('Voice recognition is not supported in your browser.');
        setShowPermissionError(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      setShowVoiceAssistant(true);
      setVoiceTranscript('');
      setAIResponse('');
    } catch (error) {
      setPermissionErrorMsg('Microphone permission denied. Please enable microphone access.');
      setShowPermissionError(true);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setIsListening(false);
      processEmergencyQuery(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setPermissionErrorMsg('Voice recognition error. Please try again.');
      setShowPermissionError(true);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const processEmergencyQuery = (query: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let response = '';

      if (lowerQuery.includes('choking')) {
        response = `CHOKING EMERGENCY:\n\n1. Stay calm. Assess if dog can cough.\n2. If coughing, encourage it.\n3. If not breathing:\n   - Open mouth, look for obstruction\n   - Heimlich: hands below rib cage, thrust up 5x\n4. Remove visible object\n5. Call vet: +1-234-567-890\n\n⚠️ Hospital if breathing doesn't restore!`;
      } else if (lowerQuery.includes('bleed')) {
        response = `BLEEDING:\n\n1. Apply direct pressure with clean cloth\n2. Elevate wound above heart\n3. Pressure for 5-10 min\n4. Don't remove cloth, add more\n5. Call vet: +1-234-567-890\n\n⚠️ Hospital if bleeding won't stop!`;
      } else if (lowerQuery.includes('poison')) {
        response = `POISONING:\n\n1. Identify substance\n2. DON'T induce vomiting\n3. Remove from mouth\n4. Poison Hotline: 1-800-213-6680\n5. Call vet: +1-234-567-890\n\n⚠️ GO TO HOSPITAL NOW!`;
      } else {
        response = `Emergency Protocol:\n1. Stay calm\n2. Check breathing/consciousness\n3. Call vet: +1-234-567-890\n4. Keep pet warm\n5. No food/water\n\nDescribe specific symptoms for detailed guidance.`;
      }

      setAIResponse(response);
      setIsProcessing(false);
      speak(response.substring(0, 150));
    }, 1500);
  };

  const handleFindHospital = async () => {
    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setNearbyHospitals([
        { name: 'Pet Emergency Center', distance: '2.4 mi', address: '123 Main St, City, ST 12345' },
        { name: 'VCA Animal Hospital', distance: '3.1 mi', address: '456 Oak Ave, City, ST 12345' },
        { name: '24/7 Vet Emergency', distance: '4.2 mi', address: '789 Pine Rd, City, ST 12345' }
      ]);
      setShowHospitalList(true);
    } catch (error) {
      setPermissionErrorMsg('Location permission denied. Enable location to find hospitals.');
      setShowPermissionError(true);
    }
  };

  const navigateToHospital = (hospital: Hospital) => {
    const encoded = encodeURIComponent(hospital.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, '_blank');
  };

  const handleSOSConfirm = () => {
    setShowSOSConfirm(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => console.log('Emergency location:', pos.coords.latitude, pos.coords.longitude)
      );
    }
    window.location.href = 'tel:911';
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-[#0A0C10] overflow-hidden border-x border-white/5 pb-8 flex flex-col font-display">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-8 pt-4 pb-2 z-50 relative text-[#94A3B8]">
        <span className="text-sm font-semibold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>9:41</span>
        <div className="flex items-center space-x-1.5">
          <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>wifi</span>
          <span className="material-symbols-outlined text-sm rotate-90" style={{ fontSize: '18px' }}>battery_full</span>
        </div>
      </div>

      <main className="flex-1 relative z-10 flex flex-col px-5 pt-4">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#1A1C1E] border border-[#475550] flex items-center justify-center text-[#94A3B8] hover:text-white transition" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-[#1A1C1E] border border-[#475550] flex items-center justify-center text-[#EF4444] animate-pulse hover:text-white transition" style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.3), 0 10px 20px rgba(0,0,0,0.5)' }}>
            <span className="material-symbols-outlined">e911_emergency</span>
          </button>
        </div>

        {/* Emergency Orb */}
        <div className="relative w-full flex justify-center mb-8">
          <div className="w-48 h-48 rounded-full flex flex-col items-center justify-center relative z-10" style={{
            backgroundColor: '#0A0C10',
            boxShadow: 'inset 0 0 50px rgba(239, 68, 68, 0.5), 0 0 20px rgba(0,0,0,0.8)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            animation: 'glowPulse 3s ease-in-out infinite'
          }}>
            <span className="material-symbols-outlined text-white text-5xl mb-2" style={{ filter: 'drop-shadow(0 0 15px rgba(239,68,68,0.8))', fontVariationSettings: "'FILL' 1" }}>crisis_alert</span>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>EMERGENCY</h1>
            <div className="mt-2 w-12 h-1 bg-gradient-to-r from-transparent via-[#EF4444] to-transparent opacity-80"></div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-5 flex-1 overflow-y-auto pb-4">
          {/* Call Local Vet Card */}
          <div className="bg-[#1A1C1E] border border-[#475550] rounded-[2rem] p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F59E0B]/20 to-orange-500/10 border border-[#F59E0B]/30 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(245,158,11,0.2)' }}>
                  <span className="material-symbols-outlined text-[#F59E0B] text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))', fontVariationSettings: "'FILL' 1" }}>call</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Call Local Vet</h2>
                  <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider mt-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Dr. Sarah • 0.8 mi</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <span className="material-symbols-outlined text-white/80 text-xl">volume_up</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Listen</span>
              </button>
              <button onClick={handleCallVet} className="h-10 px-6 rounded-full bg-[#F59E0B] text-black font-bold text-sm flex items-center space-x-2" style={{ boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}>
                <span>Call Now</span>
              </button>
            </div>
          </div>

          {/* First Aid Guide Card */}
          <div className="bg-[#1A1C1E] border border-[#475550] rounded-[2rem] p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-purple-500/10 border border-[#6366F1]/30 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(99,102,241,0.2)' }}>
                  <span className="material-symbols-outlined text-[#6366F1] text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))', fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>First Aid Guide</h2>
                  <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider mt-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Voice Assistant</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={handleStartVoiceMode} className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#6366F1]/20 border border-[#6366F1]/30 hover:bg-[#6366F1]/30 transition" style={{ boxShadow: '0 0 15px rgba(99,102,241,0.1)' }}>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366F1] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6366F1]"></span>
                </span>
                <span className="text-sm font-bold text-white uppercase tracking-wider">Start Voice Mode</span>
              </button>
            </div>
          </div>

          {/* Nearest Hospital Card */}
          <div className="bg-[#1A1C1E] border border-[#475550] rounded-[2rem] p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-blue-500/10 border border-[#06B6D4]/30 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(6,182,212,0.2)' }}>
                  <span className="material-symbols-outlined text-[#06B6D4] text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))', fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Nearest Hospital</h2>
                  <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider mt-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>24h Emergency • 2.4 mi</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <span className="material-symbols-outlined text-white/80 text-xl">volume_up</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Listen</span>
              </button>
              <button onClick={handleFindHospital} className="h-10 px-6 rounded-full bg-[#06B6D4] text-black font-bold text-sm flex items-center space-x-2" style={{ boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}>
                <span className="material-symbols-outlined text-lg">navigation</span>
                <span>Go</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* SOS Button */}
      <div className="px-5 mt-2">
        <div className="w-full bg-[#1A1C1E] border border-[#475550] rounded-full p-2 flex items-center justify-between relative overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }}>
          <div className="pl-5 flex flex-col">
            <span className="text-xs font-bold text-white/90 uppercase tracking-widest" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Quick Connect</span>
            <span className="text-[10px] text-[#94A3B8] font-medium">Direct Line</span>
          </div>
          <button onClick={() => setShowSOSConfirm(true)} className="h-12 px-8 rounded-full flex items-center justify-center space-x-2 hover:scale-105 transition-transform active:scale-100" style={{
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(153, 27, 27, 1) 100%)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span className="material-symbols-outlined text-white text-xl animate-pulse">sos</span>
            <span className="text-white font-bold tracking-wider" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>SOS</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showSOSConfirm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1C1E] border border-[#475550] w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 animate-pulse">
                <span className="material-symbols-outlined text-red-500 text-4xl">sos</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency SOS</h3>
              <p className="text-sm text-[#94A3B8] mb-6">Call 911 and share location. For life-threatening emergencies only.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowSOSConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition">Cancel</button>
                <button onClick={handleSOSConfirm} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition">Call 911</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVoiceAssistant && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1C1E] border border-[#475550] w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Voice Assistant</h3>
              <button onClick={() => setShowVoiceAssistant(false)} className="p-2 rounded-full hover:bg-white/10"><span className="material-symbols-outlined text-white">close</span></button>
            </div>
            {!aiResponse && (
              <div className="flex flex-col items-center text-center py-8">
                <div className={`w-24 h-24 rounded-full bg-[#6366F1]/20 border-2 border-[#6366F1]/50 flex items-center justify-center mb-6 ${isListening ? 'animate-pulse' : ''}`}>
                  <span className="material-symbols-outlined text-[#6366F1] text-5xl">mic</span>
                </div>
                <p className="text-white mb-4">{isListening ? 'Listening...' : 'Describe emergency'}</p>
                <p className="text-sm text-[#94A3B8] mb-6">{voiceTranscript || 'Tap mic to start'}</p>
                {isProcessing && <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>}
                {!isProcessing && !isListening && <button onClick={startListening} className="px-8 py-3 rounded-xl bg-[#6366F1] text-white font-bold hover:bg-[#5558E3] transition">Start Listening</button>}
              </div>
            )}
            {aiResponse && (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-[#94A3B8] uppercase mb-2">You said:</p>
                  <p className="text-white font-medium">{voiceTranscript}</p>
                </div>
                <div className="bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-2xl p-4">
                  <p className="text-xs text-[#6366F1] uppercase mb-3 font-bold">Instructions:</p>
                  <p className="text-white whitespace-pre-line text-sm leading-relaxed">{aiResponse}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setVoiceTranscript(''); setAIResponse(''); }} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10">Ask Again</button>
                  <button onClick={() => setShowVoiceAssistant(false)} className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-bold hover:bg-[#DC2626]">Need Hospital</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showHospitalList && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1C1E] border border-[#475550] w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Nearby Hospitals</h3>
              <button onClick={() => setShowHospitalList(false)} className="p-2 rounded-full hover:bg-white/10"><span className="material-symbols-outlined text-white">close</span></button>
            </div>
            <div className="space-y-3">
              {nearbyHospitals.map((h, i) => (
                <div key={i} onClick={() => navigateToHospital(h)} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition cursor-pointer active:scale-95">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-bold mb-1">{h.name}</h4>
                      <p className="text-xs text-[#94A3B8] mb-2">{h.address}</p>
                      <div className="flex items-center gap-1 text-[#06B6D4]">
                        <span className="material-symbols-outlined text-sm">near_me</span>
                        <span className="text-sm font-bold">{h.distance}</span>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#06B6D4]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#06B6D4]">navigation</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPermissionError && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1C1E] border border-[#475550] w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-orange-500 text-4xl">warning</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Permission Required</h3>
              <p className="text-sm text-[#94A3B8] mb-6">{permissionErrorMsg}</p>
              <button onClick={() => setShowPermissionError(false)} className="w-full py-3 rounded-xl bg-[#6366F1] text-white font-bold hover:bg-[#5558E3]">Got It</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes glowPulse { 0%, 100% { box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.2), 0 0 20px rgba(0,0,0,0.8); } 50% { box-shadow: inset 0 0 60px rgba(239, 68, 68, 0.6), 0 0 20px rgba(0,0,0,0.8); } }`}</style>
    </div>
  );
};

export default EmergencyCare;