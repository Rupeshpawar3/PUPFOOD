import React, { useState } from 'react';
import { View } from '../types';
import PageLayout from './PageLayout';

interface AlertsProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const Alerts: React.FC<AlertsProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All');

  const rightAction = (
    <button className="text-primary hover:text-primary/80 text-xs font-bold tracking-wide transition-colors">
      Mark all read
    </button>
  );

  return (
    <PageLayout title="Alerts Center" onBack={onBack} rightAction={rightAction}>
      <div className="flex flex-col gap-6 pb-4">

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Health', 'Food', 'Community'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-transform active:scale-95 border ${activeTab === tab
                ? 'bg-primary text-background-dark border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
            >
              <p className="text-xs font-bold uppercase tracking-wide">{tab}</p>
            </button>
          ))}
        </div>

        {/* Critical Alert */}
        <section>
          <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-white/5 shadow-xl glass-card border border-red-500/30">
            {/* Red urgency accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 z-10"></div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex-1 flex flex-col justify-between gap-4 z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-xl animate-pulse">warning</span>
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">Critical Alert</p>
                  </div>
                  <h2 className="text-white text-xl font-bold leading-tight drop-shadow-sm">Parvovirus Outbreak Nearby</h2>
                  <p className="text-white/70 text-sm leading-relaxed font-medium">High risk detected in your village area. Keep dogs indoors and avoid contact with strays.</p>
                </div>
                <button className="flex w-fit items-center justify-center rounded-full h-10 px-6 bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/25 hover:bg-red-600 transition-all active:scale-95 uppercase tracking-wide">
                  Safety Tips
                </button>
              </div>
              {/* Image */}
              <div className="w-full h-40 bg-cover bg-center rounded-2xl shadow-inner border border-white/5 opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhlUup2Jpik4bFZMbsk7USlk8mjt_U3KQm-x2PMT9J2q5FoOT6t4WX4CI0JbWNrF4SFhekDb-1b0eV9s-Xy2-36qv-Ju2s1EP8_UItAOvL8uTDRz5nvbBdfAOcVA27p52a56FxJxBoLN5EdS8NS6MoHkY0MykC6i5FTyd05RVBasZOhRn2MMV1wDxQ1yMQ-y8SDI_6-Ec3D6CyJk3YBkw8a3jEEBcrJaJ2-3PHWajfOLNZt5xtktt1m2dfQexiyrKnR6ljxlIXVfE')" }}>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Updates */}
        <section className="flex flex-col gap-4">
          <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest pl-1">Recent Updates</h3>

          {/* Item 1: Vaccination */}
          <div className="group flex items-center gap-4 glass-card p-4 rounded-[1.5rem] shadow-sm border border-white/5 hover:bg-white/5 transition-all active:scale-[0.99] cursor-pointer">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 shadow-lg shadow-primary/5">
              <span className="material-symbols-outlined">vaccines</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="text-white text-base font-bold truncate pr-2">Rabies Vaccination Due</p>
                <span className="shrink-0 text-[10px] font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20 whitespace-nowrap">2 days left</span>
              </div>
              <p className="text-white/50 text-xs truncate font-medium">Tommy needs his booster shot</p>
            </div>
          </div>

          {/* Item 2: Food Stock */}
          <div className="group flex items-center gap-4 glass-card p-4 rounded-[1.5rem] shadow-sm border border-white/5 hover:bg-white/5 transition-all active:scale-[0.99] cursor-pointer">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f1fec6]/20 to-[#f1fec6]/10 text-[#f1fec6] border border-[#f1fec6]/20 shadow-lg shadow-[#f1fec6]/10">
              <span className="material-symbols-outlined">pet_supplies</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="text-white text-base font-bold truncate pr-2">Food Stock Update</p>
                <span className="shrink-0 text-xs text-white/30 font-bold whitespace-nowrap">2h ago</span>
              </div>
              <p className="text-white/50 text-xs line-clamp-2 font-medium">Pedigree Chicken available at Suresh Store</p>
            </div>
            <button className="shrink-0 flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-lg">call</span>
            </button>
          </div>

          {/* Item 3: Community */}
          <div className="group flex items-center gap-4 glass-card p-4 rounded-[1.5rem] shadow-sm border border-white/5 hover:bg-white/5 transition-all active:scale-[0.99] cursor-pointer" onClick={() => onNavigate(View.NEARBY_VETS)}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-900/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/10">
              <span className="material-symbols-outlined">medical_services</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="text-white text-base font-bold truncate pr-2">Free Vet Camp</p>
                <span className="shrink-0 text-xs text-white/30 font-bold whitespace-nowrap">5h ago</span>
              </div>
              <p className="text-white/50 text-xs line-clamp-2 font-medium">Happening in Rampur Village this Sunday morning</p>
            </div>
            <div className="shrink-0 flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-white/60 group-hover:bg-primary group-hover:text-background-dark group-hover:border-primary transition-all">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>
          </div>

          {/* Item 4: System */}
          <div className="group flex items-center gap-4 glass-card p-4 rounded-[1.5rem] shadow-sm border border-white/5 opacity-60">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-white/40 border border-white/10">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="text-white text-base font-bold truncate pr-2">Profile Updated</p>
                <span className="shrink-0 text-xs text-white/30 font-bold whitespace-nowrap">Yesterday</span>
              </div>
              <p className="text-white/50 text-xs truncate font-medium">Your dog's health records are synced.</p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Alerts;