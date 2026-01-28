const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
};

// Generic API request handler
const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
};

// Authentication API
export const authAPI = {
    signup: async (email: string, password: string, name: string) => {
        const data = await apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    login: async (email: string, password: string) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    googleAuth: async (googleId: string, email: string, name: string, profileImage?: string) => {
        const data = await apiRequest('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ googleId, email, name, profileImage }),
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    getMe: async () => {
        return apiRequest('/auth/me');
    },

    logout: () => {
        removeToken();
    },
};

// Pet API
export const petAPI = {
    getAll: async () => {
        return apiRequest('/pets');
    },

    getById: async (id: string) => {
        return apiRequest(`/pets/${id}`);
    },

    create: async (petData: any) => {
        return apiRequest('/pets', {
            method: 'POST',
            body: JSON.stringify(petData),
        });
    },

    update: async (id: string, petData: any) => {
        return apiRequest(`/pets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(petData),
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/pets/${id}`, {
            method: 'DELETE',
        });
    },
};

// Food Scanner API
export const foodAPI = {
    analyzeFood: async (imageBase64: string) => {
        return apiRequest('/food/analyze', {
            method: 'POST',
            body: JSON.stringify({ image: imageBase64 }),
        });
    },

    identifyDog: async (imageBase64: string) => {
        return apiRequest('/food/identify-dog', {
            method: 'POST',
            body: JSON.stringify({ image: imageBase64 }),
        });
    },
};

// Health API
export const healthAPI = {
    getRecords: async (petId: string) => {
        return apiRequest(`/health/${petId}/records`);
    },

    addVaccination: async (petId: string, vaccinationData: any) => {
        return apiRequest(`/health/${petId}/vaccination`, {
            method: 'POST',
            body: JSON.stringify(vaccinationData),
        });
    },

    analyzeMedicine: async (imageBase64: string) => {
        return apiRequest('/health/medicine/scan', {
            method: 'POST',
            body: JSON.stringify({ image: imageBase64 }),
        });
    },

    analyzeHealthVideo: async (videoBase64: string) => {
        return apiRequest('/health/video/analyze', {
            method: 'POST',
            body: JSON.stringify({ video: videoBase64 }),
        });
    },

    findNearbyVets: async (lat: number, lng: number) => {
        return apiRequest('/health/vets/nearby', {
            method: 'POST',
            body: JSON.stringify({ lat, lng }),
        });
    },
};

// Community API
export const communityAPI = {
    getPosts: async (limit = 20, skip = 0) => {
        return apiRequest(`/community/posts?limit=${limit}&skip=${skip}`);
    },

    createPost: async (content: string, petId?: string, images?: string[], tags?: string[]) => {
        return apiRequest('/community/posts', {
            method: 'POST',
            body: JSON.stringify({ content, petId, images, tags }),
        });
    },

    likePost: async (postId: string) => {
        return apiRequest(`/community/posts/${postId}/like`, {
            method: 'PUT',
        });
    },
};

// AI Assistant API
export const assistantAPI = {
    chat: async (message: string, history: any[]) => {
        return apiRequest('/assistant/chat', {
            method: 'POST',
            body: JSON.stringify({ message, history }),
        });
    },

    textToSpeech: async (text: string) => {
        return apiRequest('/assistant/tts', {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
    },

    transcribeAudio: async (audioBase64: string) => {
        return apiRequest('/assistant/transcribe', {
            method: 'POST',
            body: JSON.stringify({ audio: audioBase64 }),
        });
    },

    thinkingQuery: async (query: string) => {
        return apiRequest('/assistant/thinking', {
            method: 'POST',
            body: JSON.stringify({ query }),
        });
    },
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};
