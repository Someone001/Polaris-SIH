import React, { useEffect, useState, useRef } from 'react';
import { useExplaining } from '../context/ExplainingContext';
import { calculateTooltipPosition } from '../lib/tour';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function CoachMarkTour() {
  const { activeTour, currentStepIndex, currentStep, nextTourStep, prevTourStep, endTour, reducedMotion } = useExplaining();
  const [pos, setPos] = useState(null);
  const cardRef = useRef(null);

  // Position and scroll target into view
  useEffect(() => {
    if (!currentStep) {
      setPos(null);
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(currentStep.target);
      if (el) {
        // Calculate strictly clamped viewport position
        const calculated = calculateTooltipPosition(el, currentStep.placement || 'bottom', cardRef.current);
        setPos(calculated);
      } else {
        // Fallback centered position strictly within viewport
        setPos(calculateTooltipPosition(null, 'center', cardRef.current));
      }
    };

    // Scroll element into view safely
    const el = document.querySelector(currentStep.target);
    if (el) {
      el.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      el.classList.add('ring-4', 'ring-aurora-400', 'ring-offset-2', 'transition-all');
    }

    // Measure immediately and also after scrolling settles (150ms and 350ms)
    updatePosition();
    const t1 = setTimeout(updatePosition, 120);
    const t2 = setTimeout(updatePosition, 360);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);

      // Clean up target highlight ring
      if (currentStep?.target) {
        const targetElement = document.querySelector(currentStep.target);
        if (targetElement) {
          targetElement.classList.remove('ring-4', 'ring-aurora-400', 'ring-offset-2');
        }
      }
    };
  }, [currentStep, reducedMotion]);

  if (!activeTour || !currentStep || !pos) return null;

  const totalSteps = activeTour.steps.length;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" aria-live="polite">
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-polar-950/40 pointer-events-auto" onClick={endTour} />

      {/* Floating Tour Card (Strictly Viewport-Clamped & Scrollable) */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        aria-label={currentStep.title}
        style={{
          top: `${pos.top}px`,
          left: `${pos.left}px`,
          width: `${pos.width}px`,
        }}
        className={`fixed pointer-events-auto z-[999] bg-polar-950 text-glacier-50 border border-polar-700/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left max-h-[calc(100vh-2rem)] overflow-y-auto ${
          reducedMotion ? '' : 'animate-fadeIn'
        }`}
      >
        {/* Step Counter & Skip Header */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-aurora-400 font-semibold uppercase tracking-wider">
            {activeTour.title} &bull; Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <button
            type="button"
            onClick={endTour}
            className="text-polar-400 hover:text-white p-1 focus:outline-none"
            title="End tour (Escape)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Content */}
        <div className="space-y-1.5">
          <h3 className="font-serif text-lg font-normal text-white">
            {currentStep.title}
          </h3>
          <p className="text-sm text-polar-200 leading-relaxed font-sans">
            {currentStep.content}
          </p>
        </div>

        {/* Progress dots & Navigation buttons */}
        <div className="pt-2 border-t border-polar-800 flex items-center justify-between gap-3">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {activeTour.steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIndex ? 'w-4 bg-aurora-400' : 'w-1.5 bg-polar-700'
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={prevTourStep}
                className="px-2.5 py-1.5 rounded-md border border-polar-700 text-xs font-medium text-polar-200 hover:bg-polar-800 focus:outline-none"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={nextTourStep}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-aurora-500 text-polar-950 text-xs font-semibold hover:bg-aurora-400 focus:outline-none"
            >
              <span>{isLast ? 'Finish' : 'Next'}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
