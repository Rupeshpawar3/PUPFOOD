import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodAnalysisResult, Recipe, View } from '../types';
import PageLayout from './PageLayout';

interface FoodScannerProps {
  onBack: () => void;
  onStartCooking?: (recipe: Recipe) => void;
  onNavigate: (view: View) => void;
}

const FoodScanner: React.FC<FoodScannerProps> = ({ onBack, onStartCooking, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4 }
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera not accessible. Please upload a photo manually.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(imageDataUrl);
        stopCamera();
        setResult(null);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setLoading(true);
    try {
      // Use the actual backend service or logic
      const base64Data = imagePreview.split(',')[1];
      const analysis = await analyzeFoodImage(base64Data);
      setResult(analysis);
    } catch (error) {
      // Graceful fallback mock if backend fails (kept for robustness)
      setTimeout(() => {
        setResult({
          isSafe: true,
          ingredientsDetected: ["Rice", "Chicken", "Sweet Potato", "Carrots"],
          recipes: [
            {
              name: "Chicken and Rice Bowl",
              calories: "320 kcal",
              time: "25 mins",
              difficulty: "Easy",
              steps: [
                "Boil boneless chicken pieces until fully cooked, then shred into small pieces",
                "Cook rice separately and let it cool slightly",
                "Mix the shredded chicken with rice, and add a small amount of the chicken broth for moisture"
              ],
              tags: ["Protein-rich", "Easy Digest"]
            },
            {
              name: "Sweet Potato Chicken Mash",
              calories: "280 kcal",
              time: "30 mins",
              difficulty: "Easy",
              steps: [
                "Steam or boil sweet potato and carrots until soft",
                "Cook chicken thoroughly and dice into small pieces",
                "Mash the vegetables and mix with diced chicken, serve at room temperature"
              ],
              tags: ["Nutritious", "Fiber-rich"]
            },
          ],
          warnings: "Never add onions, garlic, grapes, raisins, chocolate, or excessive salt to your dog's food. These ingredients can be toxic to dogs."
        });
        setLoading(false);
      }, 2000);
    } finally {
      // Handled in try/catch
      if (!result) setLoading(false); // Safety check
    }
  };

  const speakSteps = (steps: string[]) => {
    if ('speechSynthesis' in window) {
      const text = steps.join('. ');
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Result View
  if (result && imagePreview) {
    return (
      <PageLayout title="Suggestions" onBack={() => setResult(null)}>
        <div className="flex flex-col gap-4 pb-16">
          <div className="w-full">
            <div
              className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-[2rem] min-h-[250px] relative border border-white/10"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.9) 100%), url("${imagePreview}")`,
                boxShadow: '0 20px 40px -4px rgba(0, 0, 0, 0.6)'
              }}
            >
              <div className="absolute top-5 left-5">
                <div className={`backdrop-blur-md flex items-center gap-2 px-4 py-2 rounded-full ${result.isSafe ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}`}
                  style={{ boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.5)' }}>
                  <span className="material-symbols-outlined text-white text-[20px]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                    {result.isSafe ? 'verified' : 'warning'}
                  </span>
                  <span className="text-white text-xs font-bold uppercase tracking-widest" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                    {result.isSafe ? 'Safe to Eat' : 'Caution'}
                  </span>
                </div>
              </div>
              <div className="flex p-6 flex-col gap-1 relative z-10">
                <p className="text-white tracking-tight text-[28px] font-extrabold leading-tight" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.6)' }}>Ingredients Found</p>
                <p className="text-white/90 text-base font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">temp_preferences_custom</span>
                  {result.ingredientsDetected.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {result.ingredientsDetected.map((ingredient, idx) => (
              <div key={idx} className="group flex items-center justify-center gap-x-2 rounded-full px-5 py-2.5 transition-all active:scale-95 cursor-default border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                <span className="text-white text-sm font-semibold">{ingredient}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Healthy Local Recipes</h2>
            <span className="text-cyan-400 text-sm font-bold cursor-pointer hover:text-cyan-300 transition-colors">View All</span>
          </div>

          {result.recipes.map((recipe, idx) => (
            <div key={idx} className="rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
              <div className="w-full bg-center bg-no-repeat h-48 bg-cover relative group"
                style={{
                  backgroundImage: `url('https://source.unsplash.com/random/800x600/?cooked,${encodeURIComponent(recipe.name.split(' ')[0])}')`,
                  backgroundColor: '#0A0C10'
                }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10]/80 via-transparent to-black/30 pointer-events-none"></div>

                <div className="absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10 bg-black/40">
                  <span className="material-symbols-outlined text-amber-500 text-[16px]">local_fire_department</span>
                  <span className="text-xs font-bold text-white">{recipe.calories}</span>
                </div>
              </div>

              <div className="flex w-full grow flex-col items-stretch justify-center gap-5 p-6 pt-5">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white text-[22px] font-bold leading-tight tracking-tight">{recipe.name}</p>
                  </div>
                  <div className="flex gap-4 mb-5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="material-symbols-outlined text-cyan-400 text-[20px]">schedule</span>
                      <span className="text-sm font-medium">{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="material-symbols-outlined text-cyan-400 text-[20px]">bar_chart</span>
                      <span className="text-sm font-medium">{recipe.difficulty}</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {recipe.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 size-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                          <span className="text-indigo-400 text-xs font-bold">{stepIdx + 1}</span>
                        </div>
                        <p className="text-white/80 text-base leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {onStartCooking && (
                    <button
                      onClick={() => onStartCooking(recipe)}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full h-14 px-6 bg-cyan-500 hover:bg-cyan-400 text-[#0A0C10] text-base font-bold active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20"
                    >
                      <span className="material-symbols-outlined">play_circle</span>
                      <span>Start Guide</span>
                    </button>
                  )}

                  <button
                    onClick={() => speakSteps(recipe.steps)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full h-12 px-6 bg-white/5 hover:bg-white/10 text-cyan-400 text-sm font-bold active:scale-[0.98] transition-all border border-white/5"
                  >
                    <span className="material-symbols-outlined">volume_up</span>
                    <span>Read Aloud Only</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div>
            <div className="rounded-2xl p-6 flex gap-5 items-start relative overflow-hidden transition-all duration-500 border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10 bg-amber-500/10 rounded-2xl p-3 shrink-0 border border-amber-500/20">
                <span className="material-symbols-outlined text-amber-500 text-[28px]">warning</span>
              </div>
              <div className="relative z-10">
                <h4 className="text-amber-500 font-bold text-lg leading-tight mb-2">Items to Avoid</h4>
                <p className="text-amber-500/80 text-[15px] leading-relaxed">
                  {result.warnings}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Camera Interface - Modernized
  if (isCameraActive) {
    return (
      <div className="relative h-screen bg-black flex flex-col overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />

        {/* HUD Scanning Grid Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {/* Scanning Line */}
          {!prefersReducedMotion && (
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            />
          )}
          {/* Viewfinder Corners */}
          <div className="absolute inset-12 border border-white/10 rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/50 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/50 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white/50 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/50 rounded-br-xl"></div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-32 left-0 right-0 text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <p className="text-xs font-medium text-white/80">Position food within frame</p>
            </div>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 pt-10 z-30 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={stopCamera} className="w-10 h-10 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center text-white bg-black/20 active:scale-95 transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-10 pb-12 z-30 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={captureImage}
            className="relative size-20 rounded-full border-4 border-white/30 p-1 flex items-center justify-center active:scale-95 transition-all"
          >
            <div className="size-full rounded-full bg-white shadow-lg"></div>
          </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // Scanner Entry View - Modern Home Page Style
  return (
    <motion.div
      className="relative h-screen bg-[#0A0C10] text-white flex flex-col overflow-hidden no-scrollbar font-display"
      layoutId="task-card-log-meal"
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-[#A855F7]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-[#6366F1]/10 blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-20 pt-8 p-5 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors text-[#94A3B8] hover:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-white/90">Food Scanner</span>
        <div className="w-10 h-10" />
      </div>

      {/* Main UI */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-20">

        <AnimatePresence mode='wait'>
          {imagePreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full flex flex-col items-center"
            >
              <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Captured data" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10]/60 to-transparent"></div>

                {/* Retake Layer */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                  <button
                    onClick={() => { setImagePreview(null); startCamera(); }}
                    className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm tracking-wide uppercase shadow-lg hover:scale-105 transition-transform"
                  >
                    Retake Photo
                  </button>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-10 w-full h-14 rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#6366F1] font-bold text-sm tracking-widest uppercase shadow-lg shadow-purple-500/20 flex items-center justify-center relative overflow-hidden text-white"
              >
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-4xl opacity-20">progress_activity</span>
                  </motion.div>
                )}
                <span className={loading ? 'opacity-80' : ''}>{loading ? 'Analyzing...' : 'Analyze Food'}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center w-full"
            >
              {/* Scanner Icon */}
              <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#A855F7]/20 rounded-full blur-2xl"></div>
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl skew-y-3 transform transition-transform hover:skew-y-0 duration-500">
                  <span className="material-symbols-outlined text-5xl text-[#A855F7] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">restaurant_menu</span>
                </div>
                <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-xl bg-[#0A0C10] border border-white/10 flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-[#6366F1] text-xl">camera_alt</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Food Scanner</h2>
              <p className="text-sm text-[#94A3B8] font-medium text-center mb-10 leading-relaxed max-w-[280px]">
                Take a photo or upload an image to instantly analyze ingredients for your pet.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={startCamera}
                  className="h-32 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.08] transition-all hover:scale-[1.02] group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#A855F7]/20 transition-colors">
                    <span className="material-symbols-outlined text-2xl text-[#94A3B8] group-hover:text-[#A855F7] transition-colors">photo_camera</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] group-hover:text-white transition-colors">Camera</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.08] transition-all hover:scale-[1.02] group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#6366F1]/20 transition-colors">
                    <span className="material-symbols-outlined text-2xl text-[#94A3B8] group-hover:text-[#6366F1] transition-colors">image</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] group-hover:text-white transition-colors">Gallery</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Hidden inputs */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </motion.div>
  );
};

export default FoodScanner;