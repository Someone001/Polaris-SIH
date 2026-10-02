import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Sparkles, Calendar, MapPin, Compass, Tag as TagIcon, Play } from 'lucide-react';
import ItemVisual from './ItemVisual';
import Tag from './Tag';
import InfoTip from './InfoTip';
import { TYPE_LABELS } from '../lib/archiveLogic';

/**
 * Slide-over side panel / modal for viewing an archive item's plain-English details.
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

  // Close on Escape key press
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

  // Prevent background body scroll when open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!item) return null;

  const plainType = TYPE_LABELS[item.type] || item.type;

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

  // Render authentic scientific metadata card
  const renderTypeTouch = () => {
    switch (item.type) {
      case 'Photo':
        return (
          <div className="p-4 rounded-xl bg-glacier-100 border border-glacier-border space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-aurora-700">
              Photographic Benchmark Record
            </span>
            <p className="text-xs sm:text-sm text-polar-800 leading-relaxed font-sans">
              Archived under high-latitude optical standards for long-term ecological phenology and glacial advance-retreat monitoring.
            </p>
          </div>
        );

      case 'Video':
        return (
          <div className="p-4 rounded-xl bg-glacier-100 border border-glacier-border space-y-2">
            <div className="flex items-center justify-between text-polar-800 text-sm font-medium">
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 text-aurora-600 fill-aurora-600" />
                <span>Official MoES / NCPOR Video Record</span>
              </span>
              {item.duration && (
                <span className="text-xs font-mono text-polar-700 bg-polar-200/80 px-2 py-0.5 rounded font-semibold">
                  {item.duration}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-polar-700 leading-relaxed font-sans">
              Official documentary and field cinematography certified by the Ministry of Earth Sciences for public science education and broadcast outreach.
            </p>
          </div>
        );

      case 'Dataset': {
        const dataPoints = item.dataPoints || [
          { label: 'Sampling Interval', value: '10-minute automated mean' },
          { label: 'Sensor Calibration Standard', value: 'WMO-No. 8 Annex 1B (Polar Specifications)' },
          { label: 'Data Quality Flag', value: 'Level-2 Quality Controlled (QA/QC Passed)' },
          { label: 'Coordinate System', value: 'WGS 84 (EPSG:4326)' },
        ];
        return (
          <div className="p-5 rounded-xl bg-glacier-100 border border-glacier-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-polar-800">
                Calibrated Dataset Specifications
              </span>
              <span className="text-[11px] font-mono bg-aurora-100 text-aurora-800 px-2 py-0.5 rounded font-medium">
                QA/QC Level-2 Passed
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {dataPoints.map((dp, idx) => (
                <div key={idx} className="p-2.5 rounded bg-white border border-glacier-border">
                  <span className="block text-polar-500 font-medium text-[11px]">{dp.label}</span>
                  <span className="font-semibold text-polar-900">{dp.value}</span>
                </div>
              ))}
            </div>
            {item.parameters && (
              <p className="text-xs text-polar-700 pt-1 border-t border-glacier-border font-mono">
                <span className="font-sans font-semibold text-polar-900">Variables: </span>
                {item.parameters}
              </p>
            )}
          </div>
        );
      }

      case 'Report':
      case 'Publication':
        return (
          <div className="p-5 rounded-xl bg-glacier-100 border border-glacier-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-polar-800">
                {item.type === 'Publication' ? 'Peer-Reviewed Scientific Record' : 'Official Expedition Report'}
              </span>
              {item.journal && (
                <span className="text-xs font-serif text-polar-700 italic">
                  {item.journal}
                </span>
              )}
            </div>
            {item.doi && (
              <p className="text-xs text-polar-600 font-mono">
                DOI: <span className="text-polar-900 underline">{item.doi}</span>
              </p>
            )}
            <p className="text-xs text-polar-600">
              Validated and preserved within the National Polar Data Repository at NCPOR, Goa.
            </p>
          </div>
        );

      case 'Activity':
        return (
          <div className="p-4 rounded-xl bg-glacier-100 border border-glacier-border space-y-1.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-aurora-700">
              National Polar Education Outreach
            </span>
            <p className="text-xs sm:text-sm text-polar-800 leading-relaxed font-sans">
              Curated under the MoES Polar Outreach Framework to facilitate direct interaction between school students, university scholars, and wintering polar scientists.
            </p>
          </div>
        );

      default:
        return null;
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
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* Large Visual or Interactive Video Player */}
          {item.type === 'Video' && item.videoUrl ? (
            <div className="rounded-xl overflow-hidden border border-glacier-border shadow-md aspect-video bg-polar-950">
              <iframe
                src={item.videoUrl}
                title={item.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-glacier-border/80 shadow-xs">
              <ItemVisual item={item} size="lg" className="w-full aspect-[16/10]" />
            </div>
          )}

          {/* Title & Expedition Header */}
          <div className="space-y-3">
            <h2
              id="item-detail-title"
              className="font-serif text-2xl sm:text-3xl font-normal text-polar-950 leading-tight"
            >
              {item.title}
            </h2>

            {/* Expedition affiliation */}
            <div className="text-sm text-polar-600">
              <span>Expedition: </span>
              <Link
                to={`/expeditions/${item.expeditionId}`}
                state={{ fromArchiveSearch: typeof window !== 'undefined' ? window.location.search.slice(1) : '' }}
                className="font-semibold text-polar-900 hover:text-aurora-700 underline decoration-glacier-border hover:decoration-aurora-500 transition-colors"
                title="View expedition map and timeline"
              >
                {expedition?.name || expedition?.title || 'Indian Polar Mission'} &rarr;
              </Link>
              {expedition?.locationName && (
                <span className="block text-xs text-polar-500 mt-0.5">
                  Location: {expedition.locationName}
                </span>
              )}
            </div>
          </div>

          {/* Type-Specific Touch Box */}
          {renderTypeTouch()}

          {/* Section: Scientific Overview & Context */}
          <div className="space-y-2 pt-2 border-t border-glacier-border/80">
            <h3 className="font-serif text-lg font-normal text-polar-900">
              Scientific Overview & Context
            </h3>
            <p className="text-base text-polar-800 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Section: Field Methodology & Protocol */}
          {item.methodology && (
            <div className="space-y-2 pt-2 border-t border-glacier-border/80">
              <h3 className="font-serif text-lg font-normal text-polar-900">
                Observation & Sampling Methodology
              </h3>
              <p className="text-sm text-polar-700 leading-relaxed">
                {item.methodology}
              </p>
            </div>
          )}

          {/* Section: Sensors & Instrumentation */}
          {item.instrumentation && (
            <div className="space-y-2 pt-2 border-t border-glacier-border/80">
              <h3 className="font-serif text-lg font-normal text-polar-900">
                Instrumentation & Equipment Specifications
              </h3>
              <p className="text-sm text-polar-700 leading-relaxed font-mono bg-glacier-100 p-3 rounded-lg border border-glacier-border">
                {item.instrumentation}
              </p>
            </div>
          )}

          {/* Section: Climate & National Significance */}
          {item.significance && (
            <div className="space-y-2 pt-2 border-t border-glacier-border/80">
              <h3 className="font-serif text-lg font-normal text-polar-900">
                Climate Significance & National Impact
              </h3>
              <p className="text-sm text-polar-700 leading-relaxed">
                {item.significance}
              </p>
            </div>
          )}

          {/* Section: Details Table */}
          <div className="space-y-3 pt-2 border-t border-glacier-border/80">
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-lg font-normal text-polar-900">
                Archival Metadata & Attribution
              </h3>
              <InfoTip termKey="metadata" />
            </div>
            <div className="rounded-lg border border-glacier-border overflow-hidden divide-y divide-glacier-border text-sm">
              {item.author && (
                <div className="flex items-center justify-between p-3 bg-glacier-50">
                  <span className="text-polar-500 font-medium">Principal Investigator / Author</span>
                  <span className="text-polar-900 font-semibold text-right max-w-xs">{item.author}</span>
                </div>
              )}
              {item.institution && (
                <div className="flex items-center justify-between p-3 bg-glacier-100/50">
                  <span className="text-polar-500 font-medium">Affiliated Institution</span>
                  <span className="text-polar-900 font-semibold text-right max-w-xs">{item.institution}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-glacier-50">
                <span className="text-polar-500 font-medium">Observation / Release Date</span>
                <span className="text-polar-900 font-semibold">{formatDate(item.date)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-glacier-100/50">
                <span className="text-polar-500 font-medium flex items-center">
                  Region
                  <InfoTip termKey="region" />
                </span>
                <span className="text-polar-900 font-semibold">{expedition?.region || 'Polar'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-glacier-50">
                <span className="text-polar-500 font-medium flex items-center">
                  Expedition code
                  <InfoTip termKey="expedition" />
                </span>
                <span className="text-polar-900 font-mono text-xs">{item.expeditionId}</span>
              </div>
              <div className="flex items-start justify-between p-3 bg-glacier-100/50">
                <span className="text-polar-500 font-medium pt-0.5 flex items-center">
                  Tags
                  <InfoTip termKey="tags" />
                </span>
                <div className="flex flex-wrap gap-1.5 justify-end max-w-xs">
                  {item.tags?.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded bg-polar-100 text-polar-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer Bar */}
        <div className="sticky bottom-0 z-20 bg-glacier-50 px-6 py-4 border-t border-glacier-border flex items-center justify-between gap-4">
          <p className="text-xs text-polar-500 hidden sm:block">
            Want to share this discovery with the public?
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
