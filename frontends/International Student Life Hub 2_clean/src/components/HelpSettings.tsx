import { ArrowLeft, HelpCircle, Info, MessageSquare, Book, Phone, Mail, ExternalLink, Star, Clock, Users, Shield, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface HelpSettingsProps {
  onBack: () => void;
}

export function HelpSettings({ onBack }: HelpSettingsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: '全部', icon: Book },
    { id: 'account', name: '账户问题', icon: Users },
    { id: 'privacy', name: '隐私安全', icon: Shield },
    { id: 'technical', name: '技术问题', icon: AlertTriangle },
    { id: 'features', name: '功能介绍', icon: Star }
  ];

  const faqItems = [
    {
      id: 1,
      category: 'account',
      question: '如何更改我的个人资料信息？',
      answer: '你可以在"账户管理"页面中编辑你的个人资料。点击"编辑"按钮即可修改姓名、头像、个人简介等信息。',
      helpful: 45
    },
    {
      id: 2,
      category: 'privacy',
      question: '如何保护我的隐私？',
      answer: '在"隐私与安全"设置中，你可以控制个人资料的可见性、位置分享、好友请求等隐私选项。',
      helpful: 38
    },
    {
      id: 3,
      category: 'technical',
      question: '应用无法正常加载怎么办？',
      answer: '请尝试以下步骤：1) 检查网络连接 2) 重启应用 3) 清除缓存 4) 更新到最新版本',
      helpful: 52
    },
    {
      id: 4,
      category: 'features',
      question: '如何使用聊天功能？',
      answer: '点击底部导航的"消息"图标，然后选择要聊天的好友或群组。你可以发送文字、图片、语音消息等。',
      helpful: 67
    },
    {
      id: 5,
      category: 'account',
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入你的邮箱地址，我们会发送重置密码的链接到你的邮箱。',
      helpful: 29
    },
    {
      id: 6,
      category: 'features',
      question: '如何创建和参加活动？',
      answer: '在"探索"页面点击"创建活动"按钮，填写活动信息即可。要参加活动，只需点击活动详情页面的"参加"按钮。',
      helpful: 41
    }
  ];

  const contactMethods = [
    {
      title: '在线客服',
      description: '7x24小时在线支持',
      icon: MessageSquare,
      action: '开始对话',
      available: true
    },
    {
      title: '邮件支持',
      description: 'support@cheese-app.com',
      icon: Mail,
      action: '发送邮件',
      available: true
    },
    {
      title: '电话支持',
      description: '+1 (555) 123-4567',
      icon: Phone,
      action: '拨打电话',
      available: false
    }
  ];

  const appInfo = [
    { label: '应用版本', value: '1.0.0' },
    { label: '构建版本', value: '2024.09.09' },
    { label: '更新时间', value: '2024年9月9日' },
    { label: '开发者', value: '奶酪团队' },
    { label: '支持平台', value: 'iOS, Android, Web' }
  ];

  const filteredFaq = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">❓ 幫助與支持</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 快速帮助 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <HelpCircle className="w-5 h-5 text-yellow-600 mr-2" />
              快速帮助
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {helpCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedCategory === category.id
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`p-2 rounded-lg ${
                            selectedCategory === category.id
                              ? 'bg-yellow-100'
                              : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              selectedCategory === category.id
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                            }`} />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* 常见问题 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Book className="w-5 h-5 text-yellow-600 mr-2" />
              常见问题
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                {filteredFaq.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="space-y-3">
                      <div className="font-medium text-gray-900">{item.question}</div>
                      <div className="text-sm text-gray-600">{item.answer}</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 mr-1" />
                          {item.helpful} 人觉得有用
                        </div>
                        <Button variant="outline" size="sm">
                          有用
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 联系我们 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MessageSquare className="w-5 h-5 text-yellow-600 mr-2" />
              联系我们
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            method.available ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              method.available ? 'text-yellow-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{method.title}</div>
                            <div className="text-sm text-gray-500 mt-1">{method.description}</div>
                            {!method.available && (
                              <div className="text-xs text-gray-400 mt-1">暂时不可用</div>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={!method.available}
                        >
                          {method.action}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 用户指南 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Book className="w-5 h-5 text-yellow-600 mr-2" />
              用户指南
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Book className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">新手指南</div>
                        <div className="text-sm text-gray-500">了解应用的基本功能和使用方法</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="p-4">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">高级功能</div>
                        <div className="text-sm text-gray-500">探索应用的更多高级功能</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="p-4">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Shield className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">安全指南</div>
                        <div className="text-sm text-gray-500">保护你的账户和个人信息安全</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* 应用信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Info className="w-5 h-5 text-yellow-600 mr-2" />
              应用信息
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4 space-y-3">
                {appInfo.map((info, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{info.label}</span>
                    <span className="text-gray-900">{info.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 反馈 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MessageSquare className="w-5 h-5 text-yellow-600 mr-2" />
              意见反馈
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    我们重视你的反馈！如果你有任何建议、问题或想法，请告诉我们。
                  </p>
                  <Button className="w-full">
                    提交反馈
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
