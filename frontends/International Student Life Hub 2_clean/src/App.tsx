import React, { useState } from 'react';

import { ModuleFeed } from './components/ModuleFeed';
import { BottomNavigation } from './components/BottomNavigation';
import { ForYouScreen } from './components/ForYouScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { PostScreen } from './components/PostScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LoginScreen } from './components/LoginScreen';
import { NewPostScreen } from './components/NewPostScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export type ModuleType = 'rent' | 'secondhand' | 'events' | 'gossip' | 'rideshare' | 'forum';
export type ScreenType = 'module' | 'foryou' | 'explore' | 'post' | 'messages' | 'profile' | 'settings';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('explore');
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);

  const handleModuleSelect = (module: ModuleType) => {
    setActiveModule(module);
    setCurrentScreen('module');
  };

  const handleBackToExplore = () => {
    setCurrentScreen('explore');
    setActiveModule(null);
  };

  const handleNavigation = (screen: ScreenType) => {
    if (screen === 'post') {
      if (!user) {
        setShowLogin(true);
        return;
      }
      setShowNewPost(true);
      return;
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto relative">
      {/* Status bar simulation */}
      <div className="h-6 bg-white"></div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden pb-20">
        {renderScreen()}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        currentScreen={currentScreen} 
        onNavigate={handleNavigation} 
      />

      {/* Modals */}
      {showLogin && (
        <LoginScreen 
          onClose={() => setShowLogin(false)} 
        />
      )}
      
      {showNewPost && (
        <NewPostScreen 
          onClose={() => setShowNewPost(false)}
          onPostCreated={() => {
            // Refresh posts or show success message
            setShowNewPost(false);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}