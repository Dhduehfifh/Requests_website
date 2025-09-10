//底部navbar
//TODO：增加维持这个地方的东西
import { Heart, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { ScreenType } from '../App';
import { HapticsService } from '../lib/haptics';

interface BottomNavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

const navItems = [
  {
    id: 'foryou' as ScreenType,
    label: '猜你喜歡',
    englishLabel: 'For You',
    icon: Heart
  },
  {
    id: 'explore' as ScreenType,
    label: '廣場',
    englishLabel: 'Explore',
    icon: Compass
  },
  {
    id: 'post' as ScreenType,
    label: '發布',
    englishLabel: 'Post',
    icon: Plus,
    isSpecial: true
  },
  {
    id: 'messages' as ScreenType,
    label: '消息',
    englishLabel: 'Messages',
    icon: MessageSquare
  },
  {
    id: 'profile' as ScreenType,
    label: '我的',
    englishLabel: 'Profile',
    icon: User
  }
];

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  // Show home icon when on module screens
  const shouldShowHome = currentScreen === 'module';
  
  const handleNavigation = async (screen: ScreenType) => {
    // Trigger haptics on native
    await HapticsService.impactLight();
    onNavigate(screen);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 pb-4 safe-area-inset-bottom">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentScreen === item.id;
          const isSpecialButton = item.isSpecial;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-200 ${
                isSpecialButton ? 'relative' : ''
              }`}
            >
              {isSpecialButton ? (
                <div className="cheese-gradient rounded-full p-3 shadow-lg cheese-hole">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              ) : (
                <IconComponent 
                  className={`w-6 h-6 mb-1 transition-colors ${
                    isActive ? 'text-yellow-500' : 'text-gray-400'
                  }`} 
                />
              )}
              
              {!isSpecialButton && (
                <span 
                  className={`text-xs transition-colors truncate ${
                    isActive ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Home indicator for module screens */}
      {shouldShowHome && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
        </div>
      )}
    </div>
  );
}