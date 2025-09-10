import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listPosts, getUser, createUser, ApiError } from '../lib/api';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('listPosts', () => {
    it('should fetch posts successfully', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          author_id: 'user1',
          post_type: 'general',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          tags: [],
          images: [],
          visibility: 'public',
          status: 'active'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      });

      const result = await listPosts();
      
      expect(mockFetch).toHaveBeenCalledWith(
        '/json/posts',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockPosts);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad request', code: 400 }),
      });

      await expect(listPosts()).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(listPosts()).rejects.toThrow(ApiError);
    });
  });

  describe('getUser', () => {
    it('should fetch user by ID', async () => {
      const mockUser = {
        id: 'user1',
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await getUser('user1');
      
      expect(mockFetch).toHaveBeenCalledWith(
        '/json/users/user1',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
      };

      const mockUser = {
        id: 'user2',
        ...userData,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockUser,
      });

      const result = await createUser(userData);
      
      expect(mockFetch).toHaveBeenCalledWith(
        '/json/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData),
        })
      );
      expect(result).toEqual(mockUser);
    });
  });
});
