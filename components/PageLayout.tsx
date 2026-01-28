import React from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    className?: string; // Allow additional custom classes for the content container
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, onBack, rightAction, className = "" }) => {
    return (
        <div className="bg-background-dark min-h-screen font-display text-white relative flex flex-col overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[20%] right-[-20%] w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

            {/* Header */}
            {(title || onBack || rightAction) && (
                <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center min-w-0">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="mr-3 w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/80 hover:bg-white/10 transition active:scale-95"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                        )}
                        {title && (
                            <h1 className="text-xl font-bold tracking-wide truncate">{title}</h1>
                        )}
                    </div>
                    {rightAction && (
                        <div className="ml-4 shrink-0">
                            {rightAction}
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 py-3 pb-24 ${className}`}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default PageLayout;
