//我的/我的收藏/
import { ArrowLeft, Heart, Search, Filter, Calendar, MapPin, Users, Clock, Star, MoreVertical, Share, Bookmark } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface MyFavoritesScreenProps {
  onBack: () => void;
  savedPosts?: any[];
}

export function MyFavoritesScreen({ onBack, savedPosts = [] }: MyFavoritesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', count: savedPosts.length },
    { id: 'events', name: '活动', count: savedPosts.filter(p => p.type === 'event').length },
    { id: 'carpool', name: '拼车', count: savedPosts.filter(p => p.type === 'carpool').length },
    { id: 'places', name: '地点', count: savedPosts.filter(p => p.type === 'place').length }
  ];

  // 使用传入的savedPosts数据，不再需要静态数据

  const filteredItems = savedPosts.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderEventItem = (item: any) => (
    <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">
            {item.type === 'carpool' ? '🚗' : '📅'}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                {item.type === 'carpool' ? (
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.route}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.departure}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {item.seats} seats
                    </div>
                    <span className="font-medium text-green-600">{item.price}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.date}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {item.attendees}/{item.maxAttendees}
                    </div>
                  </div>
                )}
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-400">
                收藏于 {item.date || item.postDate}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share className="w-3 h-3 mr-1" />
                  分享
                </Button>
                <Button variant="outline" size="sm" className="text-yellow-600 hover:text-yellow-700">
                  <Bookmark className="w-3 h-3 mr-1 fill-current" />
                  已收藏
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderPostItem = (item: any) => (
    <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{item.image}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {item.author}
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    {item.likes}个赞
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {item.comments}条评论
                  </div>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-400">
                收藏于 {item.savedDate}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share className="w-3 h-3 mr-1" />
                  分享
                </Button>
                <Button variant="outline" size="sm" className="text-yellow-600 hover:text-yellow-700">
                  <Bookmark className="w-3 h-3 mr-1 fill-current" />
                  已收藏
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderPlaceItem = (item: any) => (
    <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{item.image}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                    {item.rating}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {item.reviews}条评价
                  </div>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-400">
                收藏于 {item.savedDate}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share className="w-3 h-3 mr-1" />
                  分享
                </Button>
                <Button variant="outline" size="sm" className="text-yellow-600 hover:text-yellow-700">
                  <Bookmark className="w-3 h-3 mr-1 fill-current" />
                  已收藏
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">🔖 我的收藏</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索收藏内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {filteredItems.length === 0 ? (
            <Card className="bg-white border border-gray-200">
              <div className="p-8 text-center">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无收藏内容</h3>
                <p className="text-gray-500">
                  {searchQuery ? '没有找到匹配的收藏内容' : '你还没有收藏任何内容'}
                </p>
              </div>
            </Card>
          ) : (
            filteredItems.map((item) => {
              switch (item.type) {
                case 'event':
                  return renderEventItem(item);
                case 'carpool':
                  return renderEventItem(item); // 使用相同的事件渲染器
                case 'post':
                  return renderPostItem(item);
                case 'place':
                  return renderPlaceItem(item);
                default:
                  return null;
                  //错误：点击某一个的时候，只应该选中它并使用EventListener.oneclick(function(){element.style.color(black)}）收藏点赞同理
              }
            })
          )}
        </div>
      </div>
    </div>
  );
}
