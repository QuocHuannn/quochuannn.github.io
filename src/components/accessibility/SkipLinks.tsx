import React from 'react';
import { useSkipLinks } from '../../hooks/useAccessibility';

interface SkipLinksProps {
  links?: Array<{
    href: string;
    label: string;
    onClick?: () => void;
  }>;
}

const DEFAULT_SKIP_LINKS = [
  {
    href: '#main-content',
    label: 'Skip to main content',
    onClick: undefined
  },
  {
    href: '#main-navigation',
    label: 'Skip to navigation',
    onClick: undefined
  }
];

export const SkipLinks: React.FC<SkipLinksProps> = ({ 
  links = DEFAULT_SKIP_LINKS 
}) => {
  const { skipToContent, skipToNavigation } = useSkipLinks();

  const handleSkipLinkClick = (href: string, customOnClick?: () => void) => {
    if (customOnClick) {
      customOnClick();
      return;
    }

    switch (href) {
      case '#main-content':
        skipToContent();
        break;
      case '#main-navigation':
        skipToNavigation();
        break;
      default:
        // Default behavior for custom links
        const target = document.querySelector(href);
        if (target) {
          (target as HTMLElement).focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <div className="skip-links">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            handleSkipLinkClick(link.href, link.onClick);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSkipLinkClick(link.href, link.onClick);
            }
          }}
        >
          {link.label}
        </a>
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .skip-links {
            position: absolute;
            top: -100px;
            left: 0;
            z-index: 9999;
          }
          
          .skip-link {
            position: absolute;
            top: -100px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            transition: top 0.2s ease;
            z-index: 10000;
          }
          
          .skip-link:focus {
            top: 6px;
          }
          
          .skip-link:hover {
            background: #333;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .skip-link {
              transition: none;
            }
          }
        `
      }} />
    </div>
  );
};

export default SkipLinks;