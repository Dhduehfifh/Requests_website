//广场
//TODO：热门状态栏集合渲染，使用oneclick
import { TrendingUp, Users } from 'lucide-react';
import { Card } from './ui/card';
import { ModuleType } from '../App';
import { PostDetailScreen } from './PostDetailScreen';
import { useState, useEffect } from 'react';
import { listPosts, type ForumPost } from '../lib/api';
import { HapticsService } from '../lib/haptics';
import { EnhancedTextRenderer } from '../lib/linkRenderer';

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
  const [trendingPosts, setTrendingPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todayPosts: 0, activeUsers: 0 });

  useEffect(() => {
    loadTrendingPosts();
  }, []);

  const loadTrendingPosts = async () => {
    try {
      setLoading(true);
      // Trigger haptics on native
      await HapticsService.impactLight();
      const posts = await listPosts({
        limit: 6,
        order: 'created_at',
        dir: 'desc',
        status: 'active'
      });
      
      setTrendingPosts(posts);
      
      // Calculate stats (simplified for MVP)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayPosts = posts.filter(post => 
        new Date(post.created_at) >= today
      ).length;
      
      setStats({
        todayPosts,
        activeUsers: Math.floor(Math.random() * 1000) + 500 // Mock data
      });
    } catch (error) {
      console.error('Failed to load trending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (post: ForumPost) => {
    // Trigger haptics on native
    await HapticsService.impactLight();
    const postDetail = {
      id: post.id,
      title: post.title,
      content: post.content,
      author: '用戶',
      avatar: '用',
      time: formatTimeAgo(post.created_at),
      likes: 0, // TODO: implement likes system
      comments: 0, // TODO: implement comments system
      category: getCategoryEmoji(post.post_type),
      categoryColor: getCategoryColor(post.post_type)
    };
    setSelectedPost(postDetail);
  };

  const handleBackToExplore = () => {
    setSelectedPost(null);
  };

  const formatTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '剛剛';
    if (diffInHours < 24) return `${diffInHours}小時前`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}天前`;
    return `${Math.floor(diffInDays / 7)}週前`;
  };

  const getCategoryEmoji = (postType: string): string => {
    switch (postType) {
      case 'market': return '🛍️';
      case 'housing': return '🏠';
      case 'lfg': return '⚡';
      default: return '💬';
    }
  };

  const getCategoryColor = (postType: string): string => {
    switch (postType) {
      case 'market': return 'bg-green-500';
      case 'housing': return 'bg-blue-500';
      case 'lfg': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (selectedPost) {
    return <PostDetailScreen post={selectedPost} onBack={handleBackToExplore} />;
  }

  const quickStats = [
    { label: '今日新貼', value: stats.todayPosts.toString(), icon: TrendingUp },
    { label: '活躍用戶', value: `${Math.floor(stats.activeUsers / 100) / 10}k`, icon: Users }
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
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                <span className="text-sm ml-2">載入中...</span>
              </div>
            </div>
          ) : trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <Card 
                key={post.id} 
                className="border border-gray-200 bg-white p-4 cursor-pointer hover:border-orange-300 transition-colors"
                onClick={() => handlePostClick(post)}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg flex-shrink-0">{getCategoryEmoji(post.post_type)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {post.title}
                    </h3>
                    <div className="text-xs text-gray-500 mb-2">
                      <EnhancedTextRenderer 
                        text={post.content} 
                        className="line-clamp-2"
                      />
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>👍 0</span>
                      <span>💬 0</span>
                      <span>{formatTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>暫無熱門動態</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}