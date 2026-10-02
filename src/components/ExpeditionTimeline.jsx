import React, { useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, CircleDot } from 'lucide-react';

export default function ExpeditionTimeline({
  events = [],
  selectedStopId = null,
  onSelectStop = () => {},
}) {
  const itemRefs = useRef({});

  // When selectedStopId changes, smoothly scroll matching timeline entry into view
  useEffect(() => {
    if (selectedStopId && itemRefs.current[selectedStopId]) {
      itemRefs.current[selectedStopId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedStopId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-glacier-border">
      {events.map((event, idx) => {
        const isSelected = selectedStopId === event.stopId;

        return (
          <div
            key={event.stopId || idx}
            ref={(el) => (itemRefs.current[event.stopId] = el)}
            onClick={() => onSelectStop(event.stopId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectStop(event.stopId);
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={isSelected}
            className={`group relative rounded-xl p-5 sm:p-6 border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-aurora-500 ${
              isSelected
                ? 'bg-polar-900 text-glacier-50 border-polar-700 shadow-md ring-1 ring-aurora-400/30'
                : 'bg-glacier-50 text-polar-900 border-glacier-border hover:border-ice-300 hover:bg-glacier-100/60'
            }`}
          >
            {/* Timeline node icon */}
            <div
              className={`absolute -left-[31px] sm:-left-[39px] top-6 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-aurora-500 text-white shadow-xs'
                  : 'bg-glacier-50 border-2 border-polar-300 text-polar-500 group-hover:border-aurora-500'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
            </div>

            {/* Event Header: Date + Waypoint tag */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium ${
                  isSelected ? 'text-aurora-300' : 'text-polar-600'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(event.date)}</span>
              </span>

              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-polar-800 text-aurora-300'
                    : 'bg-polar-100 text-polar-600'
                }`}
              >
                Step {idx + 1} of {events.length}
              </span>
            </div>

            {/* Event Title */}
            <h3
              className={`font-serif text-lg sm:text-xl font-normal leading-snug mb-2 ${
                isSelected ? 'text-white' : 'text-polar-950 group-hover:text-aurora-700'
              }`}
            >
              {event.title}
            </h3>

            {/* Event Description */}
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isSelected ? 'text-polar-200' : 'text-polar-700'
              }`}
            >
              {event.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
