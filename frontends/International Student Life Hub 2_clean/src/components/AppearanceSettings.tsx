//设定/外观与语言
import { ArrowLeft, Palette, Moon, Sun, Globe, Type, Eye, Contrast, Smartphone, Monitor } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useState } from 'react';

interface AppearanceSettingsProps {
  onBack: () => void;
}

export function AppearanceSettings({ onBack }: AppearanceSettingsProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [autoTheme, setAutoTheme] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('zh-TW');
  const [selectedTheme, setSelectedTheme] = useState('cheese');

  const themes = [
    {
      id: 'cheese',
      name: '奶酪主题',
      description: '温暖的奶酪黄色调',
      preview: 'bg-gradient-to-br from-yellow-300 to-orange-400',
      active: selectedTheme === 'cheese'
    },
    {
      id: 'blue',
      name: '海洋蓝',
      description: '清新的蓝色调',
      preview: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      active: selectedTheme === 'blue'
    },
    {
      id: 'green',
      name: '森林绿',
      description: '自然的绿色调',
      preview: 'bg-gradient-to-br from-green-400 to-emerald-500',
      active: selectedTheme === 'green'
    },
    {
      id: 'purple',
      name: '薰衣草紫',
      description: '优雅的紫色调',
      preview: 'bg-gradient-to-br from-purple-400 to-pink-500',
      active: selectedTheme === 'purple'
    }
  ];

  const languages = [
    { code: 'zh-TW', name: '繁體中文', native: '繁體中文' },
    { code: 'zh-CN', name: '简体中文', native: '简体中文' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ja', name: '日本語', native: '日本語' },
    { code: 'ko', name: '한국어', native: '한국어' },
    { code: 'es', name: 'Español', native: 'Español' },
    { code: 'fr', name: 'Français', native: 'Français' },
    { code: 'de', name: 'Deutsch', native: 'Deutsch' }
  ];

  const accessibilityOptions = [
    {
      label: '大字体',
      subtitle: '增大应用中的文字大小',
      value: largeText,
      onChange: setLargeText,
      icon: Type
    },
    {
      label: '高对比度',
      subtitle: '提高文字和背景的对比度',
      value: highContrast,
      onChange: setHighContrast,
      icon: Contrast
    },
    {
      label: '减少动画',
      subtitle: '减少界面中的动画效果',
      value: reduceMotion,
      onChange: setReduceMotion,
      icon: Eye
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">🎨 外觀與語言</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 主题设置 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Palette className="w-5 h-5 text-yellow-600 mr-2" />
              主题设置
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">深色模式</div>
                      <div className="text-sm text-gray-500 mt-1">使用深色主题界面</div>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">自动切换主题</div>
                      <div className="text-sm text-gray-500 mt-1">根据系统设置自动切换深色/浅色模式</div>
                    </div>
                    <Switch
                      checked={autoTheme}
                      onCheckedChange={setAutoTheme}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 主题颜色 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Palette className="w-5 h-5 text-yellow-600 mr-2" />
              主题颜色
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme.active 
                          ? 'border-yellow-500 ring-2 ring-yellow-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-md mb-2 ${theme.preview}`}></div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 text-sm">{theme.name}</div>
                        <div className="text-xs text-gray-500">{theme.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 语言设置 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Globe className="w-5 h-5 text-yellow-600 mr-2" />
              语言设置
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                {languages.map((language, index) => (
                  <div key={language.code} className="p-4">
                    <button 
                      onClick={() => setSelectedLanguage(language.code)}
                      className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{language.native}</div>
                          <div className="text-sm text-gray-500">{language.name}</div>
                        </div>
                      </div>
                      {selectedLanguage === language.code && (
                        <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 无障碍设置 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Eye className="w-5 h-5 text-yellow-600 mr-2" />
              无障碍设置
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                {accessibilityOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <div key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <IconComponent className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500 mt-1">{option.subtitle}</div>
                          </div>
                        </div>
                        <Switch
                          checked={option.value}
                          onCheckedChange={option.onChange}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 显示设置 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Monitor className="w-5 h-5 text-yellow-600 mr-2" />
              显示设置
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Smartphone className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">屏幕方向</div>
                        <div className="text-sm text-gray-500">设置应用的屏幕方向偏好</div>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                  </button>
                </div>
                <div className="p-4">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Eye className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">显示密度</div>
                        <div className="text-sm text-gray-500">调整界面元素的密度</div>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* 预览区域 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Eye className="w-5 h-5 text-yellow-600 mr-2" />
              预览效果
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🧀</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">奶酪用户</div>
                      <div className="text-sm text-gray-500">刚刚</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-sm text-gray-700">
                      这是当前主题设置下的界面预览效果
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  更改设置后，界面会立即应用新的主题和样式
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
