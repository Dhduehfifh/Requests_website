import React, { useState } from 'react';
import { Settings, Bell, Heart, MessageSquare, Home, ShoppingBag, Calendar, Edit3, Share, LogOut, Car, MapPin, Clock, Users, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { EditProfileScreen } from './EditProfileScreen';
import { MyFavoritesScreen } from './MyFavoritesScreen';
import { InviteFriendsScreen } from './InviteFriendsScreen';
import { useAuth } from '../contexts/AuthContext';

const stats = [
  { label: '貼文', value: 23, color: 'text-yellow-500' },
  { label: '讚', value: 156, color: 'text-yellow-600' },
  { label: '粉絲', value: 89, color: 'text-yellow-400' },
  { label: '追蹤', value: 67, color: 'text-yellow-700' }
];

const activities = [
  { icon: Home, label: '租房貼文', count: 8, color: 'bg-yellow-50 text-yellow-600' },
  { icon: ShoppingBag, label: '二手貼文', count: 12, color: 'bg-yellow-50 text-yellow-600' },
  { icon: Calendar, label: '參與活動', count: 15, color: 'bg-yellow-50 text-yellow-600' },
  { icon: MessageSquare, label: '告白貼文', count: 3, color: 'bg-yellow-50 text-yellow-600' }
];

// 假帖子数据
const mockPosts = [
  {
    id: 1,
    type: 'carpool',
    title: '哈密尔顿 → 多伦多 拼车',
    description: '每周五下午5点出发，从哈密尔顿到多伦多市中心，还有2个座位',
    route: '哈密尔顿 → 多伦多',
    departure: '2024-09-13 17:00',
    seats: 2,
    price: '$15',
    author: 'John Doe',
    likes: 12,
    comments: 5,
    saved: true,
    date: '2024-09-08'
  },
  {
    id: 2,
    type: 'event',
    title: '多伦多大学新生欢迎会',
    description: '欢迎新同学加入我们的大家庭！有免费食物和精彩表演',
    location: '多伦多大学主校区',
    date: '2024-09-15 18:00',
    attendees: 156,
    maxAttendees: 200,
    author: '学生会',
    likes: 45,
    comments: 23,
    saved: true,
    postDate: '2024-09-08'
  },
  {
    id: 3,
    type: 'carpool',
    title: '多伦多 → 哈密尔顿 拼车',
    description: '周日下午3点返回哈密尔顿，舒适SUV，经验丰富司机',
    route: '多伦多 → 哈密尔顿',
    departure: '2024-09-14 15:00',
    seats: 3,
    price: '$12',
    author: 'Sarah Chen',
    likes: 8,
    comments: 3,
    saved: false,
    date: '2024-09-07'
  },
  {
    id: 4,
    type: 'event',
    title: '编程学习小组聚会',
    description: '一起学习编程，分享经验，欢迎所有水平的学生参加',
    location: '图书馆学习室',
    date: '2024-09-20 19:00',
    attendees: 45,
    maxAttendees: 50,
    author: '计算机科学系',
    likes: 28,
    comments: 15,
    saved: true,
    postDate: '2024-09-06'
  },
  {
    id: 5,
    type: 'carpool',
    title: '哈密尔顿 → 尼亚加拉瀑布',
    description: '周末一日游拼车，早上8点出发，晚上6点返回',
    route: '哈密尔顿 → 尼亚加拉瀑布',
    departure: '2024-09-21 08:00',
    seats: 1,
    price: '$25',
    author: 'Mike Zhang',
    likes: 15,
    comments: 7,
    saved: true,
    date: '2024-09-05'
  },
    {
      id: 6,
      type: 'event',
      title: '国际学生文化交流节',
      description: '展示各国文化，品尝美食，结交新朋友',
      location: '学生活动中心',
      date: '2024-09-22 14:00',
      attendees: 89,
      maxAttendees: 150,
      author: '国际学生协会',
      likes: 67,
      comments: 34,
      saved: false,
      postDate: '2024-09-04'
    },
    {
      id: 7,
      type: 'carpool',
      title: '哈密尔顿 → 渥太华 拼车',
      description: '周末去渥太华看枫叶，早上7点出发，晚上8点返回',
      route: '哈密尔顿 → 渥太华',
      departure: '2024-09-28 07:00',
      seats: 2,
      price: '$35',
      author: 'Tom Wilson',
      likes: 23,
      comments: 8,
      saved: true,
      date: '2024-09-03'
    },
    {
      id: 8,
      type: 'event',
      title: '万圣节化妆舞会',
      description: '穿上你最酷的万圣节服装，一起狂欢！',
      location: '学生会大厅',
      date: '2024-10-31 20:00',
      attendees: 234,
      maxAttendees: 300,
      author: '活动委员会',
      likes: 89,
      comments: 45,
      saved: true,
      postDate: '2024-09-02'
    },
    {
      id: 9,
      type: 'carpool',
      title: '多伦多 → 尼亚加拉瀑布 一日游',
      description: '周末一日游拼车，包含门票，经验丰富导游',
      route: '多伦多 → 尼亚加拉瀑布',
      departure: '2024-09-29 08:30',
      seats: 1,
      price: '$45',
      author: 'Lisa Chen',
      likes: 34,
      comments: 12,
      saved: false,
      date: '2024-09-01'
    },
    {
      id: 10,
      type: 'event',
      title: '编程马拉松比赛',
      description: '24小时编程挑战，丰厚奖品等你来拿！',
      location: '计算机科学楼',
      date: '2024-10-05 09:00',
      attendees: 67,
      maxAttendees: 100,
      author: 'CS学生会',
      likes: 156,
      comments: 78,
      saved: true,
      postDate: '2024-08-30'
    },
    {
      id: 11,
      type: 'carpool',
      title: '哈密尔顿 → 温哥华 拼车',
      description: '跨省旅行，沿途欣赏风景，舒适商务车',
      route: '哈密尔顿 → 温哥华',
      departure: '2024-10-10 06:00',
      seats: 3,
      price: '$120',
      author: 'David Kim',
      likes: 45,
      comments: 19,
      saved: false,
      date: '2024-08-28'
    },
    {
      id: 12,
      type: 'event',
      title: '感恩节聚餐活动',
      description: '大家一起做感恩节大餐，分享美食和故事',
      location: '国际学生宿舍',
      date: '2024-10-14 17:00',
      attendees: 45,
      maxAttendees: 60,
      author: '宿舍管理委员会',
      likes: 78,
      comments: 34,
      saved: true,
      postDate: '2024-08-25'
    }
];

const menuItems = [
  { icon: Edit3, label: '編輯個人資料', subtitle: '更新你的資訊', action: 'edit-profile' },
  { icon: Bell, label: '通知設定', subtitle: '管理你的提醒', action: 'notifications' },
  { icon: Bookmark, label: '我的收藏', subtitle: '你收藏的貼文', action: 'favorites' },
  { icon: Share, label: '邀請朋友', subtitle: '分享應用給朋友', action: 'invite-friends' },
  { icon: Settings, label: '設定', subtitle: '隱私和偏好設定', action: 'settings' }
];

interface ProfileScreenProps {
  onSettingsClick?: () => void;
}

export function ProfileScreen({ onSettingsClick }: ProfileScreenProps) {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('main');
  const [savedRoutes, setSavedRoutes] = useState([
    { id: 1, route: '哈密尔顿 → 多伦多', frequency: '每周五', time: '17:00', price: '$15' },
    { id: 2, route: '多伦多 → 哈密尔顿', frequency: '每周日', time: '15:00', price: '$12' }
  ]);
  const [savedPosts, setSavedPosts] = useState(mockPosts.filter(post => post.saved));

  const handleMenuClick = (action: string) => {
    if (action === 'settings') {
      onSettingsClick?.();
    } else {
      setCurrentView(action);
    }
  };

  const handleSavePost = (postId: number) => {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      const isCurrentlySaved = savedPosts.some(p => p.id === postId);
      if (isCurrentlySaved) {
        setSavedPosts(prev => prev.filter(p => p.id !== postId));
      } else {
        setSavedPosts(prev => [...prev, { ...post, saved: true }]);
      }
    }
  };

  const handleSaveRoute = (route: string, frequency: string, time: string, price: string) => {
    const newRoute = {
      id: Date.now(),
      route,
      frequency,
      time,
      price
    };
    setSavedRoutes(prev => [...prev, newRoute]);
  };

  // 渲染不同的页面
  if (currentView === 'edit-profile') {
    return <EditProfileScreen onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'favorites') {
    return <MyFavoritesScreen onBack={() => setCurrentView('main')} savedPosts={savedPosts} />;
  }
  
  if (currentView === 'invite-friends') {
    return <InviteFriendsScreen onBack={() => setCurrentView('main')} />;
  }

  // 如果用户未登录，显示登录提示
  if (!user) {
    return (
      <div className="flex flex-col h-full bg-gray-50 items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 cheese-gradient rounded-full flex items-center justify-center cheese-hole mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            请先登录
          </h2>
          <p className="text-gray-600 mb-6">
            登录后可以查看个人资料、管理设置等
          </p>
          <Button 
            onClick={() => window.location.reload()} // 触发登录模态框
            className="cheese-gradient text-white border-0 hover:opacity-90"
          >
            立即登录
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            🧀 我的 Profile
          </h1>
          <button 
            onClick={onSettingsClick}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile info */}
        <Card className="bg-white mx-4 mt-4 shadow-sm border-0">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 cheese-gradient rounded-full flex items-center justify-center cheese-hole">
                <span className="text-2xl font-semibold text-white">JD</span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user.username}
                </h2>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className="text-sm text-gray-500">
                  📍 {user.city || 'Unknown'} • Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-lg font-semibold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <Button 
                onClick={() => setCurrentView('edit-profile')}
                className="flex-1 cheese-gradient text-white border-0 hover:opacity-90"
              >
                Edit Profile
              </Button>
              <Button variant="outline" className="flex-1 border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                Share Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Activity summary */}
        <Card className="bg-white mx-4 mt-4 shadow-sm border-0">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Your Activity</h3>
            <div className="space-y-3">
              {activities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.label} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">{activity.label}</span>
                    </div>
                    <span className="text-sm text-gray-600">{activity.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Recent Posts */}
        <Card className="bg-white mx-4 mt-4 shadow-sm border-0">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Posts</h3>
            <div className="space-y-4">
              {mockPosts.slice(0, 6).map((post) => (
                <div key={post.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {post.type === 'carpool' ? (
                        <Car className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Calendar className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">{post.title}</span>
                    </div>
                    <button
                      onClick={() => handleSavePost(post.id)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      {savedPosts.some(p => p.id === post.id) ? (
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      ) : (
                        <Heart className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                  
                  {post.type === 'carpool' ? (
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {post.route}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.departure}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {post.seats} seats
                      </div>
                      <span className="font-medium text-green-600">{post.price}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {post.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {post.attendees}/{post.maxAttendees}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Saved Routes */}
        <Card className="bg-white mx-4 mt-4 shadow-sm border-0">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Saved Routes</h3>
            <div className="space-y-3">
              {savedRoutes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Car className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">{route.route}</div>
                      <div className="text-sm text-gray-500">{route.frequency} {route.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{route.price}</div>
                    <Button size="sm" variant="outline" className="mt-1">
                      Reuse
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Menu items */}
        <Card className="bg-white mx-4 mt-4 shadow-sm border-0">
          <div className="p-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.label}>
                    <button 
                      onClick={() => handleMenuClick(item.action)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <IconComponent className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-600">{item.subtitle}</div>
                      </div>
                    </button>
                    {index < menuItems.length - 1 && (
                      <Separator className="my-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Recent badges */}
        <Card className="bg-white mx-4 mt-4 shadow-sm border-0">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Achievements</h3>
            <div className="flex space-x-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg">🏆</span>
                </div>
                <span className="text-xs text-gray-600">Top Poster</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg">🤝</span>
                </div>
                <span className="text-xs text-gray-600">Helpful</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg">⭐</span>
                </div>
                <span className="text-xs text-gray-600">Trusted</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Sign out */}
        <div className="p-4 mt-4">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}