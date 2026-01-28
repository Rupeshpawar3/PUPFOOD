import React, { useRef, useState, useEffect } from 'react';
import { analyzeMedicine } from '../services/geminiService';
import { MedicineAnalysisResult } from '../types';
import PageLayout from './PageLayout';

interface MedicineScannerProps {
    onBack: () => void;
    onComplete: () => void;
}

const MedicineScanner: React.FC<MedicineScannerProps> = ({ onBack, onComplete }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MedicineAnalysisResult | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Initialize Camera
    useEffect(() => {
        let stream: MediaStream | null = null;
        if (!imagePreview) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error("Camera error", err));
        }
        return () => {
            stream?.getTracks().forEach(t => t.stop());
        };
    }, [imagePreview]);

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const base64 = canvas.toDataURL("image/jpeg");
                setImagePreview(base64);
                handleAnalyze(base64);
            }
        }
    };

    const handleAnalyze = async (base64: string) => {
        setLoading(true);
        try {
            const base64Data = base64.split(',')[1];
            const analysis = await analyzeMedicine(base64Data);
            setResult(analysis);
        } catch (error) {
            alert("Could not identify medicine. Please try again.");
            setImagePreview(null);
        } finally {
            setLoading(false);
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN'; // Hinting Hindi, though browser dependent
        window.speechSynthesis.speak(utterance);
    };

    const reset = () => {
        setImagePreview(null);
        setResult(null);
    };

    if (result) {
        return (
            <PageLayout title="Scan Result" onBack={reset}>
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex-1 flex flex-col gap-6 pb-20">
                        {/* Header Section */}
                        <div className="glass-card p-6 rounded-[2rem] text-center border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                                <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>
                                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Identified Successfully</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white leading-tight mb-2 tracking-tight">
                                {result.name}
                            </h1>
                        </div>

                        {/* Dosage Info Card */}
                        <div className="glass-card p-6 rounded-[2rem] flex items-center gap-6 border border-white/10 hover:bg-white/5 transition-colors">
                            <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/20 text-primary shadow-[0_0_15px_rgba(52,211,153,0.3)] border border-primary/10">
                                <span className="material-symbols-outlined text-3xl">pill</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Dosage Instruction</span>
                                <p className="text-white text-lg font-bold leading-relaxed">
                                    {result.dosage}
                                </p>
                            </div>
                        </div>

                        {/* Audio Instruction Row */}
                        <div className="glass-card p-6 rounded-[2rem] flex items-center justify-between gap-4 border border-white/10 group cursor-pointer hover:bg-white/5 transition-colors" onClick={() => speak(result.usageHindi)}>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1">Voice Instructions</h3>
                                <p className="text-sm text-white/50 font-medium leading-relaxed">Tap to listen to the usage guide in Hindi.</p>
                            </div>
                            <button
                                className="relative shrink-0 flex items-center justify-center size-14 rounded-full bg-primary/20 text-primary transition-transform active:scale-95 border border-primary/10 group-hover:bg-primary/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                            >
                                <span className="material-symbols-outlined text-2xl">volume_up</span>
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto space-y-3">
                            <button onClick={onComplete} className="w-full h-14 bg-primary hover:bg-primary/90 text-background-dark text-lg font-bold rounded-full shadow-[0_0_20px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                <span className="material-symbols-outlined text-xl">add_circle</span>
                                Add to Daily Plan
                            </button>
                            <button onClick={reset} className="w-full py-3 text-white/40 hover:text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-lg">center_focus_weak</span>
                                Scan Another
                            </button>
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <div className="bg-background-dark font-display text-white overflow-hidden h-screen w-full flex flex-col relative">
            {/* Camera Viewport */}
            <div className="relative w-full flex-1 bg-black overflow-hidden group/camera">
                {/* Camera Feed or Static Image */}
                {imagePreview ? (
                    <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url('${imagePreview}')` }}></div>
                ) : (
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-80"></video>
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>

                {/* Top Bar */}
                <div className="absolute top-0 left-0 w-full p-4 pt-4 flex justify-between items-center z-20">
                    <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                        <h2 className="text-white text-sm font-bold tracking-widest uppercase">Scan Medicine</h2>
                    </div>
                    <button className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined">flash_on</span>
                    </button>
                </div>

                {/* Scanning Reticle (Only visible when scanning) */}
                {!result && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pb-20 pointer-events-none">
                        <div className={`relative size-72 rounded-[2rem] border-2 border-primary/50 shadow-[0_0_50px_rgba(52,211,153,0.2)] bg-primary/5 backdrop-blur-[2px] transition-all duration-500 ${loading ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                            {/* Dynamic Corner lines for tech feel */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white opacity-50"></div>
                            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white opacity-50"></div>
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white opacity-50"></div>
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white opacity-50"></div>

                            {loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <span className="material-symbols-outlined text-primary text-5xl animate-spin drop-shadow-glow">progress_activity</span>
                                    <p className="text-white font-bold tracking-widest uppercase text-xs animate-pulse">Analyzing...</p>
                                </div>
                            )}
                        </div>

                        {!loading && (
                            <div className="mt-8 pointer-events-auto cursor-pointer group" onClick={captureImage}>
                                <div className="size-20 rounded-full border-4 border-white/20 p-1 transition-transform group-active:scale-95">
                                    <div className="w-full h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-shadow"></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicineScanner;