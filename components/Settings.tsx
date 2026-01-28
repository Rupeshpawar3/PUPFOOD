import React, { useState } from 'react';
import PageLayout from './PageLayout';

interface SettingsProps {
    onBack: () => void;
}

type SettingSection = 'profile' | 'security' | 'notifications' | 'language' | 'theme' | 'appointments' | 'help' | 'about' | 'contact' | null;
type SubView = 'edit-profile' | 'change-password' | '2fa' | 'sessions' | 'delete-account' | 'language-select' | null;

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
    const [expandedSection, setExpandedSection] = useState<SettingSection>(null);
    const [subView, setSubView] = useState<SubView>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Existing state
    const [selectedLanguage, setSelectedLanguage] = useState('hindi');
    const [readScreens, setReadScreens] = useState(true);
    const [speakingSpeed, setSpeakingSpeed] = useState(50);
    const [darkMode, setDarkMode] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(false);
    const [healthAlerts, setHealthAlerts] = useState(true);

    const languages = [
        { id: 'english', name: 'English', icon: '🇬🇧' },
        { id: 'hindi', name: 'Hindi / हिंदी', icon: '🇮🇳' },
        { id: 'telugu', name: 'Telugu / తెలుగు', icon: '🇮🇳' },
        { id: 'tamil', name: 'Tamil / தமிழ்', icon: '🇮🇳' },
        { id: 'bengali', name: 'Bengali / বাংলা', icon: '🇮🇳' },
        { id: 'marathi', name: 'Marathi / मराठी', icon: '🇮🇳' },
    ];

    const toggleSection = (section: SettingSection) => {
        if (expandedSection === section) {
            setExpandedSection(null);
            setSubView(null);
        } else {
            setExpandedSection(section);
            setSubView(null);
        }
    };

    const menuItems = [
        {
            id: 'profile' as const,
            icon: 'person',
            title: 'Manage Profile',
            subtitle: 'View and edit your profile',
            color: '#6C5CFF'
        },
        {
            id: 'security' as const,
            icon: 'lock',
            title: 'Password & Security',
            subtitle: '2FA, sessions, account',
            color: '#6C5CFF'
        },
        {
            id: 'notifications' as const,
            icon: 'notifications',
            title: 'Notifications',
            subtitle: 'Alerts and reminders',
            color: '#2DD4BF'
        },
        {
            id: 'language' as const,
            icon: 'language',
            title: 'Language',
            subtitle: 'भाषा चुनें',
            color: '#6C5CFF'
        },
        {
            id: 'theme' as const,
            icon: 'palette',
            title: 'Theme',
            subtitle: 'Light, Dark, System',
            color: '#6C5CFF'
        },
        {
            id: 'appointments' as const,
            icon: 'calendar_month',
            title: 'Appointments',
            subtitle: 'Upcoming & past visits',
            color: '#2DD4BF'
        },
        {
            id: 'help' as const,
            icon: 'help',
            title: 'Help Center',
            subtitle: 'FAQs, guides, support',
            color: '#6C5CFF'
        },
        {
            id: 'about' as const,
            icon: 'info',
            title: 'About Us',
            subtitle: 'App info & policies',
            color: '#9AA0B4'
        },
        {
            id: 'contact' as const,
            icon: 'support_agent',
            title: 'Contact Us',
            subtitle: 'Get in touch',
            color: '#2DD4BF'
        }
    ];

    return (
        <PageLayout title="Settings" onBack={onBack}>
            <div className="flex flex-col gap-6 max-w-md mx-auto w-full pb-24">

                {/* User Profile Summary */}
                <div className="backdrop-blur-md bg-[#0B1020]/40 border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-gradient-to-br from-[#6C5CFF] to-[#8B7EFF] flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(108,92,255,0.3)]">
                            B
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#EAEAF0] text-lg font-semibold">Bruno's Parent</h3>
                            <p className="text-[#9AA0B4] text-sm">bruno@pupfood.app</p>
                        </div>
                        <div className="size-10 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#2DD4BF] text-xl">verified</span>
                        </div>
                    </div>
                </div>

                {/* Settings Menu */}
                <div className="flex flex-col gap-3">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            {/* Main Menu Item */}
                            <button
                                onClick={() => toggleSection(item.id)}
                                className={`w-full backdrop-blur-md border p-5 rounded-2xl transition-all ${expandedSection === item.id
                                    ? 'bg-[#6C5CFF]/10 border-[#6C5CFF] shadow-[0_0_20px_rgba(108,92,255,0.2)]'
                                    : 'bg-[#0B1020]/40 border-white/5 hover:bg-[#0E1328]/60 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="size-12 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${item.color}15` }}
                                    >
                                        <span className="material-symbols-outlined" style={{ color: item.color }}>
                                            {item.icon}
                                        </span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="text-[#EAEAF0] text-base font-semibold">{item.title}</h3>
                                        <p className="text-[#9AA0B4] text-xs">{item.subtitle}</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-[#9AA0B4] transition-transform ${expandedSection === item.id ? 'rotate-180' : ''
                                        }`}>
                                        expand_more
                                    </span>
                                </div>
                            </button>

                            {/* Expanded Content */}
                            {expandedSection === item.id && (
                                <div className="mt-3 backdrop-blur-md bg-[#0E1328]/60 border border-white/5 rounded-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-300">

                                    {/* Profile Section */}
                                    {item.id === 'profile' && (
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">visibility</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">View Profile</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">edit</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Edit Profile</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Security Section */}
                                    {item.id === 'security' && (
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">password</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Change Password</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#2DD4BF]">fingerprint</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Biometric / 2FA</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">devices</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Active Sessions</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <div className="h-px bg-white/5 my-2"></div>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-red-500">delete_forever</span>
                                                    <span className="text-red-400 text-sm font-medium">Delete Account</span>
                                                </div>
                                                <span className="material-symbols-outlined text-red-400 text-lg">chevron_right</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Notifications Section */}
                                    {item.id === 'notifications' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#2DD4BF]">notifications_active</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Push Notifications</span>
                                                </div>
                                                <div
                                                    onClick={() => setPushNotifs(!pushNotifs)}
                                                    className={`w-12 h-7 rounded-full relative transition-all cursor-pointer ${pushNotifs ? 'bg-[#6C5CFF] shadow-[0_0_12px_rgba(108,92,255,0.4)]' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`absolute top-[4px] left-[4px] bg-white rounded-full h-5 w-5 transition-transform shadow-lg ${pushNotifs ? 'translate-x-[20px]' : ''
                                                        }`}></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">email</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Email / SMS Alerts</span>
                                                </div>
                                                <div
                                                    onClick={() => setEmailNotifs(!emailNotifs)}
                                                    className={`w-12 h-7 rounded-full relative transition-all cursor-pointer ${emailNotifs ? 'bg-[#6C5CFF] shadow-[0_0_12px_rgba(108,92,255,0.4)]' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`absolute top-[4px] left-[4px] bg-white rounded-full h-5 w-5 transition-transform shadow-lg ${emailNotifs ? 'translate-x-[20px]' : ''
                                                        }`}></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#2DD4BF]">health_and_safety</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Health & Appointment Alerts</span>
                                                </div>
                                                <div
                                                    onClick={() => setHealthAlerts(!healthAlerts)}
                                                    className={`w-12 h-7 rounded-full relative transition-all cursor-pointer ${healthAlerts ? 'bg-[#6C5CFF] shadow-[0_0_12px_rgba(108,92,255,0.4)]' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`absolute top-[4px] left-[4px] bg-white rounded-full h-5 w-5 transition-transform shadow-lg ${healthAlerts ? 'translate-x-[20px]' : ''
                                                        }`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Language Section */}
                                    {item.id === 'language' && (
                                        <div className="flex flex-col gap-4">
                                            <p className="text-[#9AA0B4] text-sm">Select your preferred language</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.id}
                                                        onClick={() => setSelectedLanguage(lang.id)}
                                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedLanguage === lang.id
                                                            ? 'bg-[#6C5CFF]/20 border-[#6C5CFF] shadow-[0_0_15px_rgba(108,92,255,0.3)]'
                                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <span className="text-2xl">{lang.icon}</span>
                                                        <span className="text-[#EAEAF0] text-sm font-medium">{lang.name}</span>
                                                        {selectedLanguage === lang.id && (
                                                            <span className="material-symbols-outlined text-[#6C5CFF] text-lg ml-auto">check_circle</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                            <button className="w-full py-3 bg-[#6C5CFF] text-white font-semibold rounded-full shadow-[0_0_20px_rgba(108,92,255,0.3)] hover:bg-[#7C6CFF] transition-all">
                                                Apply & Reload
                                            </button>
                                        </div>
                                    )}

                                    {/* Theme Section */}
                                    {item.id === 'theme' && (
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => setDarkMode(false)}
                                                className={`flex items-center justify-between p-4 rounded-xl transition-all ${!darkMode ? 'bg-[#6C5CFF]/20 border border-[#6C5CFF]' : 'bg-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#FFB800]">light_mode</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Light Mode</span>
                                                </div>
                                                {!darkMode && <span className="material-symbols-outlined text-[#6C5CFF]">check_circle</span>}
                                            </button>
                                            <button
                                                onClick={() => setDarkMode(true)}
                                                className={`flex items-center justify-between p-4 rounded-xl transition-all ${darkMode ? 'bg-[#6C5CFF]/20 border border-[#6C5CFF]' : 'bg-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">dark_mode</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Dark Mode</span>
                                                </div>
                                                {darkMode && <span className="material-symbols-outlined text-[#6C5CFF]">check_circle</span>}
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#9AA0B4]">settings_suggest</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">System Default</span>
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {/* Appointments Section */}
                                    {item.id === 'appointments' && (
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#2DD4BF]">upcoming</span>
                                                    <div className="text-left">
                                                        <p className="text-[#EAEAF0] text-sm font-medium">Upcoming Appointments</p>
                                                        <p className="text-[#9AA0B4] text-xs">2 scheduled</p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">history</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Past Appointments</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#FFB800]">edit_calendar</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Cancel / Reschedule</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Help Center Section */}
                                    {item.id === 'help' && (
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">quiz</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">FAQs</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#2DD4BF]">book</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">User Guides</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-red-400">emergency</span>
                                                    <span className="text-red-400 text-sm font-medium">Emergency Help</span>
                                                </div>
                                                <span className="material-symbols-outlined text-red-400 text-lg">chevron_right</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* About Us Section */}
                                    {item.id === 'about' && (
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#9AA0B4]">info</span>
                                                    <div className="text-left">
                                                        <p className="text-[#EAEAF0] text-sm font-medium">App Information</p>
                                                        <p className="text-[#9AA0B4] text-xs">Version 1.0.0</p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">privacy_tip</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Privacy Policy</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">gavel</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Terms & Conditions</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Contact Us Section */}
                                    {item.id === 'contact' && (
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#2DD4BF]">email</span>
                                                    <div className="text-left">
                                                        <p className="text-[#EAEAF0] text-sm font-medium">Email Support</p>
                                                        <p className="text-[#9AA0B4] text-xs">support@pupfood.app</p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#6C5CFF]">call</span>
                                                    <div className="text-left">
                                                        <p className="text-[#EAEAF0] text-sm font-medium">Call Support</p>
                                                        <p className="text-[#9AA0B4] text-xs">+91 1800-123-4567</p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9AA0B4] text-lg">chevron_right</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#2DD4BF]">chat</span>
                                                    <span className="text-[#EAEAF0] text-sm font-medium">Live Chat Support</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-[#2DD4BF] animate-pulse"></span>
                                                    <span className="text-[#2DD4BF] text-xs">Online</span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Logout Button */}
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full backdrop-blur-md bg-red-500/10 border border-red-500/20 p-5 rounded-2xl hover:bg-red-500/20 transition-all mt-2"
                    >
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-400">logout</span>
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-red-400 text-base font-semibold">Logout</h3>
                                <p className="text-red-300/60 text-xs">Sign out of your account</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="backdrop-blur-md bg-[#0E1328] border border-white/10 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-sm mx-4 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-400 text-4xl">logout</span>
                            </div>
                            <h3 className="text-[#EAEAF0] text-xl font-semibold">Logout</h3>
                            <p className="text-[#9AA0B4] text-sm">Are you sure you want to logout? You'll need to sign in again to access your account.</p>
                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-3 bg-white/5 border border-white/10 text-[#EAEAF0] rounded-full font-semibold hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowLogoutConfirm(false);
                                        // Handle logout
                                    }}
                                    className="flex-1 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Voice Assistant FAB */}
            <div className="fixed bottom-6 right-6 z-40">
                <button className="flex items-center justify-center size-16 bg-gradient-to-br from-[#6C5CFF] to-[#8B7EFF] text-white rounded-full shadow-[0_8px_32px_rgba(108,92,255,0.4)] hover:shadow-[0_12px_40px_rgba(108,92,255,0.5)] hover:scale-105 active:scale-95 transition-all border border-white/10">
                    <span className="material-symbols-outlined text-3xl">mic</span>
                </button>
            </div>
        </PageLayout>
    );
};

export default Settings;
