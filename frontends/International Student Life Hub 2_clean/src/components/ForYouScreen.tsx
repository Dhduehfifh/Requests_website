import { Heart, TrendingUp, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

const recommendedPosts = [
  {
    id: 1,
    title: '校園附近最棒的咖啡店推薦 ☕',
    module: '活動聚會',
    moduleColor: 'bg-orange-500',
    image: 'coffee shop students',
    time: '1小時前',
    likes: 234,
    trending: true
  },
  {
    id: 2,
    title: '宿舍必備家具 - 價格實惠質量好',
    module: '二手市場',
    moduleColor: 'bg-green-500',
    image: 'dorm room furniture',
    time: '3小時前',
    likes: 89,
    trending: false
  },
  {
    id: 3,
    title: '尋找室友 - 愛乾淨安靜的小夥伴',
    module: '租房',
    moduleColor: 'bg-blue-500',
    image: 'clean student apartment',
    time: '5小時前',
    likes: 156,
    trending: true
  },
  {
    id: 4,
    title: '深夜學習的心聲與告白 📚',
    module: '匿名告白',
    moduleColor: 'bg-pink-500',
    image: 'library night study',
    time: '2小時前',
    likes: 298,
    trending: false
  }
];

const categories = [
  { name: '熱門', icon: TrendingUp, active: true },
  { name: '最新', icon: Clock, active: false },
  { name: '精選', icon: Heart, active: false }
];

export function ForYouScreen() {
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
            return (
              <button
                key={category.name}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category.active
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
        <div className="space-y-4 p-4">
          {recommendedPosts.map((post) => (
            <Card key={post.id} className="bg-white border border-gray-200 overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={`https://via.placeholder.com/400x200`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* Module badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${post.moduleColor}`}>
                    {post.module}
                  </span>
                </div>

                {/* Trending badge */}
                {post.trending && (
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
                        <span>{post.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load more */}
        <div className="p-4 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
            <span className="text-sm ml-2">正在載入更多推薦...</span>
          </div>
        </div>
      </div>
    </div>
  );
}