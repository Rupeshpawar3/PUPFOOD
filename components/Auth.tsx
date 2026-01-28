import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/apiService';

interface AuthProps {
    onLoginSuccess: () => void;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 500 : -500,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 500 : -500,
        opacity: 0,
        scale: 0.95
    })
};

const containerTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
};

const staggerItems = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.1 + (i * 0.05)
        }
    })
};

const InputField = ({ type, placeholder, customIndex, name, value, onChange }: any) => (
    <motion.div
        custom={customIndex}
        variants={staggerItems}
        className="mb-4 relative"
    >
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="w-full p-[16px_20px] bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all placeholder:text-[#555] backdrop-blur-sm"
        />
    </motion.div>
);

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                await authAPI.signup(formData.email, formData.password, formData.name);
            } else {
                await authAPI.login(formData.email, formData.password);
            }
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        alert('Google OAuth is implemented on the backend! Frontend integration coming soon.');
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col justify-end min-h-full w-full bg-black relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-no-repeat transform scale-105"
                style={{
                    backgroundImage: "url('/login-bg-purple.jpg')",
                    backgroundPosition: "center -100px",
                    backgroundSize: "20%"
                }}
            >
                {/* Gradient Overlay - Top to Bottom (Transparent -> Black) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
            </div>

            {/* Content Container - Pushed to Bottom */}
            <motion.div
                layout
                className="relative z-20 w-full px-6 pb-12 pt-0 flex flex-col"
            >
                <AnimatePresence mode="wait" custom={isSignUp ? 1 : -1}>
                    <motion.div
                        key={isSignUp ? 'signup' : 'signin'}
                        custom={isSignUp ? 1 : -1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={containerTransition}
                        className="w-full flex flex-col items-center"
                    >
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            className="w-full flex flex-col items-center"
                        >
                            {/* Text Header */}
                            <motion.h2
                                custom={0}
                                variants={staggerItems}
                                className="text-white text-[3.5rem] font-black tracking-tighter mb-1 text-center leading-none"
                                style={{
                                    textShadow: '0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                PUPFOOD
                            </motion.h2>
                            <motion.p
                                custom={1}
                                variants={staggerItems}
                                className="text-white/60 text-sm mb-10 text-center font-medium tracking-wide"
                            >
                                {isSignUp ? 'Join the pack today' : 'Welcome, continue your experience'}
                            </motion.p>

                            {/* Google / Apple Buttons */}
                            <motion.div
                                custom={2}
                                variants={staggerItems}
                                className="flex gap-3 w-full mb-8"
                            >
                                <button onClick={handleGoogleAuth} type="button" className="flex-1 p-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white text-xs font-bold uppercase tracking-widest hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                                    Google
                                </button>
                                <button type="button" className="flex-1 p-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white text-xs font-bold uppercase tracking-widest hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                                    Apple
                                </button>
                            </motion.div>

                            <motion.div
                                custom={3}
                                variants={staggerItems}
                                className="w-full flex items-center text-[#444] text-[10px] font-bold uppercase tracking-[0.2em] mb-8 before:flex-1 before:h-[1px] before:bg-white/[0.1] before:mr-4 after:flex-1 after:h-[1px] after:bg-white/[0.1] after:ml-4"
                            >
                                Security First
                            </motion.div>

                            <form onSubmit={handleSubmit} className="w-full">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                {isSignUp && (
                                    <InputField
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        customIndex={4}
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                )}
                                <InputField
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    customIndex={5}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <InputField
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    customIndex={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                                {!isSignUp && (
                                    <motion.a
                                        custom={7}
                                        variants={staggerItems}
                                        href="#"
                                        className="text-[#666] text-[11px] font-bold uppercase tracking-wider mb-8 inline-block hover:text-white transition-colors"
                                    >
                                        Forgot Password?
                                    </motion.a>
                                )}

                                <motion.button
                                    custom={8}
                                    variants={staggerItems}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full p-5 bg-white text-black rounded-3xl text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl shadow-white/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                                </motion.button>

                                <motion.div
                                    custom={9}
                                    variants={staggerItems}
                                    className="mt-10 text-center text-[#666] text-xs font-medium"
                                >
                                    {isSignUp ? 'Already a member?' : "New here?"} {' '}
                                    <span
                                        onClick={toggleForm}
                                        className="text-white font-bold cursor-pointer hover:underline underline-offset-4"
                                    >
                                        {isSignUp ? 'Sign In' : 'Sign Up'}
                                    </span>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Auth;
