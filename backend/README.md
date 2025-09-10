# International Student Life Hub - Backend

This is the backend API for the International Student Life Hub, built with PHP 8 and SQLite.

## Features

- **RESTful JSON API** with full CRUD operations
- **Real-time communication** via Server-Sent Events (SSE)
- **Automatic database migration** from schema.json
- **Comprehensive validation** with detailed error messages
- **CORS support** for development
- **Type-safe ORM** with SQLite backend

## Quick Start

### Prerequisites

- PHP 8.0 or higher
- SQLite extension enabled

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   ./start_server.sh
   ```

   Or manually:
   ```bash
   php -S 127.0.0.1:8000 -t public/
   ```

3. The API will be available at `http://127.0.0.1:8000`

### Testing the API

Test the health endpoint:
```bash
curl http://127.0.0.1:8000/json/health
```

Expected response:
```json
{
  "ok": true,
  "service": "json-api",
  "time": "2025-01-27T10:30:00Z"
}
```

## API Endpoints

### Health Check
- `GET /json/health` - Check API health

### Users
- `GET /json/users` - List users (with pagination and filtering)
- `POST /json/users` - Create user
- `GET /json/users/{id}` - Get user by ID
- `PATCH /json/users/{id}` - Update user

### Forum Posts
- `GET /json/posts` - List posts (with pagination and filtering)
- `POST /json/posts` - Create post
- `GET /json/posts/{id}` - Get post by ID
- `PATCH /json/posts/{id}` - Update post

### Market Listings
- `GET /json/market_listings` - List market listings
- `POST /json/market_listings` - Create market listing

### Conversations
- `GET /json/conversations` - List conversations
- `POST /json/conversations` - Create conversation

### Messages
- `GET /json/messages` - List messages
- `POST /json/messages` - Send message

### Real-time Events
- `GET /json/events?user_id=USER_ID` - Subscribe to real-time events (SSE)

## Database

The database is automatically created and migrated from `schema.json` on first run. The SQLite database file is stored at `api/data.db`.

### Schema

The database schema is defined in `schema.json` and includes:

- **Users**: User profiles and authentication
- **ForumPosts**: Generic posts that can be specialized
- **MarketListings**: Specialized posts for buying/selling
- **HousingListings**: Specialized posts for housing
- **LfgPosts**: Specialized posts for "looking for group"
- **Conversations**: Private conversations between users
- **Messages**: Messages within conversations

## Development

### Project Structure

```
backend/
├── api/
│   ├── config.php          # Database configuration
│   ├── migrations.php      # Database migration logic
│   ├── orm.php            # ORM and model definitions
│   ├── validate.php       # Validation utilities
│   ├── api.php            # API routing and handlers
│   └── data.db            # SQLite database (auto-created)
├── docs/
│   ├── uml.md             # Database UML diagram
│   ├── api.md             # Human-readable API docs
│   └── api.json           # OpenAPI specification
├── public/
│   └── index.php          # Main API entry point
├── start_server.sh        # Server startup script
└── README.md              # This file
```

### Adding New Endpoints

1. Add the route in `api/api.php`
2. Add validation in `api/validate.php` if needed
3. Update the ORM model in `api/orm.php` if needed
4. Update the API documentation

### Validation

All input validation is centralized in `api/validate.php`. The validation functions include:

- `validate_user_data()` - User validation
- `validate_forum_post_data()` - Forum post validation
- `validate_market_listing_data()` - Market listing validation
- `validate_conversation_data()` - Conversation validation
- `validate_message_data()` - Message validation

### Error Handling

All errors return a consistent JSON format:

```json
{
  "error": "Error message",
  "code": 400
}
```

## Real-time Communication

The API supports real-time communication via Server-Sent Events (SSE). To subscribe to events:

```javascript
const eventSource = new EventSource('/json/events?user_id=USER_ID');

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

eventSource.addEventListener('messages', function(event) {
  const data = JSON.parse(event.data);
  console.log('New messages:', data.data);
});

eventSource.addEventListener('prefetch', function(event) {
  const data = JSON.parse(event.data);
  console.log('Recommended posts:', data.data);
});
```

## Production Deployment

For production deployment:

1. **Disable CORS**: Remove or modify CORS headers in `public/index.php`
2. **Use a proper web server**: Replace PHP built-in server with Apache/Nginx
3. **Enable HTTPS**: Configure SSL certificates
4. **Set up monitoring**: Add logging and monitoring
5. **Configure rate limiting**: Add rate limiting middleware
6. **Database optimization**: Consider PostgreSQL for production

## Troubleshooting

### Common Issues

1. **Database not created**: Ensure the `api/` directory is writable
2. **CORS errors**: Check that CORS headers are properly set
3. **Validation errors**: Check the validation rules in `api/validate.php`
4. **SQLite errors**: Ensure SQLite extension is enabled in PHP

### Debug Mode

To enable debug mode, set the `DEBUG` constant in `api/config.php` to `true`.

## License

This project is part of the International Student Life Hub MVP.
