import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, Pet } from '../types';

interface MyPetsProps {
    onBack: () => void;
    onNavigate?: (view: View) => void;
    pets: Pet[];
    selectedPet: Pet;
    onSelectPet: (pet: Pet) => void;
}

const MyPets: React.FC<MyPetsProps> = ({ onBack, onNavigate, pets, selectedPet, onSelectPet }) => {
    // Accent color from pet or default gold
    const accentColor = selectedPet.color || '#E2B18E';

    return (
        <div className="relative h-screen w-full bg-[#0A0C10] text-white overflow-hidden flex flex-col font-sans">

            {/* Background Image Layer - Shared Element Hero */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode='popLayout'>
                    <motion.div
                        key={selectedPet.id}
                        layoutId={`pet-image-container-${selectedPet.id}`}
                        className="absolute inset-0 z-0 overflow-hidden"
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 28,
                            mass: 1.2
                        }}
                        style={{ borderRadius: 0 }} // Expands to fill screen (0 radius)
                    >
                        <motion.img
                            src={selectedPet.image}
                            alt={selectedPet.name}
                            className="w-full h-full object-cover brightness-75"
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                        {/* Gradient Overlay attached to the hero */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95 opacity-100 z-10 transition-opacity"></div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Top Navigation */}
            <div className="relative z-20 pt-10 px-5 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-black/30 hover:bg-black/50 transition-colors"
                >
                    <span className="material-symbols-outlined text-white text-xl">arrow_back</span>
                </button>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={selectedPet.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
                    >
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
                            <img alt={selectedPet.name} className="w-full h-full object-cover" src={selectedPet.thumb} />
                        </div>
                        <span className="text-xs font-semibold tracking-wide">{selectedPet.name}</span>
                    </motion.div>
                </AnimatePresence>

                <button
                    onClick={() => onNavigate?.(View.SETTINGS)}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-black/30 hover:bg-black/50 transition-colors"
                >
                    <span className="material-symbols-outlined text-white text-xl">settings</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col justify-end pb-8">

                {/* Dots */}
                <div className="flex justify-center gap-1.5 mb-3">
                    {pets.map(p => (
                        <div
                            key={p.id}
                            className={`h-1 rounded-full transition-all duration-500 ease-out ${p.id === selectedPet.id ? 'w-6 bg-white' : 'w-1 bg-white/20'}`}
                        />
                    ))}
                </div>

                {/* Animated Text Section */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={selectedPet.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full px-8 pb-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{selectedPet.name}</h1>
                                <span className="text-white/50 text-sm font-medium">{selectedPet.breed}</span>
                            </div>

                            <button
                                onClick={() => onNavigate?.(View.EDIT_PET_PROFILE)}
                                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md"
                                style={{ borderColor: accentColor, color: accentColor }}
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>

                        {/* Unified Card */}
                        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[2rem] p-5 flex items-center justify-between shadow-2xl">
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Age</span>
                                <span className="text-sm font-bold text-white">{selectedPet.age.replace(/ Years?/, 'Y').replace(/ Months?/, 'M')}</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Gender</span>
                                <span className="text-sm font-bold text-white">{selectedPet.gender}</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Weight</span>
                                <span className="text-sm font-bold text-white">{selectedPet.weight}</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col items-center flex-1 text-center">
                                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Color</span>
                                <span className="text-sm font-bold text-white truncate w-full px-2" style={{ color: accentColor }}>
                                    {selectedPet.id === 'bruno' ? 'Brown' :
                                        selectedPet.id === 'moti' ? 'White' :
                                            selectedPet.id === 'rocky' ? 'Dark' :
                                                selectedPet.id === 'bella' ? 'Tan' :
                                                    selectedPet.id === 'max' ? 'Grey' : 'Mixed'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Pet Selector - Improved Shared Element Interaction */}
                <div className="w-full overflow-x-auto no-scrollbar px-6 mt-4 pt-4">
                    <div className="flex items-center gap-6 min-w-max mx-auto justify-center pb-2">
                        {pets.map((pet) => {
                            const isActive = selectedPet.id === pet.id;
                            return (
                                <div
                                    key={pet.id}
                                    onClick={() => onSelectPet(pet)}
                                    className="flex flex-col items-center gap-2 cursor-pointer group relative"
                                >
                                    <div className={`relative transition-all duration-500 ease-out ${isActive ? 'scale-110' : 'scale-100 opacity-50 hover:opacity-100'}`}>

                                        {/* Outer Ring */}
                                        <div
                                            className="absolute -inset-[3px] rounded-full border-[1.5px] transition-all duration-300"
                                            style={{
                                                borderColor: isActive ? pet.color : 'transparent',
                                                boxShadow: isActive ? `0 0 15px ${pet.color}44` : 'none'
                                            }}
                                        ></div>

                                        {/* Thumbnail Container */}
                                        <div className="w-14 h-14 rounded-full p-[2px] bg-white/5 border border-white/10 overflow-visible relative">
                                            {/* 
                                                Shared Element Morphing Block 
                                                When isActive is true, this element "moves" to the Hero.
                                                We keep a ghost/placeholder here OR render the shared element if it's there.
                                            */}
                                            <AnimatePresence>
                                                {!isActive && (
                                                    <motion.div
                                                        layoutId={`pet-image-container-${pet.id}`}
                                                        className="absolute inset-0 w-full h-full overflow-hidden"
                                                        style={{ borderRadius: '999px' }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 200,
                                                            damping: 28
                                                        }}
                                                    >
                                                        <img
                                                            alt={pet.name}
                                                            className="w-full h-full object-cover"
                                                            src={pet.thumb}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Ghost Placeholder when image is at Hero position */}
                                            {isActive && (
                                                <div className="w-full h-full rounded-full bg-white/5 border border-dashed border-white/10"></div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name Label */}
                                    <span
                                        className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? '' : 'text-white/30'}`}
                                        style={{ color: isActive ? pet.color : undefined }}
                                    >
                                        {pet.name}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Add Button */}
                        <div
                            onClick={() => onNavigate?.(View.ADD_DOG)}
                            className="flex flex-col items-center gap-2 cursor-pointer group opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <div className="w-14 h-14 rounded-full flex items-center justify-center border border-white/10 bg-white/5">
                                <span className="material-symbols-outlined text-white text-xl">add</span>
                            </div>
                            <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Add</span>
                        </div>
                    </div>
                </div>

                <div className="w-32 h-1 bg-white/10 rounded-full mx-auto mt-4"></div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default MyPets;
