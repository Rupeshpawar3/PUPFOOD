import React from 'react';

interface OfflineModeProps {
  onDismiss: () => void;
}

const OfflineMode: React.FC<OfflineModeProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-[#F9F7F2] text-slate-900 flex flex-col font-sans-jakarta animate-in fade-in duration-300">
      <div className="h-12 w-full bg-[#F9F7F2]"></div>
      <main className="flex-1 px-6 pb-32 overflow-y-auto">
        <div className="bg-[#FDF2E9] rounded-3xl p-8 mb-8 border border-[#F3E0CF] flex flex-col items-center text-center shadow-sm">
          <div className="bg-white/60 p-4 rounded-full mb-4">
            <span className="material-symbols-outlined text-[48px] text-[#B45309]">cloud_off</span>
          </div>
          <h1 className="text-2xl font-bold text-[#B45309] mb-2">Working Offline</h1>
          <p className="text-amber-900/70 font-medium leading-relaxed">
            Your data is safe and will save when you have signal.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">What you can do</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-[#DCFCE7] h-12 w-12 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#15803D] filled" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Take Food Photo</p>
                </div>
              </div>
              <button className="flex items-center justify-center bg-slate-100 h-12 w-12 rounded-full active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-slate-600">volume_up</span>
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-[#DCFCE7] h-12 w-12 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#15803D] filled" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Record Health Video</p>
                </div>
              </div>
              <button className="flex items-center justify-center bg-slate-100 h-12 w-12 rounded-full active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-slate-600">volume_up</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-[#DCFCE7] h-12 w-12 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#15803D] filled" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <div>
                  <p className="font-bold text-lg">See Daily Plan</p>
                </div>
              </div>
              <button className="flex items-center justify-center bg-slate-100 h-12 w-12 rounded-full active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-slate-600">volume_up</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F9F7F2] via-[#F9F7F2] to-transparent">
        <button 
          onClick={onDismiss}
          className="w-full bg-[#113321] text-white py-5 rounded-2xl text-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-all"
        >
          Got It
        </button>
        <div className="h-1 w-32 bg-slate-300 rounded-full mx-auto mt-6"></div>
      </div>
    </div>
  );
};

export default OfflineMode;