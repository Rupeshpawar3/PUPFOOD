import React from 'react';
import { View } from '../types';

interface BottomNavigationProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentView, onNavigate }) => {
    // Helper to determine active state
    const isActive = (view: View) => currentView === view;

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-between z-50">
            <button
                onClick={() => onNavigate(View.DASHBOARD)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive(View.DASHBOARD) ? 'text-white' : 'text-nav-inactive hover:bg-white/5'}`}
            >
                <span className={`material-symbols-outlined text-[26px] ${isActive(View.DASHBOARD) ? 'font-fill' : ''}`}>home</span>
            </button>
            <button
                onClick={() => onNavigate(View.DAILY_PLAN)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive(View.DAILY_PLAN) ? 'text-white' : 'text-nav-inactive hover:bg-white/5'}`}
            >
                <span className={`material-symbols-outlined text-[26px] ${isActive(View.DAILY_PLAN) ? 'font-fill' : ''}`}>analytics</span>
            </button>

            {/* Standardized Center Button */}
            <button
                onClick={() => onNavigate(View.FOOD_SCANNER)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive(View.FOOD_SCANNER) ? 'text-white' : 'text-nav-inactive hover:bg-white/5'}`}
            >
                <div className={`flex items-center justify-center rounded-lg transition-all ${isActive(View.FOOD_SCANNER) ? 'text-primary' : 'text-inherit'}`}>
                    <span className="material-symbols-outlined text-[28px]">document_scanner</span>
                </div>
            </button>

            <button
                onClick={() => onNavigate(View.COMMUNITY)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive(View.COMMUNITY) ? 'text-white' : 'text-nav-inactive hover:bg-white/5'}`}
            >
                <span className={`material-symbols-outlined text-[26px] ${isActive(View.COMMUNITY) ? 'font-fill' : ''}`}>groups</span>
            </button>
            <button
                onClick={() => onNavigate(View.ACTIVITY)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive(View.ACTIVITY) ? 'text-white' : 'text-nav-inactive hover:bg-white/5'}`}
            >
                <div className="relative w-[28px] h-[28px] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="9" className={isActive(View.ACTIVITY) ? "text-[#8812BF]" : "text-current opacity-40"} />
                        <circle cx="12" cy="12" r="6" className={isActive(View.ACTIVITY) ? "text-[#B640ED]" : "text-current opacity-40"} />
                        <circle cx="12" cy="12" r="3" className={isActive(View.ACTIVITY) ? "text-[#D694F5]" : "text-current opacity-40"} />
                    </svg>
                </div>
            </button>
        </div>
    );
};

export default BottomNavigation;
