import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { extractUrls, LinkCard, TextWithLinks, EnhancedTextRenderer } from '../lib/linkRenderer';

describe('Link Renderer', () => {
  describe('extractUrls', () => {
    it('should extract URLs from text', () => {
      const text = 'Check out https://example.com and https://test.org for more info';
      const urls = extractUrls(text);
      expect(urls).toEqual(['https://example.com', 'https://test.org']);
    });

    it('should return empty array for text without URLs', () => {
      const text = 'This is just plain text without any links';
      const urls = extractUrls(text);
      expect(urls).toEqual([]);
    });

    it('should handle mixed content', () => {
      const text = 'Visit https://github.com for code and https://stackoverflow.com for help';
      const urls = extractUrls(text);
      expect(urls).toEqual(['https://github.com', 'https://stackoverflow.com']);
    });
  });

  describe('LinkCard', () => {
    it('should render link card with provided props', () => {
      render(
        <LinkCard
          url="https://example.com"
          title="Example Site"
          description="A great example website"
          domain="example.com"
        />
      );

      expect(screen.getByText('Example Site')).toBeInTheDocument();
      expect(screen.getByText('A great example website')).toBeInTheDocument();
      expect(screen.getByText('example.com')).toBeInTheDocument();
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should generate title and description when not provided', () => {
      render(<LinkCard url="https://leetcode.com/problemset/all/" />);

      expect(screen.getByText('all')).toBeInTheDocument();
      expect(screen.getByText('Practice coding problems and improve your algorithms')).toBeInTheDocument();
      expect(screen.getByText('leetcode.com')).toBeInTheDocument();
    });
  });

  describe('TextWithLinks', () => {
    it('should render text with link cards for URLs', () => {
      render(
        <TextWithLinks text="Check out https://example.com for more info" />
      );

      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Check out ';
      })).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === ' for more info';
      })).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
    });

    it('should render plain text without links', () => {
      render(<TextWithLinks text="This is just plain text" />);
      expect(screen.getByText('This is just plain text')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('EnhancedTextRenderer', () => {
    it('should render text with links when showLinks is true', () => {
      render(
        <EnhancedTextRenderer 
          text="Visit https://github.com for code" 
          showLinks={true}
        />
      );

      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Visit ';
      })).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === ' for code';
      })).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com');
    });

    it('should render plain text when showLinks is false', () => {
      render(
        <EnhancedTextRenderer 
          text="Visit https://github.com for code" 
          showLinks={false}
        />
      );

      expect(screen.getByText('Visit https://github.com for code')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <EnhancedTextRenderer 
          text="Test text" 
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
