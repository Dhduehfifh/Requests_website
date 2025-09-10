# International Student Life Hub - Frontend

This is the frontend application for the International Student Life Hub, built with React, TypeScript, and Vite.

## Features

- **Modern React 18** with TypeScript
- **Responsive Design** optimized for mobile devices
- **Real-time Communication** via WebSocket and Server-Sent Events
- **Mobile App Ready** with Capacitor for iOS/Android
- **Haptic Feedback** for native mobile experience
- **API Integration** with comprehensive error handling
- **Fixed Bottom Navigation** with safe area support

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

### Development with Backend

1. Start the backend server (in another terminal):
   ```bash
   cd ../../backend
   ./start_server.sh
   ```

2. The frontend will automatically proxy API requests to `http://127.0.0.1:8000`

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── figma/           # Design system components
│   ├── ForYouScreen.tsx # Recommendation feed
│   ├── ExploreScreen.tsx # Main exploration screen
│   ├── MessagesScreen.tsx # Chat and messaging
│   ├── ProfileScreen.tsx # User profile
│   └── BottomNavigation.tsx # Fixed bottom nav
├── lib/                 # Utilities and services
│   ├── api.ts          # API client
│   ├── realtime.ts     # Real-time communication
│   └── haptics.ts      # Mobile haptic feedback
├── types/              # TypeScript type definitions
│   └── api.ts          # API types
├── styles/             # Global styles
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## API Integration

The app uses a centralized API client (`src/lib/api.ts`) that provides:

- **Type-safe API calls** with full TypeScript support
- **Automatic error handling** with user-friendly messages
- **Request/response validation** based on schema.json
- **Pagination support** for list endpoints
- **Real-time updates** via WebSocket/SSE

### Environment Variables

Create `.env.development`:
```env
VITE_API_BASE=http://127.0.0.1:8000
VITE_WS_URL=ws://127.0.0.1:8080
```

For production, update these to your production API endpoints.

## Real-time Communication

The app supports real-time updates through:

1. **WebSocket** (primary) - `ws://127.0.0.1:8080`
2. **Server-Sent Events** (fallback) - `/json/events`

### Usage

```typescript
import { useRealtime } from '../lib/realtime';

const { connection, isConnected } = useRealtime({
  userId: 'user-id',
  onMessages: (messages) => {
    // Handle new messages
  },
  onPrefetch: (posts) => {
    // Handle recommended posts
  }
});
```

## Mobile App Development

### Building for Mobile

1. Build the web app:
   ```bash
   npm run build
   ```

2. Copy assets to native projects:
   ```bash
   npx cap copy
   ```

3. Open in native IDE:
   ```bash
   npx cap open ios     # For iOS
   npx cap open android # For Android
   ```

### Haptic Feedback

The app includes haptic feedback for mobile devices:

```typescript
import { HapticsService } from '../lib/haptics';

// Light impact (button taps)
await HapticsService.impactLight();

// Medium impact (important actions)
await HapticsService.impactMedium();

// Heavy impact (errors)
await HapticsService.impactHeavy();

// Selection feedback
await HapticsService.selection();

// Notifications
await HapticsService.notification('success');
```

### Safe Area Support

The bottom navigation includes safe area support for iOS devices:

```css
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Component Architecture

### Container vs Presentational Components

- **Container Components**: Handle data fetching and state management
- **Presentational Components**: Pure UI components with props

### State Management

- **Local State**: `useState` for component-specific state
- **API State**: Custom hooks for API data
- **Global State**: Context API for user authentication (future)

### Error Handling

All components include comprehensive error handling:

```typescript
const [error, setError] = useState<string | null>(null);

try {
  const data = await apiCall();
  setData(data);
} catch (err) {
  if (isApiError(err)) {
    setError(err.message);
  } else {
    setError('An unexpected error occurred');
  }
}
```

## Styling

The app uses Tailwind CSS with custom design tokens:

- **Colors**: Yellow primary theme with gray neutrals
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 4px grid system
- **Components**: Radix UI primitives with custom styling

### Custom CSS Classes

- `.cheese-gradient`: Yellow gradient background
- `.cheese-hole`: White circle overlay
- `.safe-area-inset-bottom`: iOS safe area padding

## Performance Optimization

### Code Splitting

- Route-based code splitting with React.lazy
- Component-level splitting for large components

### Image Optimization

- Lazy loading with intersection observer
- Placeholder images while loading
- Responsive image sizing

### API Optimization

- Request deduplication
- Response caching
- Pagination for large lists

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Manual Testing

1. **API Integration**: Test all API endpoints
2. **Real-time**: Test WebSocket and SSE connections
3. **Mobile**: Test on iOS Simulator and Android Emulator
4. **Responsive**: Test on different screen sizes

## Deployment

### Web Deployment

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy the `build/` directory to your hosting service

### Mobile App Deployment

1. Build and copy assets:
   ```bash
   npm run build
   npx cap copy
   ```

2. Open in native IDE and build:
   ```bash
   npx cap open ios
   npx cap open android
   ```

3. Follow platform-specific deployment guides

## Troubleshooting

### Common Issues

1. **API Connection Failed**: Check backend server is running
2. **WebSocket Connection Failed**: Check WebSocket server is running
3. **Build Errors**: Clear node_modules and reinstall
4. **Mobile Build Issues**: Update Capacitor and native dependencies

### Debug Mode

Enable debug logging:

```typescript
// In src/lib/api.ts
const DEBUG = import.meta.env.DEV;
if (DEBUG) console.log('API Request:', endpoint, data);
```

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include error handling for API calls
4. Add haptic feedback for user interactions
5. Test on both web and mobile platforms

## License

This project is part of the International Student Life Hub MVP.