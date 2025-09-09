import { Camera, MapPin, DollarSign, Users, MessageCircle, Home, Recycle, CalendarDays } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const categories = [
  {
    id: 'rent',
    name: '租房',
    icon: Home,
    emoji: '🏠'
  },
  {
    id: 'secondhand',
    name: '二手市場',
    icon: Recycle,
    emoji: '🛍️'
  },
  {
    id: 'events',
    name: '組隊活動',
    icon: CalendarDays,
    emoji: '⚡'
  },
  {
    id: 'rideshare',
    name: '拼車出行',
    icon: CalendarDays,
    emoji: '🚗'
  },
  {
    id: 'forum',
    name: '校園論壇',
    icon: MessageCircle,
    emoji: '💬'
  },
  {
    id: 'gossip',
    name: '匿名告白',
    icon: MessageCircle,
    emoji: '💕'
  }
];

export function PostScreen() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            發布動態
          </h1>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white border-0">
            發布
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Category selection */}
          <Card className="bg-white p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">選擇分類</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-all bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">{category.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Post details */}
          <Card className="bg-white p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">貼文詳情</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  標題 *
                </label>
                <Input placeholder="輸入一個描述性的標題" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細描述 *
                </label>
                <Textarea 
                  placeholder="提供你的貼文詳細資訊..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    價格
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="0.00" className="pl-9" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    地點
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇地點" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown">市中心</SelectItem>
                      <SelectItem value="campus">校園區域</SelectItem>
                      <SelectItem value="student-district">學生區</SelectItem>
                      <SelectItem value="university-town">大學城</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Photos */}
          <Card className="bg-white p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">添加照片</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">點擊添加照片</p>
                <p className="text-xs text-gray-500">最多5張照片，每張最大10MB</p>
              </div>
            </div>
          </Card>

          {/* Additional options */}
          <Card className="bg-white p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">其他選項</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">顯示具體位置</p>
                    <p className="text-sm text-gray-600">幫助他人更容易找到你</p>
                  </div>
                </div>
                <button className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">允許留言</p>
                    <p className="text-sm text-gray-600">讓其他人在你的貼文下留言</p>
                  </div>
                </div>
                <button className="w-12 h-6 bg-gray-900 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
          </Card>

          {/* Guidelines */}
          <Card className="bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">社區守則</h4>
                <p className="text-sm text-yellow-700">
                  請保持尊重並遵守我們的社區規則。違反規則的貼文將被移除。
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}