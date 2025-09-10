// Link renderer utility for automatically detecting and rendering links
import React from 'react';

interface LinkCardProps {
  url: string;
  title?: string;
  description?: string;
  domain?: string;
}

// Extract domain from URL
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

// Generate title from URL if not provided
function generateTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      return lastSegment.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
    }
    
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Link';
  }
}

// Generate description based on domain
function generateDescription(domain: string): string {
  const descriptions: Record<string, string> = {
    'leetcode.com': 'Practice coding problems and improve your algorithms',
    'apple.com': 'Official Apple products and information',
    'rentals.ca': 'Find rental properties and housing options',
    'maps.google.com': 'View location on Google Maps',
    'mohawkcollege.ca': 'Mohawk College official website',
    'eventbrite.com': 'Discover and join events in your area',
    'github.com': 'Code repository and development resources',
    'stackoverflow.com': 'Programming questions and answers',
    'youtube.com': 'Video content and tutorials',
    'wikipedia.org': 'Encyclopedia and reference information'
  };
  
  return descriptions[domain] || 'External link';
}

// Get appropriate icon for domain
function getDomainIcon(domain: string): string {
  const icons: Record<string, string> = {
    'leetcode.com': '💻',
    'apple.com': '🍎',
    'rentals.ca': '🏠',
    'maps.google.com': '📍',
    'mohawkcollege.ca': '🎓',
    'eventbrite.com': '🎫',
    'github.com': '🐙',
    'stackoverflow.com': '❓',
    'youtube.com': '📺',
    'wikipedia.org': '📚'
  };
  
  return icons[domain] || '🔗';
}

// Link card component
export function LinkCard({ url, title, description, domain }: LinkCardProps) {
  const displayTitle = title || generateTitle(url);
  const displayDescription = description || generateDescription(domain || extractDomain(url));
  const displayDomain = domain || extractDomain(url);
  const icon = getDomainIcon(displayDomain);
  
  return (
    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-start space-x-3">
        <div className="text-2xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block hover:opacity-80 transition-opacity"
          >
            <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
              {displayTitle}
            </h4>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {displayDescription}
            </p>
            <p className="text-xs text-blue-600 truncate">
              {displayDomain}
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

// Extract URLs from text
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

// Render text with link cards
interface TextWithLinksProps {
  text: string;
  className?: string;
}

export function TextWithLinks({ text, className = '' }: TextWithLinksProps) {
  const urls = extractUrls(text);
  
  if (urls.length === 0) {
    return <span className={className}>{text}</span>;
  }
  
  // Split text by URLs
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  
  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (urls.includes(part)) {
          return <LinkCard key={index} url={part} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}

// Enhanced text renderer that handles both regular text and links
export function EnhancedTextRenderer({ 
  text, 
  className = '',
  showLinks = true 
}: { 
  text: string; 
  className?: string;
  showLinks?: boolean;
}) {
  if (!showLinks) {
    return <span className={className}>{text}</span>;
  }
  
  const urls = extractUrls(text);
  
  if (urls.length === 0) {
    return <span className={className}>{text}</span>;
  }
  
  // For content with links, render as separate elements
  return (
    <div className={className}>
      <TextWithLinks text={text} />
    </div>
  );
}
