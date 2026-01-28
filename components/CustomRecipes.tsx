import React, { useState } from 'react';
import PageLayout from './PageLayout';
import { Recipe } from '../types';

interface CustomRecipesProps {
    onBack: () => void;
    onStartCooking?: (recipe: Recipe) => void;
}

const CustomRecipes: React.FC<CustomRecipesProps> = ({ onBack, onStartCooking }) => {
    // Mock saved recipes (in a real app, this would come from local storage or state management)
    const [savedRecipes] = useState<Recipe[]>([
        {
            name: 'Chicken & Sweet Potato Bowl',
            calories: '320 kcal',
            time: '25 mins',
            difficulty: 'Easy',
            steps: [
                'Boil chicken breast until fully cooked',
                'Steam sweet potato until soft',
                'Dice both into small pieces',
                'Mix together and let cool',
                'Serve at room temperature'
            ],
            tags: ['Protein-Rich', 'Digestible']
        },
        {
            name: 'Beef & Rice Delight',
            calories: '380 kcal',
            time: '30 mins',
            difficulty: 'Easy',
            steps: [
                'Cook lean ground beef thoroughly',
                'Boil rice until soft',
                'Add steamed carrots',
                'Mix ingredients well',
                'Cool before serving'
            ],
            tags: ['High-Protein', 'Energy Boost']
        },
        {
            name: 'Fish & Veggie Mix',
            calories: '290 kcal',
            time: '20 mins',
            difficulty: 'Medium',
            steps: [
                'Bake white fish (salmon or cod)',
                'Steam green beans and carrots',
                'Flake fish into small pieces',
                'Mix with vegetables',
                'Add a drizzle of fish oil'
            ],
            tags: ['Omega-3', 'Low-Fat']
        },
    ]);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'green';
            case 'medium': return 'amber';
            case 'hard': return 'red';
            default: return 'gray';
        }
    };

    return (
        <PageLayout title="Custom Recipes" onBack={onBack}>
            <div className="flex flex-col gap-6 pb-20">
                {/* Header Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-2xl p-5 border border-[#984EE0]/30 bg-[#984EE0]/5">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-full bg-[#984EE0]/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#984EE0] text-2xl">restaurant</span>
                            </div>
                            <div>
                                <p className="text-white/60 text-xs font-medium">Total Recipes</p>
                                <p className="text-white text-2xl font-bold">{savedRecipes.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl p-5 border border-[#11926E]/30 bg-[#11926E]/5">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-full bg-[#11926E]/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#11926E] text-2xl">verified</span>
                            </div>
                            <div>
                                <p className="text-white/60 text-xs font-medium">Vet Approved</p>
                                <p className="text-white text-2xl font-bold">{savedRecipes.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recipes List */}
                {savedRecipes.length > 0 ? (
                    <div className="space-y-4">
                        <h2 className="text-white text-xl font-bold">Your Saved Recipes</h2>
                        {savedRecipes.map((recipe, idx) => (
                            <div key={idx} className="glass-card rounded-[2rem] overflow-hidden border border-white/10">
                                <div
                                    className="w-full h-48 bg-center bg-cover relative group"
                                    style={{
                                        backgroundImage: `url('https://source.unsplash.com/random/800x600/?dog,food,${encodeURIComponent(recipe.name.split(' ')[0])}')`,
                                        backgroundColor: '#334155'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-black/40"></div>


                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                        <span className="material-symbols-outlined text-[#E6971A] text-[16px]">local_fire_department</span>
                                        <span className="text-xs font-bold text-white">{recipe.calories}</span>
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white text-xl font-bold mb-2">{recipe.name}</h3>
                                        <div className="flex items-center gap-3 text-white/80 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                <span>{recipe.time}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${recipe.difficulty.toLowerCase() === 'easy'
                                                    ? 'bg-[#11926E]/20 border border-[#11926E]/30'
                                                    : recipe.difficulty.toLowerCase() === 'medium'
                                                        ? 'bg-[#E6971A]/20 border border-[#E6971A]/30'
                                                        : 'bg-red-500/20 border border-red-500/30'
                                                }`}>
                                                <span className={`text-xs font-bold ${recipe.difficulty.toLowerCase() === 'easy'
                                                        ? 'text-[#11926E]'
                                                        : recipe.difficulty.toLowerCase() === 'medium'
                                                            ? 'text-[#E6971A]'
                                                            : 'text-red-400'
                                                    }`}>{recipe.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    {/* Tags */}
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {recipe.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-[#7461F2]/10 text-[#7461F2] text-xs font-bold rounded-full border border-[#7461F2]/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Ingredients Count */}
                                    <div className="flex items-center gap-2 mb-4 text-white/60">
                                        <span className="material-symbols-outlined text-[18px]">list</span>
                                        <span className="text-sm font-medium">{recipe.steps.length} Steps</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        {onStartCooking && (
                                            <button
                                                onClick={() => onStartCooking(recipe)}
                                                className="flex-1 bg-[#984EE0] hover:bg-[#7461F2] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-[#984EE0]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined">play_arrow</span>
                                                <span>Start Cooking</span>
                                            </button>
                                        )}
                                        <button className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10 transition-all active:scale-95">
                                            <span className="material-symbols-outlined">bookmark</span>
                                        </button>
                                        <button className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10 transition-all active:scale-95">
                                            <span className="material-symbols-outlined">share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="size-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-white/40 text-5xl">restaurant_menu</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">No Saved Recipes Yet</h3>
                        <p className="text-white/60 text-center mb-6 max-w-xs">
                            Scan ingredients with the Food Scanner to discover healthy dog recipes
                        </p>
                        <button
                            onClick={onBack}
                            className="bg-[#984EE0] hover:bg-[#7461F2] text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#984EE0]/30"
                        >
                            Scan Ingredients
                        </button>
                    </div>
                )}

                {/* Tips Card */}
                <div className="glass-card rounded-2xl p-6 border border-[#7461F2]/30 bg-[#7461F2]/5">
                    <div className="flex gap-4 items-start">
                        <span className="material-symbols-outlined text-[#7461F2] text-2xl">lightbulb</span>
                        <div>
                            <h4 className="text-white font-bold mb-2">Recipe Tips</h4>
                            <ul className="text-white/70 text-sm space-y-2">
                                <li>• Always serve food at room temperature</li>
                                <li>• Remove all bones before serving</li>
                                <li>• Store leftovers in airtight containers</li>
                                <li>• Consult your vet for portion sizes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CustomRecipes;
