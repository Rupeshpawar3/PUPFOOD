import React from 'react';
import { generateSpeech, playAudioData } from '../services/geminiService';
import { View } from '../types';
import PageLayout from './PageLayout';

interface VaccinationHistoryProps {
  onBack: () => void;
  onNavigate?: (view: View) => void;
}

const VaccinationHistory: React.FC<VaccinationHistoryProps> = ({ onBack, onNavigate }) => {
  const speak = async (text: string) => {
    const audioData = await generateSpeech(text);
    if (audioData) playAudioData(audioData);
  };

  const records = [
    {
      id: 1,
      name: "Rabies",
      status: "COMPLETED",
      date: "12 Oct 2023",
      icon: "shield",
      colorClass: "primary",
      audioText: "Rabies vaccine completed on October 12th, 2023."
    },
    {
      id: 2,
      name: "DHPP",
      status: "COMPLETED",
      date: "05 Jan 2024",
      icon: "shield",
      colorClass: "primary",
      audioText: "DHPP vaccine completed on January 5th, 2024."
    },
    {
      id: 3,
      name: "Parvovirus",
      status: "UPCOMING",
      date: "10 Oct 2024",
      icon: "schedule",
      colorClass: "amber-500",
      bgClass: "amber-100",
      textClass: "amber-600",
      audioText: "Parvovirus vaccine is upcoming on October 10th, 2024."
    }
  ];

  return (
    <PageLayout title="Vaccination History" onBack={onBack}>
      <div className="flex flex-col gap-6 pb-20">
        {/* Score Card Section */}
        <div className="relative w-full overflow-hidden rounded-[2.5rem] glass-card p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(0,0,0,0.2)] border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <h2 className="text-lg font-bold text-white mb-4 relative z-10">Vaccination Score</h2>

          {/* Gauge Visual */}
          <div className="relative w-48 h-24 overflow-hidden mb-2 z-10">
            <svg className="w-full h-full transform translate-y-1" viewBox="0 0 100 50">
              {/* Background Arc */}
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeLinecap="round" strokeWidth="10"></path>
              {/* Progress Arc (75%) */}
              <path
                className="transition-all duration-1000 ease-out"
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#34D399" // Primary Emerald
                strokeDasharray="125.6"
                strokeDashoffset="31.4"
                strokeLinecap="round"
                strokeWidth="10"
                filter="url(#glow)"
              ></path>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-center">
              <span className="text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">75%</span>
            </div>
          </div>

          <p className="text-sm font-bold text-primary mt-1 uppercase tracking-wider relative z-10">Protected</p>
          <p className="text-xs text-white/50 mt-2 max-w-[220px] leading-relaxed relative z-10">Your pet is well protected. Next vaccine due soon.</p>
        </div>

        {/* Timeline Header */}
        <div className="px-2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Timeline</h3>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">3 Records</span>
        </div>

        {/* Timeline List */}
        <div className="relative px-2 flex flex-col gap-0 flex-1">
          {/* Vertical Line */}
          <div className="absolute left-[38px] top-6 bottom-10 w-[2px] bg-white/10 z-0"></div>

          {records.map((record) => (
            <div key={record.id} className="relative z-10 flex gap-4 pb-6 group last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center size-12 rounded-2xl shadow-lg border border-white/5 ${record.status === 'COMPLETED' ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                  <span className="material-symbols-outlined text-2xl">{record.icon}</span>
                </div>
              </div>
              <div
                onClick={() => record.status === 'COMPLETED' && onNavigate?.(View.DIGITAL_CERTIFICATE)}
                className={`flex-1 rounded-[1.5rem] p-4 flex items-center justify-between gap-3 border transition-all active:scale-[0.98] cursor-pointer group-hover:bg-white/5 ${record.status === 'COMPLETED' ? 'glass-card border-white/5' : 'bg-white/5 border-dashed border-white/10'}`}
              >
                <div className="flex flex-col">
                  <span className="inline-flex items-center gap-1.5 mb-1">
                    <span className={`size-1.5 rounded-full ${record.status === 'COMPLETED' ? 'bg-primary shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-orange-400 animate-pulse'}`}></span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${record.status === 'COMPLETED' ? 'text-primary' : 'text-orange-400'}`}>{record.status}</span>
                  </span>
                  <h4 className={`text-lg font-bold text-white leading-tight ${record.status === 'UPCOMING' ? 'opacity-70' : ''}`}>{record.name}</h4>
                  <p className="text-sm text-white/40 mt-0.5 font-medium">{record.date}</p>
                  {record.status === 'COMPLETED' && (
                    <div className="flex items-center gap-1 mt-2 text-primary text-[10px] font-bold uppercase tracking-wide group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      View Certificate
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(record.audioText); }}
                  aria-label={`Listen to ${record.name} info`}
                  className={`flex shrink-0 size-10 items-center justify-center rounded-full transition-all border border-white/5 ${record.status === 'COMPLETED' ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'}`}
                >
                  <span className="material-symbols-outlined text-xl">volume_up</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fixed Action */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-20">
          <button className="w-full bg-primary hover:bg-primary/90 text-background-dark h-14 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
            <span className="material-symbols-outlined">check_circle</span>
            Mark Next as Done
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default VaccinationHistory;