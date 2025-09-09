import { Heart, TrendingUp, Clock, Users } from 'lucide-react';
import { Card } from './ui/card';

export function Home() {
  const trendingPosts = [
    { 
      id: 1, 
      title: '週末聚會: 國際學生交流活動', 
      category: '活動聚會', 
      likes: 89, 
      comments: 23,
      time: '2小時前',
      categoryColor: 'bg-orange-500'
    },
    { 
      id: 2, 
      title: '市中心一室一廳出租 - 拎包入住', 
      category: '租房', 
      likes: 156, 
      comments: 45,
      time: '4小時前',
      categoryColor: 'bg-blue-500'
    },
    { 
      id: 3, 
      title: 'MacBook Pro 13寸 - 九成新', 
      category: '二手市場', 
      likes: 67, 
      comments: 12,
      time: '6小時前',
      categoryColor: 'bg-green-500'
    }
  ];

  const quickStats = [
    { label: '今日新貼', value: '124', icon: TrendingUp, color: 'text-blue-500' },
    { label: '活躍用戶', value: '1.2k', icon: Users, color: 'text-green-500' },
    { label: '本週活動', value: '89', icon: Clock, color: 'text-orange-500' }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Welcome Header */}
      <div className="px-6 py-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">你好！👋</h1>
            <p className="text-gray-500 text-sm mt-1">歡迎回到留學生生活入口</p>
            {/**这里是啥我实在找不到了，似乎页面demo里面没有渲染这个东西 */}
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">你</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex p-2 rounded-lg bg-gray-50 mb-2`}>
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Section */}
      <div className="px-6 py-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">熱門動態</h2>
          <button className="text-blue-500 text-sm">查看全部</button>
        </div>

        <div className="space-y-3">
          {trendingPosts.map((post) => (
            <Card key={post.id} className="border-0 shadow-sm bg-white p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-1 h-12 rounded-full ${post.categoryColor} flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${post.categoryColor}`}>
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {post.likes}
                      </span>
                      <span>💬 {post.comments}</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速開始</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
              <div className="text-sm font-medium mb-1">發布動態</div>
              <div className="text-xs opacity-90">分享你的生活</div>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
              <div className="text-sm font-medium mb-1">尋找室友</div>
              <div className="text-xs opacity-90">找到完美室友</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}