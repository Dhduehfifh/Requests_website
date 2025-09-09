import { ArrowLeft, Shield, Eye, EyeOff, MapPin, Lock, User, Users, Camera, Phone, Mail, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useState } from 'react';

interface PrivacySettingsProps {
  onBack: () => void;
}

export function PrivacySettings({ onBack }: PrivacySettingsProps) {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [allowMessagesFromStrangers, setAllowMessagesFromStrangers] = useState(false);
  const [showLastSeen, setShowLastSeen] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  const [allowPhotoSharing, setAllowPhotoSharing] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [dataExport, setDataExport] = useState(false);

  const privacySections = [
    {
      title: '个人资料隐私',
      icon: User,
      items: [
        {
          label: '个人资料可见性',
          subtitle: '允许其他用户查看你的个人资料',
          value: profileVisibility,
          onChange: setProfileVisibility
        },
        {
          label: '在线状态显示',
          subtitle: '向好友显示你的在线状态',
          value: showOnlineStatus,
          onChange: setShowOnlineStatus
        },
        {
          label: '最后上线时间',
          subtitle: '显示你最后上线的时间',
          value: showLastSeen,
          onChange: setShowLastSeen
        }
      ]
    },
    {
      title: '位置与活动',
      icon: MapPin,
      items: [
        {
          label: '位置分享',
          subtitle: '在帖子和活动中显示位置信息',
          value: locationSharing,
          onChange: setLocationSharing
        },
        {
          label: '活动参与可见性',
          subtitle: '允许他人看到你参与的活动',
          value: true,
          onChange: () => {}
        }
      ]
    },
    {
      title: '社交互动',
      icon: Users,
      items: [
        {
          label: '接受好友请求',
          subtitle: '允许其他用户发送好友请求',
          value: allowFriendRequests,
          onChange: setAllowFriendRequests
        },
        {
          label: '陌生人消息',
          subtitle: '允许非好友用户发送消息',
          value: allowMessagesFromStrangers,
          onChange: setAllowMessagesFromStrangers
        },
        {
          label: '允许被标记',
          subtitle: '允许他人在帖子中标记你',
          value: allowTagging,
          onChange: setAllowTagging
        }
      ]
    },
    {
      title: '内容分享',
      icon: Camera,
      items: [
        {
          label: '照片分享权限',
          subtitle: '控制照片的分享和可见性',
          value: allowPhotoSharing,
          onChange: setAllowPhotoSharing
        },
        {
          label: '帖子可见性',
          subtitle: '设置默认的帖子可见范围',
          value: true,
          onChange: () => {}
        }
      ]
    }
  ];

  const securityFeatures = [
    {
      title: '两步验证',
      description: '为你的账户添加额外的安全保护',
      enabled: twoFactorAuth,
      onToggle: setTwoFactorAuth,
      icon: Shield,
      status: twoFactorAuth ? '已启用' : '未启用'
    },
    {
      title: '登录提醒',
      description: '在新设备登录时发送通知',
      enabled: loginAlerts,
      onToggle: setLoginAlerts,
      icon: AlertTriangle,
      status: loginAlerts ? '已启用' : '未启用'
    },
    {
      title: '数据导出',
      description: '允许导出你的个人数据',
      enabled: dataExport,
      onToggle: setDataExport,
      icon: CheckCircle,
      status: dataExport ? '已启用' : '未启用'
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
          <h1 className="text-xl font-semibold text-gray-900">🛡️ 隱私與安全</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 隐私设置 */}
          {privacySections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <div key={sectionIndex}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <IconComponent className="w-5 h-5 text-yellow-600 mr-2" />
                  {section.title}
                </h2>
                <Card className="bg-white border border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="p-4">
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
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}

          {/* 安全功能 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 text-yellow-600 mr-2" />
              安全功能
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                {securityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <IconComponent className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{feature.title}</div>
                            <div className="text-sm text-gray-500 mt-1">{feature.description}</div>
                            <div className="text-xs text-gray-400 mt-1">状态: {feature.status}</div>
                          </div>
                        </div>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={feature.onToggle}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 隐私控制 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Eye className="w-5 h-5 text-yellow-600 mr-2" />
              隐私控制
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <User className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">管理好友列表</div>
                        <div className="text-sm text-gray-500">查看和管理你的好友关系</div>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                  </button>
                </div>
                <div className="p-4">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <EyeOff className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">屏蔽用户</div>
                        <div className="text-sm text-gray-500">管理被屏蔽的用户列表</div>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                  </button>
                </div>
                <div className="p-4">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Globe className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">数据使用权限</div>
                        <div className="text-sm text-gray-500">管理应用如何使用你的数据</div>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* 隐私提示 */}
          <div>
            <Card className="bg-blue-50 border border-blue-200">
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">隐私保护提示</div>
                    <div className="text-sm text-blue-700 mt-1">
                      我们重视你的隐私。所有设置都会立即生效，你可以随时更改这些选项。
                      我们不会与第三方分享你的个人信息，除非你明确同意。
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
