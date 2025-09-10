// Haptics utility for mobile app feedback
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export class HapticsService {
  private static isNative = false;

  static async init() {
    try {
      // Check if we're running in a native environment
      this.isNative = typeof window !== 'undefined' && 
        (window as any).Capacitor?.isNativePlatform();
    } catch (error) {
      console.log('Haptics not available:', error);
      this.isNative = false;
    }
  }

  static async impactLight() {
    if (!this.isNative) {
      console.log('Haptics: impactLight (web fallback)');
      return;
    }

    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.warn('Haptics impact failed:', error);
    }
  }

  static async impactMedium() {
    if (!this.isNative) {
      console.log('Haptics: impactMedium (web fallback)');
      return;
    }

    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.warn('Haptics impact failed:', error);
    }
  }

  static async impactHeavy() {
    if (!this.isNative) {
      console.log('Haptics: impactHeavy (web fallback)');
      return;
    }

    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.warn('Haptics impact failed:', error);
    }
  }

  static async selection() {
    if (!this.isNative) {
      console.log('Haptics: selection (web fallback)');
      return;
    }

    try {
      await Haptics.selectionStart();
      await new Promise(resolve => setTimeout(resolve, 10));
      await Haptics.selectionEnd();
    } catch (error) {
      console.warn('Haptics selection failed:', error);
    }
  }

  static async notification(type: 'success' | 'warning' | 'error') {
    if (!this.isNative) {
      console.log(`Haptics: notification ${type} (web fallback)`);
      return;
    }

    try {
      switch (type) {
        case 'success':
          await Haptics.notification({ type: 'SUCCESS' });
          break;
        case 'warning':
          await Haptics.notification({ type: 'WARNING' });
          break;
        case 'error':
          await Haptics.notification({ type: 'ERROR' });
          break;
      }
    } catch (error) {
      console.warn('Haptics notification failed:', error);
    }
  }
}

// Initialize haptics when the module is loaded
HapticsService.init();
