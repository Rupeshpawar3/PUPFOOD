import React from 'react';
import PageLayout from './PageLayout';
import { motion } from 'framer-motion';

interface ActivityProps {
    onBack: () => void;
}

const Activity: React.FC<ActivityProps> = ({ onBack }) => {
    // Animation Configuration
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    const ringVariants = (circumference: number, targetOffset: number, delay: number) => ({
        hidden: { strokeDashoffset: circumference },
        visible: {
            strokeDashoffset: targetOffset,
            transition: {
                duration: 1.5,
                ease: [0.25, 0.1, 0.25, 1],
                delay: delay
            }
        }
    });

    return (
        <PageLayout className="!p-0" onBack={onBack}>
            <div className="min-h-screen bg-[#0A0C10] text-white pb-24 font-display overflow-hidden relative">

                {/* Background Ambient Glows */}
                <motion.div
                    className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-[#A855F7]/10 rounded-full blur-[120px] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                />
                <motion.div
                    className="absolute bottom-[20%] right-[-20%] w-80 h-80 bg-[#6366F1]/10 rounded-full blur-[100px] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                />

                {/* Custom Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="px-6 py-6 flex items-center justify-between z-10 relative"
                >
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#94A3B8]/20 p-0.5 shadow-lg shadow-black/40 bg-[#0A0C10]">
                        <img
                            alt="User profile"
                            className="w-full h-full object-cover rounded-full"
                            src="/bruno-new.jpg"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xs font-bold tracking-[0.2em] uppercase text-white/90 drop-shadow-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Bruno's Activity</h1>
                        <div className="flex items-center space-x-1.5 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            </span>
                            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider drop-shadow-sm">Weekly Goal: On Track</span>
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full glass-card border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 transition backdrop-blur-xl shadow-lg"
                    >
                        <span className="material-symbols-outlined">calendar_month</span>
                    </motion.button>
                </motion.header>

                <motion.main
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="relative px-6 flex flex-col z-10 mt-2"
                >

                    {/* Weekly Activity Row */}
                    <motion.div variants={itemVariants} className="w-full mb-10">
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h2 className="text-xl font-bold text-white drop-shadow-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Activity</h2>
                            <span className="text-xs font-medium text-[#94A3B8] uppercase tracking-widest">Aug 2023</span>
                        </div>

                        <div className="flex justify-between items-center px-1 bg-white/[0.03] p-4 rounded-3xl border border-white/5 backdrop-blur-sm shadow-inner">
                            {/* Days */}
                            {[
                                { day: 'S', p: 10, l: 15, c: 20 },
                                { day: 'M', p: 30, l: 35, c: 30 },
                                { day: 'T', p: 15, l: 20, c: 10 },
                                { day: 'W', p: 5, l: 10, c: 5 },
                                { day: 'T', p: 25, l: 40, c: 10 },
                                { day: 'F', p: 90, l: 75, c: 50, active: true },
                                { day: 'S', empty: true }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="flex flex-col items-center space-y-3"
                                >
                                    {item.active ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.1 }}
                                            transition={{ type: "spring", delay: 0.5 }}
                                            className="w-6 h-6 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/30 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)] transform"
                                        >
                                            <span className="text-[10px] text-white font-bold uppercase">{item.day}</span>
                                        </motion.div>
                                    ) : (
                                        <span className="text-[10px] text-[#94A3B8] font-bold uppercase">{item.day}</span>
                                    )}

                                    <div className={`relative w-7 h-7 ${item.empty ? 'opacity-30' : ''}`}>
                                        {item.empty ? (
                                            <div className="w-full h-full rounded-full border border-white/5 bg-white/[0.02]"></div>
                                        ) : (
                                            <>
                                                {item.active && <div className="absolute inset-0 bg-[#A855F7]/20 rounded-full blur-[8px]"></div>}
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                    <circle className="text-white/5" cx="18" cy="18" fill="none" r="16" stroke="currentColor" strokeWidth="3"></circle>

                                                    {/* Move Ring (Purple) */}
                                                    <motion.circle
                                                        className="text-[#A855F7]"
                                                        cx="18" cy="18" fill="none" r="16" stroke="currentColor" strokeWidth="3"
                                                        strokeDasharray="100, 100"
                                                        initial={{ strokeDashoffset: 100 }}
                                                        animate={{ strokeDashoffset: 100 - (item.p || 0) }}
                                                        transition={{ duration: 1, delay: 0.3 }}
                                                        strokeLinecap="round"
                                                        style={{ filter: item.active ? 'drop-shadow(0 0 2px rgba(168,85,247,0.8))' : '' }}
                                                    ></motion.circle>

                                                    {/* Exercise Ring (Indigo) */}
                                                    <motion.circle
                                                        className="text-[#6366F1]"
                                                        cx="18" cy="18" fill="none" r="12" stroke="currentColor" strokeWidth="3"
                                                        strokeDasharray="75, 100"
                                                        initial={{ strokeDashoffset: 75 }}
                                                        animate={{ strokeDashoffset: 75 - ((item.l || 0) * 0.75) }}
                                                        transition={{ duration: 1, delay: 0.4 }}
                                                        strokeLinecap="round"
                                                        style={{ filter: item.active ? 'drop-shadow(0 0 2px rgba(99,102,241,0.8))' : '' }}
                                                    ></motion.circle>

                                                    {/* Play Ring (Cyan) */}
                                                    <motion.circle
                                                        className="text-[#06B6D4]"
                                                        cx="18" cy="18" fill="none" r="8" stroke="currentColor" strokeWidth="3"
                                                        strokeDasharray="50, 100"
                                                        initial={{ strokeDashoffset: 50 }}
                                                        animate={{ strokeDashoffset: 50 - ((item.c || 0) * 0.5) }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        strokeLinecap="round"
                                                        style={{ filter: item.active ? 'drop-shadow(0 0 2px rgba(6,182,212,0.8))' : '' }}
                                                    ></motion.circle>
                                                </svg>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main Stats with Big Ring */}
                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-12 w-full px-2">
                        <div className="flex flex-col space-y-8 z-20">
                            {/* Move */}
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                                <h3 className="text-[#A855F7] font-bold text-xs uppercase tracking-widest mb-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse">Move</h3>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-white drop-shadow-md">450</span>
                                    <span className="text-xs text-[#94A3B8] font-bold uppercase ml-2">kcal</span>
                                </div>
                            </motion.div>

                            {/* Exercise */}
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                                <h3 className="text-[#6366F1] font-bold text-xs uppercase tracking-widest mb-1 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]">Exercise</h3>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-white drop-shadow-md">35</span>
                                    <span className="text-xs text-[#94A3B8] font-bold uppercase ml-2">min</span>
                                </div>
                            </motion.div>

                            {/* Play */}
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                                <h3 className="text-[#06B6D4] font-bold text-xs uppercase tracking-widest mb-1 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">Play</h3>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-white drop-shadow-md">12</span>
                                    <span className="text-xs text-[#94A3B8] font-bold uppercase ml-2">hours</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Big Animated Ring */}
                        <div className="relative w-48 h-48 -mr-2">
                            {/* Ambient Ring Glow */}
                            <motion.div
                                animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-[#A855F7]/10 blur-[60px] rounded-full"
                            ></motion.div>

                            <svg className="w-full h-full drop-shadow-2xl transform -rotate-90" viewBox="0 0 200 200">
                                {/* Backgrounds */}
                                <circle className="text-white/5" cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="12" fill="none"></circle>
                                <circle className="text-white/5" cx="100" cy="100" r="62" stroke="currentColor" strokeWidth="12" fill="none"></circle>
                                <circle className="text-white/5" cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="12" fill="none"></circle>

                                {/* Progress Rings */}
                                {/* Move (Purple) */}
                                <motion.circle
                                    className="text-[#A855F7]"
                                    cx="100" cy="100" r="84"
                                    stroke="currentColor" strokeWidth="12" fill="none"
                                    strokeDasharray="527"
                                    variants={ringVariants(527, 100, 0.2)}
                                    initial="hidden"
                                    animate="visible"
                                    strokeLinecap="round"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.5))' }}
                                ></motion.circle>

                                {/* Exercise (Indigo) */}
                                <motion.circle
                                    className="text-[#6366F1]"
                                    cx="100" cy="100" r="62"
                                    stroke="currentColor" strokeWidth="12" fill="none"
                                    strokeDasharray="389"
                                    variants={ringVariants(389, 90, 0.4)}
                                    initial="hidden"
                                    animate="visible"
                                    strokeLinecap="round"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.5))' }}
                                ></motion.circle>

                                {/* Play (Cyan) */}
                                <motion.circle
                                    className="text-[#06B6D4]"
                                    cx="100" cy="100" r="40"
                                    stroke="currentColor" strokeWidth="12" fill="none"
                                    strokeDasharray="251"
                                    variants={ringVariants(251, 30, 0.6)}
                                    initial="hidden"
                                    animate="visible"
                                    strokeLinecap="round"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))' }}
                                ></motion.circle>
                            </svg>
                        </div>
                    </motion.div>

                    {/* Today's Goals Cards */}
                    <motion.div variants={itemVariants} className="w-full mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] drop-shadow-sm">Weekly Progress</h2>
                            <span className="text-[10px] text-[#06B6D4] font-bold cursor-pointer hover:text-white transition">View Details</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Move Card */}
                            <motion.div
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                                className="glass-card rounded-[2rem] p-5 flex flex-col justify-between h-44 relative overflow-hidden group hover:border-[#A855F7]/30 transition-colors border border-white/5 bg-white/5"
                            >
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-2xl group-hover:bg-[#A855F7]/20 transition-colors"></div>

                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-10 h-10 rounded-2xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/20 shadow-inner">
                                        <span className="material-symbols-outlined text-[#A855F7] text-xl">directions_walk</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-baseline mb-1">
                                        <span className="text-3xl font-bold text-white">450</span>
                                        <span className="text-[10px] text-[#94A3B8] font-bold ml-1 uppercase">kcal</span>
                                    </div>
                                    <p className="text-[10px] text-[#94A3B8]/70 font-bold uppercase tracking-wide mb-4">Daily Move</p>

                                    <div className="w-full bg-[#0A0C10] rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '85%' }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                            className="bg-[#A855F7] h-full rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                                        ></motion.div>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <span className="text-[10px] text-[#A855F7] font-bold">85%</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Exercise Card */}
                            <motion.div
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                                className="glass-card rounded-[2rem] p-5 flex flex-col justify-between h-44 relative overflow-hidden group hover:border-[#6366F1]/30 transition-colors border border-white/5 bg-white/5"
                            >
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#6366F1]/10 rounded-full blur-2xl group-hover:bg-[#6366F1]/20 transition-colors"></div>

                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center border border-[#6366F1]/20 shadow-inner">
                                        <span className="material-symbols-outlined text-[#6366F1] text-xl">fitness_center</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-baseline mb-1">
                                        <span className="text-3xl font-bold text-white">35</span>
                                        <span className="text-[10px] text-[#94A3B8] font-bold ml-1 uppercase">min</span>
                                    </div>
                                    <p className="text-[10px] text-[#94A3B8]/70 font-bold uppercase tracking-wide mb-4">Daily Exercise</p>

                                    <div className="w-full bg-[#0A0C10] rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '76%' }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                                            className="bg-[#6366F1] h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                                        ></motion.div>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <span className="text-[10px] text-[#6366F1] font-bold">76%</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.main>
            </div>
        </PageLayout>
    );
};

export default Activity;
