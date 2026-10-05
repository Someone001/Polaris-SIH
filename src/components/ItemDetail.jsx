import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Sparkles, ExternalLink, Play, Calendar, User, BookOpen, Database, Camera, Film, Radio } from 'lucide-react';
import ItemVisual from './ItemVisual';
import Tag from './Tag';
import { TYPE_LABELS } from '../lib/archiveLogic';

/**
 * Slide-over side panel / modal for viewing an archive item's sourced details.
 * Strictly presents sourced fields without placeholders or invented tables.
 */
export default function ItemDetail({
  item,
  expedition,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex = 0,
  totalCount = 0,
}) {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // Prevent background body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!item) return null;

  const plainType = TYPE_LABELS[item.type] || item.type;
  const sourceUrl = item.url || item.sourceUrl || item.fileUrl || item.videoUrl;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-polar-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
    >
      {/* Panel container */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-glacier-50 h-full overflow-y-auto border-l border-glacier-border shadow-2xl flex flex-col justify-between"
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-glacier-50/95 backdrop-blur-md px-6 py-4 border-b border-glacier-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag variant="ice" size="sm">
              {plainType}
            </Tag>
            <span className="text-xs text-polar-500 font-medium">
              Record {currentIndex + 1} of {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Step Previous */}
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className={`p-1.5 rounded-md border border-glacier-border transition-colors ${
                hasPrev
                  ? 'text-polar-800 hover:bg-glacier-200/70 hover:text-polar-950 cursor-pointer'
                  : 'text-polar-300 border-glacier-border/50 cursor-not-allowed'
              }`}
              title="Previous item (Left Arrow)"
              aria-label="Previous item"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Step Next */}
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className={`p-1.5 rounded-md border border-glacier-border transition-colors ${
                hasNext
                  ? 'text-polar-800 hover:bg-glacier-200/70 hover:text-polar-950 cursor-pointer'
                  : 'text-polar-300 border-glacier-border/50 cursor-not-allowed'
              }`}
              title="Next item (Right Arrow)"
              aria-label="Next item"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-polar-600 hover:text-polar-950 hover:bg-glacier-200/70 transition-colors focus:outline-none"
              title="Close panel (Escape)"
              aria-label="Close detail view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Visual Presentation */}
          {item.type === 'Video' && item.embedUrl ? (
            <div className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-glacier-border shadow-md aspect-video bg-polar-950">
                <iframe
                  src={item.embedUrl}
                  title={item.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center justify-between text-xs text-polar-700 bg-glacier-100 p-2.5 rounded-lg border border-glacier-border">
                <span className="font-medium text-polar-900">
                  Channel: {item.channel || 'YouTube Video'}
                </span>
                {item.videoUrl && (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-aurora-700 hover:text-aurora-800 font-semibold transition-colors"
                  >
                    <span>Open on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-glacier-border/80 shadow-xs">
                <ItemVisual item={item} size="lg" className="w-full aspect-[16/10]" />
              </div>
              {item.creditLine && (
                <p className="text-xs text-polar-600 px-1 italic">
                  {item.creditLine}
                </p>
              )}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <h2
              id="item-detail-title"
              className="font-serif text-2xl sm:text-3xl font-normal text-polar-950 leading-tight"
            >
              {item.title}
            </h2>

            {/* Expedition affiliation if exists */}
            {expedition && item.expeditionId && (
              <div className="text-sm text-polar-600 pt-1">
                <span>Expedition: </span>
                <Link
                  to={`/expeditions/${item.expeditionId}`}
                  className="font-semibold text-polar-900 hover:text-aurora-700 underline decoration-glacier-border hover:decoration-aurora-500 transition-colors"
                >
                  {expedition.name || expedition.title} &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Primary Source Verification Box */}
          <div className="p-4 rounded-xl bg-glacier-100/80 border border-glacier-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-polar-800">
                Primary Source
              </span>
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-aurora-700 hover:text-aurora-800 transition-colors"
                >
                  <span>Open Primary Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            {item.creditLine && (
              <p className="text-xs text-polar-700 font-medium">
                {item.creditLine}
              </p>
            )}
            {item.sourceExcerpt && (
              <div className="text-xs text-polar-600 border-l-2 border-aurora-500 pl-3 py-1 bg-white/60 rounded-r">
                <span className="font-semibold text-polar-800 block text-[11px] uppercase tracking-wider">
                  Source Excerpt:
                </span>
                <p className="italic mt-0.5">&ldquo;{item.sourceExcerpt}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Type-Specific Sourced Details */}
          {item.type === 'Publication' && (
            <div className="p-5 rounded-xl bg-white border border-glacier-border space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-polar-800">
                Publication Metadata (CrossRef)
              </h3>
              <div className="space-y-2 text-sm">
                {item.author && (
                  <div>
                    <span className="text-xs text-polar-500 block">Author(s)</span>
                    <span className="font-medium text-polar-900">{item.author}</span>
                  </div>
                )}
                {item.journal && (
                  <div>
                    <span className="text-xs text-polar-500 block">Journal</span>
                    <span className="font-serif italic text-polar-900">{item.journal}</span>
                  </div>
                )}
                {item.year && (
                  <div>
                    <span className="text-xs text-polar-500 block">Year</span>
                    <span className="font-mono text-polar-900">{item.year}</span>
                  </div>
                )}
                {item.doi && (
                  <div>
                    <span className="text-xs text-polar-500 block">Digital Object Identifier (DOI)</span>
                    <a
                      href={`https://doi.org/${item.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-aurora-700 hover:text-aurora-800 underline inline-flex items-center gap-1"
                    >
                      <span>https://doi.org/{item.doi}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.type === 'Dataset' && (
            <div className="p-5 rounded-xl bg-white border border-glacier-border space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-polar-800">
                Dataset Metadata (Zenodo)
              </h3>
              <div className="space-y-2 text-sm">
                {item.creators && item.creators.length > 0 && (
                  <div>
                    <span className="text-xs text-polar-500 block">Creator(s)</span>
                    <span className="font-medium text-polar-900">{item.creators.join(', ')}</span>
                  </div>
                )}
                {item.repository && (
                  <div>
                    <span className="text-xs text-polar-500 block">Repository</span>
                    <span className="font-medium text-polar-900">{item.repository}</span>
                  </div>
                )}
                {item.publicationDate && (
                  <div>
                    <span className="text-xs text-polar-500 block">Publication Date</span>
                    <span className="font-mono text-polar-900">{item.publicationDate}</span>
                  </div>
                )}
                {item.doi && (
                  <div>
                    <span className="text-xs text-polar-500 block">Dataset DOI</span>
                    <a
                      href={`https://doi.org/${item.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-aurora-700 hover:text-aurora-800 underline inline-flex items-center gap-1"
                    >
                      <span>https://doi.org/{item.doi}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {item.description && (
                  <div>
                    <span className="text-xs text-polar-500 block">Description</span>
                    <p className="text-sm text-polar-800 leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.type === 'Photo' && (
            <div className="p-5 rounded-xl bg-white border border-glacier-border space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-polar-800">
                Photograph Provenance (Wikimedia Commons)
              </h3>
              <div className="space-y-2 text-sm">
                {item.author && (
                  <div>
                    <span className="text-xs text-polar-500 block">Author / Contributor</span>
                    <span className="font-medium text-polar-900">{item.author}</span>
                  </div>
                )}
                {item.license && (
                  <div>
                    <span className="text-xs text-polar-500 block">License</span>
                    <span className="font-mono text-xs text-polar-900">{item.license}</span>
                  </div>
                )}
                {item.date && (
                  <div>
                    <span className="text-xs text-polar-500 block">Date</span>
                    <span className="font-mono text-xs text-polar-900">{formatDate(item.date)}</span>
                  </div>
                )}
                {item.subject && (
                  <div>
                    <span className="text-xs text-polar-500 block">Subject</span>
                    <p className="text-sm text-polar-800 leading-relaxed mt-0.5">{item.subject}</p>
                  </div>
                )}
                {item.fileUrl && (
                  <div>
                    <span className="text-xs text-polar-500 block">Commons File Page</span>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-aurora-700 hover:text-aurora-800 underline inline-flex items-center gap-1 break-all"
                    >
                      <span>{item.fileUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.type === 'Video' && (
            <div className="p-5 rounded-xl bg-white border border-glacier-border space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-polar-800">
                Video Record (YouTube oEmbed)
              </h3>
              <div className="space-y-2 text-sm">
                {item.channel && (
                  <div>
                    <span className="text-xs text-polar-500 block">Channel</span>
                    {item.channelUrl ? (
                      <a
                        href={item.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-aurora-700 hover:text-aurora-800 underline inline-flex items-center gap-1"
                      >
                        <span>{item.channel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="font-medium text-polar-900">{item.channel}</span>
                    )}
                  </div>
                )}
                {item.videoUrl && (
                  <div>
                    <span className="text-xs text-polar-500 block">Video URL</span>
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-aurora-700 hover:text-aurora-800 underline inline-flex items-center gap-1 break-all"
                    >
                      <span>{item.videoUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.type === 'Activity' && (
            <div className="p-5 rounded-xl bg-white border border-glacier-border space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-polar-800">
                Activity Details (Press Information Bureau)
              </h3>
              <div className="space-y-2 text-sm">
                {item.date && (
                  <div>
                    <span className="text-xs text-polar-500 block">Date</span>
                    <span className="font-medium text-polar-900">{item.date}</span>
                  </div>
                )}
                {item.venue && (
                  <div>
                    <span className="text-xs text-polar-500 block">Venue</span>
                    <span className="text-polar-900">{item.venue}</span>
                  </div>
                )}
                {item.station && (
                  <div>
                    <span className="text-xs text-polar-500 block">Station</span>
                    <span className="text-polar-900">{item.station}</span>
                  </div>
                )}
                {item.organizer && (
                  <div>
                    <span className="text-xs text-polar-500 block">Organizer</span>
                    <span className="text-polar-900">{item.organizer}</span>
                  </div>
                )}
                {item.highlights && (
                  <div>
                    <span className="text-xs text-polar-500 block">Highlights</span>
                    <p className="text-sm text-polar-800 leading-relaxed mt-0.5">{item.highlights}</p>
                  </div>
                )}
                {item.sourceUrl && (
                  <div>
                    <span className="text-xs text-polar-500 block">Press Release</span>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-aurora-700 hover:text-aurora-800 underline inline-flex items-center gap-1 break-all"
                    >
                      <span>{item.sourceUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Region Tag */}
          {item.region && (
            <div className="flex items-center gap-2 pt-2 border-t border-glacier-border text-xs text-polar-600">
              <span className="font-semibold uppercase tracking-wider text-polar-500">Region:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-polar-100 font-medium text-polar-800">
                {item.region}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Action Footer Bar */}
        <div className="sticky bottom-0 z-20 bg-glacier-50 px-6 py-4 border-t border-glacier-border flex items-center justify-between gap-4">
          <p className="text-xs text-polar-500 hidden sm:block">
            Generate outreach blurbs, social posts, or press notes
          </p>
          <button
            data-tour="archive-detail-studio"
            type="button"
            onClick={() => navigate(`/studio/${item.id}`)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-polar-900 text-glacier-50 font-medium text-sm hover:bg-polar-800 transition-colors shadow-2xs focus:outline-none"
          >
            <Sparkles className="w-4 h-4 text-aurora-300" />
            <span>Create content from this</span>
          </button>
        </div>
      </div>
    </div>
  );
}
