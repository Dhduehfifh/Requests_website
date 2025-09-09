import { ArrowLeft, User, Lock, Mail, Phone, MapPin, Calendar, Shield, Key, Trash2, Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useState } from 'react';

interface AccountSettingsProps {
  onBack: () => void;
}

export function AccountSettings({ onBack }: AccountSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const profileSections = [
    {
      title: '基本信息',
      icon: User,
      items: [
        {
          label: '头像',
          value: '当前头像',
          action: '更换',
          icon: User
        },
        {
          label: '姓名',
          value: '张三',
          action: '编辑',
          icon: User
        },
        {
          label: '用户名',
          value: '@zhangsan',
          action: '编辑',
          icon: User
        },
        {
          label: '个人简介',
          value: '国际学生，热爱生活',
          action: '编辑',
          icon: User
        }
      ]
    },
    {
      title: '联系方式',
      icon: Mail,
      items: [
        {
          label: '邮箱地址',
          value: 'zhangsan@example.com',
          action: '验证',
          icon: Mail,
          verified: true
        },
        {
          label: '手机号码',
          value: '+1 (555) 123-4567',
          action: '验证',
          icon: Phone,
          verified: false
        }
      ]
    },
    {
      title: '个人信息',
      icon: MapPin,
      items: [
        {
          label: '所在城市',
          value: '多伦多',
          action: '编辑',
          icon: MapPin
        },
        {
          label: '学校',
          value: '多伦多大学',
          action: '编辑',
          icon: MapPin
        },
        {
          label: '专业',
          value: '计算机科学',
          action: '编辑',
          icon: MapPin
        },
        {
          label: '生日',
          value: '1995年3月15日',
          action: '编辑',
          icon: Calendar
        }
      ]
    }
  ];

  const securityOptions = [
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
    }
  ];

  const accountActions = [
    {
      title: '更改密码',
      description: '更新你的登录密码',
      icon: Lock,
      action: '更改',
      type: 'button'
    },
    {
      title: '数据导出',
      description: '下载你的个人数据',
      icon: Download,
      action: '导出',
      type: 'button'
    },
    {
      title: '数据导入',
      description: '从其他平台导入数据',
      icon: Upload,
      action: '导入',
      type: 'button'
    },
    {
      title: '删除账户',
      description: '永久删除你的账户和所有数据',
      icon: Trash2,
      action: '删除',
      type: 'danger'
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
          <h1 className="text-xl font-semibold text-gray-900">👤 帳戶管理</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 个人资料设置 */}
          {profileSections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <div key={sectionIndex}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <IconComponent className="w-5 h-5 text-yellow-600 mr-2" />
                  {section.title}
                </h2>
                <Card className="bg-white border border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {section.items.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={itemIndex} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-yellow-100 rounded-lg">
                                <ItemIcon className="w-4 h-4 text-yellow-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.label}</div>
                                <div className="text-sm text-gray-500 mt-1">{item.value}</div>
                                {item.verified !== undefined && (
                                  <div className="flex items-center mt-1">
                                    {item.verified ? (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        <span className="text-xs">已验证</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-orange-600">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        <span className="text-xs">未验证</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              {item.action}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            );
          })}

          {/* 安全设置 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 text-yellow-600 mr-2" />
              安全设置
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                {securityOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <div key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <IconComponent className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.title}</div>
                            <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                            <div className="text-xs text-gray-400 mt-1">状态: {option.status}</div>
                          </div>
                        </div>
                        <Switch
                          checked={option.enabled}
                          onCheckedChange={option.onToggle}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 通知偏好 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="w-5 h-5 text-yellow-600 mr-2" />
              通知偏好
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">邮件通知</div>
                      <div className="text-sm text-gray-500 mt-1">通过邮件接收重要通知</div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">短信通知</div>
                      <div className="text-sm text-gray-500 mt-1">通过短信接收紧急通知</div>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 账户操作 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Key className="w-5 h-5 text-yellow-600 mr-2" />
              账户操作
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                {accountActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <div key={index} className="p-4">
                      <button className="w-full flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            action.type === 'danger' 
                              ? 'bg-red-100' 
                              : 'bg-yellow-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              action.type === 'danger' 
                                ? 'text-red-600' 
                                : 'text-yellow-600'
                            }`} />
                          </div>
                          <div className="text-left">
                            <div className={`font-medium ${
                              action.type === 'danger' 
                                ? 'text-red-600' 
                                : 'text-gray-900'
                            }`}>{action.title}</div>
                            <div className="text-sm text-gray-500">{action.description}</div>
                          </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 账户信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 text-yellow-600 mr-2" />
              账户信息
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">账户创建时间</span>
                  <span className="text-gray-900">2024年1月15日</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最后登录</span>
                  <span className="text-gray-900">2024年9月9日 12:07</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">账户状态</span>
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    正常
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">存储使用</span>
                  <span className="text-gray-900">2.3 GB / 10 GB</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
