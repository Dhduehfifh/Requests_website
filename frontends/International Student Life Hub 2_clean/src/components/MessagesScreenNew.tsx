//消息页面具体实现
import { Search, MoreHorizontal, MessageCircle, Check, CheckCheck } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ChatScreen } from './ChatScreen';
import { useState, useEffect } from 'react';
import { listConversations, listMessages, type Conversation, type Message } from '../lib/api';
import { useRealtime } from '../lib/realtime';
import { HapticsService } from '../lib/haptics';

// Mock user ID for development - in production this would come from auth context
const CURRENT_USER_ID = 'b662585e-248f-490f-a24b-e02d7abebfb8';

interface ConversationWithDetails extends Conversation {
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
  type: string;
  isGroup?: boolean;
  delivered?: boolean;
}

export function MessagesScreen() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time connection
  const { connection, isConnected } = useRealtime({
    userId: CURRENT_USER_ID,
    onMessages: (messages: Message[]) => {
      // Update conversations with new messages
      updateConversationsWithMessages(messages);
    },
    onError: (error) => {
      console.error('Real-time connection error:', error);
    }
  });

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Trigger haptics on native
      await HapticsService.impactLight();
      
      const conversationsData = await listConversations({
        user_id: CURRENT_USER_ID,
        limit: 50,
        order: 'updated_at',
        dir: 'desc'
      });

      // Convert to display format
      const conversationsWithDetails: ConversationWithDetails[] = await Promise.all(
        conversationsData.map(async (conv) => {
          // Get the other user's name (simplified for MVP)
          const otherUserId = conv.user_a === CURRENT_USER_ID ? conv.user_b : conv.user_a;
          const otherUserName = `User ${otherUserId.slice(-4)}`;
          
          // Get last message
          const messages = await listMessages({
            conv_id: conv.id,
            limit: 1,
            order: 'created_at',
            dir: 'desc'
          });
          
          const lastMessage = messages[0]?.content || 'No messages yet';
          const timeAgo = messages[0] ? formatTimeAgo(messages[0].created_at) : 'No messages';
          
          return {
            ...conv,
            name: otherUserName,
            lastMessage,
            time: timeAgo,
            unread: 0, // TODO: implement unread count
            online: Math.random() > 0.5, // Mock online status
            avatar: otherUserName.charAt(0),
            type: 'general',
            delivered: true
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('載入對話失敗');
    } finally {
      setLoading(false);
    }
  };

  const updateConversationsWithMessages = (messages: Message[]) => {
    // Update conversations with new messages
    setConversations(prev => 
      prev.map(conv => {
        const newMessages = messages.filter(msg => msg.conv_id === conv.id);
        if (newMessages.length > 0) {
          const latestMessage = newMessages[newMessages.length - 1];
          return {
            ...conv,
            lastMessage: latestMessage.content,
            time: formatTimeAgo(latestMessage.created_at),
            unread: conv.unread + 1
          };
        }
        return conv;
      })
    );
  };

  const formatTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '剛剛';
    if (diffInMinutes < 60) return `${diffInMinutes}分鐘前`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小時前`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}天前`;
    return `${Math.floor(diffInDays / 7)}週前`;
  };

  const handleConversationClick = async (conversation: ConversationWithDetails) => {
    // Trigger haptics on native
    await HapticsService.impactLight();
    setSelectedConversation(conversation);
  };

  const handleBackToMessages = () => {
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedConversation) {
    return (
      <ChatScreen 
        conversation={selectedConversation} 
        onBack={handleBackToMessages}
        currentUserId={CURRENT_USER_ID}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">消息</h1>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索對話..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-yellow-800 text-sm text-center">
            連接中... 實時消息可能延遲
          </p>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
              <span className="text-sm ml-2">載入對話中...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={loadConversations}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              重試
            </button>
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="bg-white border-0 border-b border-gray-100 rounded-none p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-medium">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {conversation.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {conversation.unread > 0 && (
                          <div className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread}
                          </div>
                        )}
                        
                        {conversation.delivered && (
                          <div className="flex items-center">
                            {conversation.unread === 0 ? (
                              <CheckCheck className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Check className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">暫無對話</p>
            <p className="text-sm">開始與其他用戶交流吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
