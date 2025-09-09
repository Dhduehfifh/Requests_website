import { ArrowLeft, Bell, Volume2, VolumeX, Smartphone, Mail, MessageSquare, Calendar, Users, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useState } from 'react';

interface NotificationSettingsProps {
  onBack: () => void;
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [eventNotifications, setEventNotifications] = useState(true);
  const [friendRequestNotifications, setFriendRequestNotifications] = useState(true);
  const [likeNotifications, setLikeNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [quietStartTime, setQuietStartTime] = useState('22:00');
  const [quietEndTime, setQuietEndTime] = useState('08:00');

  const notificationTypes = [
    {
      title: '消息通知',
      icon: MessageSquare,
      items: [
        {
          label: '新消息提醒',
          subtitle: '收到新消息时推送通知',
          value: messageNotifications,
          onChange: setMessageNotifications
        },
        {
          label: '群组消息',
          subtitle: '群组中的新消息',
          value: messageNotifications,
          onChange: setMessageNotifications
        }
      ]
    },
    {
      title: '社交通知',
      icon: Users,
      items: [
        {
          label: '好友请求',
          subtitle: '收到新的好友请求',
          value: friendRequestNotifications,
          onChange: setFriendRequestNotifications
        },
        {
          label: '点赞通知',
          subtitle: '有人点赞你的帖子',
          value: likeNotifications,
          onChange: setLikeNotifications
        },
        {
          label: '评论通知',
          subtitle: '有人评论你的帖子',
          value: commentNotifications,
          onChange: setCommentNotifications
        }
      ]
    },
    {
      title: '活动通知',
      icon: Calendar,
      items: [
        {
          label: '活动提醒',
          subtitle: '即将开始的活动通知',
          value: eventNotifications,
          onChange: setEventNotifications
        },
        {
          label: '活动更新',
          subtitle: '活动信息变更通知',
          value: eventNotifications,
          onChange: setEventNotifications
        }
      ]
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
          <h1 className="text-xl font-semibold text-gray-900">🔔 通知設定</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 全局通知设置 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Bell className="w-5 h-5 text-yellow-600 mr-2" />
              全局通知
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">推送通知</div>
                      <div className="text-sm text-gray-500 mt-1">允许应用发送推送通知</div>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">声音提醒</div>
                      <div className="text-sm text-gray-500 mt-1">通知时播放提示音</div>
                    </div>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">震动提醒</div>
                      <div className="text-sm text-gray-500 mt-1">通知时震动设备</div>
                    </div>
                    <Switch
                      checked={vibrationEnabled}
                      onCheckedChange={setVibrationEnabled}
                    />
                  </div>
                </div>
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
              </div>
            </Card>
          </div>

          {/* 通知类型设置 */}
          {notificationTypes.map((type, typeIndex) => {
            const IconComponent = type.icon;
            return (
              <div key={typeIndex}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <IconComponent className="w-5 h-5 text-yellow-600 mr-2" />
                  {type.title}
                </h2>
                <Card className="bg-white border border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {type.items.map((item, itemIndex) => (
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

          {/* 免打扰时间 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <VolumeX className="w-5 h-5 text-yellow-600 mr-2" />
              免打扰时间
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="divide-y divide-gray-100">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">启用免打扰</div>
                      <div className="text-sm text-gray-500 mt-1">在指定时间内静音通知</div>
                    </div>
                    <Switch
                      checked={quietHours}
                      onCheckedChange={setQuietHours}
                    />
                  </div>
                </div>
                {quietHours && (
                  <>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">开始时间</div>
                          <div className="text-sm text-gray-500 mt-1">{quietStartTime}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          修改
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">结束时间</div>
                          <div className="text-sm text-gray-500 mt-1">{quietEndTime}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          修改
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* 通知预览 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Smartphone className="w-5 h-5 text-yellow-600 mr-2" />
              通知预览
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🧀</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">奶酪</div>
                      <div className="text-sm text-gray-600">你收到了一条新消息</div>
                    </div>
                    <div className="text-xs text-gray-500">刚刚</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  这是通知在锁屏上的显示效果预览
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
