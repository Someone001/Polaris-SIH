import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function EmptyState({ onClear, query }) {
  return (
    <div className="py-20 px-6 text-center max-w-xl mx-auto rounded-2xl border border-dashed border-glacier-border bg-glacier-50/70">
      <div className="w-14 h-14 rounded-full bg-ice-100 flex items-center justify-center mx-auto mb-4 text-ice-700">
        <SearchX className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-2xl font-normal text-polar-950 mb-2">
        Nothing matches that search yet
      </h3>
      <p className="text-polar-700 text-base leading-relaxed mb-6">
        {query ? (
          <>
            No records found containing &ldquo;{query}&rdquo;. Try checking the spelling, using broader words like &ldquo;ice&rdquo; or &ldquo;wildlife&rdquo;, or clearing active filters.
          </>
        ) : (
          'Try clearing some of your selected filters to see more expedition records.'
        )}
      </p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-polar-900 text-glacier-50 font-medium text-sm hover:bg-polar-800 transition-colors shadow-2xs focus:outline-none"
        >
          <RotateCcw className="w-4 h-4 text-aurora-300" />
          <span>Clear all filters</span>
        </button>
      )}
    </div>
  );
}
