import { ArrowLeft, Share2, Copy, Mail, MessageSquare, QrCode, Users, Gift, Star, CheckCircle, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface InviteFriendsScreenProps {
  onBack: () => void;
}

export function InviteFriendsScreen({ onBack }: InviteFriendsScreenProps) {
  const [copied, setCopied] = useState(false);
  const [inviteCode] = useState('CHEESE2024');
  const [inviteLink] = useState('https://cheese-app.com/invite/CHEESE2024');

  const inviteMethods = [
    {
      title: '分享链接',
      description: '通过链接邀请朋友',
      icon: Share2,
      action: '分享链接',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: '邀请码',
      description: '使用邀请码邀请朋友',
      icon: Copy,
      action: '复制邀请码',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: '二维码',
      description: '扫描二维码加入',
      icon: QrCode,
      action: '生成二维码',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: '邮件邀请',
      description: '通过邮件发送邀请',
      icon: Mail,
      action: '发送邮件',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: '短信邀请',
      description: '通过短信发送邀请',
      icon: MessageSquare,
      action: '发送短信',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  const rewards = [
    {
      title: '邀请奖励',
      description: '每成功邀请一位朋友',
      reward: '获得 100 奶酪币',
      icon: Gift,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: '好友奖励',
      description: '被邀请的朋友',
      reward: '获得 50 奶酪币',
      icon: Star,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: '连续邀请',
      description: '连续邀请 5 位朋友',
      reward: '获得 500 奶酪币',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    }
  ];

  const recentInvites = [
    {
      name: '李小明',
      status: '已加入',
      date: '2024-09-08',
      reward: '100 奶酪币'
    },
    {
      name: '王小红',
      status: '已注册',
      date: '2024-09-07',
      reward: '100 奶酪币'
    },
    {
      name: '张小华',
      status: '待加入',
      date: '2024-09-06',
      reward: '待获得'
    }
  ];

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">👥 邀請朋友</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 邀请统计 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 text-yellow-600 mr-2" />
              邀请统计
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-500">已邀请</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-500">已加入</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">800</div>
                    <div className="text-sm text-gray-500">获得奖励</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 邀请方式 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Share2 className="w-5 h-5 text-yellow-600 mr-2" />
              邀请方式
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {inviteMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <Card key={index} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${method.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{method.title}</div>
                            <div className="text-sm text-gray-500">{method.description}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          {method.action}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 邀请码和链接 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Copy className="w-5 h-5 text-yellow-600 mr-2" />
              我的邀请信息
            </h2>
            <div className="space-y-3">
              <Card className="bg-white border border-gray-200">
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邀请码
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm">
                          {inviteCode}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCopyInviteCode}
                        >
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邀请链接
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 truncate">
                          {inviteLink}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCopyInviteLink}
                        >
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 邀请奖励 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Gift className="w-5 h-5 text-yellow-600 mr-2" />
              邀请奖励
            </h2>
            <div className="space-y-3">
              {rewards.map((reward, index) => {
                const IconComponent = reward.icon;
                return (
                  <Card key={index} className="bg-white border border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${reward.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{reward.title}</div>
                          <div className="text-sm text-gray-500">{reward.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-yellow-600">{reward.reward}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 最近邀请 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 text-yellow-600 mr-2" />
              最近邀请
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                {recentInvites.map((invite, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {invite.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{invite.name}</div>
                          <div className="text-sm text-gray-500">{invite.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          invite.status === '已加入' ? 'text-green-600' : 
                          invite.status === '已注册' ? 'text-blue-600' : 
                          'text-gray-500'
                        }`}>
                          {invite.status}
                        </div>
                        <div className="text-xs text-gray-500">{invite.reward}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 邀请规则 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Star className="w-5 h-5 text-yellow-600 mr-2" />
              邀请规则
            </h2>
            <Card className="bg-blue-50 border border-blue-200">
              <div className="p-4">
                <div className="space-y-2 text-sm text-blue-800">
                  <div>• 每位用户只能使用一次邀请码</div>
                  <div>• 被邀请用户需要完成注册才能获得奖励</div>
                  <div>• 邀请奖励将在被邀请用户首次登录后发放</div>
                  <div>• 禁止恶意刷邀请，违者将取消奖励资格</div>
                  <div>• 邀请链接和邀请码长期有效</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
