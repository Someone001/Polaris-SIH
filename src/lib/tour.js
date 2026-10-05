/**
 * Declarative step definitions for Polaris Coach-Mark Tours.
 */

export const TOURS = {
  archive: {
    key: 'archive',
    title: 'Tour the Archive',
    route: '/archive',
    steps: [
      {
        target: '[data-tour="archive-search"]',
        title: 'Search Across All Records',
        content: 'Type any keyword like "ozone", "algae", or "Maitri" to search through the cataloged expedition items.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="archive-types"]',
        title: 'Filter by Collection Type',
        content: 'Switch between published papers, research data, photographs, videos, and outreach activities with live item counts.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="archive-first-card"]',
        title: 'Inspect an Archive Card',
        content: 'Each card displays the item title, date/year, and primary source citation. Click any card to inspect full details.',
        placement: 'top',
      },
    ],
  },
  expedition: {
    key: 'expedition',
    title: 'Tour an Expedition',
    route: '/expeditions/exp-001',
    steps: [
      {
        target: '[data-tour="expedition-header"]',
        title: 'Expedition Summary',
        content: 'Review mission facts sourced directly from public documentation, including vessel, departure port, and team size.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="expedition-source"]',
        title: 'Primary Source Citation',
        content: 'Every expedition record shows a direct link to its source document and an explicit credit line.',
        placement: 'top',
      },
      {
        target: '[data-tour="expedition-nav"]',
        title: 'Step Across Expeditions',
        content: 'Use navigation controls to browse chronologically through Indian polar scientific expeditions.',
        placement: 'top',
      },
    ],
  },
};

/**
 * Calculates responsive tooltip coordinates strictly clamped inside the visible viewport.
 * Uses viewport-relative coordinates because CoachMarkTour uses a `fixed inset-0` container.
 */
export function calculateTooltipPosition(targetEl, preferredPlacement = 'bottom', cardEl = null) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipWidth = Math.min(380, viewportWidth - 32);
  const cardHeight = cardEl?.offsetHeight ? Math.max(cardEl.offsetHeight, 180) : 230;
  const gap = 14;

  if (!targetEl) {
    return {
      top: Math.max(16, (viewportHeight - cardHeight) / 2),
      left: Math.max(16, (viewportWidth - tooltipWidth) / 2),
      width: tooltipWidth,
      placement: 'center',
    };
  }

  const rect = targetEl.getBoundingClientRect();
  let top = 0;
  let left = 0;
  let finalPlacement = preferredPlacement;

  // Horizontal positioning (centered relative to target)
  left = rect.left + rect.width / 2 - tooltipWidth / 2;

  // Vertical placement logic with intelligent auto-flip
  if (preferredPlacement === 'bottom') {
    if (rect.bottom + cardHeight + gap < viewportHeight - 16) {
      top = rect.bottom + gap;
      finalPlacement = 'bottom';
    } else if (rect.top - cardHeight - gap > 16) {
      top = rect.top - cardHeight - gap;
      finalPlacement = 'top';
    } else {
      // If neither fits cleanly, place where there is more space
      top = rect.bottom + gap;
      finalPlacement = 'bottom';
    }
  } else if (preferredPlacement === 'top') {
    if (rect.top - cardHeight - gap > 16) {
      top = rect.top - cardHeight - gap;
      finalPlacement = 'top';
    } else if (rect.bottom + cardHeight + gap < viewportHeight - 16) {
      top = rect.bottom + gap;
      finalPlacement = 'bottom';
    } else {
      top = rect.bottom + gap;
      finalPlacement = 'bottom';
    }
  } else if (preferredPlacement === 'left') {
    // If on wide screen and fits on left
    if (rect.left - tooltipWidth - gap > 16 && viewportWidth > 1024) {
      left = rect.left - tooltipWidth - gap;
      top = rect.top + rect.height / 2 - cardHeight / 2;
      finalPlacement = 'left';
    } else {
      // Fallback to top or bottom
      if (rect.top - cardHeight - gap > 16) {
        top = rect.top - cardHeight - gap;
        finalPlacement = 'top';
      } else {
        top = rect.bottom + gap;
        finalPlacement = 'bottom';
      }
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
    }
  } else if (preferredPlacement === 'right') {
    if (rect.right + tooltipWidth + gap < viewportWidth - 16 && viewportWidth > 1024) {
      left = rect.right + gap;
      top = rect.top + rect.height / 2 - cardHeight / 2;
      finalPlacement = 'right';
    } else {
      top = rect.bottom + gap;
      finalPlacement = 'bottom';
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
    }
  }

  // STRICT VIEWPORT CLAMPING
  // Guarantees the box can NEVER go out of the viewport on any side:
  const minTop = 16;
  const maxTop = Math.max(minTop, viewportHeight - cardHeight - 16);
  top = Math.max(minTop, Math.min(top, maxTop));

  const minLeft = 16;
  const maxLeft = Math.max(minLeft, viewportWidth - tooltipWidth - 16);
  left = Math.max(minLeft, Math.min(left, maxLeft));

  return {
    top,
    left,
    width: tooltipWidth,
    placement: finalPlacement,
  };
}
