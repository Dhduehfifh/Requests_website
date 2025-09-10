# International Student Life Hub - MVP

A comprehensive platform for international students to connect, trade items, find housing, and organize activities.

## 🚀 Quick Start

### Prerequisites

- **PHP 8.0+** with SQLite extension
- **Node.js 18+** with npm
- **iOS Simulator** (for mobile development)
- **Android Studio** (for mobile development)

### 1. Start Backend

```bash
cd backend
./start_server.sh
```

The API will be available at `http://127.0.0.1:8000`

### 2. Start Frontend

```bash
cd frontends/International\ Student\ Life\ Hub\ 2_clean
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Test API

```bash
curl http://127.0.0.1:8000/json/health
```

## 📱 Mobile App

### Build for Mobile

```bash
cd frontends/International\ Student\ Life\ Hub\ 2_clean
npm run build
npx cap copy
npx cap open ios     # For iOS
npx cap open android # For Android
```

## 🏗️ Architecture

### Backend (PHP + SQLite)
- **Location**: `backend/`
- **API**: RESTful JSON API at `/json/*`
- **Database**: SQLite with auto-migration from `schema.json`
- **Real-time**: WebSocket + SSE support
- **Validation**: Centralized input validation

### Frontend (React + TypeScript)
- **Location**: `frontends/International Student Life Hub 2_clean/`
- **Framework**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI
- **Mobile**: Capacitor for iOS/Android
- **Real-time**: WebSocket + SSE client

## 📊 Database Schema

The database schema is defined in `backend/api/schema.json` and includes:

- **Users**: User profiles and authentication
- **ForumPosts**: Generic posts (market/housing/lfg)
- **MarketListings**: Specialized posts for buying/selling
- **HousingListings**: Specialized posts for housing
- **LfgPosts**: Specialized posts for "looking for group"
- **Conversations**: Private conversations between users
- **Messages**: Messages within conversations

See `backend/docs/uml.md` for the complete UML diagram.

## 🔌 API Endpoints

### Core Endpoints
- `GET /json/health` - Health check
- `GET /json/posts` - List posts with filtering
- `POST /json/posts` - Create post
- `GET /json/users` - List users
- `POST /json/users` - Create user
- `GET /json/conversations` - List conversations
- `POST /json/messages` - Send message
- `GET /json/events` - Real-time events (SSE)

### Real-time Events
- **WebSocket**: `ws://127.0.0.1:8080` (primary)
- **SSE**: `GET /json/events?user_id=USER_ID` (fallback)

See `backend/docs/api.md` for complete API documentation.

## 🎨 Frontend Features

### Screens
- **ForYouScreen**: Personalized recommendations
- **ExploreScreen**: Main exploration hub
- **MessagesScreen**: Real-time messaging
- **ProfileScreen**: User profile management

### Mobile Features
- **Fixed Bottom Navigation** with safe area support
- **Haptic Feedback** for native feel
- **Responsive Design** for all screen sizes
- **Real-time Updates** via WebSocket/SSE

### Components
- **Container Components**: Handle data fetching
- **Presentational Components**: Pure UI components
- **API Client**: Type-safe API calls
- **Real-time Client**: WebSocket/SSE management

## 🔧 Development

### Backend Development

```bash
cd backend
php -S 127.0.0.1:8000 -t public/
```

### Frontend Development

```bash
cd frontends/International\ Student\ Life\ Hub\ 2_clean
npm run dev
```

### Database Management

The database is automatically created and migrated from `schema.json`. To reset:

```bash
rm backend/api/data.db
# Restart backend server
```

## 📱 Mobile Development

### iOS Development

1. Install Xcode
2. Open project: `npx cap open ios`
3. Build and run in iOS Simulator

### Android Development

1. Install Android Studio
2. Open project: `npx cap open android`
3. Build and run in Android Emulator

### Haptic Feedback

The app includes haptic feedback for mobile devices:

```typescript
import { HapticsService } from '../lib/haptics';

await HapticsService.impactLight();    // Button taps
await HapticsService.impactMedium();   // Important actions
await HapticsService.impactHeavy();    // Errors
await HapticsService.selection();      // Selection feedback
```

## 🧪 Testing

### Backend Testing

```bash
# Test health endpoint
curl http://127.0.0.1:8000/json/health

# Test user creation
curl -X POST http://127.0.0.1:8000/json/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com"}'

# Test post creation
curl -X POST http://127.0.0.1:8000/json/posts \
  -H "Content-Type: application/json" \
  -d '{"author_id":"USER_ID","title":"Test Post","content":"Test content","post_type":"general","images":[]}'
```

### Frontend Testing

1. Open `http://localhost:3000`
2. Navigate through all screens
3. Test API integration
4. Test real-time features
5. Test mobile responsiveness

## 📚 Documentation

- **Backend API**: `backend/docs/api.md`
- **Database Schema**: `backend/docs/uml.md`
- **Frontend Guide**: `frontends/International Student Life Hub 2_clean/README.md`
- **API Fetch Map**: `frontends/International Student Life Hub 2_clean/docs/fetch-map.md`

## 🚀 Deployment

### Web Deployment

1. Build frontend: `npm run build`
2. Deploy `build/` directory to hosting service
3. Deploy backend to PHP hosting service

### Mobile App Deployment

1. Build web app: `npm run build`
2. Copy to native: `npx cap copy`
3. Build native apps in Xcode/Android Studio
4. Submit to App Store/Google Play

## 🔒 Security

- **CORS**: Enabled for development, disable in production
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection**: Protected with prepared statements
- **XSS**: Sanitized output in frontend

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**: Check backend server is running
2. **WebSocket Connection Failed**: Check WebSocket server is running
3. **Build Errors**: Clear node_modules and reinstall
4. **Mobile Build Issues**: Update Capacitor and native dependencies

### Debug Mode

Enable debug logging in development:

```typescript
// Frontend
const DEBUG = import.meta.env.DEV;

// Backend
define('DEBUG', true);
```

## 📈 Performance

### Backend Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Response Caching**: Cache frequently accessed data
- **Connection Pooling**: Efficient database connections

### Frontend Optimization
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Lazy loading and responsive images
- **API Optimization**: Request deduplication and caching

## 🤝 Contributing

1. Follow existing code style
2. Add TypeScript types for new features
3. Include error handling for API calls
4. Add haptic feedback for user interactions
5. Test on both web and mobile platforms

## 📄 License

This project is part of the International Student Life Hub MVP.

## 🎯 MVP Goals

✅ **Backend API** with full CRUD operations  
✅ **Frontend App** with real API integration  
✅ **Real-time Communication** via WebSocket/SSE  
✅ **Mobile App** ready for iOS/Android  
✅ **Database Schema** with auto-migration  
✅ **Comprehensive Documentation**  
✅ **Haptic Feedback** for mobile experience  
✅ **Fixed Bottom Navigation** with safe area support  

The MVP is now complete and ready for testing and deployment!
