/**
 * SkipLinks Component
 *
 * Provides skip navigation links for keyboard users to bypass
 * repetitive navigation and jump directly to main content.
 *
 * Requirements: 15.1, 15.2
 */

import { useEffect, useState } from 'react';

interface SkipLink {
  id: string;
  label: string;
  target: string;
}

const skipLinks: SkipLink[] = [
  {
    id: 'skip-to-main',
    label: 'Pular para o conteúdo principal',
    target: '#main-content',
  },
  {
    id: 'skip-to-navigation',
    label: 'Pular para a navegação',
    target: '#navigation-controls',
  },
  {
    id: 'skip-to-cta',
    label: 'Pular para ações principais',
    target: '#sticky-cta',
  },
];

export function SkipLinks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show skip links on first Tab key press
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsVisible(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { once: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSkipLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: string
  ) => {
    event.preventDefault();

    const targetElement = document.querySelector(target);
    if (targetElement) {
      // Focus the target element
      if (targetElement instanceof HTMLElement) {
        targetElement.focus();

        // If element is not naturally focusable, add tabindex temporarily
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.addEventListener(
            'blur',
            () => {
              targetElement.removeAttribute('tabindex');
            },
            { once: true }
          );
        }
      }

      // Scroll to target
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Links de navegação rápida"
      className={`skip-links ${isVisible ? 'skip-links-visible' : ''}`}
    >
      {skipLinks.map(link => (
        <a
          key={link.id}
          href={link.target}
          className="skip-link"
          onClick={e => handleSkipLinkClick(e, link.target)}
        >
          {link.label}
        </a>
      ))}

      <style>{`
        .skip-links {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.5rem;
        }

        .skip-link {
          position: absolute;
          left: -9999px;
          top: 0;
          padding: 0.75rem 1.5rem;
          background-color: #1B3A6B;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .skip-link:focus {
          position: static;
          left: auto;
          outline: 3px solid #F5A623;
          outline-offset: 2px;
        }

        .skip-link:hover {
          background-color: #2D9B8A;
          transform: translateY(-1px);
          box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15);
        }

        .skip-link:active {
          transform: translateY(0);
        }

        /* Ensure skip links are visible when focused */
        .skip-links-visible .skip-link:focus {
          position: static;
        }
      `}</style>
    </nav>
  );
}

export default SkipLinks;
