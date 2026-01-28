import React, { useState, useEffect } from 'react';
import { findNearbyVets, generateSpeech, playAudioData } from '../services/geminiService';

interface NearbyVetsProps {
  onBack: () => void;
}

const NearbyVets: React.FC<NearbyVetsProps> = ({ onBack }) => {
  const [vetsText, setVetsText] = useState<string>("Locating nearby clinics...");
  const [isLoading, setIsLoading] = useState(true);
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    // Simulate user location (Delhi coordinates for demo)
    const mockLocation = { lat: 28.6139, lng: 77.2090 };
    
    const fetchVets = async () => {
        const result = await findNearbyVets(mockLocation);
        setVetsText(result.text || "No clinics found.");
        setSources(result.chunks || []);
        setIsLoading(false);
    };

    fetchVets();
  }, []);

  const handleSpeak = async () => {
      const audioData = await generateSpeech(vetsText);
      if (audioData) playAudioData(audioData);
  };

  const handleCall = (title: string) => {
      // Since phone numbers aren't always in grounding chunks, we simulate the action
      // In a real app with Places API, we would have the formatted_phone_number
      alert(`Calling ${title}...`);
      window.location.href = "tel:1234567890";
  };

  return (
    <div className="font-manrope bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden h-screen w-full flex flex-col">
      {/* Top 40%: Map Interface */}
      <div className="relative h-[40%] w-full bg-cover bg-center map-pattern group/map-root">
        {/* Back Button (Absolute) */}
        <button 
          onClick={onBack}
          className="absolute top-12 left-4 z-30 size-10 rounded-full bg-white dark:bg-background-dark shadow-md flex items-center justify-center text-forest-green dark:text-primary active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        {/* User Location Pin */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer z-20 pointer-events-none">
          <div className="relative h-14 w-14 flex items-center justify-center pulse-ring">
            <div className="bg-soft-mint dark:bg-primary h-8 w-8 rounded-full border-4 border-white dark:border-background-dark shadow-xl z-20"></div>
          </div>
        </div>

        {/* Visual overlay to fade into bottom sheet */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Bottom 60%: Scrollable List */}
      <div className="relative h-[60%] flex-1 -mt-6 rounded-t-[32px] bg-warm-beige dark:bg-warm-beige-dark shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-30 flex flex-col w-full overflow-hidden">
        {/* Drag Handle Area */}
        <div className="w-full flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing bg-warm-beige dark:bg-warm-beige-dark">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        {/* Header */}
        <div className="px-5 pb-3 flex-shrink-0 bg-warm-beige dark:bg-warm-beige-dark border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center">
            <div>
              <h2 className="text-[#0e1b14] dark:text-white text-2xl font-extrabold tracking-tight">Nearby Vets</h2>
              <p className="text-forest-green dark:text-primary/80 text-sm font-medium mt-0.5">Google Maps Data</p>
            </div>
             <button 
                onClick={handleSpeak}
                className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined">volume_up</span>
              </button>
        </div>
        
        {/* AI Result Content */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 space-y-6 no-scrollbar bg-warm-beige dark:bg-warm-beige-dark">
          {isLoading ? (
               <div className="flex flex-col items-center justify-center h-40 gap-3">
                   <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-gray-500 font-medium">Searching area...</p>
               </div>
          ) : (
            <>
                <div className="prose dark:prose-invert">
                    <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-sm bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        {vetsText}
                    </p>
                </div>
                
                {sources.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 pl-1">Found Clinics</h3>
                        <div className="flex flex-col gap-4">
                             {sources.map((chunk, idx) => {
                                 const uri = chunk.web?.uri || chunk.maps?.uri;
                                 const title = chunk.web?.title || chunk.maps?.title || "Veterinary Clinic";
                                 if (!uri) return null;
                                 
                                 return (
                                     <div key={idx} className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-card dark:shadow-none flex flex-col gap-3">
                                         <div className="flex items-start justify-between gap-3">
                                             <div className="flex items-center gap-3">
                                                 <div className="size-10 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                                     <span className="material-symbols-outlined">location_on</span>
                                                 </div>
                                                 <div>
                                                     <h4 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">{title}</h4>
                                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Veterinary Care</p>
                                                 </div>
                                             </div>
                                             <div className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                                                 Open
                                             </div>
                                         </div>
                                         
                                         <div className="flex gap-2 mt-1">
                                             <button 
                                                onClick={() => handleCall(title)}
                                                className="flex-1 h-10 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-bright font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                                             >
                                                 <span className="material-symbols-outlined text-[20px] filled" style={{fontVariationSettings: "'FILL' 1"}}>call</span>
                                                 Call
                                             </button>
                                             <a 
                                                href={uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                                             >
                                                 <span className="material-symbols-outlined text-[20px]">directions</span>
                                                 Directions
                                             </a>
                                         </div>
                                     </div>
                                 );
                             })}
                        </div>
                    </div>
                )}
            </>
          )}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};

export default NearbyVets;