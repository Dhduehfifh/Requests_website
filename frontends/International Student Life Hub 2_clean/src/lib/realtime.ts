// Real-time communication utilities for WebSocket and SSE
import type { SSEEnvelope, MessagesEvent, PrefetchEvent, Message } from '../types/api';

export interface RealtimeConfig {
  userId: string;
  onMessages?: (messages: Message[]) => void;
  onPrefetch?: (posts: Array<{ id: string; title: string; post_type: string; city?: string; created_at: string }>) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export class RealtimeConnection {
  private ws: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private config: RealtimeConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor(config: RealtimeConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      // Try WebSocket first
      await this.connectWebSocket();
    } catch (error) {
      console.warn('WebSocket connection failed, falling back to SSE:', error);
      // Fall back to SSE
      this.connectSSE();
    } finally {
      this.isConnecting = false;
    }
  }

  private connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://127.0.0.1:8080`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.config.onConnect?.();
          
          // Subscribe to user events
          this.ws?.send(JSON.stringify({
            type: 'subscribe',
            user_id: this.config.userId
          }));
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data: SSEEnvelope = JSON.parse(event.data);
            this.handleEvent(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.config.onDisconnect?.();
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        // Timeout after 5 seconds
        setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 5000);

      } catch (error) {
        reject(error);
      }
    });
  }

  private connectSSE(): void {
    try {
      const sseUrl = `/json/events?user_id=${this.config.userId}`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        console.log('SSE connected');
        this.reconnectAttempts = 0;
        this.config.onConnect?.();
      };

      this.eventSource.addEventListener('messages', (event) => {
        try {
          const data: MessagesEvent = JSON.parse(event.data);
          this.config.onMessages?.(data.data);
        } catch (error) {
          console.error('Failed to parse SSE messages event:', error);
        }
      });

      this.eventSource.addEventListener('prefetch', (event) => {
        try {
          const data: PrefetchEvent = JSON.parse(event.data);
          this.config.onPrefetch?.(data.data);
        } catch (error) {
          console.error('Failed to parse SSE prefetch event:', error);
        }
      });

      this.eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        this.config.onError?.(new Error('SSE connection error'));
        this.handleReconnect();
      };

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      this.config.onError?.(error instanceof Error ? error : new Error('SSE connection failed'));
    }
  }

  private handleEvent(data: SSEEnvelope): void {
    switch (data.type) {
      case 'messages':
        this.config.onMessages?.(data.data);
        break;
      case 'prefetch':
        this.config.onPrefetch?.(data.data);
        break;
      default:
        console.log('Unknown event type:', data.type);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.config.onError?.(new Error('Max reconnection attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  ping(): void {
    this.sendMessage({ type: 'ping' });
  }
}

// Convenience function to create and connect
export function connectRealtime(config: RealtimeConfig): RealtimeConnection {
  const connection = new RealtimeConnection(config);
  connection.connect();
  return connection;
}

// Hook for React components
export function useRealtime(config: RealtimeConfig) {
  const [connection, setConnection] = React.useState<RealtimeConnection | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const conn = new RealtimeConnection({
      ...config,
      onConnect: () => {
        setIsConnected(true);
        config.onConnect?.();
      },
      onDisconnect: () => {
        setIsConnected(false);
        config.onDisconnect?.();
      },
      onError: (error) => {
        setIsConnected(false);
        config.onError?.(error);
      },
    });

    conn.connect();
    setConnection(conn);

    return () => {
      conn.disconnect();
    };
  }, [config.userId]);

  return { connection, isConnected };
}

// Import React for the hook (this will be available in the React environment)
import React from 'react';
