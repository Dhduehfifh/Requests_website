import React, { useState } from 'react';

import { ModuleFeed } from './components/ModuleFeed';
import { BottomNavigation } from './components/BottomNavigation';
import { ForYouScreen } from './components/ForYouScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { PostScreen } from './components/PostScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';

export type ModuleType = 'rent' | 'secondhand' | 'events' | 'gossip' | 'rideshare' | 'forum';
export type ScreenType = 'module' | 'foryou' | 'explore' | 'post' | 'messages' | 'profile' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('explore');
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);

  const handleModuleSelect = (module: ModuleType) => {
    setActiveModule(module);
    setCurrentScreen('module');
  };

  const handleBackToExplore = () => {
    setCurrentScreen('explore');
    setActiveModule(null);
  };

  const handleNavigation = (screen: ScreenType) => {
    setCurrentScreen(screen);
    if (screen !== 'module') {
      setActiveModule(null);
    }
  };

  const handleBackToProfile = () => {
    setCurrentScreen('profile');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'module':
        return activeModule ? (
          <ModuleFeed module={activeModule} onBack={handleBackToExplore} />
        ) : (
          <ExploreScreen onModuleSelect={handleModuleSelect} />
        );
      case 'foryou':
        return <ForYouScreen />;
      case 'explore':
        return <ExploreScreen onModuleSelect={handleModuleSelect} />;
      case 'post':
        return <PostScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'profile':
        return <ProfileScreen onSettingsClick={() => setCurrentScreen('settings')} />;
      case 'settings':
        return <SettingsScreen onBack={handleBackToProfile} />;
      default:
        return <ExploreScreen onModuleSelect={handleModuleSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto relative">
      {/* Status bar simulation */}
      <div className="h-6 bg-white"></div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        currentScreen={currentScreen} 
        onNavigate={handleNavigation} 
      />
    </div>
  );
}