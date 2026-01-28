import React, { useState } from 'react';
import PageLayout from './PageLayout';

interface LearnProps {
    onBack: () => void;
}

const Learn: React.FC<LearnProps> = ({ onBack }) => {
    const [activeLesson, setActiveLesson] = useState<number | null>(null);
    const [slide, setSlide] = useState(0);

    const lessons = [
        {
            id: 1,
            title: "Safe Foods",
            image: "https://images.unsplash.com/photo-1605256585681-455837661b18?auto=format&fit=crop&w=400&q=80",
            slides: [
                { img: "https://images.unsplash.com/photo-1605256585681-455837661b18?auto=format&fit=crop&w=600&q=80", text: "Many human foods are safe for dogs, but some are deadly. Always check before feeding." },
                { img: "https://images.unsplash.com/photo-1623366302587-bca291d29c42?auto=format&fit=crop&w=600&q=80", text: "Carrots are a great low-calorie snack that is high in fiber and beta-carotene." },
                { img: "https://images.unsplash.com/photo-1615485925763-8678628890a5?auto=format&fit=crop&w=600&q=80", text: "Avoid grapes and raisins at all costs. They can cause kidney failure in dogs." }
            ]
        },
        {
            id: 2,
            title: "Puppy Care",
            image: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=400&q=80",
            slides: [
                { img: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80", text: "Puppies need a lot of sleep. Expect them to sleep 18-20 hours a day." }
            ]
        },
        {
            id: 3,
            title: "First Aid",
            image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80",
            slides: [
                { img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80", text: "Keep a basic first aid kit with bandages, antiseptic, and tweezers." }
            ]
        }
    ];

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    if (activeLesson !== null) {
        const lesson = lessons.find(l => l.id === activeLesson)!;
        const currentSlide = lesson.slides[slide];

        return (
            <div className="fixed inset-0 bg-background-dark z-50 flex flex-col animate-slide-up-fade font-display">
                <div className="relative flex-1">
                    <img src={currentSlide.img} alt="Lesson" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background-dark"></div>

                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
                        <button onClick={() => { setActiveLesson(null); setSlide(0); }} className="text-white p-2 rounded-full glass-card hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div className="px-3 py-1 rounded-full glass-card text-white text-xs font-bold border border-white/10">
                            {slide + 1} / {lesson.slides.length}
                        </div>
                    </div>
                </div>

                <div className="bg-background-dark p-8 pb-12 rounded-t-[3rem] -mt-12 relative z-10 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col gap-6">
                        <p className="text-white text-xl font-medium leading-relaxed tracking-wide">
                            {currentSlide.text}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                            <button onClick={() => speak(currentSlide.text)} className="size-14 rounded-full bg-white/5 text-primary flex items-center justify-center border border-white/10 active:scale-95 transition-transform hover:bg-white/10">
                                <span className="material-symbols-outlined text-2xl">volume_up</span>
                            </button>

                            <div className="flex gap-4">
                                {slide > 0 && (
                                    <button onClick={() => setSlide(s => s - 1)} className="px-6 py-3 rounded-full bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-colors">
                                        Back
                                    </button>
                                )}
                                {slide < lesson.slides.length - 1 ? (
                                    <button onClick={() => setSlide(s => s + 1)} className="px-8 py-3 rounded-full bg-primary text-background-dark font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                        Next
                                    </button>
                                ) : (
                                    <button onClick={() => { setActiveLesson(null); setSlide(0); }} className="px-8 py-3 rounded-full bg-accent text-background-dark font-bold shadow-lg shadow-accent/20 hover:scale-105 transition-transform">
                                        Finish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PageLayout title="Learn Hub" onBack={onBack}>
            <div className="grid grid-cols-1 gap-6 pb-8">
                {lessons.map((lesson) => (
                    <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson.id)}
                        className="relative h-48 rounded-[2.5rem] overflow-hidden group text-left border border-white/10 shadow-lg"
                    >
                        <img src={lesson.image} alt={lesson.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{lesson.title}</h3>
                            <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
                                <span>Start Lesson</span>
                                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </PageLayout>
    );
};

export default Learn;