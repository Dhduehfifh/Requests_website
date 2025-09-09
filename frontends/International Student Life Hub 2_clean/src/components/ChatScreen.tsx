import { ArrowLeft, MoreHorizontal, Phone, Video, Send, Image, Smile, Paperclip } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

interface ChatScreenProps {
  conversation: {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
    type: string;
  };
  onBack: () => void;
}

const mockMessages = [
  {
    id: 1,
    sender: 'other',
    name: '陳小雅',
    avatar: '雅',
    message: '你好！我看到你發布的租房信息，這個公寓還在嗎？',
    time: '14:30',
    type: 'text'
  },
  {
    id: 2,
    sender: 'me',
    message: '你好！是的，還在的。你想了解什麼信息呢？',
    time: '14:32',
    type: 'text'
  },
  {
    id: 3,
    sender: 'other',
    name: '陳小雅',
    avatar: '雅',
    message: '我想問一下租金是多少？還有位置在哪裡？',
    time: '14:33',
    type: 'text'
  },
  {
    id: 4,
    sender: 'me',
    message: '租金是2800元/月，位置在市中心，步行5分鐘到大學。交通很方便！',
    time: '14:35',
    type: 'text'
  },
  {
    id: 5,
    sender: 'other',
    name: '陳小雅',
    avatar: '雅',
    message: '聽起來不錯！可以看房嗎？我這週末有空',
    time: '14:36',
    type: 'text'
  },
  {
    id: 6,
    sender: 'me',
    message: '當然可以！週六下午2點怎麼樣？我可以帶你去看房',
    time: '14:38',
    type: 'text'
  },
  {
    id: 7,
    sender: 'other',
    name: '陳小雅',
    avatar: '雅',
    message: '好的！那我們週六下午2點見。地址是哪裡？',
    time: '14:40',
    type: 'text'
  },
  {
    id: 8,
    sender: 'me',
    message: '地址是：大學路123號，3樓。到了給我發消息，我下來接你',
    time: '14:42',
    type: 'text'
  },
  {
    id: 9,
    sender: 'other',
    name: '陳小雅',
    avatar: '雅',
    message: '好的，謝謝！期待見到你 😊',
    time: '14:43',
    type: 'text'
  },
  {
    id: 10,
    sender: 'me',
    message: '不客氣！週六見！',
    time: '14:44',
    type: 'text'
  }
];

export function ChatScreen({ conversation, onBack }: ChatScreenProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {conversation.avatar}
                </span>
              </div>
              {conversation.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{conversation.name}</h1>
              <p className="text-sm text-gray-500">
                {conversation.online ? '在線' : '離線'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-xs lg:max-w-md ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar for other messages */}
              {message.sender === 'other' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-xs font-medium text-gray-700">
                    {message.avatar}
                  </span>
                </div>
              )}
              
              {/* Message bubble */}
              <div className="flex flex-col">
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
                <span className={`text-xs text-gray-500 mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                  {message.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Image className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入消息..."
              className="pr-12 bg-gray-50 border-0 rounded-full"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
              <Smile className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
