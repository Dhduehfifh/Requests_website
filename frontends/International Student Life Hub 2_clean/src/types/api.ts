// API types based on schema.json
export interface User {
  id: string;
  phone_e164?: string;
  email?: string;
  birthday?: string; // YYYY-MM-DD format
  username: string;
  avatar_url?: string;
  school?: string;
  city?: string;
  language?: 'zh' | 'en';
  banned_until?: string; // ISO 8601 datetime
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface ForumPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  city?: string;
  province?: string;
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  post_type: 'general' | 'market' | 'housing' | 'lfg';
  status: 'active' | 'closed' | 'deleted';
  images: string[];
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  deleted_at?: string; // ISO 8601 datetime
}

export interface MarketListing {
  id: string;
  forum_post_id: string;
  category: 'electronics' | 'furniture' | 'home_appliances' | 'vehicles' | 'books' | 'fashion' | 'sports' | 'entertainment' | 'digital' | 'other';
  price: number;
  trade_methods: ('meetup' | 'pickup' | 'delivery' | 'shipping')[];
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface HousingListing {
  id: string;
  forum_post_id: string;
  address: string;
  unit_number?: string;
  city: string;
  province: string;
  postal_code: string;
  housing_type: 'house' | 'apartment' | 'condo' | 'townhouse' | 'other';
  housing_type_other?: string;
  rent: number;
  rent_unit: 'year' | 'month' | 'week' | 'day';
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface LfgPost {
  id: string;
  forum_post_id: string;
  topic: string;
  people_needed?: number;
  total_expected?: number;
  online: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface Conversation {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface Message {
  id: string;
  conv_id: string;
  sender_id: string;
  content: string;
  images: string[];
  ref_post_id?: string;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

// API request/response types
export interface ApiError {
  error: string;
  code?: number;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  order?: string;
  dir?: 'asc' | 'desc';
}

export interface UserCreateRequest {
  username: string;
  phone_e164?: string;
  email?: string;
  birthday?: string;
  avatar_url?: string;
  school?: string;
  city?: string;
  language?: 'zh' | 'en';
}

export interface UserUpdateRequest extends Partial<UserCreateRequest> {}

export interface ForumPostCreateRequest {
  author_id: string;
  title: string;
  content: string;
  city?: string;
  province?: string;
  tags?: string[];
  visibility?: 'public' | 'friends' | 'private';
  post_type: 'general' | 'market' | 'housing' | 'lfg';
  status?: 'active' | 'closed' | 'deleted';
  images?: string[];
}

export interface ForumPostUpdateRequest extends Partial<ForumPostCreateRequest> {}

export interface MarketListingCreateRequest {
  forum_post_id: string;
  category: 'electronics' | 'furniture' | 'home_appliances' | 'vehicles' | 'books' | 'fashion' | 'sports' | 'entertainment' | 'digital' | 'other';
  price: number;
  trade_methods: ('meetup' | 'pickup' | 'delivery' | 'shipping')[];
}

export interface ConversationCreateRequest {
  user_a: string;
  user_b: string;
}

export interface MessageCreateRequest {
  conv_id: string;
  sender_id: string;
  content: string;
  images?: string[];
  ref_post_id?: string;
}

// Real-time event types
export interface SSEEnvelope<T = any> {
  type: string;
  data: T;
  ts: string; // ISO 8601 datetime
}

export interface MessagesEvent {
  type: 'messages';
  data: Message[];
  ts: string;
}

export interface PrefetchEvent {
  type: 'prefetch';
  data: Array<{
    id: string;
    title: string;
    post_type: string;
    city?: string;
    created_at: string;
  }>;
  ts: string;
}

// Combined post type for display
export interface PostWithDetails extends ForumPost {
  author?: User;
  market_listing?: MarketListing;
  housing_listing?: HousingListing;
  lfg_post?: LfgPost;
}

// Filter types
export interface PostFilters extends PaginationParams {
  post_type?: 'general' | 'market' | 'housing' | 'lfg';
  author_id?: string;
  city?: string;
  status?: 'active' | 'closed' | 'deleted';
}

export interface MarketListingFilters extends PaginationParams {
  post_id?: string;
  category?: string;
}

export interface MessageFilters extends PaginationParams {
  conv_id?: string;
  sender_id?: string;
}
