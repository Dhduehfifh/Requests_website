//太好了，找到monk data变量名了，但是数据结构需要调整至带type的，当然可以写syntax
import { ArrowLeft, Search, Filter, MapPin, Clock, DollarSign, Users, MessageCircle as MessageIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ModuleType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PostDetailScreen } from './PostDetailScreen';
import { useState } from 'react';

interface ModuleFeedProps {
  module: ModuleType;
  onBack: () => void;
}

const moduleConfig = {
  rent: {
    title: '租房',
    subtitle: '找到理想住所',
    emoji: '🏠'
  },
  secondhand: {
    title: '二手市場',
    subtitle: '買賣閒置好物',
    emoji: '🛍️'
  },
  events: {
    title: '組隊活動',
    subtitle: '一起參與有趣活動',
    emoji: '⚡'
  },
  rideshare: {
    title: '拼車出行',
    subtitle: '共享出行更便宜',
    emoji: '🚗'
  },
  forum: {
    title: '校園論壇',
    subtitle: '交流學習生活',
    emoji: '💬'
  },
  gossip: {
    title: '匿名告白',
    subtitle: '分享內心話',
    emoji: '💕'
  }
};

const mockData = {
  rent: [
    {
      id: 1,
      title: '校園附近溫馨一居室',
      location: '市中心，步行5分鐘到大學',
      price: '¥2800/月',
      image: 'modern apartment interior',
      time: '2小時前',
      likes: 24,
      comments: 8,
      badge: '拎包入住'
    },
    {
      id: 2,
      title: '學生區合租兩居室',
      location: '學生區，地鐵直達校園',
      price: '¥1500/月',
      image: 'shared apartment room', 
      time: '5小時前',
      likes: 15,
      comments: 12,
      badge: '找室友'
    },
    {
      id: 3,
      title: '精裝公寓靠近圖書館',
      location: '大學城核心區域',
      price: '¥3200/月',
      image: 'modern apartment interior',
      time: '1天前',
      likes: 31,
      comments: 5,
      badge: '家具齊全'
    },
    {
      id: 4,
      title: '陽光充足單間出租',
      location: '校園西門500米',
      price: '¥2200/月',
      image: 'shared apartment room',
      time: '2天前', 
      likes: 18,
      comments: 9,
      badge: '採光好'
    }

  ],
  secondhand: [
    {
      id: 1,
      title: 'MacBook Pro 13寸',
      location: '校園區域',
      price: '¥8800',
      image: 'macbook laptop desk',
      time: '1小時前',
      likes: 32,
      comments: 6,
      badge: '九成新',
      originalPrice: '¥12800'
    },
    {
      id: 2,
      title: '生物化學教科書套裝',
      location: '圖書館附近',
      price: '¥280 整套',
      image: 'college textbooks stack',
      time: '3小時前',
      likes: 18,
      comments: 4,
      badge: '無筆記',
      originalPrice: '¥680'
    },
    {
      id: 3,
      title: 'iPhone 14 白色128G',
      location: '學生宿舍',
      price: '¥4200',
      image: 'smartphone on desk',
      time: '6小時前',
      likes: 45,
      comments: 12,
      badge: '含配件',
      originalPrice: '¥5999'
    },
    {
      id: 4,
      title: '自行車 九成新',
      location: '校園北門',
      price: '¥350',
      image: 'bicycle campus',
      time: '1天前',
      likes: 23,
      comments: 7,
      badge: '騎行少',
      originalPrice: '¥799'
    }
  ],
  events: [
    {
      id: 1,
      title: '英雄聯盟 五排組隊',
      location: '線上',
      current: 3,
      total: 5,
      time: '今晚 8:00 PM',
      likes: 89,
      comments: 23,
      rank: '黃金以上'
    },
    {
      id: 2,
      title: '王者榮耀 開黑組隊',
      location: '線上',
      current: 2,
      total: 5,
      time: '週六 2:00 PM', 
      likes: 67,
      comments: 18,
      rank: '鑽石段位'
    },
    {
      id: 3,
      title: '週末登山活動',
      location: '香山公園',
      current: 8,
      total: 15,
      time: '週日 6:00 AM',
      likes: 124,
      comments: 34,
      rank: '體力中等'
    }
  ],
  rideshare: [
    {
      id: 1,
      title: '北京 → 天津',
      location: '週五下午出發',
      current: 2,
      total: 4,
      time: '12月13日 3:00 PM',
      likes: 45,
      comments: 12,
      price: '¥80/人'
    },
    {
      id: 2, 
      title: '校園 → 機場',
      location: '首都機場T3',
      current: 1,
      total: 3,
      time: '明天 10:00 AM',
      likes: 23,
      comments: 6,
      price: '¥120/人'
    }
  ],
  forum: [
    {
      id: 1,
      title: '計算機專業選課建議',
      content: '下學期想選AI相關課程，有沒有學長學姐推薦一下？',
      time: '30分鐘前',
      likes: 56,
      comments: 34,
      category: '學習交流'
    },
    {
      id: 2,
      title: '校園生活小貼士分享',
      content: '整理了一些在校園生活的實用建議，希望對新同學有幫助',
      time: '2小時前',
      likes: 89,
      comments: 45,
      category: '生活分享'
    }
  ],
  gossip: [
    {
      id: 1,
      title: '告白：暗戀助教好久了',
      location: '匿名',
      time: '30分鐘前',
      likes: 89,
      comments: 34
    },
    {
      id: 2,
      title: '有人也會想家嗎？',
      location: '匿名',
      time: '1小時前',
      likes: 156,
      comments: 67
    }
  ]
};

export function ModuleFeed({ module, onBack }: ModuleFeedProps) {
  const config = moduleConfig[module];
  const posts = mockData[module];
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handlePostClick = (post: any) => {
    // Convert post to the format expected by PostDetailScreen based on category
    let postDetail;
    
    if (module === 'rent' || module === 'secondhand') {
      // Sales posts - show price, location, condition
      postDetail = {
        id: post.id,
        title: post.title,
        content: `${post.location}\n\n${post.badge ? `狀態: ${post.badge}` : ''}\n${post.originalPrice ? `原價: ${post.originalPrice}` : ''}`,
        author: '賣家',
        avatar: '賣',
        time: post.time,
        likes: post.likes,
        comments: post.comments,
        category: config.title,
        categoryColor: 'bg-yellow-500',
        images: [post.image],
        price: post.price,
        location: post.location,
        condition: post.badge
      };
    } else if (module === 'events' || module === 'rideshare') {
      // Team/group posts - show requirements, time, location
      postDetail = {
        id: post.id,
        title: post.title,
        content: `地點: ${post.location}\n時間: ${post.time}\n${post.rank ? `要求: ${post.rank}` : ''}\n${post.price ? `費用: ${post.price}` : ''}\n\n目前 ${post.current}/${post.total} 人參與`,
        author: '組織者',
        avatar: '組',
        time: post.time,
        likes: post.likes,
        comments: post.comments,
        category: config.title,
        categoryColor: 'bg-yellow-500',
        images: [post.image],
        current: post.current,
        total: post.total,
        requirements: post.rank,
        price: post.price
      };
    } else if (module === 'forum') {
      // Forum posts - show category, content
      postDetail = {
        id: post.id,
        title: post.title,
        content: post.content,
        author: '用戶',
        avatar: '用',
        time: post.time,
        likes: post.likes,
        comments: post.comments,
        category: post.category,
        categoryColor: 'bg-yellow-500',
        images: [post.image]
      };
    } else {
      // Default posts
      postDetail = {
        id: post.id,
        title: post.title,
        content: post.location || post.content || '這是一個很棒的分享！',
        author: '用戶',
        avatar: '用',
        time: post.time,
        likes: post.likes,
        comments: post.comments,
        category: config.title,
        categoryColor: 'bg-yellow-500',
        images: [post.image]
      };
    }
    
    setSelectedPost(postDetail);
  };

  const handleBackToFeed = () => {
    setSelectedPost(null);
  };

  if (selectedPost) {
    return <PostDetailScreen post={selectedPost} onBack={handleBackToFeed} />;
  }

  const renderSalesLayout = (posts: any[]) => (
    <div className="grid grid-cols-2 gap-3 p-4">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="bg-white border border-gray-200 overflow-hidden cursor-pointer hover:border-orange-300 transition-colors"
          onClick={() => handlePostClick(post)}
        >
          <div className="relative">
            <ImageWithFallback
              src={`https://via.placeholder.com/200x150`}
              alt={post.title}
              className="w-full h-32 object-cover"
            />
            {post.badge && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/80 text-white text-xs rounded">
                  {post.badge}
                </span>
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-500 font-semibold text-sm">{post.price}</span>
              {post.originalPrice && (
                <span className="text-gray-400 line-through text-xs">{post.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center text-gray-500 text-xs mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{post.location}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{post.time}</span>
              <div className="flex items-center space-x-2">
                <span>👍 {post.likes}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderTeamLayout = (posts: any[]) => (
    <div className="space-y-3 p-4">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="bg-white border border-gray-200 p-4 cursor-pointer hover:border-orange-300 transition-colors"
          onClick={() => handlePostClick(post)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{post.title}</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <Users className="w-4 h-4 text-gray-600 mr-1" />
                <span className="text-sm font-medium text-gray-900">
                  {post.current}/{post.total}
                </span>
              </div>
              <button 
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle join action
                  console.log('Join clicked for post:', post.id);
                }}
              >
                <span className="text-lg font-bold leading-none">+</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{post.location}</span>
            </div>
            {post.rank && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {post.rank}
              </span>
            )}
            {post.price && (
              <span className="text-green-600 font-medium text-sm">
                {post.price}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{post.time}</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <span>👍 {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderForumLayout = (posts: any[]) => (
    <div className="space-y-3 p-4">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="bg-white border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors"
          onClick={() => handlePostClick(post)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {post.category}
            </span>
            <span className="text-gray-500 text-xs">{post.time}</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <span>👍 {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>
            <Button size="sm" variant="outline" className="border-gray-200">
              查看詳情
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderDefaultLayout = (posts: any[]) => (
    <div className="space-y-3 p-4">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="bg-white border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors"
          onClick={() => handlePostClick(post)}
        >
          <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">{post.location}</span>
            <span className="text-gray-500 text-xs">{post.time}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <span>👍 {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>
            <Button size="sm" variant="outline" className="border-gray-200">
              回覆
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{config.title}</h1>
            <p className="text-sm text-gray-500">{config.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {(module === 'rent' || module === 'secondhand') && renderSalesLayout(posts)}
        {(module === 'events' || module === 'rideshare') && renderTeamLayout(posts)}
        {module === 'forum' && renderForumLayout(posts)}
        {module === 'gossip' && renderDefaultLayout(posts)}

        {/* Load more indicator */}
        <div className="p-4 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
            <span className="text-sm ml-2">正在載入更多...</span>
          </div>
        </div>
      </div>
    </div>
  );
}