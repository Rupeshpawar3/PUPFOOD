import { GoogleGenAI, Type, Modality } from "@google/genai";
import { config } from "../config/env.js";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

export interface FoodAnalysisResult {
    isSafe: boolean;
    ingredientsDetected: string[];
    recipes: Recipe[];
    warnings: string;
}

export interface Recipe {
    name: string;
    calories: string;
    time: string;
    difficulty: string;
    steps: string[];
    tags: string[];
}

export interface DogProfile {
    breed?: string;
    size?: 'small' | 'medium' | 'large';
    ageEstimate?: string;
}

export interface MedicineAnalysisResult {
    name: string;
    dosage: string;
    instruction: string;
    usageHindi: string;
}

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysisResult> => {
    try {
        const modelId = "gemini-3-flash-preview";

        const response = await ai.models.generateContent({
            model: modelId,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Image,
                        },
                    },
                    {
                        text: `Analyze this image to see if it contains food ingredients suitable for a dog. 
            1. Identify the key ingredients visible (e.g., Rice, Chicken, Pumpkin).
            2. Suggest 2 simple, healthy dog recipes using these ingredients. If only one ingredient is found, suggest a recipe that uses it as a base.
            3. For each recipe, provide a name, calorie count (approx), prep time, difficulty, and 3 simple steps.
            4. Provide a safety warning list of items to absolutely avoid adding to this meal (e.g., Onions, Garlic).
            `,
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isSafe: { type: Type.BOOLEAN, description: "Is the food generally safe for dogs?" },
                        ingredientsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recipes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    calories: { type: Type.STRING, description: "e.g. 240 kcal" },
                                    time: { type: Type.STRING, description: "e.g. 15 mins" },
                                    difficulty: { type: Type.STRING, description: "e.g. Easy" },
                                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g. ['Cooling', 'Instant']" }
                                },
                                required: ["name", "calories", "time", "difficulty", "steps"]
                            }
                        },
                        warnings: { type: Type.STRING, description: "Text description of items to avoid" }
                    },
                    required: ["isSafe", "ingredientsDetected", "recipes", "warnings"],
                },
            },
        });

        if (response.text) {
            return JSON.parse(response.text) as FoodAnalysisResult;
        }
        throw new Error("No response text from Gemini");

    } catch (error) {
        console.error("Error analyzing food:", error);
        throw error;
    }
};

export const identifyDogProfile = async (base64Image: string): Promise<DogProfile> => {
    try {
        const modelId = "gemini-3-flash-preview";
        const response = await ai.models.generateContent({
            model: modelId,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Image,
                        },
                    },
                    {
                        text: `Identify the dog in this image.
                        1. Determine the breed (e.g., Labrador, Golden Retriever, Desi/Indie).
                        2. Estimate the size category based on the breed or visible size:
                           - 'small' (under 10kg, like Pugs, Pomeranians)
                           - 'medium' (10-25kg, like Beagles, Indies)
                           - 'large' (over 25kg, like German Shepherds, Labradors)
                        3. Estimate the age if possible, otherwise leave empty.
                        `,
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        breed: { type: Type.STRING },
                        size: { type: Type.STRING, enum: ['small', 'medium', 'large'] },
                        ageEstimate: { type: Type.STRING }
                    },
                    required: ['breed', 'size']
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as DogProfile;
        }
        return {};
    } catch (error) {
        console.error("Error identifying dog:", error);
        return {};
    }
};

export const analyzeMedicine = async (base64Image: string): Promise<MedicineAnalysisResult> => {
    try {
        const modelId = "gemini-3-flash-preview";

        const response = await ai.models.generateContent({
            model: modelId,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Image,
                        },
                    },
                    {
                        text: `Identify the medicine in this image.
            1. Extract the medicine name and strength (e.g. Doxycycline 100mg).
            2. Provide simple dosage instruction text suitable for a dog owner (e.g. "Give 1 pill after food").
            3. Provide the same instruction translated to Hindi.
            `,
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        dosage: { type: Type.STRING },
                        instruction: { type: Type.STRING },
                        usageHindi: { type: Type.STRING }
                    },
                    required: ["name", "dosage", "instruction", "usageHindi"]
                }
            },
        });

        if (response.text) {
            return JSON.parse(response.text) as MedicineAnalysisResult;
        }
        throw new Error("No response text");

    } catch (error) {
        console.error("Error analyzing medicine:", error);
        throw error;
    }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                }
            }
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
        console.error("TTS Error:", error);
        return undefined;
    }
};

export const findNearbyVets = async (location: { lat: number, lng: number }) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Find 3 top rated veterinary clinics near me. Provide their names, estimated distance in km, and open status.",
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    googleMaps: {
                        retrievalConfig: {
                            latLng: { latitude: location.lat, longitude: location.lng }
                        }
                    }
                }
            }
        });
        return {
            text: response.text,
            chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        };
    } catch (error) {
        console.error("Maps Error:", error);
        return { text: "Unable to find vets right now.", chunks: [] };
    }
};

export const analyzeHealthVideo = async (base64Video: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: {
                parts: [
                    { inlineData: { mimeType: "video/mp4", data: base64Video } },
                    { text: "Analyze this video of a dog walking. Describe the gait, identify any limping, stiffness or abnormalities, and provide a quick health assessment." }
                ]
            }
        });
        return response.text || "Could not analyze video.";
    } catch (error) {
        console.error("Video Analysis Error:", error);
        return "Error analyzing video.";
    }
};

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    { inlineData: { mimeType: "audio/webm", data: base64Audio } },
                    { text: "Transcribe this audio caption accurately." }
                ]
            }
        });
        return response.text || "";
    } catch (error) {
        console.error("Transcription Error:", error);
        return "Error transcribing audio.";
    }
};

export const askThinkingAI = async (query: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: query,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text || "No response.";
    } catch (error) {
        console.error("Thinking AI Error:", error);
        return "Sorry, I couldn't think through that right now.";
    }
};

export const chatWithBot = async (message: string, history: { role: string, text: string }[]): Promise<string> => {
    try {
        const contents = history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }));
        contents.push({ role: 'user', parts: [{ text: message }] });

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: contents
        });
        return response.text || "I didn't catch that.";
    } catch (error) {
        console.error("Chat Error:", error);
        return "Sorry, chat is unavailable.";
    }
};
