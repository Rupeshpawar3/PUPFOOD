import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSpeech, playAudioData } from '../services/geminiService';

interface WaterTrackerProps {
    onBack: () => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ onBack }) => {
    const [bowls, setBowls] = useState(3);
    const goal = 6;
    const percentage = Math.min((bowls / goal) * 100, 100);

    const handleAddBowl = () => {
        setBowls(prev => (prev < goal ? prev + 1 : prev));
    };

    const handleRemoveBowl = () => {
        setBowls(prev => (prev > 0 ? prev - 1 : 0));
    };

    const handleListen = async () => {
        const text = `You have tracked ${bowls} bowls of water today. Your goal is ${goal} bowls. Keep your dog hydrated!`;
        const audioData = await generateSpeech(text);
        if (audioData) playAudioData(audioData);
    };

    return (
        <motion.div
            className="relative flex h-full min-h-screen w-full flex-col bg-[#0A0C10] text-white overflow-x-hidden font-display no-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Background Ambient Glows */}
            <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-[#06B6D4]/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-[#6366F1]/10 blur-[100px] pointer-events-none"></div>

            {/* Header */}
            <header className="flex items-center p-6 pb-2 justify-between sticky top-0 z-20">
                <button
                    onClick={onBack}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors text-[#94A3B8] hover:text-white"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">Hydration Monitor</span>
                <div className="size-10"></div>
            </header>

            {/* Hero Section: Water Visualization */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[380px] relative z-10">
                <div className="relative w-72 h-72 flex items-center justify-center">

                    {/* Outer Rings */}
                    <motion.div
                        animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border border-[#06B6D4]/20"
                    ></motion.div>
                    <motion.div
                        animate={{ scale: [1.1, 1.12, 1.1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border border-[#06B6D4]/10"
                    ></motion.div>

                    {/* Main Water Container */}
                    <div className="relative w-64 h-64 rounded-full bg-[#0A0C10] border-4 border-white/5 shadow-[0_0_50px_rgba(6,182,212,0.1)] flex items-center justify-center overflow-hidden backdrop-blur-sm z-10">

                        {/* Water Fill */}
                        <motion.div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-[#06B6D4] to-[#22d3ee] opacity-80"
                            initial={{ height: '0%' }}
                            animate={{ height: `${percentage}%` }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        >
                            {/* Wave Effect */}
                            <motion.div
                                animate={{ x: [-100, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                                className="absolute -top-3 left-0 w-[200%] h-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0iIzIyZDNVZSIgZmlsbC1vcGFjaXR5PSIwLjUiIGQ9Ik0wLDk2TjgwLDExMkMxNjAsMTI4LDI0MCwxNjAsMzIwLDE2MEM0MDAsMTYwLDQ4MCwxMjgsNTYwLDExMkM2NDAsOTYsNzIwLDk2LDgwMCwxMTJDODgwLDEyOCw5NjAsMTYwLDEwNDAsMTYwQzExMjAsMTYwLDEyMDAsMTI4LDEyODAsMTEyQzEzNjAsOTYsMTQ0MCw5NiwxNDQwLDk2TDE0NDAsMzIwTDEzNjAsMzIwQzEyODAsMzIwLDEyMDAsMzIwLDExMjAsMzIwQzEwNDAsMzIwLDk2MCwzMjAsODgwLDMyMEM4MDAsMzIwLDcyMCwzMjAsNjQwLDMyMEM1NjAsMzIwLDQ4MCwzMjAsNDAwLDMyMEMzMjAsMzIwLDI0MCwzMjAsMTYwLDMyMEM4MCwzMjAsMCwzMjAsMCwzMjBaIj48L3BhdGg+PC9zdmc+')]"
                                style={{ backgroundSize: '50% 100%' }}
                            />
                        </motion.div>

                        {/* Percentage Text */}
                        <div className="absolute z-20 flex flex-col items-center">
                            <motion.span
                                key={bowls}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-6xl font-bold text-white drop-shadow-md"
                            >
                                {Math.round(percentage)}<span className="text-2xl text-[#06B6D4]">%</span>
                            </motion.span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">Hydration Level</span>
                        </div>

                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full pointer-events-none z-30"></div>
                    </div>
                </div>

                <motion.div
                    key={bowls}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                >
                    <span className="material-symbols-outlined text-[#06B6D4]">check_circle</span>
                    <p className="text-sm font-medium text-white/90">
                        {percentage >= 100 ? "Goal Reached! Great job!" : "Keep going! Almost there."}
                    </p>
                </motion.div>
            </div>

            {/* Controls Section */}
            <div className="px-6 pb-12 w-full max-w-md mx-auto z-20">
                {/* Stats Card */}
                <div className="glass-card rounded-[2.5rem] p-1 border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
                    <div className="flex items-center justify-between p-6 pb-2">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold mb-1">Total Intake</p>
                            <div className="flex items-end gap-2">
                                <h3 className="text-4xl font-bold text-white">{bowls}</h3>
                                <span className="text-sm font-medium text-[#94A3B8] mb-1.5">/ {goal} bowls</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#06B6D4]">water_drop</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 pb-6 pt-2">
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRemoveBowl}
                        className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-white text-2xl">remove</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddBowl}
                        className="h-24 rounded-[2.5rem] bg-gradient-to-r from-[#06B6D4] to-[#3b82f6] flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <span className="material-symbols-outlined text-white text-4xl mb-1 filter drop-shadow-md">add_circle</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Add Bowl</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleListen}
                        className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#06B6D4] text-2xl">record_voice_over</span>
                    </motion.button>
                </div>

                <div className="mt-8 flex justify-center">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                        <span className="material-symbols-outlined text-[#94A3B8] text-sm">history</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">View History</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default WaterTracker;