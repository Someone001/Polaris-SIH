import React from 'react';
import { useExplaining } from '../context/ExplainingContext';

/**
 * Subtle presenter badge for Judge Mode / Guided Walkthrough.
 * Only renders when Judge Mode is enabled in HelpMenu.
 */
export default function JudgeBadge({ step, label, className = '' }) {
  const { isJudgeMode } = useExplaining();

  if (!isJudgeMode) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-polar-900 text-aurora-300 border border-aurora-500/40 text-[11px] font-mono shadow-xs animate-fadeIn ${className}`}
      title={label}
    >
      <span className="w-4 h-4 rounded-full bg-aurora-500 text-polar-950 font-bold flex items-center justify-center text-[10px]">
        {step}
      </span>
      <span className="font-sans font-medium text-white">{label}</span>
    </span>
  );
}
