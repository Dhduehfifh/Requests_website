# Database UML Class Diagram

This document contains the UML class diagram generated from `schema.json` representing the database structure for the International Student Life Hub.

## Mermaid Class Diagram

```mermaid
classDiagram
    class User {
        +String id PK
        +String phone_e164 UK
        +String email UK
        +Date birthday
        +String username UK
        +String avatar_url
        +String school
        +String city
        +Enum language
        +DateTime banned_until
        +DateTime created_at
        +DateTime updated_at
    }

    class ForumPost {
        +String id PK
        +String author_id FK
        +String title
        +String content
        +String city
        +String province
        +Array~String~ tags
        +Enum visibility
        +Enum post_type
        +Enum status
        +Array~String~ images
        +DateTime created_at
        +DateTime updated_at
        +DateTime deleted_at
    }

    class ForumComment {
        +String id PK
        +String post_id FK
        +String author_id FK
        +String content
        +DateTime created_at
        +DateTime updated_at
        +DateTime deleted_at
    }

    class MarketListing {
        +String id PK
        +String forum_post_id FK
        +Enum category
        +Decimal price
        +Array~Enum~ trade_methods
        +DateTime created_at
        +DateTime updated_at
    }

    class HousingListing {
        +String id PK
        +String forum_post_id FK
        +String address
        +String unit_number
        +String city
        +String province
        +String postal_code
        +Enum housing_type
        +String housing_type_other
        +Decimal rent
        +Enum rent_unit
        +DateTime created_at
        +DateTime updated_at
    }

    class LfgPost {
        +String id PK
        +String forum_post_id FK
        +String topic
        +Integer people_needed
        +Integer total_expected
        +Boolean online
        +DateTime created_at
        +DateTime updated_at
    }

    class Conversation {
        +String id PK
        +String user_a FK
        +String user_b FK
        +DateTime created_at
        +DateTime updated_at
    }

    class Message {
        +String id PK
        +String conv_id FK
        +String sender_id FK
        +String content
        +Array~String~ images
        +String ref_post_id FK
        +DateTime created_at
        +DateTime updated_at
    }

    %% Relationships
    User ||--o{ ForumPost : "writes"
    User ||--o{ ForumComment : "writes"
    User ||--o{ Conversation : "participates"
    
    ForumPost ||--o{ ForumComment : "has"
    ForumPost ||--o| MarketListing : "specializes (market)"
    ForumPost ||--o| HousingListing : "specializes (housing)"
    ForumPost ||--o| LfgPost : "specializes (lfg)"
    
    Conversation ||--o{ Message : "contains"
    User ||--o{ Message : "sends"
    ForumPost ||--o{ Message : "references"
```

## Field Types and Constraints

### User
- **id**: UUID (Primary Key)
- **phone_e164**: String (Unique, Nullable)
- **email**: String (Unique, Nullable)
- **birthday**: Date (YYYY-MM-DD, Nullable)
- **username**: String (Unique, Required)
- **avatar_url**: String (Nullable)
- **school**: String (Nullable)
- **city**: String (Nullable)
- **language**: Enum('zh', 'en') (Default: 'en', Nullable)
- **banned_until**: DateTime (ISO 8601, Nullable)
- **created_at**: DateTime (ISO 8601, Required)
- **updated_at**: DateTime (ISO 8601, Required)

### ForumPost
- **id**: UUID (Primary Key)
- **author_id**: UUID (Foreign Key → User.id, Required)
- **title**: String (Required)
- **content**: String (Markdown allowed, Required)
- **city**: String (Nullable)
- **province**: String (Nullable)
- **tags**: Array<String> (JSON array)
- **visibility**: Enum('public', 'friends', 'private') (Default: 'public')
- **post_type**: Enum('general', 'market', 'housing', 'lfg') (Required)
- **status**: Enum('active', 'closed', 'deleted') (Required)
- **images**: Array<String> (URLs, JSON array)
- **created_at**: DateTime (ISO 8601, Required)
- **updated_at**: DateTime (ISO 8601, Required)
- **deleted_at**: DateTime (ISO 8601, Nullable)

### MarketListing
- **id**: UUID (Primary Key)
- **forum_post_id**: UUID (Foreign Key → ForumPost.id, Required)
- **category**: Enum('electronics', 'furniture', 'home_appliances', 'vehicles', 'books', 'fashion', 'sports', 'entertainment', 'digital', 'other') (Required)
- **price**: Decimal(2 decimal places) (Required)
- **trade_methods**: Array<Enum('meetup', 'pickup', 'delivery', 'shipping')> (JSON array)
- **created_at**: DateTime (ISO 8601, Required)
- **updated_at**: DateTime (ISO 8601, Required)

### HousingListing
- **id**: UUID (Primary Key)
- **forum_post_id**: UUID (Foreign Key → ForumPost.id, Required)
- **address**: String (Required)
- **unit_number**: String (Nullable)
- **city**: String (Required)
- **province**: String (Required)
- **postal_code**: String (Required)
- **housing_type**: Enum('house', 'apartment', 'condo', 'townhouse', 'other') (Required)
- **housing_type_other**: String (Nullable, Required if housing_type = 'other')
- **rent**: Decimal(2 decimal places) (Required)
- **rent_unit**: Enum('year', 'month', 'week', 'day') (Required)
- **created_at**: DateTime (ISO 8601, Required)
- **updated_at**: DateTime (ISO 8601, Required)

### LfgPost
- **id**: UUID (Primary Key)
- **forum_post_id**: UUID (Foreign Key → ForumPost.id, Required)
- **topic**: String (Required)
- **people_needed**: Integer (Nullable)
- **total_expected**: Integer (Nullable)
- **online**: Boolean (Required)
- **created_at**: DateTime (ISO 8601, Required)
- **updated_at**: DateTime (ISO 8601, Required)

### Conversation
- **id**: UUID (Primary Key)
- **user_a**: UUID (Foreign Key → User.id, Required)
- **user_b**: UUID (Foreign Key → User.id, Required)
- **created_at**: DateTime (ISO 8601, Required)
- **updated_at**: DateTime (ISO 8601, Required)

### Message
- **id**: UUID (Primary Key)
- **conv_id**: UUID (Foreign Key → Conversation.id, Required)
- **sender_id**: UUID (Foreign Key → User.id, Required)
- **content**: String (Required)
- **images**: Array<String> (URLs, JSON array)
- **ref_post_id**: UUID (Foreign Key → ForumPost.id, Nullable)
- **created_at**: DateTime (ISO 8601, Required)
- **updated_at**: DateTime (ISO 8601, Required)

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

4. **HousingListing Constraints**:
   - housing_type_other must be provided if housing_type = 'other'
   - forum_post_id must reference a ForumPost with post_type = 'housing'

5. **LfgPost Constraints**:
   - If online = false, then ForumPost.city and ForumPost.province must be non-null
   - forum_post_id must reference a ForumPost with post_type = 'lfg'

6. **Conversation Constraints**:
   - (user_a, user_b) pair must be unique (unordered)
   - user_a != user_b

7. **Message Constraints**:
   - conv_id must reference an existing Conversation
   - sender_id must be either user_a or user_b in the referenced Conversation
   - ref_post_id must reference an existing ForumPost if provided

## Indexes

Recommended indexes for performance:
- `users(phone_e164)` - Unique index
- `users(email)` - Unique index  
- `users(username)` - Unique index
- `forum_posts(author_id)` - Foreign key index
- `forum_posts(post_type)` - Filter index
- `forum_posts(city)` - Filter index
- `forum_posts(created_at)` - Order index
- `forum_comments(post_id)` - Foreign key index
- `market_listings(forum_post_id)` - Foreign key index
- `housing_listings(forum_post_id)` - Foreign key index
- `lfg_posts(forum_post_id)` - Foreign key index
- `conversations(user_a, user_b)` - Unique composite index
- `messages(conv_id)` - Foreign key index
- `messages(created_at)` - Order index
