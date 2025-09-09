import { ArrowLeft, Heart, MessageCircle, Share, MoreHorizontal, Send, Image, Smile } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PostDetailScreenProps {
  post: {
    id: number;
    title: string;
    content: string;
    author: string;
    avatar: string;
    time: string;
    likes: number;
    comments: number;
    category: string;
    categoryColor: string;
    images?: string[];
    // Additional fields for different post types
    price?: string;
    location?: string;
    condition?: string;
    current?: number;
    total?: number;
    requirements?: string;
  };
  onBack: () => void;
}

const mockComments = [
  {
    id: 1,
    author: '陳小雅',
    avatar: '雅',
    content: '這個公寓看起來很不錯！租金是多少呢？',
    time: '2小時前',
    likes: 5,
    replies: [
      {
        id: 11,
        author: '房東',
        avatar: '房',
        content: '租金是2800元/月，包含水電費',
        time: '1小時前',
        likes: 2
      }
    ]
  },
  {
    id: 2,
    author: 'Mike Johnson',
    avatar: 'MJ',
    content: '位置很好，離學校很近。我朋友住在那裡，說環境不錯！',
    time: '3小時前',
    likes: 8,
    replies: []
  },
  {
    id: 3,
    author: '王小明',
    avatar: '明',
    content: '可以看房嗎？我這週末有空',
    time: '4小時前',
    likes: 3,
    replies: [
      {
        id: 31,
        author: '房東',
        avatar: '房',
        content: '當然可以！請私信我安排時間',
        time: '3小時前',
        likes: 1
      }
    ]
  },
  {
    id: 4,
    author: '匿名用戶',
    avatar: '匿',
    content: '這個價格在市中心算是很實惠了，我之前看過類似的都要3000+',
    time: '5小時前',
    likes: 12,
    replies: []
  }
];

export function PostDetailScreen({ post, onBack }: PostDetailScreenProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [newComment, setNewComment] = useState('');
  const [showReplies, setShowReplies] = useState<number[]>([]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      console.log('Sending comment:', newComment);
      setNewComment('');
    }
  };

  const toggleReplies = (commentId: number) => {
    setShowReplies(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">貼文詳情</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Post */}
        <Card className="bg-white border-0 border-b border-gray-200 rounded-none">
          <div className="p-4">
            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">{post.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                <p className="text-sm text-gray-500">{post.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${post.categoryColor}`}>
                {post.category}
              </span>
            </div>

            {/* Post Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{post.title}</h2>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
              
              {/* Additional details based on post type */}
              {post.price && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">價格</span>
                    <span className="text-lg font-bold text-yellow-600">{post.price}</span>
                  </div>
                </div>
              )}
              
              {post.current && post.total && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">參與人數</span>
                    <span className="text-lg font-bold text-blue-600">{post.current}/{post.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(post.current / post.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {post.requirements && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">要求:</span>
                    <span className="text-sm font-medium text-green-700">{post.requirements}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-4">
                <ImageWithFallback
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 transition-colors ${
                      isLiked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{likeCount}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                    <Share className="w-5 h-5" />
                    <span className="text-sm font-medium">分享</span>
                  </button>
                </div>
              </div>
              
              {/* Join button for team/group posts */}
              {post.current && post.total && post.current < post.total && (
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-4 rounded-lg transition-colors">
                  立即加入 ({post.current}/{post.total})
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            評論 ({post.comments})
          </h3>

          <div className="space-y-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                {/* Main Comment */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-700">{comment.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.time}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-2 ml-3">
                      <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                        👍 {comment.likes}
                      </button>
                      <button 
                        onClick={() => toggleReplies(comment.id)}
                        className="text-xs text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        {comment.replies.length > 0 ? `回覆 (${comment.replies.length})` : '回覆'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {showReplies.includes(comment.id) && comment.replies.length > 0 && (
                  <div className="ml-11 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-3">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-gray-700">{reply.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border border-gray-200 rounded-2xl p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                              <span className="text-xs text-gray-500">{reply.time}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.content}</p>
                          </div>
                          <div className="mt-1 ml-3">
                            <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                              👍 {reply.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Image className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="寫下你的評論..."
              className="pr-12 bg-gray-50 border-0 rounded-full"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
              <Smile className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
