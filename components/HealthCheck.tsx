import React, { useState, useEffect, useRef } from 'react';
import { View } from '../types';
import { analyzeHealthVideoOpenAI } from '../services/openaiService';
import PageLayout from './PageLayout';

interface HealthCheckProps {
    onBack: () => void;
    onNavigate?: (view: View) => void;
}

type HealthCheckView = 'dashboard' | 'reports' | 'scanner-landing' | 'scanner-active' | 'scanner-results';
type ScanState = 'idle' | 'recording' | 'analyzing' | 'complete';

interface HealthData {
    weight: { value: number; unit: string; trend: 'up' | 'down' | 'stable' };
    heartRate: { value: number; status: 'normal' | 'high' | 'low' };
    temperature: { value: number; unit: string; normal: boolean };
    activityLevel: { steps: number; target: number };
    sleepQuality: { hours: number; quality: 'excellent' | 'good' | 'poor' };
}

interface HealthReport {
    id: string;
    type: 'scan' | 'checkup' | 'vaccination';
    date: Date;
    title: string;
    summary: string;
    status: 'normal' | 'attention' | 'critical';
}

interface HealthAnalysis {
    healthScore: number;
    observations: string[];
    concerns: string[];
    severity: 'normal' | 'monitor' | 'attention' | 'urgent';
    recommendations: string[];
}

const HealthCheck: React.FC<HealthCheckProps> = ({ onBack, onNavigate }) => {
    const [currentView, setCurrentView] = useState<HealthCheckView>('dashboard');
    const [healthData] = useState<HealthData>({
        weight: { value: 18, unit: 'kg', trend: 'stable' },
        heartRate: { value: 72, status: 'normal' },
        temperature: { value: 101, unit: 'F', normal: true },
        activityLevel: { steps: 8420, target: 10000 },
        sleepQuality: { hours: 7.5, quality: 'good' }
    });
    const [reports, setReports] = useState<HealthReport[]>([
        {
            id: '1',
            type: 'scan',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            title: 'Behavior Scan',
            summary: 'Normal activity patterns detected. No concerns.',
            status: 'normal'
        },
        {
            id: '2',
            type: 'vaccination',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            title: 'Rabies Booster',
            summary: 'Vaccination completed successfully.',
            status: 'normal'
        }
    ]);
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [scanProgress, setScanProgress] = useState(0);
    const [scanResult, setScanResult] = useState<HealthAnalysis | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Camera setup for scanner
    useEffect(() => {
        let stream: MediaStream | null = null;
        if (currentView === 'scanner-active' && !cameraError) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play();
                        };
                    }
                })
                .catch(err => {
                    console.error("Camera error", err);
                    setCameraError("Unable to access camera. Please ensure you have allowed permission.");
                });
        }
        return () => {
            stream?.getTracks().forEach(t => t.stop());
        };
    }, [currentView, cameraError]);

    const retryCamera = () => {
        setCameraError(null);
    };

    // Recording progress
    useEffect(() => {
        if (scanState === 'recording') {
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                            mediaRecorderRef.current.stop();
                        }
                        setScanState('analyzing');
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [scanState]);

    const startScanning = () => {
        setCurrentView('scanner-active');
        setScanState('idle');
        setScanProgress(0);
    };

    const startRecording = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async () => {
                    const base64data = reader.result as string;
                    const base64Content = base64data.split(',')[1];

                    try {
                        // Use OpenAI for health analysis
                        const result = await analyzeHealthVideoOpenAI(base64Content);

                        // Use the structured response from OpenAI
                        const analysis: HealthAnalysis = {
                            healthScore: result.healthScore,
                            observations: result.observations,
                            concerns: result.concerns,
                            severity: result.severity,
                            recommendations: result.recommendations
                        };

                        setScanResult(analysis);
                        setScanState('complete');
                        setCurrentView('scanner-results');

                        // Add to reports
                        const newReport: HealthReport = {
                            id: Date.now().toString(),
                            type: 'scan',
                            date: new Date(),
                            title: 'AI Behavior Scan',
                            summary: analysis.observations.join('. '),
                            status: analysis.severity === 'normal' ? 'normal' : 'attention'
                        };
                        setReports(prev => [newReport, ...prev]);
                    } catch (e) {
                        console.error('Analysis failed', e);
                        setScanState('idle');
                    }
                };
            };

            recorder.start();
            setScanState('recording');
        }
    };

    const saveScanReport = () => {
        setCurrentView('dashboard');
        setScanState('idle');
        setScanProgress(0);
    };

    // Calculate progress ring
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = scanResult
        ? circumference - (scanResult.healthScore / 100) * circumference
        : circumference - (scanProgress / 100) * circumference;

    // DASHBOARD VIEW
    if (currentView === 'dashboard') {
        return (
            <PageLayout title="Health Check" onBack={onBack}>
                <div className="max-w-md mx-auto pb-24">
                    {/* Health Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Weight Card */}
                        <div className="glass-card rounded-3xl p-5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl">monitor_weight</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Weight</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">{healthData.weight.value}</span>
                                        <span className="text-sm text-white/60">{healthData.weight.unit}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                {healthData.weight.trend === 'stable' && (
                                    <>
                                        <span className="material-symbols-outlined text-accent text-sm">trending_flat</span>
                                        <span className="text-accent font-medium">Stable</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Heart Rate Card */}
                        <div className="glass-card rounded-3xl p-5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-red-400 text-xl">favorite</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Heart Rate</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">{healthData.heartRate.value}</span>
                                        <span className="text-sm text-white/60">bpm</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                                <span className="text-green-400 font-medium capitalize">{healthData.heartRate.status}</span>
                            </div>
                        </div>

                        {/* Temperature Card */}
                        <div className="glass-card rounded-3xl p-5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-orange-400 text-xl">thermostat</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Temperature</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">{healthData.temperature.value}</span>
                                        <span className="text-sm text-white/60">°{healthData.temperature.unit}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                {healthData.temperature.normal && (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                        <span className="text-green-400 font-medium">Normal</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Activity Card */}
                        <div className="glass-card rounded-3xl p-5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-400 text-xl">directions_run</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Activity</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">{healthData.activityLevel.steps}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all"
                                    style={{ width: `${(healthData.activityLevel.steps / healthData.activityLevel.target) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Sleep Quality Card */}
                    <div className="glass-card rounded-3xl p-5 border border-white/10 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-purple-400 text-2xl">bedtime</span>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-1">Sleep Quality</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-white">{healthData.sleepQuality.hours}</span>
                                        <span className="text-sm text-white/60">hours</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                                <span className="text-green-400 font-bold text-xs capitalize">{healthData.sleepQuality.quality}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3 mb-6">
                        {/* AI Scan Button - Primary CTA */}
                        <button
                            onClick={startScanning}
                            className="w-full glass-card rounded-3xl p-6 border border-primary/30 hover:border-primary/50 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-white text-3xl">videocam</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-white font-bold text-lg mb-1">AI Behavior Scan</h3>
                                    <p className="text-white/60 text-sm">Analyze health with camera</p>
                                </div>
                                <span className="material-symbols-outlined text-primary text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </button>

                        {/* Reports Button */}
                        <button
                            onClick={() => setCurrentView('reports')}
                            className="w-full glass-card rounded-2xl p-4 border border-white/10 hover:bg-white/5 transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-emerald-400 text-xl">description</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-white font-bold text-sm">Medical Reports</h3>
                                    <p className="text-white/50 text-xs">{reports.length} reports</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                    </div>

                    {/* Recent Reports Preview */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-white font-bold text-lg">Recent Reports</h2>
                            <button
                                onClick={() => setCurrentView('reports')}
                                className="text-primary text-xs font-bold uppercase tracking-wider hover:text-white transition-colors"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {reports.slice(0, 3).map(report => (
                                <div key={report.id} className="glass-card rounded-2xl p-4 border border-white/10">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.type === 'scan' ? 'bg-primary/20' :
                                            report.type === 'vaccination' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                                            }`}>
                                            <span className={`material-symbols-outlined text-xl ${report.type === 'scan' ? 'text-primary' :
                                                report.type === 'vaccination' ? 'text-emerald-400' : 'text-blue-400'
                                                }`}>
                                                {report.type === 'scan' ? 'biotech' : report.type === 'vaccination' ? 'vaccines' : 'medical_services'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-bold text-sm mb-1">{report.title}</h3>
                                            <p className="text-white/60 text-xs mb-2">{report.summary}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white/40 text-[10px]">
                                                    {report.date.toLocaleDateString()}
                                                </span>
                                                {report.status === 'normal' && (
                                                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase">
                                                        Normal
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // REPORTS VIEW
    if (currentView === 'reports') {
        return (
            <PageLayout title="Medical Reports" onBack={() => setCurrentView('dashboard')}>
                <div className="max-w-md mx-auto pb-24">
                    <div className="space-y-3">
                        {reports.map(report => (
                            <div key={report.id} className="glass-card rounded-3xl p-5 border border-white/10">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${report.type === 'scan' ? 'bg-primary/20' :
                                        report.type === 'vaccination' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                                        }`}>
                                        <span className={`material-symbols-outlined text-2xl ${report.type === 'scan' ? 'text-primary' :
                                            report.type === 'vaccination' ? 'text-emerald-400' : 'text-blue-400'
                                            }`}>
                                            {report.type === 'scan' ? 'biotech' : report.type === 'vaccination' ? 'vaccines' : 'medical_services'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-white font-bold text-base">{report.title}</h3>
                                            {report.status === 'normal' ? (
                                                <span className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase">
                                                    Normal
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase">
                                                    Attention
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/70 text-sm mb-3">{report.summary}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                {report.date.toLocaleDateString()}
                                            </span>
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                {report.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PageLayout>
        );
    }

    // SCANNER ACTIVE VIEW (Futuristic AI Scanner)
    if (currentView === 'scanner-active') {
        return (
            <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-black">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                </div>

                {/* Camera Error UI */}
                {cameraError && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-red-500 text-3xl">videocam_off</span>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Camera Access Needed</h3>
                            <p className="text-gray-400 text-sm mb-6">{cameraError}</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={retryCamera}
                                    className="bg-primary hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-xl transition-all active:scale-95"
                                >
                                    Retry Camera
                                </button>
                                <button
                                    onClick={() => setCurrentView('dashboard')}
                                    className="text-gray-400 text-sm hover:text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Navigation */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 mt-8">
                    <button onClick={() => setCurrentView('dashboard')} className="premium-glass w-12 h-12 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="w-12"></div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-28 left-0 right-0 px-6 flex flex-col items-center z-20">
                    <div className="text-center mb-8">
                        <p className="text-white font-medium text-sm mb-2 animate-pulse">
                            {scanState === 'recording' ? 'Scanning...' : 'Ready to Scan'}
                        </p>
                        <p className="text-white/60 text-xs text-shadow-sm">
                            {scanState === 'recording' ? 'Hold steady for 5 seconds' : 'Tap play to start analysis'}
                        </p>
                    </div>

                    <div className="w-full flex justify-center items-end gap-8">
                        {/* Center: Progress Ring */}
                        <div className="relative flex items-center justify-center -mb-2">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                            <div className="relative premium-glass rounded-full p-2 border border-white/5">
                                <svg className="w-32 h-32">
                                    <circle className="text-white/5" cx="64" cy="64" fill="transparent" r={radius} stroke="currentColor" strokeWidth="8"></circle>
                                    <circle
                                        className="text-primary progress-ring"
                                        cx="64"
                                        cy="64"
                                        fill="transparent"
                                        r={radius}
                                        stroke="currentColor"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        strokeWidth="8"
                                    ></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                                    {scanState === 'idle' ? (
                                        <button
                                            onClick={startRecording}
                                            className="w-16 h-16 bg-primary hover:bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition-all z-20"
                                        >
                                            <span className="material-symbols-outlined text-black text-3xl">play_arrow</span>
                                        </button>
                                    ) : (
                                        <span className="text-4xl font-bold text-white tracking-tight">
                                            {scanProgress}
                                            <span className="text-xl text-gray-400 font-normal">%</span>
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#06B6D4]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-30"></div>
            </div >
        );
    }

    // SCANNER RESULTS VIEW
    if (currentView === 'scanner-results' && scanResult) {
        const severityColor = {
            normal: 'green',
            monitor: 'blue',
            attention: 'amber',
            urgent: 'red'
        }[scanResult.severity];

        return (
            <PageLayout title="Scan Results" onBack={() => setCurrentView('dashboard')}>
                <div className="max-w-md mx-auto space-y-5 pb-8">
                    {/* Health Score Card */}
                    <div className="glass-card rounded-[2.5rem] p-8 text-center border border-white/10">
                        <div className="relative inline-block mb-6">
                            <svg className="w-40 h-40">
                                <circle className="text-white/5" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                                <circle
                                    className={`text-${severityColor}-400 progress-ring`}
                                    cx="80"
                                    cy="80"
                                    fill="transparent"
                                    r="70"
                                    stroke="currentColor"
                                    strokeDasharray={2 * Math.PI * 70}
                                    strokeDashoffset={2 * Math.PI * 70 - (scanResult.healthScore / 100) * 2 * Math.PI * 70}
                                    strokeLinecap="round"
                                    strokeWidth="12"
                                ></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-white">{scanResult.healthScore}</span>
                                <span className="text-white/60 text-sm mt-1">Health Score</span>
                            </div>
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-full bg-${severityColor}-500/20 border border-${severityColor}-500/30`}>
                            <span className={`text-${severityColor}-400 font-bold text-sm uppercase tracking-wider`}>{scanResult.severity}</span>
                        </div>
                    </div>

                    {/* Observations */}
                    {scanResult.observations.length > 0 && (
                        <div className="glass-card rounded-3xl p-6 border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">visibility</span>
                                Observations
                            </h3>
                            <ul className="space-y-2">
                                {scanResult.observations.map((obs, i) => (
                                    <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                                        <span className="material-symbols-outlined text-green-400 text-sm mt-0.5">check_circle</span>
                                        <span>{obs}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Concerns */}
                    {scanResult.concerns.length > 0 && (
                        <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-amber-500/5">
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-400">warning</span>
                                Points to Monitor
                            </h3>
                            <ul className="space-y-2">
                                {scanResult.concerns.map((concern, i) => (
                                    <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                                        <span className="material-symbols-outlined text-amber-400 text-sm mt-0.5">info</span>
                                        <span>{concern}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommendations */}
                    <div className="glass-card rounded-3xl p-6 border border-white/10">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-400">recommend</span>
                            Recommendations
                        </h3>
                        <ul className="space-y-3">
                            {scanResult.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                                    <span className="text-2xl">{i === 0 ? '🎯' : i === 1 ? '🥗' : '💪'}</span>
                                    <span className="text-white/80 text-sm flex-1">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={saveScanReport}
                        className="w-full bg-primary hover:bg-cyan-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        Save Report & Return
                    </button>
                </div>
            </PageLayout>
        );
    }

    return null;
};

export default HealthCheck;