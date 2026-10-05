import React from 'react';
import { Link } from 'react-router-dom';
import ItemVisual from './ItemVisual';
import Tag from './Tag';
import { TYPE_LABELS } from '../lib/archiveLogic';

/**
 * Clean, hairline-bordered item card in the archive grid.
 */
export default function ItemCard({ item, expedition, onClick, dataTour }) {
  const plainType = TYPE_LABELS[item.type] || item.type;

  // Format date simply in plain English: "14 Jan 2024"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article
      data-tour={dataTour}
      data-reveal
      data-reveal-direction="up"
      onClick={() => onClick(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item);
        }
      }}
      tabIndex={0}
      role="button"
      className="reveal-card group relative flex flex-col h-full text-left bg-glacier-50 border border-glacier-border rounded-xl overflow-hidden hover:border-ice-300 hover:shadow-xs transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:ring-offset-2"
    >
      {/* Generated Polar SVG Visual */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-glacier-border/70">
        <ItemVisual item={item} size="md" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        
        {/* Type pill on top-left of visual */}
        <div className="absolute top-3 left-3">
          <Tag variant="dark" size="sm">
            {plainType}
          </Tag>
        </div>

        {/* Region badge on top-right if available */}
        {expedition?.region && (
          <div className="absolute top-3 right-3">
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-polar-950/80 backdrop-blur-xs text-glacier-100 border border-polar-700/60">
              {expedition.region}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Metadata line: date & expedition */}
          <div className="flex items-center justify-between text-xs text-polar-500 font-medium">
            <span>{formatDate(item.date)}</span>
            <span className="truncate max-w-[170px]" title={expedition?.title || ''}>
              {expedition?.locationName || expedition?.title || 'Polar Expedition'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-normal text-polar-950 leading-snug line-clamp-2 group-hover:text-aurora-700 transition-colors">
            {item.title}
          </h3>

          {/* Plain description snippet */}
          <p className="text-sm text-polar-700 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Footer: Tags and View Expedition Link */}
        <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-glacier-border/70 text-xs">
          <div className="flex flex-wrap gap-1">
            {item.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[11px] text-polar-600 px-1.5 py-0.5 rounded bg-polar-100/70">
                #{tag}
              </span>
            ))}
          </div>

          <Link
            data-tour={dataTour ? "archive-view-expedition" : undefined}
            to={`/expeditions/${item.expeditionId}`}
            state={{ fromArchiveSearch: typeof window !== 'undefined' ? window.location.search.slice(1) : '' }}
            onClick={(e) => e.stopPropagation()}
            className="text-aurora-700 hover:text-aurora-600 font-semibold inline-flex items-center gap-1 shrink-0 group/exp"
            title="View expedition map and timeline"
          >
            <span>View expedition</span>
            <span className="transition-transform group-hover/exp:translate-x-0.5">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
