export enum View {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  FOOD_SCANNER = 'FOOD_SCANNER',
  HEALTH_CHECK = 'HEALTH_CHECK',
  DAILY_PLAN = 'DAILY_PLAN',
  LEARN = 'LEARN',
  MY_PETS = 'MY_PETS',
  ALERTS = 'ALERTS',
  ADD_DOG = 'ADD_DOG',
  MEDICINE_SCANNER = 'MEDICINE_SCANNER',
  SETTINGS = 'SETTINGS',
  NEARBY_VETS = 'NEARBY_VETS',
  EMERGENCY_CARE = 'EMERGENCY_CARE',
  FIRST_AID = 'FIRST_AID',
  COMMUNITY = 'COMMUNITY',
  VACCINATION_HISTORY = 'VACCINATION_HISTORY',
  SHARE_STORY = 'SHARE_STORY',
  CHAT = 'CHAT',
  DIGITAL_CERTIFICATE = 'DIGITAL_CERTIFICATE',
  WATER_TRACKER = 'WATER_TRACKER',
  COOKING_MODE = 'COOKING_MODE',
  SAFE_INGREDIENTS = 'SAFE_INGREDIENTS',
  CUSTOM_RECIPES = 'CUSTOM_RECIPES',
  EDIT_PET_PROFILE = 'EDIT_PET_PROFILE',
  ACTIVITY = 'ACTIVITY',
}

export interface Recipe {
  name: string;
  calories: string;
  time: string;
  difficulty: string;
  steps: string[];
  tags: string[];
}

export interface FoodAnalysisResult {
  isSafe: boolean;
  ingredientsDetected: string[];
  recipes: Recipe[];
  warnings: string;
}

export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  role: MessageRole;
  text: string;
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

export interface Pet {
  id: string;
  name: string;
  age: string;
  gender: string;
  breed: string;
  weight: string;
  color: string;
  image: string;
  thumb: string;
}