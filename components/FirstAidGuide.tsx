import React, { useState, useEffect, useRef } from 'react';
import { View } from '../types';

interface FirstAidGuideProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const steps = [
    {
        title: "Assess Safety",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8GVSZ_UZ9VDwiW00J4Emt0Dv94G6Zu-lN4MZZs3HtOg4hX-UcsdtAstaeloqVGuAzD6bxnxHZM_NOPAbpB0v3PqmCjw6f5k2qQbAc4ZzF9t1Q2BnpQlfI6G2Z_ExL16oH9WbposLmEIJjCfK-UlAdA4WjTWzzDAWa5-9MW-9-7QZhycCDXlLXJA5kTR1kaMb0A8WNxy8Fjjn_rNsY1LNJeHvXammtzhEwZpf6fyo6LgtjHzCqJSsYCDMqFnPMK5vtD4lPHQboJTM",
        text: "Approach calm. Check breathing. Muzzle if needed.",
        duration: 8
    },
    {
        title: "Cleaning the Wound",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi2rDJJE62qw8PdSerax_fTVNSn34p7_n2o67erHk4dly5oasVFC-b3kLO0zDCobIuNBYN8vZJ9vXXKU_wHD2k0ZXv8Ld5OpngklSEMhdlju3uyoE-7ZFLKgN27medgqK2FKSIpicfSi0jKe6LlBnVK1D9KeWUU5L2bKNjEAOfISfniu83fXb_KpKWh4BeBHigMIXOtR_pa0-0ss0DZOBEBUM7ENRuYnR05IUJX3zhBnzSnjNeLE1Q0HFi3JumDmD1ZnEPF-WsiMo",
        text: "Gently flush the wound with clean water or saline solution. Remove any visible debris.",
        duration: 10
    },
    {
        title: "Stop Bleeding",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8MW_6QZMG7rT1Ll5nL8wJ4omE-Q2da6aKPHnF5jKNJ0XlFVOJCTtoxNpFW7Y6yQCF7HFeLd06TTMRBm9iAV7MQKrRPsYD_bhkvP_i3zhK5rq2wY0vKLxjKNpskYRKk8qdC_Pom0elURpG31s2dL08RSre7UAnEk8IRpeccCfHMV0ZMDKouv26WvmDCGNHIHmRlWZTtBwsuHzigCY0v5sjoCf1nuzxqWmt79gcJTwRkx5BUAe9XPVYBuCG2Wb6tcj0Tc49rPZfEoI",
        text: "Apply firm pressure with a clean cloth. Hold for 3 minutes.",
        duration: 8
    },
    {
        title: "Bandage Wound",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAo1FOvh9zAbov5dmCnFpXWlqTpqpVuY62w2QqjC8DK-R9XXHSJv0qc6sc8S8AZEXl0TQBYJ6CJqmMDIXGSUQKIzFM5-5MQ1lXcLDqklg6kCA54z22wLOgBQJOXjnMxrwlwjm47osrg60TVhTwZqpJWcNjbtRtApYL5LsCvqrcghgKOE7zGgkftg09pGfDuYIkGIe7LPaM3HrLLi1EUJ13FoigK66u-e6m8t1PXMg3fe2_6IN-Cn9OPvCa5tO1kVMfY7QN_G1yYtOg",
        text: "Wrap loosely with a bandage. Ensure it is not too tight.",
        duration: 8
    },
    {
        title: "Seek Vet",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhlUup2Jpik4bFZMbsk7USlk8mjt_U3KQm-x2PMT9J2q5FoOT6t4WX4CI0JbWNrF4SFhekDb-1b0eV9s-Xy2-36qv-Ju2s1EP8_UItAOvL8uTDRz5nvbBdfAOcVA27p52a56FxJxBoLN5EdS8NS6MoHkY0MykC6i5FTyd05RVBasZOhRn2MMV1wDxQ1yMQ-y8SDI_6-Ec3D6CyJk3YBkw8a3jEEBcrJaJ2-3PHWajfOLNZt5xtktt1m2dfQexiyrKnR6ljxlIXVfE",
        text: "Visit the vet to prevent infection and check deeper damage.",
        duration: 6
    }
];

const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ onBack, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1); // Start at index 1 to match "Step 2" in prompt
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const stepData = steps[currentStep];

  useEffect(() => {
    // Reset state on step change
    setIsPlaying(false);
    setProgress(0);
    window.speechSynthesis.cancel();
  }, [currentStep]);

  useEffect(() => {
      let interval: any;
      if (isPlaying) {
          const duration = stepData.duration * 1000;
          const tick = 100;
          interval = setInterval(() => {
              setProgress(p => {
                  if (p >= 100) {
                      setIsPlaying(false);
                      clearInterval(interval);
                      return 100;
                  }
                  return p + (tick / duration) * 100;
              });
          }, tick);
      }
      return () => clearInterval(interval);
  }, [isPlaying, stepData.duration]);

  const togglePlay = () => {
      if (isPlaying) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
      } else {
          // Speak
          const u = new SpeechSynthesisUtterance(stepData.text);
          u.onend = () => {
              setIsPlaying(false);
              setProgress(100);
          };
          setUtterance(u);
          window.speechSynthesis.speak(u);
          setIsPlaying(true);
          // If we were at 100%, restart progress
          if (progress === 100) setProgress(0);
      }
  };

  const nextStep = () => {
      if (currentStep < steps.length - 1) {
          setCurrentStep(c => c + 1);
      } else {
          onBack(); // Done
      }
  };

  const prevStep = () => {
      if (currentStep > 0) {
          setCurrentStep(c => c - 1);
      } else {
          onBack();
      }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-warm-beige dark:bg-background-dark font-display text-accent-green dark:text-gray-100">
        {/* Top App Bar */}
        <div className="flex items-center p-6 justify-between z-10">
            <button 
                onClick={onBack}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-green/5 hover:bg-accent-green/10 transition-colors text-accent-green dark:text-white dark:bg-white/10"
            >
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
            </button>
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Step {currentStep + 1} of {steps.length}</span>
                <h2 className="text-lg font-bold leading-tight tracking-tight text-center">{stepData.title}</h2>
            </div>
            <button 
                onClick={() => onNavigate(View.EMERGENCY_CARE)}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-300"
            >
                <span className="material-symbols-outlined text-[24px]">local_hospital</span>
            </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-2 pb-6 gap-6 w-full">
            {/* Illustration Card */}
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-accent-green/5 relative bg-white dark:bg-white/5">
                <div 
                    className="absolute inset-0 bg-center bg-contain bg-no-repeat m-8" 
                    style={{ backgroundImage: `url('${stepData.image}')`, opacity: 0.9 }}
                ></div>
            </div>

            {/* Helper Text */}
            <div className="w-full text-center mt-2">
                <h2 className="text-3xl font-bold leading-tight text-accent-green dark:text-white px-4">
                    {isPlaying ? "Listening..." : "Press to listen to instructions"}
                </h2>
            </div>

            {/* Massive Play Button */}
            <div className="flex-1 flex items-center justify-center py-4 w-full">
                <button 
                    onClick={togglePlay}
                    className="group relative flex items-center justify-center size-32 rounded-full bg-primary-bright text-primary-content shadow-lg transition-transform active:scale-95"
                >
                    {/* Pseudo-ring for static "pulsing" look */}
                    <div className="absolute inset-0 rounded-full ring-8 ring-primary-bright/30 group-hover:ring-primary-bright/40 transition-all"></div>
                    <div className="absolute inset-0 rounded-full ring-[16px] ring-primary-bright/10 group-hover:ring-primary-bright/20 transition-all"></div>
                    
                    {isPlaying ? (
                         <span className="material-symbols-outlined text-[64px] relative z-10" style={{fontVariationSettings: "'FILL' 1, 'wght' 600"}}>pause</span>
                    ) : (
                         <span className="material-symbols-outlined text-[64px] relative z-10 ml-2" style={{fontVariationSettings: "'FILL' 1, 'wght' 600"}}>play_arrow</span>
                    )}
                </button>
            </div>

            {/* Audio Progress Bar */}
            <div className="w-full px-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm font-semibold opacity-70 mb-1">
                    <span>{isPlaying ? 'Playing' : '0:00'}</span>
                    <span>{stepData.duration}s</span>
                </div>
                <div className="h-4 w-full rounded-full bg-accent-green/10 dark:bg-white/10 overflow-hidden relative">
                    <div 
                        className="absolute top-0 left-0 h-full bg-accent-green dark:bg-primary-bright rounded-full transition-all duration-100 ease-linear" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 pb-10 bg-warm-beige dark:bg-background-dark">
            <div className="flex items-center justify-between gap-4">
                <button 
                    onClick={prevStep}
                    className="flex-1 h-16 rounded-2xl bg-accent-green/5 hover:bg-accent-green/10 text-accent-green dark:bg-white/5 dark:text-white dark:hover:bg-white/10 font-bold text-lg flex items-center justify-center gap-3 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Previous
                </button>
                <button 
                    onClick={nextStep}
                    className="flex-1 h-16 rounded-2xl bg-accent-green text-white hover:bg-accent-green/90 font-bold text-lg flex items-center justify-center gap-3 shadow-md transition-colors dark:bg-primary-bright dark:text-primary-content"
                >
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default FirstAidGuide;