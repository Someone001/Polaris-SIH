import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global Scroll-to-Reveal hook using high-performance IntersectionObserver.
 * Automatically observes sections, cards, and any elements marked with [data-reveal]
 * or .reveal-on-scroll across the entire site.
 */
export function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // If user prefers reduced motion, immediately reveal everything
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal], .reveal-on-scroll, section, .reveal-card').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    // Selector of all elements that should scroll-to-reveal
    const SELECTOR = '[data-reveal], .reveal-on-scroll, main section:not([data-no-reveal]), .reveal-card, article[role="button"]';

    let observer;

    const setupObserver = () => {
      if (observer) {
        observer.disconnect();
      }

      const options = {
        root: null,
        rootMargin: '0px 0px -40px 0px', // triggers slightly before scrolling past bottom edge
        threshold: 0.05,
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const delay = target.getAttribute('data-reveal-delay');
            if (delay) {
              target.style.transitionDelay = `${delay}ms`;
            }
            const duration = target.getAttribute('data-reveal-duration');
            if (duration) {
              target.style.transitionDuration = `${duration}ms`;
            }

            target.classList.add('is-revealed');
            observer.unobserve(target);
          }
        });
      }, options);

      const elements = document.querySelectorAll(SELECTOR);
      elements.forEach((el, index) => {
        // Ensure reveal-on-scroll styling is active
        if (!el.classList.contains('reveal-on-scroll') && !el.hasAttribute('data-reveal') && !el.classList.contains('reveal-card')) {
          el.classList.add('reveal-on-scroll');
        }

        // Elements already in viewport on mount or navigation should reveal promptly
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const stagger = el.getAttribute('data-reveal-delay') || (index < 4 ? index * 50 : 0);
          if (stagger && !el.getAttribute('data-reveal-delay')) {
            el.style.transitionDelay = `${stagger}ms`;
          }
          el.classList.add('is-revealed');
        } else {
          // Lower down elements will be revealed gracefully as user scrolls to them
          observer.observe(el);
        }
      });
    };

    // Run on mount or route transition (allowing DOM to settle)
    const timer = setTimeout(setupObserver, 60);

    // Also observe DOM mutations (e.g. filtered items in Archive, dynamic tab switches)
    let mutationTimer;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(mutationTimer);
      mutationTimer = setTimeout(setupObserver, 100);
    });

    const mainEl = document.querySelector('main') || document.body;
    mutationObserver.observe(mainEl, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(mutationTimer);
      if (observer) observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname, location.search]);
}

export default useScrollReveal;
