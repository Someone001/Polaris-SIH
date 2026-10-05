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
        content: 'Type any keyword like "penguins", "ice", or "wind" to instantly search through all forty expedition items.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="archive-types"]',
        title: 'Filter by Collection Type',
        content: 'Switch between expedition reports, research data, papers, photos, and videos with clear item counts.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="archive-first-card"]',
        title: 'Inspect an Archive Card',
        content: 'Each card features an abstract polar visual, date, and description. Click any card to open its full detail view.',
        placement: 'top',
      },
      {
        target: '[data-tour="archive-view-expedition"]',
        title: 'Connected Expedition Journeys',
        content: 'Click "View expedition" on any record to jump straight into its complete route map and field timeline.',
        placement: 'top',
      },
    ],
  },
  expedition: {
    key: 'expedition',
    title: 'Tour an Expedition',
    route: '/expeditions/exp-ant-43',
    steps: [
      {
        target: '[data-tour="expedition-map"]',
        title: 'Interactive Route Map',
        content: 'Follow the ship and tractor convoy across numbered waypoints. Click any dot to highlight coordinates and date.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="expedition-timeline"]',
        title: 'Chronological Field Timeline',
        content: 'Step through key events in simple words. Selecting an entry highlights its matching stop on the map above.',
        placement: 'left',
      },
      {
        target: '[data-tour="expedition-records"]',
        title: 'Voyage Collection Records',
        content: 'All verified photos, reports, and datasets gathered during this specific mission are catalogued right here.',
        placement: 'top',
      },
      {
        target: '[data-tour="expedition-nav"]',
        title: 'Step Across Expeditions',
        content: 'Use the bottom navigation links to step chronologically through India’s polar research history.',
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
