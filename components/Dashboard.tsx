import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { View, Pet } from '../types';
import PupFoodLogo from './PupFoodLogo';

interface DashboardProps {
    onNavigate: (view: View) => void;
    onOpenVoice: () => void;
    selectedPet: Pet;
}

// Animation Configuration - Performance & Smoothness Optimized
const smoothTransition = {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for native-like smoothness
    duration: 0.6
};

const springInteraction = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 1
};

// Stagger configuration (slower stagger to prevent frame drops)
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

// Card animation variants - using translateZ to force GPU layer
const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.98,
        filter: "blur(4px)" // Slight blur out initially for smoothness
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: smoothTransition
    }
};

// Slide variants - optimized
const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { ...smoothTransition, duration: 0.5 }
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: { duration: 0.3 }
    }
};

// Fade variants (for reduced motion fallback)
const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.12 } },
    exit: { opacity: 0, transition: { duration: 0.1 } }
};

// Button micro-interaction
const buttonTap = {
    scale: 0.96,
    transition: { duration: 0.1 }
};

const buttonHover = {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 25 }
};


const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenVoice, selectedPet }) => {
    const [hydrationLevel, setHydrationLevel] = useState(true);
    const [healthScore, setHealthScore] = useState(0);
    const prefersReducedMotion = useReducedMotion();
    const targetScore = 98;

    // Choose variants based on motion preference - use optimized transitions
    const getVariants = () => prefersReducedMotion ? fadeVariants : cardVariants;
    const getSlideVariants = () => prefersReducedMotion ? fadeVariants : slideVariants;

    // Animate counter from 0 to target on mount
    useEffect(() => {
        if (prefersReducedMotion) {
            setHealthScore(targetScore);
            return;
        }

        let start = 0;
        const end = targetScore;
        const duration = 2000;
        const incrementTime = Math.floor(duration / end);

        const timer = setInterval(() => {
            start += 1;
            setHealthScore(start);
            if (start >= end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [prefersReducedMotion]);

    return (
        <motion.div
            className="min-h-full relative bg-[#0A0C10] overflow-hidden pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.4 }}
        >
            {/* Background Blur Effects */}
            <motion.div
                className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-[#A855F7]/10 rounded-full blur-[120px] pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 1.2, delay: 0.3 }}
            />
            <motion.div
                className="absolute bottom-[20%] right-[-20%] w-80 h-80 bg-[#6366F1]/10 rounded-full blur-[100px] pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 1.2, delay: 0.5 }}
            />

            {/* Status Bar */}
            <motion.div
                className="flex justify-between items-center px-8 pt-4 pb-2 z-50 relative text-[#94A3B8]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.4 }}
            >
                <span className="text-sm font-semibold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>9:41</span>
                <div className="flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>wifi</span>
                    <span className="material-symbols-outlined text-sm rotate-90" style={{ fontSize: '18px' }}>battery_full</span>
                </div>
            </motion.div>

            {/* Header */}
            <motion.header
                className="px-4 py-3 flex items-center justify-between z-10 relative"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.div
                    variants={getSlideVariants()}
                    whileTap={buttonTap}
                    onClick={() => onNavigate(View.MY_PETS)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#94A3B8]/20 p-0.5 shadow-lg shadow-black/40 cursor-pointer"
                >
                    <img alt="User profile" className="w-full h-full object-cover rounded-full" src={selectedPet.thumb} />
                </motion.div>
                <motion.div
                    className="flex flex-col items-center"
                    variants={getVariants()}
                >
                    <h1 className="text-xs font-bold tracking-[0.2em] uppercase text-white/90" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>{selectedPet.name}'s Diet Plan</h1>
                    <div className="flex items-center space-x-1.5 mt-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        </span>
                        <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Connected</span>
                    </div>
                </motion.div>
                <motion.button
                    variants={getSlideVariants()}
                    whileTap={buttonTap}
                    whileHover={prefersReducedMotion ? {} : { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } }}
                    onClick={() => onNavigate(View.ALERTS)}
                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 transition"
                >
                    <span className="material-symbols-outlined text-xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>notifications</span>
                </motion.button>
            </motion.header>

            {/* Main Content */}
            <main className="relative px-4 flex flex-col items-center z-10">
                {/* Health Score Sphere */}
                <motion.div
                    className="relative mt-4 mb-6 will-change-transform"
                    initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    transition={prefersReducedMotion ? { duration: 0.1 } : { ...smoothTransition, delay: 0.2 }}
                >
                    <div className="w-64 h-64 rounded-full flex flex-col items-center justify-center relative z-10" style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)',
                        boxShadow: '0 0 80px rgba(99, 102, 241, 0.25), inset 0 0 20px rgba(168, 85, 247, 0.1)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <motion.div
                            animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="mb-3"
                        >
                            <PupFoodLogo width={40} animated={!prefersReducedMotion} />
                        </motion.div>
                        <div className="flex items-baseline space-x-1">
                            <motion.span
                                key={healthScore}
                                initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-6xl font-bold text-white"
                                style={{ textShadow: '0 0 25px rgba(99, 102, 241, 0.5), 0 4px 8px rgba(0,0,0,0.6)' }}
                            >
                                {healthScore}
                            </motion.span>
                            <span className="text-3xl font-medium text-[#94A3B8]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>%</span>
                        </div>
                        <p className="text-xs text-[#94A3B8] uppercase tracking-widest mt-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Dog Health Score</p>
                        <motion.div
                            className="mt-5 px-4 py-1 rounded-full text-[10px] text-[#10B981] font-bold uppercase tracking-widest border border-[#10B981]/20 bg-[#10B981]/5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 1.5, duration: 0.4 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(16px)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                            }}
                        >
                            Excellent
                        </motion.div>
                    </div>
                    {/* Pagination Dots */}
                    <div className="flex justify-center space-x-1.5 mt-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 shadow-sm"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 shadow-sm"></div>
                    </div>
                </motion.div>

                {/* Daily Intake Card */}
                <motion.div
                    className="w-full mb-4"
                    initial="hidden"
                    animate="visible"
                    variants={getVariants()}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
                >
                    <motion.div
                        className="glass-card rounded-[2rem] p-6 relative overflow-hidden border border-white/5"
                        whileHover={prefersReducedMotion ? {} : buttonHover}
                        whileTap={prefersReducedMotion ? {} : buttonTap}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Daily Intake</p>
                                <div className="flex items-baseline space-x-1.5">
                                    <span className="text-4xl font-semibold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>450</span>
                                    <span className="text-lg font-medium text-[#94A3B8]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>/ 900 kcal</span>
                                </div>
                            </div>
                            <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-[#0A0C10]/30 border border-white/5" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                                <span className="material-symbols-outlined text-[#A855F7] text-3xl" style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.5))' }}>local_fire_department</span>
                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" fill="none" r="46" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                                    <motion.circle
                                        cx="50" cy="50" fill="none" r="46"
                                        stroke="#A855F7"
                                        strokeDasharray="289"
                                        initial={{ strokeDashoffset: 289 }}
                                        animate={{ strokeDashoffset: 144 }}
                                        transition={{ duration: prefersReducedMotion ? 0 : 1.5, delay: 0.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        strokeWidth="4"
                                        className="drop-shadow-[0_0_4px_#A855F7]"
                                    />
                                </svg>
                            </div>
                        </div>
                        {/* Macros Grid */}
                        <motion.div
                            className="grid grid-cols-3 gap-3"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {[
                                { value: '50g', label: 'Protein', color: '#10B981' },
                                { value: '12g', label: 'Fat', color: '#F59E0B' },
                                { value: '5g', label: 'Fiber', color: '#94A3B8' }
                            ].map((macro, index) => (
                                <motion.div
                                    key={macro.label}
                                    variants={getVariants()}
                                    whileHover={prefersReducedMotion ? {} : { scale: 1.05, transition: { duration: 0.15 } }}
                                    whileTap={prefersReducedMotion ? {} : { scale: 0.98, transition: { duration: 0.1 } }}
                                    className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center border-white/5 bg-white/5 hover:bg-white/10 transition-colors shadow-none cursor-pointer"
                                >
                                    <p className="text-lg font-bold text-white mb-0.5" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>{macro.value}</p>
                                    <p className="text-[9px] uppercase font-bold tracking-wider" style={{ color: macro.color, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>{macro.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Meal & Hydration Cards */}
                <motion.div
                    className="w-full mb-4 space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Morning Kibble Card */}
                    <motion.div
                        className="glass-card rounded-[2rem] p-5 border border-white/5"
                        variants={getVariants()}
                        whileTap={prefersReducedMotion ? {} : buttonTap}
                    >
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                                    style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05),0 4px 6px rgba(0,0,0,0.3)' }}
                                    whileHover={prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }}
                                    transition={springInteraction}
                                >
                                    <span className="material-symbols-outlined text-[#94A3B8]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>grain</span>
                                </motion.div>
                                <div>
                                    <h3 className="text-base font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Morning Kibble</h3>
                                    <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mt-0.5" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Primary Meal</p>
                                </div>
                            </div>
                            <motion.div
                                className="w-9 h-9 rounded-full glass-card flex items-center justify-center border-white/10 text-[#94A3B8] hover:text-white transition cursor-pointer shadow-lg"
                                whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 90 }}
                                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </motion.div>
                        </div>
                        {/* Portion Size Slider */}
                        <div className="px-1">
                            <div className="flex justify-between text-xs mb-3 items-end">
                                <span className="text-[#94A3B8] uppercase font-bold text-[10px] tracking-widest" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Portion Size</span>
                                <span className="text-[#06B6D4] font-bold text-sm" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))' }}>120G</span>
                            </div>
                            <div className="relative h-6 flex items-center">
                                <div className="absolute w-full h-1 bg-[#0A0C10]/50 rounded-full overflow-hidden" style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)' }}>
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#94A3B8]/20 to-[#06B6D4]"
                                        initial={{ width: 0 }}
                                        animate={{ width: '40%' }}
                                        transition={{ ...smoothTransition, delay: 0.6 }}
                                    />
                                </div>
                                <input className="relative w-full z-10 opacity-0 cursor-pointer" type="range" defaultValue="40" />
                                <motion.div
                                    className="absolute left-[40%] w-4 h-4 rounded-full bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.8)] border-2 border-white -ml-2 pointer-events-none"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: prefersReducedMotion ? 0 : 1.0, type: "spring", stiffness: 300 }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Hydration Card */}
                    <motion.div
                        className="glass-card rounded-[2rem] p-5 flex justify-between items-center border border-white/5"
                        variants={getVariants()}
                        whileTap={prefersReducedMotion ? {} : buttonTap}
                    >
                        <div className="flex items-center space-x-4">
                            <motion.div
                                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05),0 4px 6px rgba(0,0,0,0.3)' }}
                                animate={prefersReducedMotion ? {} : {
                                    y: [0, -2, 0],
                                    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                                }}
                            >
                                <span className="material-symbols-outlined text-[#94A3B8]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>water_drop</span>
                            </motion.div>
                            <div onClick={() => onNavigate(View.WATER_TRACKER)} className="cursor-pointer">
                                <h3 className="text-base font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Hydration</h3>
                                <p className="text-[10px] text-[#94A3B8]/70 font-bold uppercase tracking-wider mt-0.5" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Water Intake</p>
                            </div>
                        </div>
                        <label className="inline-flex items-center cursor-pointer relative">
                            <input
                                type="checkbox"
                                checked={hydrationLevel}
                                onChange={() => setHydrationLevel(!hydrationLevel)}
                                className="sr-only peer"
                            />
                            <motion.div
                                className="w-14 h-8 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all border border-white/10 shadow-inner"
                                animate={{ backgroundColor: hydrationLevel ? '#06B6D4' : '#0A0C10' }}
                                transition={{ duration: 0.2 }}
                            />
                            <span className={`absolute right-2 text-[8px] font-bold text-white/30 uppercase tracking-wider ${hydrationLevel ? 'hidden' : 'block'}`}>Low</span>
                            <span className={`absolute left-2 text-[8px] font-bold text-[#0A0C10] uppercase tracking-wider ${hydrationLevel ? 'block' : 'hidden'}`}>Good</span>
                        </label>
                    </motion.div>
                </motion.div>


                {/* Daily Tasks Section */}
                <motion.div
                    className="w-full bg-white/[0.02] backdrop-blur-3xl rounded-t-[3rem] border-t border-white/5 pt-3 pb-8 px-2 will-change-transform"
                    style={{ boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.8)' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0.1 } : { ...smoothTransition, delay: 0.5 }}
                >
                    <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-4 shadow-sm"></div>
                    <div className="flex justify-between items-center mb-4 px-3">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Daily Tasks</h2>
                            <motion.span
                                className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-[#94A3B8] shadow-inner"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: prefersReducedMotion ? 0 : 0.8, type: "spring" }}
                            >
                                1/4
                            </motion.span>
                        </div>
                    </div>
                    {/* Task Cards Grid */}
                    <motion.div
                        className="grid grid-cols-2 gap-4 px-2"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            onClick={() => onNavigate(View.FOOD_SCANNER)}
                            layoutId="task-card-log-meal"
                            className="task-card rounded-3xl p-5 flex flex-col justify-between h-40 group hover:bg-white/5 transition-all cursor-pointer"
                            variants={getVariants()}
                            whileHover={prefersReducedMotion ? {} : buttonHover}
                            whileTap={prefersReducedMotion ? {} : buttonTap}
                        >
                            <motion.div
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#6366F1]/20 transition-colors"
                                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05),0 2px 4px rgba(0,0,0,0.2)' }}
                                whileHover={prefersReducedMotion ? {} : { rotate: 10 }}
                            >
                                <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#6366F1]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>restaurant</span>
                            </motion.div>
                            <div>
                                <p className="text-sm font-semibold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Log Meal</p>
                                <p className="text-[10px] text-[#94A3B8]/70 mt-1 font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Evening feed</p>
                            </div>
                        </motion.div>
                        <motion.div
                            onClick={() => onNavigate(View.HEALTH_CHECK)}
                            className="task-card rounded-3xl p-5 flex flex-col justify-between h-40 group hover:bg-white/5 transition-all cursor-pointer"
                            variants={getVariants()}
                            whileHover={prefersReducedMotion ? {} : buttonHover}
                            whileTap={prefersReducedMotion ? {} : buttonTap}
                        >
                            <motion.div
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#6366F1]/20 transition-colors"
                                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05),0 2px 4px rgba(0,0,0,0.2)' }}
                                whileHover={prefersReducedMotion ? {} : { rotate: 10 }}
                            >
                                <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#6366F1]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>health_and_safety</span>
                            </motion.div>
                            <div>
                                <p className="text-sm font-semibold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Check Health</p>
                                <p className="text-[10px] text-[#94A3B8]/70 mt-1 font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Daily physical log</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Emergency Strip */}
                    <motion.div
                        onClick={() => onNavigate(View.EMERGENCY_CARE)}
                        className="mt-6 mx-2 py-3 px-4 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/10 border border-red-500/30 flex items-center justify-between cursor-pointer hover:border-red-500/50 hover:from-red-500/30 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={prefersReducedMotion ? { duration: 0.1 } : { ...smoothTransition, delay: 0.7 }}
                        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="material-symbols-outlined text-red-400 text-xl animate-pulse">emergency</span>
                            <span className="text-sm font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Emergency Care</span>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </div>
                        <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">24/7</span>
                    </motion.div>
                </motion.div>
            </main>
        </motion.div>
    );
};

export default Dashboard;
