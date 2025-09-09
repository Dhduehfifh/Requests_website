import { ArrowLeft, Bell, Shield, Globe, Palette, Moon, Sun, Volume2, VolumeX, Eye, EyeOff, User, Lock, HelpCircle, Info, LogOut, MessageSquare } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useState } from 'react';
import { NotificationSettings } from './NotificationSettings';
import { PrivacySettings } from './PrivacySettings';
import { AppearanceSettings } from './AppearanceSettings';
import { AccountSettings } from './AccountSettings';
import { HelpSettings } from './HelpSettings';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [currentView, setCurrentView] = useState('main');

  const settingsSections = [
    {
      title: '通知設定',
      icon: Bell,
      items: [
        {
          label: '推送通知',
          subtitle: '接收新消息和活動提醒',
          type: 'switch',
          value: notifications,
          onChange: setNotifications
        },
        {
          label: '聲音提醒',
          subtitle: '通知時播放聲音',
          type: 'switch',
          value: soundEnabled,
          onChange: setSoundEnabled
        },
        {
          label: '通知設定',
          subtitle: '管理所有通知選項',
          type: 'button',
          icon: Bell,
          action: () => setCurrentView('notifications')
        }
      ]
    },
    {
      title: '隱私與安全',
      icon: Shield,
      items: [
        {
          label: '個人資料可見性',
          subtitle: '允許其他用戶查看你的資料',
          type: 'switch',
          value: profileVisibility,
          onChange: setProfileVisibility
        },
        {
          label: '位置分享',
          subtitle: '在貼文中顯示位置信息',
          type: 'switch',
          value: locationSharing,
          onChange: setLocationSharing
        },
        {
          label: '隱私設定',
          subtitle: '管理你的隱私選項',
          type: 'button',
          icon: Eye,
          action: () => setCurrentView('privacy')
        }
      ]
    },
    {
      title: '外觀與語言',
      icon: Palette,
      items: [
        {
          label: '深色模式',
          subtitle: '使用深色主題',
          type: 'switch',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          label: '語言設定',
          subtitle: '繁體中文',
          type: 'button',
          icon: Globe,
          action: () => setCurrentView('appearance')
        }
      ]
    },
    {
      title: '帳戶管理',
      icon: User,
      items: [
        {
          label: '編輯個人資料',
          subtitle: '更新你的基本信息',
          type: 'button',
          icon: User,
          action: () => setCurrentView('account')
        },
        {
          label: '更改密碼',
          subtitle: '更新你的登入密碼',
          type: 'button',
          icon: Lock,
          action: () => setCurrentView('account')
        }
      ]
    },
    {
      title: '幫助與支持',
      icon: HelpCircle,
      items: [
        {
          label: '幫助中心',
          subtitle: '常見問題和解決方案',
          type: 'button',
          icon: HelpCircle,
          action: () => setCurrentView('help')
        },
        {
          label: '關於我們',
          subtitle: '應用版本和團隊信息',
          type: 'button',
          icon: Info,
          action: () => setCurrentView('help')
        },
        {
          label: '聯繫我們',
          subtitle: '反饋和建議',
          type: 'button',
          icon: MessageSquare,
          action: () => setCurrentView('help')
        }
      ]
    }
  ];

  // 渲染不同的设置页面
  if (currentView === 'notifications') {
    return <NotificationSettings onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'privacy') {
    return <PrivacySettings onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'appearance') {
    return <AppearanceSettings onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'account') {
    return <AccountSettings onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'help') {
    return <HelpSettings onBack={() => setCurrentView('main')} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">🧀 設定</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <div key={sectionIndex}>
                <div className="flex items-center space-x-2 mb-3">
                  <IconComponent className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                
                <Card className="bg-white border border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="p-4">
                        {item.type === 'switch' ? (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-500 mt-1">{item.subtitle}</div>
                            </div>
                            <Switch
                              checked={item.value}
                              onCheckedChange={item.onChange}
                            />
                          </div>
                        ) : (
                          <button 
                            onClick={item.action}
                            className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              {item.icon && (
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                  <item.icon className="w-4 h-4 text-yellow-600" />
                                </div>
                              )}
                              <div className="text-left">
                                <div className="font-medium text-gray-900">{item.label}</div>
                                <div className="text-sm text-gray-500">{item.subtitle}</div>
                              </div>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}

          {/* Logout Section */}
          <div className="pt-4">
            <Card className="bg-white border border-red-200">
              <button className="w-full p-4 flex items-center space-x-3 hover:bg-red-50 transition-colors">
                <div className="p-2 bg-red-100 rounded-lg">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-red-600">登出</div>
                  <div className="text-sm text-red-500">退出你的帳戶</div>
                </div>
              </button>
            </Card>
          </div>

          {/* App Version */}
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">
              奶酪 🧀 v1.0.0
            </div>
            <div className="text-xs text-gray-400 mt-1">
              © 2024 奶酪 - 国际学生生活中心
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
