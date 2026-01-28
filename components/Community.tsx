import React from 'react';
import { View } from '../types';
import { generateSpeech, playAudioData } from '../services/geminiService';

interface CommunityProps {
    onBack: () => void;
    onNavigate: (view: View) => void;
}

const Community: React.FC<CommunityProps> = ({ onBack, onNavigate }) => {
    const speak = async (text: string) => {
        const audioData = await generateSpeech(text);
        if (audioData) playAudioData(audioData);
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col mx-auto max-w-md bg-[#0A0C10] shadow-xl overflow-hidden font-sans-jakarta">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-[#D4A373]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[-20%] w-80 h-80 bg-[#84A98C]/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Header */}
            <header className="px-4 py-3 flex items-center justify-between z-10 sticky top-0 bg-[#0A0C10]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-white drop-shadow-md">Village Stories</h1>
                    <div className="flex items-center space-x-1.5 mt-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A373] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4A373] shadow-[0_0_8px_rgba(212,163,115,0.8)]"></span>
                        </span>
                        <span className="text-[10px] font-bold text-[#D4A373] uppercase tracking-wider drop-shadow-sm">Live Community</span>
                    </div>
                </div>
                <button
                    onClick={() => onNavigate(View.MY_PETS)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#94A3B8]/20 p-0.5 shadow-lg shadow-black/40"
                >
                    <img alt="User profile" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2O6PkBR73YTOs9tPQDA40K-9RqHq8aM4vnzItCgcywjxLd04BbN6WahgTWX1Ujscq2SeVrGYlDxARGROWlbM_D0YQmhO7NpqEVA5MxcK7zTCfKe1e9jz1VduRLzXiM6vBM4tc7krCclw0pTbUfcK6ic-PuzDaaMMwSgr2YIFTfAE86QQ8_03k919uhtxUoyl42JZo7_aBKHoyse_pym4oOy3t8wP729ixKDm4aiwfz8UKIXjYuitoY_7tc5maxwZO7AHh4wKnphk" />
                </button>
            </header>

            {/* Main Feed */}
            <main className="relative px-4 flex flex-col space-y-4 z-10 mt-4 pb-20 overflow-y-auto h-full">

                {/* Story Card 1 */}
                <article className="relative rounded-[2rem] p-4 group overflow-hidden border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl bg-white/[0.03]">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0C10]/90 z-10 pointer-events-none"></div>
                    <div className="w-full h-80 rounded-2xl overflow-hidden relative shadow-lg">
                        <img alt="Village dog running" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeW7KejklTrFy-11mpkQUfqHGo5kcClXeNsIOzVDZdwpN-Bo60Lbru2cPnCQI9nPA4ulQFvr9ntMTK40bXGNt73CvYcN6uz8_gj11Z3Nw4HcCwcTKqL0zEdR4s_TnR__1MFVrk-QO3P0EJopCosGsyuuGoh8ESMQCulsSJHfsY0SKXtCOs6KWAdwSzYoMQUEWhUrCnKqCEt-ecVsS9kgB9x4iWRDBPwJSZMdhK1iL6dfwr5cvYfOEvs9pb5GeXLat6-YHxhnkdrZo" />
                        <div className="absolute top-3 right-3 z-20">
                            <span className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                Cotswolds
                            </span>
                        </div>
                    </div>
                    <div className="relative z-20 -mt-20 px-2">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-lg shadow-black/30">
                                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiYLO7NxmXoU93j2c0rxPGnBFmd0Qtb_cKFSiwoyHrJWueH5gSGhkN2kLQ2BuDPEiepaDv2t8ShLK6EGj2Ir0Yk1rd4OwFHAfbh-BND-jLonEAtsysmKSNm6FhhZ73Brv8_0O4pLD5uyCx22p_QqmQLb4jW2S16dn5W1Sdp-KzvUsXVAm3lNyvBA3feEcbGT0-das8jWZutF3FhpKFznwf5FMVWtWPtJ6h3-6mNkvK1EPb5W2W2u5U-xqzKrwmWFkziznHgOSkLMs" />
                                </div>
                                <span className="text-sm font-semibold text-white/95 drop-shadow-md">Thomas & Barnaby</span>
                            </div>
                            <button
                                onClick={() => speak("Barnaby found a hidden stream today! While exploring the old mill path, he sniffed out a fresh spring.")}
                                className="w-12 h-12 rounded-full bg-[#A5D6A7] text-[#0A0C10] flex items-center justify-center shadow-[0_0_20px_rgba(165,214,167,0.4)] hover:scale-110 transition-transform"
                            >
                                <span className="material-symbols-outlined text-2xl">graphic_eq</span>
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">Barnaby found a hidden stream today!</h3>
                        <p className="text-base text-gray-100 font-light leading-relaxed mb-4 drop-shadow-md">
                            While exploring the old mill path, he sniffed out a fresh spring. Cleanest water we've seen in years. Here's how to find it...
                        </p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                            <div className="flex items-center gap-5">
                                <button className="flex items-center gap-1.5 group/heart">
                                    <span className="material-symbols-outlined text-[#D4A373] group-hover/heart:fill-current transition-colors text-xl">favorite</span>
                                    <span className="text-sm font-medium text-[#D4A373]">248</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-[#94A3B8] hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-xl">chat_bubble</span>
                                    <span className="text-sm font-medium">42</span>
                                </button>
                            </div>
                            <button className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-[#A5D6A7] uppercase tracking-wide hover:bg-white/20 transition-colors flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">headphones</span>
                                Listen
                            </button>
                        </div>
                    </div>
                </article>

                {/* Story Card 2 - WITH LAVENDER BACKGROUND */}
                <article className="relative rounded-[2rem] p-4 group overflow-hidden border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                    {/* Lavender Background Implementation */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, rgba(230, 224, 255, 0.15) 0%, rgba(200, 190, 255, 0.05) 100%)',
                            backdropFilter: 'blur(20px)'
                        }}
                    ></div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0C10]/90 z-10 pointer-events-none"></div>
                    <div className="w-full h-80 rounded-2xl overflow-hidden relative shadow-lg">
                        <img alt="Dog with flower" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZaUr8yjKVPaP_o8Ck9jfacOp6XK2etTe_04ri_EE81aY_K5iG6Qsk7tdWzPnPRiWgVvtvOlsm12Tpak8e2bdyHqoMoe4e-tXeTpi1tpo2q48KXjYNEFbtKEO6gWJSBEmAdc5-0ZOooufRY7SUeg8ddCDpXfmOAeuhLy8DaiSDO1gO3UpwbCaRHIBWojxg0rnvlDpSxleneN0rL2qt4XX0vPjmHg8GpTa3-1k6lGLSn8VJyH8eplJgBtmK6TuVo1PWU5bf4IGNMZc" />
                        <div className="absolute top-3 right-3 z-20">
                            <span className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                Highlands
                            </span>
                        </div>
                    </div>
                    <div className="relative z-20 -mt-20 px-2">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-lg shadow-black/30">
                                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqkBXJiXB0RyYdh4yLHfE2wGDk2N1q-t1vz9m1RhULzNcPQ9v8jEa1OmtB7xs_sQV1OJde4RMtd4wbDOZpdanjpFjyWZUei7WvXQr00cG2f7StnAwS4kD7Nmhu9Aju2UstUXNYUnMoWF5hMlfvqHLkTOBFOYZs3VSSobb1qbVsHc7Yz9Ydtb8lxgHDvO53leuDn0Iov4hlPjLHk8py6FpbGcmjEDD3dRhMmo131_JAH3PF58f_IFUR4zHXceBM8I21hRfDcUoqmbQ" />
                                </div>
                                <span className="text-sm font-semibold text-white/95 drop-shadow-md">Sarah & Daisy</span>
                            </div>
                            <button
                                onClick={() => speak("Natural tick prevention tips. Using local lavender and diluted apple cider vinegar has worked wonders for Daisy.")}
                                className="w-12 h-12 rounded-full bg-[#A5D6A7] text-[#0A0C10] flex items-center justify-center shadow-[0_0_20px_rgba(165,214,167,0.4)] hover:scale-110 transition-transform"
                            >
                                <span className="material-symbols-outlined text-2xl">graphic_eq</span>
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">Natural tick prevention tips</h3>
                        <p className="text-base text-gray-100 font-light leading-relaxed mb-4 drop-shadow-md">
                            Using local lavender and diluted apple cider vinegar has worked wonders for Daisy this season. Here is the recipe I use...
                        </p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                            <div className="flex items-center gap-5">
                                <button className="flex items-center gap-1.5 group/heart">
                                    <span className="material-symbols-outlined text-[#D4A373] group-hover/heart:fill-current transition-colors text-xl">favorite</span>
                                    <span className="text-sm font-medium text-[#D4A373]">856</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-[#94A3B8] hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-xl">chat_bubble</span>
                                    <span className="text-sm font-medium">128</span>
                                </button>
                            </div>
                            <button className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-[#A5D6A7] uppercase tracking-wide hover:bg-white/20 transition-colors flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">headphones</span>
                                Listen
                            </button>
                        </div>
                    </div>
                </article>

                {/* Create Post CTA */}
                <article className="relative rounded-[2rem] p-4 group overflow-hidden border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl bg-white/[0.03] opacity-90">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0C10]/90 z-10 pointer-events-none"></div>
                    <div className="w-full h-80 rounded-2xl overflow-hidden relative shadow-lg bg-[#0A0C10]/50 flex items-center justify-center border border-white/5">
                        <div className="text-center p-6 z-20">
                            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4 border border-[#10B981]/20">
                                <span className="material-symbols-outlined text-[#10B981] text-3xl">photo_camera</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Share Your Village Story</h3>
                            <p className="text-sm text-gray-400 mb-6">Join the community and share your daily adventures.</p>
                            <button
                                onClick={() => onNavigate(View.SHARE_STORY)}
                                className="bg-[#10B981] text-[#0A0C10] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg shadow-[#10B981]/20 hover:scale-105 transition-transform w-full"
                            >
                                Create Post
                            </button>
                        </div>
                    </div>
                </article>

                <div className="h-24"></div>
            </main>

            {/* Bottom Nav */}
            <nav className="absolute bottom-0 w-full bg-[#0A0C10] border-t border-white/10 px-4 py-2 flex justify-between items-center z-40">
                <button onClick={() => onNavigate(View.DASHBOARD)} className="flex flex-col items-center gap-1 text-[#84A98C] hover:text-[#A5D6A7] transition-colors">
                    <span className="material-symbols-outlined text-[28px]">home</span>
                    <span className="text-xs font-bold">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[28px]">group</span>
                    <span className="text-xs font-bold">Groups</span>
                </button>
                <button onClick={() => onNavigate(View.ALERTS)} className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[28px]">notifications</span>
                    <span className="text-xs font-bold">Alerts</span>
                </button>
                <button onClick={() => onNavigate(View.MY_PETS)} className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[28px]">person</span>
                    <span className="text-xs font-bold">Profile</span>
                </button>
            </nav>
        </div>
    );
};

export default Community;