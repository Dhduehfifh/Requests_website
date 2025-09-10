//猜你喜欢
//TODO：以推荐算法为标准search，两个api，参数为type,返回不同帖子
import { Heart, TrendingUp, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { listPosts, likePost, unlikePost, getPostLikes, type ForumPost } from '../lib/api';
import { HapticsService } from '../lib/haptics';
import { EnhancedTextRenderer } from '../lib/linkRenderer';
import { useAuth } from '../contexts/AuthContext';
import { PostDetailScreen } from './PostDetailScreen';

// Helper function to get module info based on post type
function getModuleInfo(postType: string) {
  switch (postType) {
    case 'market':
      return { name: '二手市場', color: 'bg-green-500' };
    case 'housing':
      return { name: '租房', color: 'bg-blue-500' };
    case 'lfg':
      return { name: '活動聚會', color: 'bg-orange-500' };
    default:
      return { name: '一般討論', color: 'bg-gray-500' };
  }
}

// Helper function to format time
function formatTimeAgo(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return '剛剛';
  if (diffInHours < 24) return `${diffInHours}小時前`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}天前`;
  return `${Math.floor(diffInDays / 7)}週前`;
}

const categories = [
  { name: '熱門', icon: TrendingUp, active: true },
  { name: '最新', icon: Clock, active: false },
  { name: '精選', icon: Heart, active: false }
];

interface PostWithLikes extends ForumPost {
  likes: number;
  liked: boolean;
}

export function ForYouScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithLikes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('熱門');

  useEffect(() => {
    loadPosts();
  }, [activeCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Trigger haptics on native
      await HapticsService.impactLight();
      const postsData = await listPosts({
        limit: 20,
        order: activeCategory === '最新' ? 'created_at' : 'created_at',
        dir: 'desc',
        status: 'active'
      });
      
      // Load likes for each post
      const postsWithLikes = await Promise.all(
        postsData.map(async (post) => {
          try {
            const likesData = await getPostLikes(post.id);
            return {
              ...post,
              likes: likesData.count,
              liked: likesData.liked
            };
          } catch (error) {
            console.warn(`Failed to load likes for post ${post.id}:`, error);
            return {
              ...post,
              likes: 0,
              liked: false
            };
          }
        })
      );
      
      setPosts(postsWithLikes);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('載入推薦內容失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    // Trigger haptics on native
    await HapticsService.impactLight();
    setActiveCategory(category);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    try {
      // Trigger haptics on native
      await HapticsService.impactLight();
      
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      let result;
      if (post.liked) {
        result = await unlikePost(postId);
      } else {
        result = await likePost(postId);
      }
      
      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, liked: result.liked, likes: result.count }
          : p
      ));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (selectedPostId) {
    return (
      <PostDetailScreen
        postId={selectedPostId}
        onBack={() => setSelectedPostId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          🧀 猜你喜歡
        </h1>
        <p className="text-gray-500">為你精心推薦</p>
      </div>

      {/* Category filters */}
      <div className="bg-white px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={loadPosts}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              重試
            </button>
          </div>
        )}
        
        {loading && !error ? (
          <div className="p-4 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
              <span className="text-sm ml-2">正在載入推薦內容...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {posts.map((post) => {
              const moduleInfo = getModuleInfo(post.post_type);
              const timeAgo = formatTimeAgo(post.created_at);
              const hasImages = post.images && post.images.length > 0;
              const imageUrl = hasImages ? post.images[0] : `https://via.placeholder.com/400x200?text=${encodeURIComponent(post.title)}`;
              
              return (
                <Card 
                  key={post.id} 
                  className="bg-white border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Module badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${moduleInfo.color}`}>
                        {moduleInfo.name}
                      </span>
                    </div>

                    {/* Trending badge - show for recent posts */}
                    {new Date(post.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center space-x-1 bg-yellow-500 text-white px-2 py-1 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs font-medium">熱門</span>
                        </div>
                      </div>
                    )}

                    {/* Overlay content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg mb-2 overflow-hidden">
                          <div className="line-clamp-2">{post.title}</div>
                        </h3>
                        <div className="flex items-center justify-between text-white/90 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(post.id);
                            }}
                            className={`flex items-center space-x-1 ${
                              post.liked ? 'text-red-400' : 'text-white/90'
                            }`}
                            disabled={!user}
                          >
                            <Heart className={`w-3 h-3 ${post.liked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content with link rendering */}
                  <div className="p-4">
                    <EnhancedTextRenderer 
                      text={post.content} 
                      className="text-sm text-gray-700"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {!loading && !error && (
          <div className="p-4 text-center">
            <button 
              onClick={loadPosts}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              載入更多推薦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}