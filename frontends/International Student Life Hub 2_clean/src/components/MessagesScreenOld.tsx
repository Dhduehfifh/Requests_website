//消息页面具体实现
import { Search, MoreHorizontal, MessageCircle, Check, CheckCheck } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ChatScreen } from './ChatScreen';
import { useState, useEffect } from 'react';
import { listConversations, listMessages, type Conversation, type Message } from '../lib/api';
import { useRealtime } from '../lib/realtime';
import { HapticsService } from '../lib/haptics';


const conversations = [
  {
    id: 1,
    name: '陳小雅',
    lastMessage: '這個公寓還有嗎？',
    time: '2分鐘前',
    unread: 2,
    online: true,
    avatar: '雅',
    type: 'rent'
  },
  {
    id: 2,
    name: 'Mike Johnson',
    lastMessage: '謝謝MacBook的資訊！',
    time: '1小時前',
    unread: 0,
    online: false,
    avatar: 'MJ',
    type: 'market',
    delivered: true
  },
  {
    id: 3,
    name: '語言交流群組',
    lastMessage: 'Emma: 明天晚上7點見！',
    time: '3小時前',
    unread: 5,
    online: true,
    avatar: '語',
    type: 'events',
    isGroup: true
  },
  {
    id: 4,
    name: '匿名用戶',
    lastMessage: '你的告白真的很有共鳴',
    time: '1天前',
    unread: 0,
    online: false,
    avatar: '匿',
    type: 'gossip'
  },
  {
    id: 5,
    name: '王小明',
    lastMessage: '這週末能見面嗎？',
    time: '2天前',
    unread: 1,
    online: true,
    avatar: '明',
    type: 'rent'
  }
];

const typeColors = {
  rent: 'bg-blue-500',
  market: 'bg-green-500',
  events: 'bg-orange-500',
  gossip: 'bg-pink-500'
};

export function MessagesScreen() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const handleConversationClick = (conversation: any) => {
    setSelectedConversation(conversation);
  };

  const handleBackToMessages = () => {
    setSelectedConversation(null);
  };

  if (selectedConversation) {
    return <ChatScreen conversation={selectedConversation} onBack={handleBackToMessages} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            🧀 消息
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="搜尋對話..."
            className="pl-10 bg-gray-50 border-0"
          />
        </div>
      </div>

      {/* Quick filters */}
      <div className="bg-white px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-3 overflow-x-auto">
          <button className="flex-shrink-0 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
            全部 (12)
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            租房 (3)
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium">
            二手 (2)
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium">
            活動 (4)
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-medium">
            告白 (3)
          </button>
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="bg-white border border-gray-200 p-0 overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="flex items-center p-4">
                {/* Avatar with type indicator */}
                <div className="relative mr-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {conversation.avatar}
                    </span>
                  </div>
                  
                  {/* Online indicator */}
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                  
                  {/* Type indicator */}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 ${typeColors[conversation.type]} rounded-full border-2 border-white`}></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium truncate ${conversation.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conversation.name}
                      {conversation.isGroup && (
                        <span className="ml-1 text-xs text-gray-500">(群組)</span>
                      )}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {conversation.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className={`text-sm overflow-hidden whitespace-nowrap text-ellipsis ${conversation.unread > 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      {/* Delivery status */}
                      {conversation.delivered && conversation.unread === 0 && (
                        <CheckCheck className="w-4 h-4 text-gray-600" />
                      )}
                      
                      {/* Unread badge */}
                      {conversation.unread > 0 && (
                        <div className="bg-gray-900 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty state message */}
        <div className="p-8 text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">開始對話</h3>
          <p className="text-gray-600 mb-4">
            通過貼文和活動與其他同學建立聯繫
          </p>
        </div>
      </div>
    </div>
  );
}