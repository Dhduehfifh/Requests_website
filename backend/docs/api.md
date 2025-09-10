# International Student Life Hub API Documentation

## Overview

This API provides endpoints for the International Student Life Hub platform, enabling students to connect, trade items, find housing, and organize activities.

**Base URL**: `http://localhost:8000`  
**Content-Type**: `application/json`  
**Authentication**: None (for MVP)

## General Information

### Response Format
All responses are in JSON format. Successful responses return the requested data, while errors return an error object:

```json
{
  "error": "Error message",
  "code": 400
}
```

### Pagination
List endpoints support pagination with the following query parameters:
- `limit`: Number of items to return (1-200, default: 20)
- `offset`: Number of items to skip (default: 0)
- `order`: Field to order by (varies by endpoint)
- `dir`: Sort direction (`asc` or `desc`, default: `desc`)

### Common HTTP Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error or invalid request
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Endpoints

### Health Check

#### GET /json/health
Check API service health.

**Response:**
```json
{
  "ok": true,
  "service": "json-api",
  "time": "2025-01-27T10:30:00Z"
}
```

### Users

#### GET /json/users
List users with optional filtering.

**Query Parameters:**
- `limit` (integer, 1-200, default: 20): Number of users to return
- `offset` (integer, default: 0): Number of users to skip
- `order` (string, default: "created_at"): Order by field (created_at, updated_at, id, username, city)
- `dir` (string, default: "desc"): Sort direction (asc, desc)
- `city` (string, optional): Filter by city
- `school` (string, optional): Filter by school

**Response:**
```json
[
  {
    "id": "c2f8f4d8-6d8a-4a4f-8a2d-7d47a6b12d77",
    "phone_e164": "+14165551234",
    "email": "alice@example.com",
    "birthday": "2003-09-21",
    "username": "alice",
    "avatar_url": "https://cdn.example.com/avatars/a.png",
    "school": "Mohawk College",
    "city": "Hamilton",
    "language": "en",
    "banned_until": null,
    "created_at": "2025-09-01T13:42:11Z",
    "updated_at": "2025-09-01T13:42:11Z"
  }
]
```

#### POST /json/users
Create a new user.

**Request Body:**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "phone_e164": "+14165551234",
  "birthday": "2003-09-21",
  "avatar_url": "https://cdn.example.com/avatars/a.png",
  "school": "Mohawk College",
  "city": "Hamilton",
  "language": "en"
}
```

**Response:** 201 Created with user object

#### GET /json/users/{id}
Get user by ID.

**Path Parameters:**
- `id` (string, UUID): User ID

**Response:** User object or 404 Not Found

#### PATCH /json/users/{id}
Update user.

**Path Parameters:**
- `id` (string, UUID): User ID

**Request Body:** Same as POST /json/users (all fields optional)

**Response:** Updated user object or 404 Not Found

### Forum Posts

#### GET /json/posts
List forum posts with optional filtering.

**Query Parameters:**
- `limit` (integer, 1-200, default: 20): Number of posts to return
- `offset` (integer, default: 0): Number of posts to skip
- `order` (string, default: "created_at"): Order by field (created_at, updated_at, id, author_id, status, post_type)
- `dir` (string, default: "desc"): Sort direction (asc, desc)
- `post_type` (string, optional): Filter by post type (general, market, housing, lfg)
- `author_id` (string, UUID, optional): Filter by author
- `city` (string, optional): Filter by city
- `status` (string, optional): Filter by status (active, closed, deleted)

**Response:**
```json
[
  {
    "id": "2a3e0a62-0c92-4fe1-9b8e-3f2a2e7c1b11",
    "author_id": "c2f8f4d8-6d8a-4a4f-8a2d-7d47a6b12d77",
    "title": "Looking for a study buddy for COMP-10205",
    "content": "Anyone up for DSA problem sets?",
    "city": "Hamilton",
    "province": "ON",
    "tags": ["study", "DSA"],
    "visibility": "public",
    "post_type": "lfg",
    "status": "active",
    "images": [],
    "created_at": "2025-09-02T02:22:10Z",
    "updated_at": "2025-09-02T02:22:10Z",
    "deleted_at": null
  }
]
```

#### POST /json/posts
Create a new forum post.

**Request Body:**
```json
{
  "author_id": "c2f8f4d8-6d8a-4a4f-8a2d-7d47a6b12d77",
  "title": "Looking for a study buddy for COMP-10205",
  "content": "Anyone up for DSA problem sets?",
  "city": "Hamilton",
  "province": "ON",
  "tags": ["study", "DSA"],
  "visibility": "public",
  "post_type": "lfg",
  "status": "active",
  "images": []
}
```

**Response:** 201 Created with post object

#### GET /json/posts/{id}
Get forum post by ID.

**Path Parameters:**
- `id` (string, UUID): Post ID

**Response:** Post object or 404 Not Found

#### PATCH /json/posts/{id}
Update forum post.

**Path Parameters:**
- `id` (string, UUID): Post ID

**Request Body:** Same as POST /json/posts (all fields optional)

**Response:** Updated post object or 404 Not Found

### Market Listings

#### GET /json/market_listings
List market listings with optional filtering.

**Query Parameters:**
- `limit` (integer, 1-200, default: 20): Number of listings to return
- `offset` (integer, default: 0): Number of listings to skip
- `order` (string, default: "created_at"): Order by field (created_at, updated_at, id, forum_post_id, price, category)
- `dir` (string, default: "desc"): Sort direction (asc, desc)
- `post_id` (string, UUID, optional): Filter by forum post ID
- `category` (string, optional): Filter by category (electronics, furniture, home_appliances, vehicles, books, fashion, sports, entertainment, digital, other)

**Response:**
```json
[
  {
    "id": "9a4b1f68-8427-4f5f-9a9f-2f4ab8da7f1a",
    "forum_post_id": "2a3e0a62-0c92-4fe1-9b8e-3f2a2e7c1b11",
    "category": "electronics",
    "price": 120.00,
    "trade_methods": ["meetup", "pickup"],
    "created_at": "2025-09-02T02:22:10Z",
    "updated_at": "2025-09-02T02:22:10Z"
  }
]
```

#### POST /json/market_listings
Create a new market listing.

**Request Body:**
```json
{
  "forum_post_id": "2a3e0a62-0c92-4fe1-9b8e-3f2a2e7c1b11",
  "category": "electronics",
  "price": 120.00,
  "trade_methods": ["meetup", "pickup"]
}
```

**Response:** 201 Created with market listing object

### Conversations

#### GET /json/conversations
List conversations with optional filtering.

**Query Parameters:**
- `limit` (integer, 1-200, default: 20): Number of conversations to return
- `offset` (integer, default: 0): Number of conversations to skip
- `order` (string, default: "created_at"): Order by field (created_at, updated_at, id, user_a, user_b)
- `dir` (string, default: "desc"): Sort direction (asc, desc)
- `user_id` (string, UUID, optional): Filter conversations by user (user_a or user_b)

**Response:**
```json
[
  {
    "id": "c1c1d8f0-0c0d-4f2d-9c1a-1a2b3c4d5e6f",
    "user_a": "c2f8f4d8-6d8a-4a4f-8a2d-7d47a6b12d77",
    "user_b": "9f9f4d8b-5e5a-4a4f-8a2d-7d47a6b12d88",
    "created_at": "2025-09-02T04:00:00Z",
    "updated_at": "2025-09-02T04:00:00Z"
  }
]
```

#### POST /json/conversations
Create a new conversation between two users.

**Request Body:**
```json
{
  "user_a": "c2f8f4d8-6d8a-4a4f-8a2d-7d47a6b12d77",
  "user_b": "9f9f4d8b-5e5a-4a4f-8a2d-7d47a6b12d88"
}
```

**Response:** 201 Created with conversation object

### Messages

#### GET /json/messages
List messages with optional filtering.

**Query Parameters:**
- `limit` (integer, 1-200, default: 20): Number of messages to return
- `offset` (integer, default: 0): Number of messages to skip
- `order` (string, default: "created_at"): Order by field (created_at, updated_at, id)
- `dir` (string, default: "desc"): Sort direction (asc, desc)
- `conv_id` (string, UUID, optional): Filter by conversation ID
- `sender_id` (string, UUID, optional): Filter by sender ID

**Response:**
```json
[
  {
    "id": "ab4a7b5f-7aa4-4a9f-bf61-a30aef6b1ef4",
    "conv_id": "c1c1d8f0-0c0d-4f2d-9c1a-1a2b3c4d5e6f",
    "sender_id": "c2f8f4d8-6d8a-4a4f-8a2d-7d47a6b12d77",
    "content": "Hey! Is this still available?",
    "images": [],
    "ref_post_id": null,
    "created_at": "2025-09-02T04:01:00Z",
    "updated_at": "2025-09-02T04:01:00Z"
  }
]
```

#### POST /json/messages
Send a new message in a conversation.

**Request Body:**
```json
{
  "conv_id": "c1c1d8f0-0c0d-4f2d-9c1a-1a2b3c4d5e6f",
  "sender_id": "c2f8f4d8-6d8a-4a4f-8a2d-7d47a6b12d77",
  "content": "Hey! Is this still available?",
  "images": [],
  "ref_post_id": null
}
```

**Response:** 201 Created with message object

### Real-time Events

#### GET /json/events
Subscribe to real-time events via Server-Sent Events.

**Query Parameters:**
- `user_id` (string, UUID, required): User ID to subscribe to events for

**Response:** Server-Sent Events stream

**Event Types:**
- `messages`: New messages for the user
- `prefetch`: Recommended posts based on user's city

**Event Format:**
```
event: messages
data: {"type":"messages","data":[...],"ts":"2025-01-27T10:30:00Z"}

event: prefetch
data: {"type":"prefetch","data":[...],"ts":"2025-01-27T10:30:00Z"}
```

## Data Models

### User
- `id`: UUID (Primary Key)
- `phone_e164`: String (Unique, Nullable)
- `email`: String (Unique, Nullable)
- `birthday`: Date (YYYY-MM-DD, Nullable)
- `username`: String (Unique, Required)
- `avatar_url`: String (Nullable)
- `school`: String (Nullable)
- `city`: String (Nullable)
- `language`: Enum('zh', 'en') (Default: 'en', Nullable)
- `banned_until`: DateTime (ISO 8601, Nullable)
- `created_at`: DateTime (ISO 8601, Required)
- `updated_at`: DateTime (ISO 8601, Required)

### ForumPost
- `id`: UUID (Primary Key)
- `author_id`: UUID (Foreign Key → User.id, Required)
- `title`: String (Required)
- `content`: String (Markdown allowed, Required)
- `city`: String (Nullable)
- `province`: String (Nullable)
- `tags`: Array<String> (JSON array)
- `visibility`: Enum('public', 'friends', 'private') (Default: 'public')
- `post_type`: Enum('general', 'market', 'housing', 'lfg') (Required)
- `status`: Enum('active', 'closed', 'deleted') (Required)
- `images`: Array<String> (URLs, JSON array)
- `created_at`: DateTime (ISO 8601, Required)
- `updated_at`: DateTime (ISO 8601, Required)
- `deleted_at`: DateTime (ISO 8601, Nullable)

### MarketListing
- `id`: UUID (Primary Key)
- `forum_post_id`: UUID (Foreign Key → ForumPost.id, Required)
- `category`: Enum('electronics', 'furniture', 'home_appliances', 'vehicles', 'books', 'fashion', 'sports', 'entertainment', 'digital', 'other') (Required)
- `price`: Decimal(2 decimal places) (Required)
- `trade_methods`: Array<Enum('meetup', 'pickup', 'delivery', 'shipping')> (JSON array)
- `created_at`: DateTime (ISO 8601, Required)
- `updated_at`: DateTime (ISO 8601, Required)

### Conversation
- `id`: UUID (Primary Key)
- `user_a`: UUID (Foreign Key → User.id, Required)
- `user_b`: UUID (Foreign Key → User.id, Required)
- `created_at`: DateTime (ISO 8601, Required)
- `updated_at`: DateTime (ISO 8601, Required)

### Message
- `id`: UUID (Primary Key)
- `conv_id`: UUID (Foreign Key → Conversation.id, Required)
- `sender_id`: UUID (Foreign Key → User.id, Required)
- `content`: String (Required)
- `images`: Array<String> (URLs, JSON array)
- `ref_post_id`: UUID (Foreign Key → ForumPost.id, Nullable)
- `created_at`: DateTime (ISO 8601, Required)
- `updated_at`: DateTime (ISO 8601, Required)

## Business Rules

1. **User Constraints**:
   - phone_e164, email, and username must be unique if provided
   - At least one of phone_e164, email, or username must be provided

2. **ForumPost Constraints**:
   - author_id must reference an existing User
   - post_type determines which specialization table to use

3. **MarketListing Constraints**:
   - city must be provided if category != 'digital'
   - forum_post_id must reference a ForumPost with post_type = 'market'

4. **Conversation Constraints**:
   - (user_a, user_b) pair must be unique (unordered)
   - user_a != user_b

5. **Message Constraints**:
   - conv_id must reference an existing Conversation
   - sender_id must be either user_a or user_b in the referenced Conversation
   - ref_post_id must reference an existing ForumPost if provided

## Error Handling

All errors return a JSON object with an `error` field containing the error message and optionally a `code` field with the HTTP status code.

**Example Error Response:**
```json
{
  "error": "username must be unique",
  "code": 400
}
```

## Rate Limiting

Currently no rate limiting is implemented for the MVP. This should be added in production.

## CORS

CORS headers are only enabled in development when not using a proxy. In production, the API should be served from the same origin as the frontend.
