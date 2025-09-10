// API client for International Student Life Hub
import type {
  User,
  ForumPost,
  MarketListing,
  HousingListing,
  LfgPost,
  Conversation,
  Message,
  ApiError,
  PaginationParams,
  UserCreateRequest,
  UserUpdateRequest,
  ForumPostCreateRequest,
  ForumPostUpdateRequest,
  MarketListingCreateRequest,
  ConversationCreateRequest,
  MessageCreateRequest,
  PostFilters,
  MarketListingFilters,
  MessageFilters,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_BASE || '';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user_id: string;
  username: string;
  email: string;
  token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  city?: string;
  school?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    method: 'GET', // Default method
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}`,
        response.status,
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Health check
export async function checkHealth(): Promise<{ ok: boolean; service: string; time: string }> {
  return request('/json/health');
}

// Users API
export async function listUsers(params: PaginationParams & { city?: string; school?: string } = {}): Promise<User[]> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const query = searchParams.toString();
  return request(`/json/users${query ? `?${query}` : ''}`);
}

export async function getUser(id: string): Promise<User> {
  return request(`/json/users/${id}`);
}

export async function createUser(data: UserCreateRequest): Promise<User> {
  return request('/json/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: string, data: UserUpdateRequest): Promise<User> {
  return request(`/json/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Forum Posts API
export async function listPosts(filters: PostFilters = {}): Promise<ForumPost[]> {
  const searchParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const query = searchParams.toString();
  return request(`/json/posts${query ? `?${query}` : ''}`);
}

export async function getPost(id: string): Promise<ForumPost> {
  return request(`/json/posts/${id}`);
}

export async function createPost(data: ForumPostCreateRequest): Promise<ForumPost> {
  return request('/json/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePost(id: string, data: ForumPostUpdateRequest): Promise<ForumPost> {
  return request(`/json/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Market Listings API
export async function listMarketListings(filters: MarketListingFilters = {}): Promise<MarketListing[]> {
  const searchParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const query = searchParams.toString();
  return request(`/json/market_listings${query ? `?${query}` : ''}`);
}

export async function createMarketListing(data: MarketListingCreateRequest): Promise<MarketListing> {
  return request('/json/market_listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Conversations API
export async function listConversations(params: PaginationParams & { user_id?: string } = {}): Promise<Conversation[]> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const query = searchParams.toString();
  return request(`/json/conversations${query ? `?${query}` : ''}`);
}

export async function createConversation(data: ConversationCreateRequest): Promise<Conversation> {
  return request('/json/conversations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Messages API
export async function listMessages(filters: MessageFilters = {}): Promise<Message[]> {
  const searchParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const query = searchParams.toString();
  return request(`/json/messages${query ? `?${query}` : ''}`);
}

export async function sendMessage(data: MessageCreateRequest): Promise<Message> {
  return request('/json/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Helper functions for common operations
export async function getPostWithDetails(id: string): Promise<ForumPost & { author?: User; market_listing?: MarketListing; housing_listing?: HousingListing; lfg_post?: LfgPost }> {
  const post = await getPost(id);
  const author = await getUser(post.author_id).catch(() => undefined);
  
  let marketListing: MarketListing | undefined;
  let housingListing: HousingListing | undefined;
  let lfgPost: LfgPost | undefined;
  
  // Fetch specialized data based on post type
  if (post.post_type === 'market') {
    try {
      const listings = await listMarketListings({ post_id: id, limit: 1 });
      marketListing = listings[0];
    } catch (error) {
      console.warn('Failed to fetch market listing:', error);
    }
  }
  
  return {
    ...post,
    author,
    market_listing: marketListing,
    housing_listing: housingListing,
    lfg_post: lfgPost,
  };
}

export async function getMarketPosts(filters: Omit<PostFilters, 'post_type'> = {}): Promise<ForumPost[]> {
  return listPosts({ ...filters, post_type: 'market' });
}

export async function getHousingPosts(filters: Omit<PostFilters, 'post_type'> = {}): Promise<ForumPost[]> {
  return listPosts({ ...filters, post_type: 'housing' });
}

export async function getLfgPosts(filters: Omit<PostFilters, 'post_type'> = {}): Promise<ForumPost[]> {
  return listPosts({ ...filters, post_type: 'lfg' });
}

// Auth functions
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/json/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/json/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function logout(): Promise<{ message: string }> {
  return request<{ message: string }>('/json/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<User> {
  return request<User>('/json/auth/me');
}

// Like functions
export async function likePost(postId: string): Promise<{ liked: boolean; count: number }> {
  return request<{ liked: boolean; count: number }>(`/json/posts/${postId}/like`, {
    method: 'POST',
  });
}

export async function unlikePost(postId: string): Promise<{ liked: boolean; count: number }> {
  return request<{ liked: boolean; count: number }>(`/json/posts/${postId}/like`, {
    method: 'DELETE',
  });
}

export async function getPostLikes(postId: string): Promise<{ count: number; liked: boolean }> {
  return request<{ count: number; liked: boolean }>(`/json/posts/${postId}/likes`);
}

// Follow functions
export async function followUser(userId: string): Promise<{ following: boolean }> {
  return request<{ following: boolean }>(`/json/users/${userId}/follow`, {
    method: 'POST',
  });
}

export async function unfollowUser(userId: string): Promise<{ following: boolean }> {
  return request<{ following: boolean }>(`/json/users/${userId}/follow`, {
    method: 'DELETE',
  });
}

// 评论功能
export async function addComment(postId: string, content: string): Promise<ForumComment> {
  return request<ForumComment>(`/json/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function getComments(postId: string): Promise<ForumComment[]> {
  return request<ForumComment[]>(`/json/posts/${postId}/comments`);
}

// Error handling utility
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export { ApiError };
