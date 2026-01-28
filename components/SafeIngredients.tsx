import React, { useState } from 'react';
import PageLayout from './PageLayout';

interface SafeIngredientsProps {
    onBack: () => void;
}

interface Ingredient {
    name: string;
    emoji: string;
    status: 'safe' | 'unsafe' | 'caution';
    description: string;
}

const SafeIngredients: React.FC<SafeIngredientsProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        { name: 'All', icon: 'apps' },
        { name: 'Proteins', icon: 'egg' },
        { name: 'Vegetables', icon: 'nutrition' },
        { name: 'Fruits', icon: 'cardiology' },
        { name: 'Grains', icon: 'grain' },
        { name: 'Toxic', icon: 'warning' },
    ];

    const ingredients: Record<string, Ingredient[]> = {
        Proteins: [
            { name: 'Chicken', emoji: '🍗', status: 'safe', description: 'Excellent lean protein source' },
            { name: 'Beef', emoji: '🥩', status: 'safe', description: 'High-quality protein and iron' },
            { name: 'Fish', emoji: '🐟', status: 'safe', description: 'Rich in omega-3 fatty acids' },
            { name: 'Eggs', emoji: '🥚', status: 'safe', description: 'Complete protein with vitamins' },
            { name: 'Turkey', emoji: '🦃', status: 'safe', description: 'Lean protein alternative' },
        ],
        Vegetables: [
            { name: 'Carrots', emoji: '🥕', status: 'safe', description: 'Rich in vitamin A and fiber' },
            { name: 'Sweet Potato', emoji: '🍠', status: 'safe', description: 'Great source of vitamins' },
            { name: 'Pumpkin', emoji: '🎃', status: 'safe', description: 'Aids digestion' },
            { name: 'Green Beans', emoji: '🫘', status: 'safe', description: 'Low calorie, high fiber' },
            { name: 'Broccoli', emoji: '🥦', status: 'caution', description: 'Small amounts only' },
            { name: 'Onions', emoji: '🧅', status: 'unsafe', description: 'TOXIC - Can damage red blood cells' },
            { name: 'Garlic', emoji: '🧄', status: 'unsafe', description: 'TOXIC - Harmful in any amount' },
        ],
        Fruits: [
            { name: 'Apples', emoji: '🍎', status: 'safe', description: 'Remove seeds and core' },
            { name: 'Bananas', emoji: '🍌', status: 'safe', description: 'Good source of potassium' },
            { name: 'Blueberries', emoji: '🫐', status: 'safe', description: 'Antioxidant-rich superfood' },
            { name: 'Watermelon', emoji: '🍉', status: 'safe', description: 'Hydrating and refreshing' },
            { name: 'Grapes', emoji: '🍇', status: 'unsafe', description: 'TOXIC - Can cause kidney failure' },
            { name: 'Raisins', emoji: '🍇', status: 'unsafe', description: 'TOXIC - Especially dangerous' },
        ],
        Grains: [
            { name: 'Rice', emoji: '🍚', status: 'safe', description: 'Easily digestible carbohydrate' },
            { name: 'Oats', emoji: '🥣', status: 'safe', description: 'High in fiber' },
            { name: 'Quinoa', emoji: '🌾', status: 'safe', description: 'Complete protein source' },
        ],
        Toxic: [
            { name: 'Chocolate', emoji: '🍫', status: 'unsafe', description: 'HIGHLY TOXIC - Can be fatal' },
            { name: 'Xylitol', emoji: '🍬', status: 'unsafe', description: 'TOXIC - Found in sugar-free items' },
            { name: 'Avocado', emoji: '🥑', status: 'unsafe', description: 'Contains persin toxin' },
            { name: 'Macadamia Nuts', emoji: '🌰', status: 'unsafe', description: 'TOXIC - Causes weakness' },
            { name: 'Coffee', emoji: '☕', status: 'unsafe', description: 'Caffeine is toxic to dogs' },
        ],
    };

    const allIngredients = Object.values(ingredients).flat();

    const filteredIngredients = (
        selectedCategory && selectedCategory !== 'All'
            ? ingredients[selectedCategory] || []
            : allIngredients
    ).filter(ing =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'safe': return 'green';
            case 'unsafe': return 'red';
            case 'caution': return 'amber';
            default: return 'gray';
        }
    };

    return (
        <PageLayout title="Safe Ingredients" onBack={onBack}>
            <div className="flex flex-col gap-6 pb-20">
                {/* Search Bar */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">search</span>
                    <input
                        type="text"
                        placeholder="Search ingredients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name === 'All' ? null : cat.name)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${(selectedCategory === null && cat.name === 'All') || selectedCategory === cat.name
                                    ? 'bg-primary text-black'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                            <span className="text-sm font-bold">{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Ingredients List */}
                <div className="space-y-3">
                    {filteredIngredients.length > 0 ? (
                        filteredIngredients.map((ingredient, idx) => {
                            const color = getStatusColor(ingredient.status);
                            return (
                                <div
                                    key={idx}
                                    className={`glass-card rounded-2xl p-5 border ${ingredient.status === 'unsafe'
                                            ? 'border-red-500/30 bg-red-500/5'
                                            : ingredient.status === 'caution'
                                                ? 'border-amber-500/30 bg-amber-500/5'
                                                : 'border-white/10'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{ingredient.emoji}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-white font-bold text-lg">{ingredient.name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`}>
                                                    {ingredient.status}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${ingredient.status === 'unsafe' ? 'text-red-400' : 'text-white/70'}`}>
                                                {ingredient.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-white/20 text-6xl mb-4">search_off</span>
                            <p className="text-white/60">No ingredients found</p>
                        </div>
                    )}
                </div>

                {/* Safety Note */}
                <div className="glass-card rounded-2xl p-6 border border-primary/30 bg-primary/5">
                    <div className="flex gap-4 items-start">
                        <span className="material-symbols-outlined text-primary text-2xl">info</span>
                        <div>
                            <h4 className="text-white font-bold mb-2">Important Note</h4>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Always consult your veterinarian before introducing new foods to your dog's diet.
                                Individual dogs may have allergies or sensitivities to certain ingredients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default SafeIngredients;
