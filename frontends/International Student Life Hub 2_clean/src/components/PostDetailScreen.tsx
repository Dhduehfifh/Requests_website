import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageSquare, Share, MoreHorizontal } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { EnhancedTextRenderer } from '../lib/linkRenderer';
import { useAuth } from '../contexts/AuthContext';
import { getPost, likePost, unlikePost, getPostLikes, addComment, getComments, type ForumPost, type ForumComment } from '../lib/api';
import { HapticsService } from '../lib/haptics';

interface PostDetailScreenProps {
  postId: string;
  onBack: () => void;
}

export function PostDetailScreen({ postId, onBack }: PostDetailScreenProps) {
  const { user } = useAuth();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      const [postData, likesData, commentsData] = await Promise.all([
        getPost(postId),
        getPostLikes(postId),
        getComments(postId)
      ]);
      setPost(postData);
      setLikes(likesData);
      setComments(commentsData);
    } catch (err) {
      console.error('Failed to load post data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !post) return;
    
    try {
      await HapticsService.impactLight();
      
      if (likes.liked) {
        await unlikePost(post.id);
        setLikes(prev => ({ count: prev.count - 1, liked: false }));
      } else {
        await likePost(post.id);
        setLikes(prev => ({ count: prev.count + 1, liked: true }));
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !newComment.trim()) return;

    try {
      setCommentLoading(true);
      await HapticsService.impactLight();
      
      const comment = await addComment(post.id, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">帖子不存在</p>
        <Button onClick={onBack}>返回</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">帖子详情</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="flex-1 overflow-y-auto">
        <Card className="m-4 p-4">
          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 cheese-gradient rounded-full flex items-center justify-center cheese-hole">
              <span className="text-sm font-semibold text-white">
                {post.author_id?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">用户 {post.author_id?.slice(-4)}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Post Title */}
          {post.title && (
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {post.title}
            </h2>
          )}

          {/* Post Content */}
          <div className="mb-4">
            <EnhancedTextRenderer 
              text={post.content} 
              className="text-gray-700 leading-relaxed"
            />
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {post.images.map((image, index) => (
                <ImageWithFallback
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center space-x-1 ${
                  likes.liked ? 'text-red-500' : 'text-gray-500'
                } ${!user ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${likes.liked ? 'fill-current' : ''}`} />
                <span>{likes.count}</span>
              </button>
              
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                <MessageSquare className="w-5 h-5" />
                <span>{comments.length}</span>
              </button>
            </div>

            <button className="text-gray-500 hover:text-gray-700">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </Card>

        {/* Comments Section */}
        <div className="px-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            评论 ({comments.length})
          </h3>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex space-x-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的评论..."
                  className="flex-1"
                  disabled={commentLoading}
                />
                <Button
                  type="submit"
                  disabled={!newComment.trim() || commentLoading}
                  className="cheese-gradient text-white border-0"
                >
                  {commentLoading ? '发送中...' : '发送'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600">请先登录才能评论</p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 cheese-gradient rounded-full flex items-center justify-center cheese-hole">
                    <span className="text-xs font-semibold text-white">
                      {comment.author_id?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">
                        用户 {comment.author_id?.slice(-4)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>还没有评论，来抢沙发吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}