import React from 'react';
import { generateSpeech, playAudioData } from '../services/geminiService';
import PageLayout from './PageLayout';

interface DigitalCertificateProps {
    onBack: () => void;
}

const DigitalCertificate: React.FC<DigitalCertificateProps> = ({ onBack }) => {
    const handleListen = async () => {
        const text = "Certificate details for Sheru. 3 Years Old, Male, Desi Breed. Vaccination Status: Rabies Vaccine, taken on 12th October 2023, Status Valid. D H P P Vaccine, taken on 5th January 2024, Status Valid. Issued by Department of Animal Welfare.";
        const audioData = await generateSpeech(text);
        if (audioData) playAudioData(audioData);
    };

    return (
        <PageLayout title="Digital Certificate" onBack={onBack}>
            <div className="flex flex-col gap-6 pb-28">
                {/* Audio Button */}
                <button onClick={handleListen} className="w-full bg-primary hover:bg-primary/90 text-background-dark flex items-center justify-center gap-3 p-4 rounded-[1.5rem] shadow-lg shadow-primary/20 active:scale-[0.98] transition-all group">
                    <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">volume_up</span>
                    <span className="text-lg font-bold">Listen to Certificate Details</span>
                </button>

                {/* Certificate Card */}
                <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-xl overflow-hidden relative border border-black/5 dark:border-white/10">
                    {/* Decorative Pattern Background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                    {/* Official Label */}
                    <div className="bg-primary/10 p-3 text-center border-b border-primary/20 relative z-10">
                        <p className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary-dark dark:text-primary">Department of Animal Welfare</p>
                    </div>

                    {/* Profile */}
                    <div className="flex p-8 flex-col items-center relative z-10">
                        <div className="relative mb-6">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-white dark:border-white/10 shadow-2xl"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-6nVGxTbVjaJJEk0SmvAKu63D_8byOtjbcM1AQgeC9IVA6OI6NGAw4aRYlbp1qzMqqbUo17zbx2xBABv3aXB5w6QXDV4VOTwzQUiTVEr1sKHHg5CyL5FMIxa66MtkA_O4S5p9myK2IpE8lW7zg7UeKu8vxYfD5AVm1vubE1y6_kr1CC0NV1OCDkLgjiUzT_W5jj74QIsa5ZwJiyqhFXoZ4xORR4ISnXvmvAbRDI9m7uQTi0QHZKiAWJfldqpmSHIo0ON4E958Hmg")' }}
                            ></div>
                            <div className="absolute bottom-0 right-0 bg-primary text-background-dark p-1.5 rounded-full border-[3px] border-white dark:border-surface-dark shadow-sm">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-slate-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight mb-2">Sheru</p>
                            <div className="flex gap-2 justify-center items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 text-primary-dark dark:text-primary text-xs font-bold border border-primary/20">3 Years Old</span>
                                <span className="text-slate-300 dark:text-white/20">•</span>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Male, Desi Breed</p>
                            </div>
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-3 font-mono uppercase tracking-wider">ID: VAX-98234-IN</p>
                        </div>
                    </div>

                    <div className="px-8"><div className="h-px w-full bg-slate-100 dark:bg-white/5"></div></div>

                    {/* History */}
                    <div className="px-8 pt-6 pb-2">
                        <h3 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-primary">verified</span>
                            Vaccination Status
                        </h3>
                    </div>

                    <div className="p-4 space-y-2 relative z-10">
                        {/* Item 1 */}
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl justify-between border border-transparent dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="text-primary-dark dark:text-primary flex items-center justify-center rounded-xl bg-white dark:bg-white/10 shrink-0 size-12 shadow-sm">
                                    <span className="material-symbols-outlined">vaccines</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-slate-900 dark:text-white text-base font-bold leading-none">Rabies Vaccine</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">12 Oct 2023</p>
                                </div>
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-1.5">
                                <span className="bg-[#0fb345]/10 text-primary-dark dark:text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/20 tracking-wider">VALID</span>
                                <div className="flex items-center gap-1">
                                    <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[10px] text-primary/80 font-semibold">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl justify-between border border-transparent dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="text-primary-dark dark:text-primary flex items-center justify-center rounded-xl bg-white dark:bg-white/10 shrink-0 size-12 shadow-sm">
                                    <span className="material-symbols-outlined">shield</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-slate-900 dark:text-white text-base font-bold leading-none">DHPP Vaccine</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">05 Jan 2024</p>
                                </div>
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-1.5">
                                <span className="bg-[#0fb345]/10 text-primary-dark dark:text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/20 tracking-wider">VALID</span>
                                <div className="flex items-center gap-1">
                                    <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[10px] text-primary/80 font-semibold">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Section */}
                    <div className="p-6 bg-slate-50 dark:bg-black/40 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-2">
                        <div className="flex flex-col gap-1 pr-4">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Verification QR</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">Authorities can scan to verify instantly.</p>
                        </div>
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 dark:border-white/10">
                            <div
                                className="w-16 h-16 bg-center bg-no-repeat bg-contain opacity-90"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDE8ppcmZ3tf8NG70lz0h2w_WzzFUP1qdYPKJqxIoF7VBthqfXgXkFyOlF8ZYMe4hYyCvpPjx3gSW8rWsshz4XEetKAg-S6AiHlJ-Xv7L-are02f7FWNoAXoxIBccqmsyo2Uv6H1wwYgftPIzCECUy0DmHcO2KnsDNj-KEHzIAayzgZu7dGw32uD3o9pbAWnRrQlHI6q5PBNRdxzpmPodx90z4w7dT_VN25XHZkYHqHzH9i5jULvhAmFru0bv_T5C32mNXwXtWJBE')" }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="text-center px-6">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">This is a digitally generated document valid across all Indian veterinary clinics and municipal borders.</p>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark z-20">
                <div className="max-w-md mx-auto">
                    <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center gap-2 h-14 rounded-full font-bold transition-all shadow-lg active:scale-[0.98]">
                        <span className="material-symbols-outlined">download</span>
                        <span>Download / Share</span>
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default DigitalCertificate;