import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { generateSpeech, playAudioData } from '../services/geminiService';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const totalSteps = recipe.steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose(); // Finish
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const playStepAudio = async () => {
    const text = recipe.steps[currentStep];
    const audioData = await generateSpeech(text);
    if (audioData) playAudioData(audioData);
  };

  // Auto-play audio when step changes (optional, good for accessibility)
  useEffect(() => {
    // Uncomment to enable auto-play
    // playStepAudio();
  }, [currentStep]);

  return (
    <div className="bg-[#F9F7F2] dark:bg-background-dark font-display text-[#0E1B14] dark:text-white min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-[#0E1B14] fixed inset-0 z-50 animate-in slide-in-from-bottom duration-500">
        
        {/* Top Navigation */}
        <nav className="flex items-center justify-between p-6 w-full z-20">
            <button 
                onClick={onClose}
                aria-label="Close" 
                className="flex size-12 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
                <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            
            <h2 className="text-sm font-bold tracking-wider uppercase text-[#0E1B14]/60 dark:text-white/60 truncate max-w-[150px]">
                {recipe.name}
            </h2>
            
            <button 
                onClick={() => setShowIngredients(!showIngredients)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-black/5 dark:border-white/10 active:scale-95 transition-all ${showIngredients ? 'bg-primary text-white' : 'bg-white dark:bg-white/10 text-[#0E1B14] dark:text-white'}`}
            >
                <span className="material-symbols-outlined text-[20px]">grocery</span>
                <span className="text-sm font-bold hidden sm:inline">Ingredients</span>
            </button>
        </nav>

        {/* Ingredients Modal Overlay */}
        {showIngredients && (
            <div className="absolute top-24 right-6 z-30 w-64 bg-white dark:bg-[#1a2e22] rounded-3xl shadow-xl border border-black/5 dark:border-white/10 p-5 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="font-bold text-lg mb-3">Ingredients</h3>
                {/* Since existing Recipe type doesn't have structured ingredients, we mock or parse if available. 
                    For now, assuming detected ingredients are part of the context or just listing tags/name */}
                <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-[#F9F7F2] dark:bg-white/5 rounded-full text-xs font-bold text-[#0E1B14]/70 dark:text-white/70 border border-black/5">
                            {tag}
                        </span>
                    ))}
                    <p className="text-xs text-gray-500 mt-2 italic w-full">Refer to food scanner results for full list.</p>
                </div>
            </div>
        )}

        {/* Progress Indicator */}
        <div className="px-6 w-full flex justify-center mb-4 z-10">
            <div className="flex items-center gap-2">
                {recipe.steps.map((_, idx) => (
                    <div 
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentStep 
                                ? 'w-8 bg-primary' 
                                : idx < currentStep 
                                    ? 'w-2 bg-primary' 
                                    : 'w-2 bg-primary/20 dark:bg-white/20'
                        }`}
                    ></div>
                ))}
            </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 w-full max-w-md mx-auto relative gap-8 pb-10">
            
            {/* Illustration Container */}
            <div className="w-full aspect-square relative rounded-[2.5rem] overflow-hidden shadow-xl bg-white dark:bg-white/5 border-4 border-white dark:border-white/10 group">
                {/* Use a dynamic image based on recipe if available, or a nice generic cooking one */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                    style={{
                        backgroundImage: `url('https://source.unsplash.com/random/800x800/?cooking,${encodeURIComponent(recipe.name.split(' ')[0])}')`,
                        // Fallback in case unsplash fails or for generic look
                        backgroundColor: '#e5e7eb'
                    }}
                >
                    {/* Fallback overlay if image doesn't load nicely */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                    <span className="text-sm font-bold tracking-widest uppercase">Step {currentStep + 1}</span>
                </div>
            </div>

            {/* Instructions */}
            <div className="flex flex-col items-center text-center gap-6 w-full z-10">
                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-[#0E1B14] dark:text-white tracking-tight animate-slide-up-fade min-h-[80px] flex items-center justify-center">
                    {recipe.steps[currentStep]}
                </h1>

                {/* Giant Play Button */}
                <button 
                    onClick={playStepAudio}
                    className="group relative flex items-center justify-center size-24 md:size-28 bg-orange-100 dark:bg-primary/20 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 mt-2 cursor-pointer touch-manipulation"
                >
                    <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
                    <span className="material-symbols-outlined text-[#0E1B14] dark:text-primary text-5xl md:text-6xl pl-2 group-hover:text-primary dark:group-hover:text-white transition-colors">play_arrow</span>
                    <span className="sr-only">Play Instruction</span>
                </button>
                
                <p className="text-[#0E1B14]/50 dark:text-white/50 text-sm font-semibold uppercase tracking-wider">Tap to Listen</p>
            </div>
        </main>

        {/* Bottom Navigation Footer */}
        <footer className="w-full p-6 pb-8 md:pb-10 bg-[#F9F7F2] dark:bg-background-dark sticky bottom-0 z-20">
            <div className="flex items-center justify-between w-full max-w-md mx-auto gap-4">
                {/* Back Button */}
                <button 
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex-1 h-16 rounded-full border border-black/5 dark:border-white/10 text-[#0E1B14] dark:text-white flex items-center justify-center gap-2 shadow-sm transition-all touch-manipulation ${currentStep === 0 ? 'opacity-50 cursor-not-allowed bg-transparent' : 'bg-white dark:bg-white/10 active:bg-black/5 dark:active:bg-white/20'}`}
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    <span className="text-lg font-bold">Back</span>
                </button>

                {/* Next Button */}
                <button 
                    onClick={handleNext}
                    className="flex-1 h-16 rounded-full bg-primary text-[#0E1B14] flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition-all touch-manipulation"
                >
                    <span className="text-lg font-bold">{currentStep === totalSteps - 1 ? "Finish" : "Next"}</span>
                    <span className="material-symbols-outlined text-2xl">{currentStep === totalSteps - 1 ? "check" : "arrow_forward"}</span>
                </button>
            </div>
        </footer>
    </div>
  );
};

export default CookingMode;