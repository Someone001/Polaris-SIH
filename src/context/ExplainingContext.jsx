import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TOURS } from '../lib/tour';

const ExplainingContext = createContext(null);

const STORAGE_KEY_WELCOME = 'polaris_welcome_seen';
const STORAGE_KEY_JUDGE = 'polaris_judge_mode';

export function ExplainingProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Welcome Overlay state
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY_WELCOME);
    } catch {
      return false;
    }
  });

  const openWelcome = useCallback(() => {
    setIsWelcomeOpen(true);
  }, []);

  const closeWelcome = useCallback((dontShowAgain = true) => {
    setIsWelcomeOpen(false);
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY_WELCOME, 'true');
      } catch {
        // ignore
      }
    }
  }, []);

  // 2. Judge Mode / Guided Walkthrough state
  const [isJudgeMode, setIsJudgeMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_JUDGE) === 'true';
    } catch {
      return false;
    }
  });

  const toggleJudgeMode = useCallback(() => {
    setIsJudgeMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_JUDGE, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // 3. Guided Tour state
  const [activeTourKey, setActiveTourKey] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // 4. Prefers reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Active tour object
  const activeTour = activeTourKey ? TOURS[activeTourKey] : null;
  const currentStep = activeTour && activeTour.steps ? activeTour.steps[currentStepIndex] : null;

  // Tour actions
  const startTour = useCallback(
    (tourKey) => {
      const tour = TOURS[tourKey];
      if (!tour) return;

      setActiveTourKey(tourKey);
      setCurrentStepIndex(0);

      // If current path does not match required start route, navigate there
      if (tour.route && location.pathname !== tour.route) {
        navigate(tour.route);
      }
    },
    [location.pathname, navigate]
  );

  const nextTourStep = useCallback(() => {
    if (!activeTour) return;
    if (currentStepIndex < activeTour.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setActiveTourKey(null);
      setCurrentStepIndex(0);
    }
  }, [activeTour, currentStepIndex]);

  const prevTourStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const endTour = useCallback(() => {
    setActiveTourKey(null);
    setCurrentStepIndex(0);
  }, []);

  // 5. Help Menu state
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

  // Keyboard shortcut listener for '?' key to toggle help menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when user is typing in form inputs
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement?.isContentEditable) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsHelpMenuOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isHelpMenuOpen) setIsHelpMenuOpen(false);
        if (isWelcomeOpen) setIsWelcomeOpen(false);
        if (activeTourKey) endTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHelpMenuOpen, isWelcomeOpen, activeTourKey, endTour]);

  return (
    <ExplainingContext.Provider
      value={{
        isWelcomeOpen,
        openWelcome,
        closeWelcome,
        isJudgeMode,
        toggleJudgeMode,
        isHelpMenuOpen,
        setIsHelpMenuOpen,
        activeTourKey,
        activeTour,
        currentStepIndex,
        currentStep,
        startTour,
        nextTourStep,
        prevTourStep,
        endTour,
        reducedMotion,
      }}
    >
      {children}
    </ExplainingContext.Provider>
  );
}

export function useExplaining() {
  const context = useContext(ExplainingContext);
  if (!context) {
    throw new Error('useExplaining must be used within an ExplainingProvider');
  }
  return context;
}
