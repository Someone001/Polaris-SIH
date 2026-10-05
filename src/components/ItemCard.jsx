import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import ItemVisual from './ItemVisual';
import Tag from './Tag';
import { TYPE_LABELS } from '../lib/archiveLogic';

/**
 * Clean, hairline-bordered item card in the archive grid.
 * Displays only sourced fields, with visible primary source link and credit line.
 */
export default function ItemCard({ item, expedition, onClick, dataTour }) {
  const plainType = TYPE_LABELS[item.type] || item.type;
  const region = item.region || expedition?.region;

  // Format date simply if present; otherwise fallback to year if present; otherwise omitted
  const dateDisplay = item.date
    ? (() => {
        try {
          return new Date(item.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
        } catch {
          return item.date;
        }
      })()
    : item.year
    ? String(item.year)
    : null;

  const descriptionSnippet = item.description || item.subject || item.highlights || item.sourceExcerpt || '';
  const sourceUrl = item.url || item.sourceUrl || item.fileUrl || item.videoUrl;

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
      {/* Generated Polar SVG Visual or Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-glacier-border/70">
        <ItemVisual item={item} size="md" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />

        {/* Type pill on top-left of visual */}
        <div className="absolute top-3 left-3">
          <Tag variant="dark" size="sm">
            {plainType}
          </Tag>
        </div>

        {/* Region badge on top-right if available */}
        {region && (
          <div className="absolute top-3 right-3">
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-polar-950/80 backdrop-blur-xs text-glacier-100 border border-polar-700/60">
              {region}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Metadata line: date & expedition (only if present) */}
          <div className="flex items-center justify-between text-xs text-polar-500 font-medium">
            {dateDisplay && <span>{dateDisplay}</span>}
            {expedition && (
              <span className="truncate max-w-[170px]" title={expedition.title || expedition.name}>
                {expedition.name || expedition.title}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-normal text-polar-950 leading-snug line-clamp-2 group-hover:text-aurora-700 transition-colors">
            {item.title}
          </h3>

          {/* Author / Journal / Channel if present */}
          {(item.author || item.journal || item.channel || item.repository) && (
            <p className="text-xs text-polar-600 font-mono truncate">
              {item.author || item.journal || item.channel || item.repository}
            </p>
          )}

          {/* Plain description snippet if present */}
          {descriptionSnippet && (
            <p className="text-sm text-polar-700 leading-relaxed line-clamp-2">
              {descriptionSnippet}
            </p>
          )}
        </div>

        {/* Card Footer: Visible Source Link & One-Line Credit */}
        <div className="pt-2.5 border-t border-glacier-border/70 text-xs space-y-1.5">
          {sourceUrl && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-polar-500">
                Primary Source
              </span>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-aurora-700 hover:text-aurora-800 font-medium transition-colors"
                title={sourceUrl}
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {item.creditLine && (
            <p className="text-[11px] text-polar-500 truncate" title={item.creditLine}>
              {item.creditLine}
            </p>
          )}

          {/* Expedition link if present */}
          {item.expeditionId && (
            <div className="pt-1">
              <Link
                to={`/expeditions/${item.expeditionId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium text-polar-700 hover:text-polar-950 underline decoration-glacier-border hover:decoration-aurora-500"
              >
                View connected expedition &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
