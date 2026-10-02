import React, { useRef, useEffect } from 'react';
import { HelpCircle, Compass, Archive, Sparkles, BookOpen, Eye, X } from 'lucide-react';
import { useExplaining } from '../context/ExplainingContext';

export default function HelpMenu() {
  const {
    isHelpMenuOpen,
    setIsHelpMenuOpen,
    startTour,
    openWelcome,
    isJudgeMode,
    toggleJudgeMode,
  } = useExplaining();

  const menuRef = useRef(null);

  // Close on click outside (resilient across desktop & mobile instances)
  useEffect(() => {
    if (!isHelpMenuOpen) return;

    const handleOutside = (e) => {
      // If click is inside ANY help menu container or dropdown, do not close
      if (e.target && e.target.closest && e.target.closest('.help-menu-container')) {
        return;
      }
      setIsHelpMenuOpen(false);
    };

    // Use click and touchstart for mobile & desktop consistency
    document.addEventListener('click', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isHelpMenuOpen, setIsHelpMenuOpen]);

  return (
    <div className="relative help-menu-container" ref={menuRef}>
      {/* Help Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsHelpMenuOpen((prev) => !prev);
        }}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isHelpMenuOpen || isJudgeMode
            ? 'bg-polar-900 text-aurora-300 ring-2 ring-aurora-500 shadow-md'
            : 'bg-polar-100 text-polar-700 hover:bg-polar-200 hover:text-polar-950 shadow-xs'
        }`}
        title="Help, Tours & Guided Walkthrough (Press '?')"
        aria-label="Help and tours menu"
        aria-expanded={isHelpMenuOpen}
      >
        <span className="font-serif font-bold text-sm select-none">?</span>
      </button>

      {/* Dropdown Menu */}
      {isHelpMenuOpen && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-glacier-border shadow-2xl p-3 z-[100] text-left text-sm space-y-2 animate-fadeIn"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-glacier-border">
            <div>
              <span className="font-serif text-base font-normal text-polar-950 block">
                Orientation & Tours
              </span>
              <span className="text-[11px] text-polar-500">
                Shortcut: press <kbd className="font-mono bg-polar-100 px-1 rounded">?</kbd> anytime
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsHelpMenuOpen(false)}
              className="text-polar-400 hover:text-polar-700 p-1"
              aria-label="Close help menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Guided Tours List */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsHelpMenuOpen(false);
                startTour('archive');
              }}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-glacier-100 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-ice-100 text-ice-700 flex items-center justify-center shrink-0 group-hover:bg-polar-900 group-hover:text-white transition-colors">
                <Archive className="w-4 h-4" />
              </div>
              <div>
                <span className="font-medium text-polar-900 block group-hover:text-aurora-700">
                  Tour the Archive
                </span>
                <span className="text-xs text-polar-500 block">
                  Learn how to search, filter, and inspect records
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsHelpMenuOpen(false);
                startTour('expedition');
              }}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-glacier-100 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-ice-100 text-ice-700 flex items-center justify-center shrink-0 group-hover:bg-polar-900 group-hover:text-white transition-colors">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-medium text-polar-900 block group-hover:text-aurora-700">
                  Tour an Expedition
                </span>
                <span className="text-xs text-polar-500 block">
                  See how the interactive map & timeline sync
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsHelpMenuOpen(false);
                openWelcome();
              }}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-glacier-100 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-ice-100 text-ice-700 flex items-center justify-center shrink-0 group-hover:bg-polar-900 group-hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="font-medium text-polar-900 block group-hover:text-aurora-700">
                  Show Welcome Screen
                </span>
                <span className="text-xs text-polar-500 block">
                  Review the 3-point portal overview
                </span>
              </div>
            </button>
          </div>

          {/* Judge Mode / Guided Walkthrough Toggle */}
          <div className="pt-2 border-t border-glacier-border">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-glacier-50 border border-glacier-border">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-polar-900 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-aurora-600" />
                  <span>Guided Walkthrough</span>
                </span>
                <span className="text-[11px] text-polar-500 block">
                  Labels main UI sections for presentations
                </span>
              </div>

              <button
                type="button"
                onClick={toggleJudgeMode}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  isJudgeMode ? 'bg-aurora-500' : 'bg-polar-200'
                }`}
                role="switch"
                aria-checked={isJudgeMode}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isJudgeMode ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
