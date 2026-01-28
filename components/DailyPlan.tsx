import React from 'react';
import { generateSpeech, playAudioData } from '../services/geminiService';
import PageLayout from './PageLayout';

interface DailyPlanProps {
    onBack: () => void;
}

const DailyPlan: React.FC<DailyPlanProps> = ({ onBack }) => {
    const speak = async (text: string) => {
        const audioData = await generateSpeech(text);
        if (audioData) playAudioData(audioData);
    };

    return (
        <PageLayout title="Today's Plan" onBack={onBack}>
            <div className="space-y-8 pb-8">
                {/* Meal Section */}
                <section className="animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white tracking-wide">Morning Meal</h3>
                        <div className="glass-card px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                            8:00 AM
                        </div>
                    </div>

                    <div className="relative rounded-[2rem] overflow-hidden shadow-lg group cursor-pointer border border-white/10">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYjGqHVQg4ED48GoKIRmtOt1B3WYCcdzwXsX-HpXeXjq8jsB3rslpDQrAUKR1L6HU05OBCxwFeG2G6hJxJcrCn31etPdZdGLHcglJtWytkRV2Vs1JZUyhkbOweizaMyK6AAi0PyuPryXzv9Y6OUE-BTtq82KUJP0WL2X_2SE_gkkacrEag1ATAJwm82VJGfgjASxMFF-Z8OXuDquAk7zeduOw-QY3JqoQMKvuk8FcPMm3gaEsldi5yufFAEuMH5dBv317UJpbsQmo"
                            alt="Rice & Chicken"
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent flex flex-col justify-end p-6">
                            <div className="flex items-end justify-between">
                                <div className="animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
                                    <h4 className="text-2xl font-bold text-white mb-1">Rice & Chicken</h4>
                                    <p className="text-white/60 text-sm">350g • Warm temperature</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); speak("Today's morning meal is Rice and Chicken. Serve 350 grams at warm temperature."); }}
                                    className="size-12 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-110 active:scale-90 transition-transform animate-pop"
                                    style={{ animationDelay: '0.3s' }}
                                >
                                    <span className="material-symbols-outlined text-2xl">volume_up</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Care Reminders */}
                <section>
                    <h3 className="text-lg font-bold text-white mb-4 animate-slide-up-fade tracking-wide" style={{ animationDelay: '0.2s' }}>Care Reminders</h3>
                    <div className="space-y-4">
                        {[
                            { icon: 'water_drop', title: 'Fresh Water', subtitle: 'Refill 3 times today', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/30' },
                            { icon: 'directions_walk', title: 'Evening Walk', subtitle: '30 mins at 6 PM', color: 'text-emerald-300', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
                            { icon: 'medication', title: 'Vitamin Supplement', subtitle: '1 tablet with dinner', color: 'text-purple-300', bg: 'bg-purple-500/20', border: 'border-purple-500/30' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="glass-card p-4 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors animate-slide-up-fade cursor-pointer"
                                style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}
                                onClick={() => speak(item.title + ". " + item.subtitle)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} border ${item.border}`}>
                                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{item.title}</p>
                                        <p className="text-xs text-white/50">{item.subtitle}</p>
                                    </div>
                                </div>
                                <button
                                    className="size-10 rounded-full hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-colors active:scale-90"
                                >
                                    <span className="material-symbols-outlined">volume_up</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Alerts */}
                <section className="animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
                    <h3 className="text-lg font-bold text-white mb-4 tracking-wide">Alerts</h3>
                    <div className="relative overflow-hidden group glass-card rounded-2xl p-5 border border-orange-500/30 bg-orange-500/5">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full group-hover:bg-orange-500/20 transition-colors pointer-events-none"></div>
                        <div className="flex gap-4 items-start relative z-10">
                            <span className="material-symbols-outlined text-orange-400 text-3xl shrink-0 animate-pulse">warning</span>
                            <div className="flex-1">
                                <h4 className="font-bold text-white mb-1">Vaccination Due Soon</h4>
                                <p className="text-xs text-white/60 mb-3 leading-relaxed">Rabies booster shot is due in 14 days.</p>
                                <button className="text-[10px] font-bold bg-orange-500 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-orange-900/40 hover:bg-orange-600 transition-colors uppercase tracking-wider">View Details</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
};

export default DailyPlan;