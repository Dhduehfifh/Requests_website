import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createPost, createMarketListing } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { HapticsService } from '../lib/haptics';

interface NewPostScreenProps {
  onClose: () => void;
  onPostCreated?: () => void;
}

export function NewPostScreen({ onClose, onPostCreated }: NewPostScreenProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'general' | 'market' | 'housing' | 'lfg'>('general');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, '');
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      // Trigger haptics on native
      await HapticsService.impactMedium();

      const postData = {
        author_id: user.id,
        title,
        content,
        post_type: postType,
        tags,
        visibility: 'public' as const,
        status: 'active' as const,
        images: [],
      };

      const post = await createPost(postData);

      // If it's a market post, create market listing
      if (postType === 'market' && price && category) {
        await createMarketListing({
          forum_post_id: post.id,
          category: category as any,
          price: parseFloat(price),
          trade_methods: ['meetup', 'pickup'],
        });
      }

      onPostCreated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'electronics', 'furniture', 'home_appliances', 'vehicles',
    'books', 'fashion', 'sports', 'entertainment', 'digital', 'other'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">发布新帖子</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              帖子类型
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'general', label: '一般' },
                { value: 'market', label: '市场' },
                { value: 'housing', label: '租房' },
                { value: 'lfg', label: '找伙伴' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPostType(type.value as any)}
                  className={`p-3 rounded-lg border text-center ${
                    postType === type.value
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Input
              type="text"
              placeholder="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Content */}
          <div>
            <Textarea
              placeholder="分享你的想法..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="w-full"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签 (输入后按空格或回车添加)
            </label>
            <Input
              type="text"
              placeholder="#学习 #生活"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              className="w-full"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Market-specific fields */}
          {postType === 'market' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    价格 ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {loading ? '发布中...' : '发布'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
