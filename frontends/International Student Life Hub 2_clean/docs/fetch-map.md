# API Fetch Map

This document maps frontend components to their required API endpoints and provides a reverse index of which components use each endpoint.

## Component → API Endpoints

### ForYouScreen
- **GET /json/posts** - Load recommended posts
  - Parameters: `limit=20`, `order=created_at`, `dir=desc`, `status=active`
  - Triggers: Component mount, category filter change, load more button

### ExploreScreen
- **GET /json/posts** - Load trending posts
  - Parameters: `limit=6`, `order=created_at`, `dir=desc`, `status=active`
  - Triggers: Component mount

### PostDetailScreen
- **GET /json/posts/{id}** - Load post details
  - Parameters: `id` from URL params
  - Triggers: Component mount

### MessagesScreen
- **GET /json/conversations** - Load user conversations
  - Parameters: `user_id`, `limit`, `offset`, `order=created_at`, `dir=desc`
  - Triggers: Component mount
- **GET /json/messages** - Load messages for conversation
  - Parameters: `conv_id`, `limit`, `offset`, `order=created_at`, `dir=desc`
  - Triggers: Conversation selection, load more messages
- **POST /json/messages** - Send new message
  - Body: `{ conv_id, sender_id, content, images?, ref_post_id? }`
  - Triggers: Send message button

### ProfileScreen
- **GET /json/users/{id}** - Load user profile
  - Parameters: `id` from current user context
  - Triggers: Component mount
- **PATCH /json/users/{id}** - Update user profile
  - Body: User update data
  - Triggers: Save profile button

### NewPostScreen (Future)
- **POST /json/posts** - Create new post
  - Body: `{ author_id, title, content, post_type, city?, province?, tags?, visibility?, status?, images? }`
  - Triggers: Publish button
- **POST /json/market_listings** - Create market listing (if post_type=market)
  - Body: `{ forum_post_id, category, price, trade_methods }`
  - Triggers: After post creation

## API Endpoint → Components

### GET /json/posts
**Used by:**
- ForYouScreen (recommended posts)
- ExploreScreen (trending posts)
- PostDetailScreen (post details)
- NewPostScreen (post creation)

**Parameters:**
- `limit`: Number of posts to return (1-200, default: 20)
- `offset`: Number of posts to skip (default: 0)
- `order`: Field to order by (created_at, updated_at, id, author_id, status, post_type)
- `dir`: Sort direction (asc, desc, default: desc)
- `post_type`: Filter by post type (general, market, housing, lfg)
- `author_id`: Filter by author
- `city`: Filter by city
- `status`: Filter by status (active, closed, deleted)

### GET /json/posts/{id}
**Used by:**
- PostDetailScreen

**Parameters:**
- `id`: Post ID (UUID)

### POST /json/posts
**Used by:**
- NewPostScreen

**Body:**
```json
{
  "author_id": "string",
  "title": "string",
  "content": "string",
  "post_type": "general|market|housing|lfg",
  "city": "string?",
  "province": "string?",
  "tags": "string[]",
  "visibility": "public|friends|private",
  "status": "active|closed|deleted",
  "images": "string[]"
}
```

### PATCH /json/posts/{id}
**Used by:**
- PostDetailScreen (edit post)

**Body:** Same as POST /json/posts (all fields optional)

### GET /json/market_listings
**Used by:**
- MarketListScreen (future)
- PostDetailScreen (for market posts)

**Parameters:**
- `post_id`: Filter by forum post ID
- `category`: Filter by category
- `limit`, `offset`, `order`, `dir`: Pagination

### POST /json/market_listings
**Used by:**
- NewPostScreen (when creating market posts)

**Body:**
```json
{
  "forum_post_id": "string",
  "category": "electronics|furniture|home_appliances|vehicles|books|fashion|sports|entertainment|digital|other",
  "price": "number",
  "trade_methods": "string[]"
}
```

### GET /json/users
**Used by:**
- UserListScreen (future)

**Parameters:**
- `city`: Filter by city
- `school`: Filter by school
- `limit`, `offset`, `order`, `dir`: Pagination

### GET /json/users/{id}
**Used by:**
- ProfileScreen
- PostDetailScreen (author info)

**Parameters:**
- `id`: User ID (UUID)

### PATCH /json/users/{id}
**Used by:**
- ProfileScreen

**Body:**
```json
{
  "username": "string?",
  "email": "string?",
  "phone_e164": "string?",
  "birthday": "string?",
  "avatar_url": "string?",
  "school": "string?",
  "city": "string?",
  "language": "zh|en?"
}
```

### GET /json/conversations
**Used by:**
- MessagesScreen

**Parameters:**
- `user_id`: Filter conversations by user
- `limit`, `offset`, `order`, `dir`: Pagination

### POST /json/conversations
**Used by:**
- MessagesScreen (start new conversation)

**Body:**
```json
{
  "user_a": "string",
  "user_b": "string"
}
```

### GET /json/messages
**Used by:**
- MessagesScreen
- ChatScreen

**Parameters:**
- `conv_id`: Filter by conversation ID
- `sender_id`: Filter by sender ID
- `limit`, `offset`, `order`, `dir`: Pagination

### POST /json/messages
**Used by:**
- MessagesScreen
- ChatScreen

**Body:**
```json
{
  "conv_id": "string",
  "sender_id": "string",
  "content": "string",
  "images": "string[]?",
  "ref_post_id": "string?"
}
```

### GET /json/events
**Used by:**
- RealtimeConnection (SSE fallback)
- MessagesScreen (real-time messages)
- ForYouScreen (real-time recommendations)

**Parameters:**
- `user_id`: User ID to subscribe to events for

**Response:** Server-Sent Events stream

## Error Handling

All components should handle the following error scenarios:

1. **Network errors**: Show retry button
2. **API errors**: Display error message from API response
3. **Validation errors**: Show field-specific error messages
4. **Timeout errors**: Show timeout message with retry option

## Loading States

Components should show loading indicators for:
- Initial data loading
- Pagination (load more)
- Form submissions
- Real-time updates

## Caching Strategy

- **Posts**: Cache for 5 minutes, invalidate on new posts
- **User profiles**: Cache for 10 minutes
- **Messages**: No caching (always fresh)
- **Conversations**: Cache for 2 minutes

## Real-time Updates

Components using real-time features:
- **MessagesScreen**: Subscribe to `messages` events
- **ForYouScreen**: Subscribe to `prefetch` events
- **ExploreScreen**: Subscribe to `prefetch` events

## Performance Considerations

1. **Pagination**: Load 20 items initially, 10 more on "load more"
2. **Image loading**: Lazy load images, use placeholders
3. **API calls**: Debounce search inputs, cache responses
4. **Real-time**: Limit event frequency, batch updates
