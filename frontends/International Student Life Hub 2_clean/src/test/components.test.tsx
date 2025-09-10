import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomNavigation } from '../components/BottomNavigation';

// Mock haptics
vi.mock('../lib/haptics', () => ({
  HapticsService: {
    impactLight: vi.fn(),
    impactMedium: vi.fn(),
    impactHeavy: vi.fn(),
  },
}));

describe('Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('BottomNavigation', () => {
    it('should render navigation items', () => {
      const mockOnNavigate = vi.fn();
      render(
        <BottomNavigation 
          currentScreen="explore" 
          onNavigate={mockOnNavigate} 
        />
      );

      expect(screen.getByText('猜你喜歡')).toBeInTheDocument();
      expect(screen.getByText('廣場')).toBeInTheDocument();
      expect(screen.getByText('消息')).toBeInTheDocument();
      expect(screen.getByText('我的')).toBeInTheDocument();
    });

    it('should call onNavigate when item is clicked', async () => {
      const mockOnNavigate = vi.fn();
      render(
        <BottomNavigation 
          currentScreen="explore" 
          onNavigate={mockOnNavigate} 
        />
      );

      const forYouButton = screen.getByText('猜你喜歡');
      await userEvent.click(forYouButton);
      
      expect(mockOnNavigate).toHaveBeenCalledWith('foryou');
    });

    it('should highlight active screen', () => {
      render(
        <BottomNavigation 
          currentScreen="foryou" 
          onNavigate={vi.fn()} 
        />
      );

      const forYouSpan = screen.getByText('猜你喜歡');
      expect(forYouSpan).toHaveClass('text-yellow-500');
    });
  });
});
