import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import FoodScanner from './components/FoodScanner';
import LiveAssistant from './components/LiveAssistant';
import HealthCheck from './components/HealthCheck';
import DailyPlan from './components/DailyPlan';
import Activity from './components/Activity';
import Learn from './components/Learn';
import MyPets from './components/MyPets';
import AddDog from './components/AddDog';
import Alerts from './components/Alerts';
import MedicineScanner from './components/MedicineScanner';
import Settings from './components/Settings';
import NearbyVets from './components/NearbyVets';
import EmergencyCare from './components/EmergencyCare';
import FirstAidGuide from './components/FirstAidGuide';
import Community from './components/Community';
import VaccinationHistory from './components/VaccinationHistory';
import ShareStory from './components/ShareStory';
import Chat from './components/Chat';
import OfflineMode from './components/OfflineMode';
import DigitalCertificate from './components/DigitalCertificate';
import WaterTracker from './components/WaterTracker';
import CookingMode from './components/CookingMode';
import SafeIngredients from './components/SafeIngredients';
import CustomRecipes from './components/CustomRecipes';
import { View, Recipe, Pet } from './types';

// Default Pets Data
const DEFAULT_PETS: Pet[] = [
  {
    id: 'bruno',
    name: 'Bruno',
    age: '4 Years',
    gender: 'Male',
    breed: 'Mixed Breed',
    weight: '18 kg',
    color: '#D4A574',
    image: '/bruno-new.jpg',
    thumb: '/bruno-new.jpg'
  },
  {
    id: 'moti',
    name: 'Moti',
    age: '2 Years',
    gender: 'Male',
    breed: 'Labrador',
    weight: '25 kg',
    color: '#E8E0D5',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Jy8Czee3IJZTkjlsYdmKccmlALusDS9-5uQZMHhYX4Wacq1AQiu17DAl5N87Hl-0xbflFJ9BxHMAWGASHUmfQcF_V2yNB7-gMymKv7Wya1xieuzZ0fVVYqJ_fQaTKhSPoI1_HSo2mUhurxXZIUvX5Ose8DG5xIaZ6DrrV0_KZqkVS--aKyNEfKI9lwubBUYdyD_t_dryzsNbW1EwYKrDmKr8x7-HutfXDYpghj6ODqI-Eopiar0m-gW4ig0gLdhhehO-5NJD4Es',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX0_Df02z40IjkXEAjRL9xHHhflCjFFV6WRGNmn7h8kHpNg5fZZvKcsW1zVcAn1-8CAnUSAAPUNPCP8YtR7Nt25TIzFG-DwKTB5YK39TQ_mG0Jj-4eeRpcpM-u_99Z1JT-IZGnIuwRKCX2dol7adAvF5b_HIYoBFONtopL8pMnQtJCwZC_Z81CVHAsrETpCV2ws7Amt7kUPFg-rmKuMOkQh4GxOdaZ2lYmJ7ieMc9KIvuiXF1vuXqm5EuLEnXrBZIAm1yUf5mYvsk'
  },
  {
    id: 'rocky',
    name: 'Rocky',
    age: '6 Months',
    gender: 'Male',
    breed: 'German Shepherd',
    weight: '8 kg',
    color: '#4A3C30',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc6QU1ZAlDlnCsSdj3m7Qk-UkI-ehKEt3M5h-ohYjfVWRqqAn_B99qo0SLXMW-Epk1upgCBbmMcHC19h9OLQFbOijbzRuUYRh-5qK9gckjerGdU8QTClW7H4ujyFPR6DgEBLCFEP9kQHloeIQho5urg13krwfwSVapgOqK_edP8MZGJJzTke9e2iPm6787w5qQX4vNBJfXspScyQuojRta8Dr3ij3PAtRnbo2Ci3wAj3MpWYV4t_UeZ2xb5hnkuL6Q66wxwecMeWI',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxjpYIVt9hPB5VjDjfnzcHzuPIB2kEjHn13ZWRcz3rrsRYa-p1h71J2SmuYxkJvQbxPQQnm0ZIJIWs-m5EI4BgKkceT1u-SW9RBJRN5-gkrca6pxwhiw4RBK7OBpNxtnNiLuxmtSE7TTdYgthLyVVvf5XVtYDumKy0p1IJNF-3-I1OFeooqAx1Ow59tGcNMle9DZ7VWWdfS3DEHfYi9ffou-cKrP0AemWX8GPCDW0jKntHYYG4daTYgGHV36v2W_waTo3hyFtpzY8'
  },
  {
    id: 'bella',
    name: 'Bella',
    age: '3 Years',
    gender: 'Female',
    breed: 'Beagle',
    weight: '12 kg',
    color: '#A0522D',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1000&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'max',
    name: 'Max',
    age: '5 Years',
    gender: 'Male',
    breed: 'Husky',
    weight: '28 kg',
    color: '#708090',
    image: 'https://images.unsplash.com/photo-1563889958749-6256b6436218?q=80&w=1000&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1563889958749-6256b6436218?q=80&w=200&auto=format&fit=crop'
  }
];

import BottomNavigation from './components/BottomNavigation';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showOfflineScreen, setShowOfflineScreen] = useState(!navigator.onLine);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Pet State
  const [pets, setPets] = useState<Pet[]>(DEFAULT_PETS);
  const [selectedPet, setSelectedPet] = useState<Pet>(DEFAULT_PETS[0]);

  useEffect(() => {
    const handleOnline = () => {
      setShowOfflineScreen(false);
    };
    const handleOffline = () => {
      setShowOfflineScreen(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleStartCooking = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentView(View.COOKING_MODE);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.LOGIN:
      case View.SIGNUP:
        return <Auth onLoginSuccess={() => setCurrentView(View.DASHBOARD)} />;
      case View.FOOD_SCANNER:
        return <FoodScanner onBack={() => setCurrentView(View.DASHBOARD)} onStartCooking={handleStartCooking} onNavigate={setCurrentView} />;
      case View.SAFE_INGREDIENTS:
        return <SafeIngredients onBack={() => setCurrentView(View.FOOD_SCANNER)} />;
      case View.CUSTOM_RECIPES:
        return <CustomRecipes onBack={() => setCurrentView(View.FOOD_SCANNER)} onStartCooking={handleStartCooking} />;
      case View.HEALTH_CHECK:
        return <HealthCheck onBack={() => setCurrentView(View.DASHBOARD)} onNavigate={setCurrentView} />;
      case View.DAILY_PLAN:
        return <DailyPlan onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.ACTIVITY:
        return <Activity onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.ALERTS:
        return <Alerts onBack={() => setCurrentView(View.DASHBOARD)} onNavigate={setCurrentView} />;
      case View.LEARN:
        return <Learn onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.MY_PETS:
        return <MyPets
          onBack={() => setCurrentView(View.DASHBOARD)}
          onNavigate={setCurrentView}
          pets={pets}
          selectedPet={selectedPet}
          onSelectPet={setSelectedPet}
        />;
      case View.EDIT_PET_PROFILE:
        return <EditPetProfile onBack={() => setCurrentView(View.MY_PETS)} onSave={() => setCurrentView(View.MY_PETS)} />;
      case View.ADD_DOG:
        return <AddDog onBack={() => setCurrentView(View.MY_PETS)} onComplete={() => setCurrentView(View.MY_PETS)} />;
      case View.MEDICINE_SCANNER:
        return <MedicineScanner onBack={() => setCurrentView(View.HEALTH_CHECK)} onComplete={() => setCurrentView(View.DAILY_PLAN)} />;
      case View.SETTINGS:
        return <Settings onBack={() => setCurrentView(View.MY_PETS)} />;
      case View.NEARBY_VETS:
        return <NearbyVets onBack={() => setCurrentView(View.ALERTS)} />;
      case View.EMERGENCY_CARE:
        return <EmergencyCare onBack={() => setCurrentView(View.DASHBOARD)} onNavigate={setCurrentView} />;
      case View.FIRST_AID:
        return <FirstAidGuide onBack={() => setCurrentView(View.EMERGENCY_CARE)} onNavigate={setCurrentView} />;
      case View.COMMUNITY:
        return <Community onBack={() => setCurrentView(View.DASHBOARD)} onNavigate={setCurrentView} />;
      case View.SHARE_STORY:
        return <ShareStory onBack={() => setCurrentView(View.COMMUNITY)} onComplete={() => setCurrentView(View.COMMUNITY)} />;
      case View.VACCINATION_HISTORY:
        return <VaccinationHistory onBack={() => setCurrentView(View.HEALTH_CHECK)} onNavigate={setCurrentView} />;
      case View.CHAT:
        return <Chat onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.DIGITAL_CERTIFICATE:
        return <DigitalCertificate onBack={() => setCurrentView(View.VACCINATION_HISTORY)} />;
      case View.WATER_TRACKER:
        return <WaterTracker onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.COOKING_MODE:
        return selectedRecipe ? (
          <CookingMode recipe={selectedRecipe} onClose={() => setCurrentView(View.FOOD_SCANNER)} />
        ) : (
          <FoodScanner onBack={() => setCurrentView(View.DASHBOARD)} onStartCooking={handleStartCooking} />
        );
      case View.DASHBOARD:
      default:
        return <Dashboard
          onNavigate={setCurrentView}
          onOpenVoice={() => setIsVoiceActive(true)}
          selectedPet={selectedPet}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center font-display p-8 md:p-0">

      {/* iPhone 13 Mockup Container */}
      <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[844px] w-[390px] shadow-xl">

        {/* Notch */}
        <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-50"></div>

        {/* Side Buttons */}
        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div> {/* Mute */}
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div> {/* Vol Up */}
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div> {/* Vol Down */}
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div> {/* Power */}

        {/* Screen Content */}
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-background-dark relative flex flex-col">
          <main className="w-full h-full overflow-y-auto scrollbar-hide flex-1">
            {renderContent()}
          </main>

          {/* Global Bottom Navigation (Hidden on Auth) */}
          {(currentView !== View.LOGIN && currentView !== View.SIGNUP) && (
            <BottomNavigation currentView={currentView} onNavigate={setCurrentView} />
          )}

          {/* Voice Assistant Overlay */}
          {isVoiceActive && (
            <LiveAssistant onClose={() => setIsVoiceActive(false)} />
          )}

          {/* Offline Mode Overlay */}
          {showOfflineScreen && (
            <OfflineMode onDismiss={() => setShowOfflineScreen(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;