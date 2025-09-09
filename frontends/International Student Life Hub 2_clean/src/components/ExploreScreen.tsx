//广场
//TODO：热门状态栏集合渲染，使用oneclick
import { TrendingUp, Users } from 'lucide-react';
import { Card } from './ui/card';
import { ModuleType } from '../App';
import { PostDetailScreen } from './PostDetailScreen';
import { useState } from 'react';

interface ExploreScreenProps {
  onModuleSelect: (module: ModuleType) => void;
}

const modules = [
  {
    id: 'rent' as ModuleType,
    title: '租房',
    subtitle: '找到理想住所',
    emoji: '🏠'
  },
  {
    id: 'secondhand' as ModuleType,
    title: '二手市場',
    subtitle: '買賣閒置好物',
    emoji: '🛍️'
  },
  {
    id: 'events' as ModuleType,
    title: '組隊活動',
    subtitle: '一起參與有趣活動',
    emoji: '⚡'
  },
  {
    id: 'rideshare' as ModuleType,
    title: '拼車出行',
    subtitle: '共享出行更便宜',
    emoji: '🚗'
  },
  {
    id: 'forum' as ModuleType,
    title: '校園論壇',
    subtitle: '交流學習生活',
    emoji: '💬'
  },
  {
    id: 'gossip' as ModuleType,
    title: '匿名告白',
    subtitle: '分享內心話',
    emoji: '💕'
  }
];

export function ExploreScreen({ onModuleSelect }: ExploreScreenProps) {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handlePostClick = (post: any) => {
    const postDetail = {
      id: post.id,
      title: post.title,
      content: post.subtitle,
      author: '用戶',
      avatar: '用',
      time: '2小時前',
      likes: post.likes,
      comments: post.comments,
      category: post.category,
      categoryColor: 'bg-orange-500'
    };
    setSelectedPost(postDetail);
  };

  const handleBackToExplore = () => {
    setSelectedPost(null);
  };

  if (selectedPost) {
    return <PostDetailScreen post={selectedPost} onBack={handleBackToExplore} />;
  }
  const quickStats = [
    { label: '今日新貼', value: '124', icon: TrendingUp },
    { label: '活躍用戶', value: '1.2k', icon: Users }
  ];
  //这个删掉变成banner

  const trendingPosts = [
    { 
      id: 1, 
      title: '英雄聯盟 五排組隊', 
      subtitle: '3/5 還缺2位 週六晚上8點', 
      category: '⚡', 
      likes: 89, 
      comments: 23
    },
    { 
      id: 2, 
      title: '拼車回家 北京→天津', 
      subtitle: '2/4 本週五下午出發', 
      category: '🚗', 
      likes: 45, 
      comments: 12
    },
    { 
      id: 3, 
      title: 'MacBook Pro 13寸', 
      subtitle: '九成新 附送鍵盤保護膜', 
      category: '🛍️', 
      likes: 156, 
      comments: 67
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">🧀 奶酪廣場</h1>
            <p className="text-gray-500 text-sm mt-1">留學生生活入口</p>
          </div>
          <div className="w-10 h-10 cheese-gradient rounded-full flex items-center justify-center cheese-hole">
            <span className="text-white text-sm font-medium">你</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex p-2 rounded-lg bg-gray-50 mb-2">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modules Section */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">探索服務</h2>
        <div className="grid grid-cols-2 gap-3">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-200 bg-white"
              onClick={() => onModuleSelect(module.id)}
            >
              <div className="p-4 h-20 flex items-center">
                {/* Emoji */}
                <span className="text-2xl mr-3 flex-shrink-0">{module.emoji}</span>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                    {module.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-1">
                    {module.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速開始</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium mb-1 text-gray-900">發布動態</div>
            <div className="text-xs text-gray-500">分享你的生活</div>
          </Card>
          <Card className="border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium mb-1 text-gray-900">尋找室友</div>
            <div className="text-xs text-gray-500">找到完美室友</div>
          </Card>
        </div>
      </div>

      {/* Trending Section */}
      <div className="px-6 py-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">熱門動態</h2>
          <button className="text-gray-500 text-sm">查看全部</button>
        </div>

        <div className="space-y-3">
          {trendingPosts.map((post) => (
            <Card 
              key={post.id} 
              className="border border-gray-200 bg-white p-4 cursor-pointer hover:border-orange-300 transition-colors"
              onClick={() => handlePostClick(post)}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0">{post.category}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{post.subtitle}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}