import React, { useRef, useState } from 'react';
import { identifyDogProfile } from '../services/geminiService';
import { DogProfile } from '../types';
import PageLayout from './PageLayout';

interface AddDogProps {
    onBack: () => void;
    onComplete: () => void;
}

const AddDog: React.FC<AddDogProps> = ({ onBack, onComplete }) => {
    const [step, setStep] = useState(1);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [breed, setBreed] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            setImagePreview(base64);

            // Auto-detect breed/size
            setAnalyzing(true);
            try {
                const base64Data = base64.split(',')[1];
                const result = await identifyDogProfile(base64Data);
                if (result.breed) setBreed(result.breed.toLowerCase());
                if (result.size) setSize(result.size);
            } catch (err) {
                console.error(err);
            } finally {
                setAnalyzing(false);
            }
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleNext = () => {
        setStep(2);
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    if (step === 1) {
        return (
            <PageLayout title="Add Your Dog" onBack={onBack}>
                <div className="flex flex-col h-full relative">
                    {/* Progress Indicators */}
                    <div className="flex w-full items-center justify-center gap-2 mb-6">
                        <div className="h-1.5 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
                    </div>

                    {/* Main Card */}
                    <div className="glass-card rounded-[2.5rem] p-8 flex-1 border border-white/5 relative overflow-hidden">
                        <h1 className="text-2xl font-bold text-center mb-2 text-white">Step 1: Basic Info</h1>
                        <p className="text-white/60 text-center mb-10">Tell us a bit about your furry friend</p>

                        {/* Photo Upload */}
                        <div className="flex justify-center mb-10 relative">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="relative flex flex-col items-center justify-center size-40 rounded-full bg-white/5 border-2 border-dashed border-white/20 hover:border-primary/50 hover:bg-white/10 active:scale-95 transition-all group overflow-hidden"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Dog" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center size-14 rounded-full bg-primary/20 mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                            <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
                                        </div>
                                        <span className="text-white font-bold text-sm tracking-wide">Add Photo</span>
                                    </>
                                )}
                                {analyzing && (
                                    <div className="absolute inset-0 bg-background-dark/60 backdrop-blur-sm flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary animate-spin text-3xl">progress_activity</span>
                                    </div>
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Form Fields */}
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <span className="text-sm font-bold ml-1 text-white/80">What is the dog's name?</span>
                                <div className="relative flex items-center group">
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-background-dark/50 border border-white/10 text-white placeholder:text-white/20 rounded-2xl h-14 pl-6 pr-14 text-lg focus:outline-none focus:border-primary/50 focus:bg-background-dark/80 transition-all font-display"
                                        placeholder="e.g. Bruno"
                                        type="text"
                                    />
                                    <div className="absolute right-5 text-primary/50 pointer-events-none flex items-center justify-center group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-2xl">pets</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm font-bold ml-1 text-white/80">How old is the dog?</span>
                                <div className="relative flex items-center group">
                                    <input
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full bg-background-dark/50 border border-white/10 text-white placeholder:text-white/20 rounded-2xl h-14 pl-6 pr-14 text-lg focus:outline-none focus:border-primary/50 focus:bg-background-dark/80 transition-all appearance-none font-display"
                                        inputMode="numeric"
                                        placeholder="Years"
                                        type="number"
                                    />
                                    <div className="absolute right-5 text-primary/50 pointer-events-none flex items-center justify-center group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-2xl">cake</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Action Button */}
                    <div className="absolute bottom-24 right-4 z-20">
                        <button onClick={() => speak("Please upload a photo and enter your dog's name and age.")} className="size-12 rounded-full glass-card flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-black/20 active:scale-95 transition-transform hover:bg-white/10">
                            <span className="material-symbols-outlined text-xl">mic</span>
                        </button>
                    </div>

                    {/* Bottom Nav */}
                    <div className="pt-6 pb-2">
                        <button onClick={handleNext} className="w-full h-14 bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] active:scale-[0.98]">
                            Next
                            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // Step 2
    return (
        <PageLayout title="Dog Details" onBack={() => setStep(1)}>
            <div className="flex flex-col h-full relative">
                {/* Progress */}
                <div className="flex w-full items-center justify-center gap-2 mb-6">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50"></div>
                    <div className="h-1.5 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-8 pb-4">
                    {/* Size Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 px-1">
                            <h2 className="text-xl font-bold text-white">How big is your dog?</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Small */}
                            <label className="group cursor-pointer relative">
                                <input className="peer sr-only" name="size" type="radio" value="small" checked={size === 'small'} onChange={() => setSize('small')} />
                                <div className="flex flex-col h-full glass-card rounded-2xl border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/10 transition-all duration-300 overflow-hidden hover:bg-white/5">
                                    <div className="aspect-square w-full relative overflow-hidden flex items-center justify-center p-2">
                                        <div className="w-full h-full bg-center bg-contain bg-no-repeat opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjr3IqhyXAB5klv3WtjiuFe13CrDLAqueSOM8MfC61udZ8tt4Hqmaef--LQw0IPZawAGIsGarPlfBxVKYqfrYOo0aHzmzCo1vxStTNDxadr6lbH5J7MKBcaLO1FaP4TKc8mOD1-qF5BVBaxEh_F_v5PqeI2eM_gI-hGfeMDnUutt0hu2lW1obEAtfe2zmzCwgiaVU-DjLS4EmbEnfie-hmbRVC6nqNPK_MpVyHyrpXs16nW6XNn9YPAnCHAUHLU6qtw61Y4be8ngs')" }}></div>
                                    </div>
                                    <div className="p-3 text-center flex-1 flex flex-col justify-center border-t border-white/5 bg-black/20">
                                        <span className="block text-sm font-bold text-white leading-tight mb-0.5">Small</span>
                                        <span className="block text-[10px] text-white/50 font-medium tracking-wide">Up to 10kg</span>
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 size-5 rounded-full bg-primary text-background-dark opacity-0 peer-checked:opacity-100 transition-all flex items-center justify-center scale-0 peer-checked:scale-100 duration-300 shadow-glow leading-none">
                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                </div>
                            </label>

                            {/* Medium */}
                            <label className="group cursor-pointer relative">
                                <input className="peer sr-only" name="size" type="radio" value="medium" checked={size === 'medium'} onChange={() => setSize('medium')} />
                                <div className="flex flex-col h-full glass-card rounded-2xl border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/10 transition-all duration-300 overflow-hidden hover:bg-white/5">
                                    <div className="aspect-square w-full relative overflow-hidden flex items-center justify-center p-2">
                                        <div className="w-full h-full bg-center bg-contain bg-no-repeat opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzd2RNqqbCO5y_iXPYcKluCwNAMHe-tBFj1R7mjleiS9YdJutDuZRa4vLkPL5C8uuKNtE_wi2l5xY_cd_IBLNJrUxi9C66y4EKo8SK9cLV_6j5APIH8O3xcQYaDwO-HhSwjC9H8BkZI8Y3kGavPoCNCz-tIcvruWE7QMZswEuzUS8EUm0vCSme6VyoZzu-ww6mpS-NGbM8Y-kpmjE0qjeNQdfKHTaAWdUvKslSZyAFhyaCtmfDbhD5Z9iOOJyZaeOXwy5l9A6vpvg')" }}></div>
                                    </div>
                                    <div className="p-3 text-center flex-1 flex flex-col justify-center border-t border-white/5 bg-black/20">
                                        <span className="block text-sm font-bold text-white leading-tight mb-0.5">Medium</span>
                                        <span className="block text-[10px] text-white/50 font-medium tracking-wide">10-25kg</span>
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 size-5 rounded-full bg-primary text-background-dark opacity-0 peer-checked:opacity-100 transition-all flex items-center justify-center scale-0 peer-checked:scale-100 duration-300 shadow-glow leading-none">
                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                </div>
                            </label>

                            {/* Large */}
                            <label className="group cursor-pointer relative">
                                <input className="peer sr-only" name="size" type="radio" value="large" checked={size === 'large'} onChange={() => setSize('large')} />
                                <div className="flex flex-col h-full glass-card rounded-2xl border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/10 transition-all duration-300 overflow-hidden hover:bg-white/5">
                                    <div className="aspect-square w-full relative overflow-hidden flex items-center justify-center p-2">
                                        <div className="w-full h-full bg-center bg-contain bg-no-repeat opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8GVSZ_UZ9VDwiW00J4Emt0Dv94G6Zu-lN4MZZs3HtOg4hX-UcsdtAstaeloqVGuAzD6bxnxHZM_NOPAbpB0v3PqmCjw6f5k2qQbAc4ZzF9t1Q2BnpQlfI6G2Z_ExL16oH9WbposLmEIJjCfK-UlAdA4WjTWzzDAWa5-9MW-9-7QZhycCDXlLXJA5kTR1kaMb0A8WNxy8Fjjn_rNsY1LNJeHvXammtzhEwZpf6fyo6LgtjHzCqJSsYCDMqFnPMK5vtD4lPHQboJTM')" }}></div>
                                    </div>
                                    <div className="p-3 text-center flex-1 flex flex-col justify-center border-t border-white/5 bg-black/20">
                                        <span className="block text-sm font-bold text-white leading-tight mb-0.5">Large</span>
                                        <span className="block text-[10px] text-white/50 font-medium tracking-wide">Over 25kg</span>
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 size-5 rounded-full bg-primary text-background-dark opacity-0 peer-checked:opacity-100 transition-all flex items-center justify-center scale-0 peer-checked:scale-100 duration-300 shadow-glow leading-none">
                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Breed Section */}
                    <section className="flex-1">
                        <div className="flex items-center gap-3 mb-4 px-1">
                            <h2 className="text-xl font-bold text-white">What is the breed?</h2>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <span className="material-symbols-outlined text-white/50 text-2xl group-focus-within:text-primary transition-colors">search</span>
                            </div>
                            {/* Custom dropdown appearance */}
                            <select
                                value={breed}
                                onChange={(e) => setBreed(e.target.value)}
                                className="w-full appearance-none bg-white/5 text-white text-lg font-medium py-4 pl-12 pr-10 rounded-2xl border border-white/10 shadow-sm focus:border-primary/50 focus:bg-white/10 focus:outline-none transition-all cursor-pointer font-display"
                            >
                                <option disabled value="" className="bg-background-dark text-white/50">Select Breed (e.g., Desi)</option>
                                <option value="desi" className="bg-background-dark text-white">Desi / Indie / Pariah</option>
                                <option value="labrador" className="bg-background-dark text-white">Labrador</option>
                                <option value="gsd" className="bg-background-dark text-white">German Shepherd</option>
                                <option value="golden" className="bg-background-dark text-white">Golden Retriever</option>
                                <option value="pug" className="bg-background-dark text-white">Pug</option>
                                <option value="pomeranian" className="bg-background-dark text-white">Pomeranian</option>
                                <option value="beagle" className="bg-background-dark text-white">Beagle</option>
                                <option value="husky" className="bg-background-dark text-white">Husky</option>
                                <option value="rottweiler" className="bg-background-dark text-white">Rottweiler</option>
                                <option value="other" className="bg-background-dark text-white">Other / Mixed</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/50">
                                <span className="material-symbols-outlined text-2xl">expand_more</span>
                            </div>
                        </div>
                    </section>

                    {/* Spacer for footer */}
                    <div className="flex-grow min-h-[40px]"></div>

                    {/* Footer Button */}
                    <button onClick={onComplete} className="w-full bg-primary hover:bg-primary/90 text-background-dark text-lg font-bold py-4 rounded-full shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:shadow-[0_0_35px_rgba(52,211,153,0.5)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                        Finish
                        <span className="material-symbols-outlined text-2xl font-bold">check</span>
                    </button>
                </div>

                <button onClick={() => speak("Select your dog's size and breed.")} aria-label="Listen to instructions" className="absolute top-2 right-2 size-10 flex items-center justify-center rounded-full text-primary hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
                </button>
            </div>
        </PageLayout>
    );
};

export default AddDog;