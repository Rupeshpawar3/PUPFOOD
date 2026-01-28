import { foodAPI, healthAPI, assistantAPI } from "./apiService";
import { FoodAnalysisResult, DogProfile, MedicineAnalysisResult } from "../types";

// 1. Food Analysis
export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysisResult> => {
    try {
        const response = await foodAPI.analyzeFood(base64Image);
        return response.result;
    } catch (error) {
        console.error("Error analyzing food:", error);
        throw error;
    }
};

// 2. Dog Identification
export const identifyDogProfile = async (base64Image: string): Promise<DogProfile> => {
    try {
        const response = await foodAPI.identifyDog(base64Image);
        return response.result;
    } catch (error) {
        console.error("Error identifying dog:", error);
        return {};
    }
};

// 3. Medicine Analysis
export const analyzeMedicine = async (base64Image: string): Promise<MedicineAnalysisResult> => {
    try {
        const response = await healthAPI.analyzeMedicine(base64Image);
        return response.result;
    } catch (error) {
        console.error("Error analyzing medicine:", error);
        throw error;
    }
};

// 4. Text-to-Speech
export const playAudioData = async (base64Audio: string) => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    } catch (e) {
        console.error("Audio playback error", e);
    }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
    try {
        const response = await assistantAPI.textToSpeech(text);
        return response.audioData;
    } catch (error) {
        console.error("TTS Error:", error);
        return undefined;
    }
};

// 5. Maps Grounding
export const findNearbyVets = async (location: { lat: number, lng: number }) => {
    try {
        return await healthAPI.findNearbyVets(location.lat, location.lng);
    } catch (error) {
        console.error("Maps Error:", error);
        return { text: "Unable to find vets right now.", chunks: [] };
    }
};

// 6. Video Understanding
export const analyzeHealthVideo = async (base64Video: string): Promise<string> => {
    try {
        const response = await healthAPI.analyzeHealthVideo(base64Video);
        return response.analysis;
    } catch (error) {
        console.error("Video Analysis Error:", error);
        return "Error analyzing video.";
    }
};

// 7. Audio Transcription
export const transcribeAudio = async (base64Audio: string): Promise<string> => {
    try {
        const response = await assistantAPI.transcribeAudio(base64Audio);
        return response.transcription;
    } catch (error) {
        console.error("Transcription Error:", error);
        return "Error transcribing audio.";
    }
};

// 8. Thinking Mode
export const askThinkingAI = async (query: string): Promise<string> => {
    try {
        const response = await assistantAPI.thinkingQuery(query);
        return response.response;
    } catch (error) {
        console.error("Thinking AI Error:", error);
        return "Sorry, I couldn't think through that right now.";
    }
};

// 9. AI Chatbot
export const chatWithBot = async (message: string, history: { role: string, text: string }[]): Promise<string> => {
    try {
        const response = await assistantAPI.chat(message, history);
        return response.response;
    } catch (error) {
        console.error("Chat Error:", error);
        return "Sorry, chat is unavailable.";
    }
};