import React, { useState, useRef, useEffect } from 'react';
import glossary from '../data/glossary.json';
import { HelpCircle, X } from 'lucide-react';

/**
 * Reusable plain-language glossary tooltip.
 * Highlights nested glossary terms and makes them interactively navigable.
 */
export default function InfoTip({ termKey, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState(termKey);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  // Reset currentKey when termKey prop changes
  useEffect(() => {
    setCurrentKey(termKey);
  }, [termKey]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setCurrentKey(termKey);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setCurrentKey(termKey);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, termKey]);

  const entry = glossary[currentKey?.toLowerCase()] || {
    term: currentKey,
    definition: 'A term used in polar research operations.',
  };

  // Render definition with clickable nested glossary links
  const renderDefinition = (text) => {
    const words = text.split(/(\s+)/);
    return words.map((token, idx) => {
      const cleanToken = token.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (glossary[cleanToken] && cleanToken !== currentKey.toLowerCase()) {
        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentKey(cleanToken);
            }}
            className="text-aurora-700 underline decoration-dotted font-medium hover:text-aurora-600 focus:outline-none"
            title={`See definition for ${cleanToken}`}
          >
            {token}
          </button>
        );
      }
      return token;
    });
  };

  return (
    <span className={`relative inline-flex items-center align-middle ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label={`What does ${entry.term} mean?`}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-polar-100 text-polar-600 hover:bg-aurora-100 hover:text-aurora-800 text-[10px] font-mono font-bold transition-colors focus:outline-none focus:ring-1 focus:ring-aurora-500 cursor-pointer select-none"
      >
        ?
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 rounded-xl bg-polar-950 text-glacier-50 border border-polar-700 shadow-xl text-left text-xs leading-relaxed animate-fadeIn"
          onMouseLeave={() => {
            setIsOpen(false);
            setCurrentKey(termKey);
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-polar-800">
            <span className="font-semibold text-aurora-300 uppercase tracking-wider text-[11px]">
              {entry.term}
            </span>
            <div className="flex items-center gap-1.5">
              {currentKey.toLowerCase() !== termKey.toLowerCase() && (
                <button
                  type="button"
                  onClick={() => setCurrentKey(termKey)}
                  className="text-[10px] text-polar-400 hover:text-polar-200 underline"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setCurrentKey(termKey);
                }}
                className="text-polar-400 hover:text-white"
                aria-label="Close definition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Definition text */}
          <p className="text-polar-200 font-sans">
            {renderDefinition(entry.definition)}
          </p>

          <span className="block text-[10px] text-polar-400 mt-2 font-mono">
            Polaris Plain-English Glossary
          </span>
        </div>
      )}
    </span>
  );
}
