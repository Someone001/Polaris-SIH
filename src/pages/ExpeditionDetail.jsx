import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Building2,
  Users,
  Anchor,
  Compass,
  ArrowLeft,
  Share2,
  Check,
  ExternalLink,
  Shield,
  Flag,
} from 'lucide-react';
import Tag from '../components/Tag';
import ExpeditionMap from '../components/ExpeditionMap';
import ItemCard from '../components/ItemCard';
import ItemDetail from '../components/ItemDetail';
import InfoTip from '../components/InfoTip';
import JudgeBadge from '../components/JudgeBadge';
import { getExpedition, getAdjacentExpeditions, getItemsByExpedition } from '../lib/dataLoader';

export default function ExpeditionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Fetch expedition data
  const expedition = useMemo(() => getExpedition(id), [id]);
  const adjacent = useMemo(() => getAdjacentExpeditions(id), [id]);
  const expeditionRecords = useMemo(() => getItemsByExpedition(id), [id]);

  // Coordinates check from ledger
  const hasCoordinates = Boolean(expedition?.latitude && expedition?.longitude);
  const mapStops = useMemo(() => {
    if (!hasCoordinates) return [];
    return [
      {
        id: `${expedition.id}-base`,
        name: expedition.station || `${expedition.name} Station`,
        lat: expedition.latitude,
        lon: expedition.longitude,
        date: expedition.flagOffDate || expedition.launchDate || String(expedition.year || ''),
      },
    ];
  }, [hasCoordinates, expedition]);

  // Has timeline stops check
  const hasTimeline = Boolean(expedition?.stops && expedition.stops.length > 0);

  // Dynamic document title
  useEffect(() => {
    if (expedition) {
      document.title = `${expedition.name || expedition.title} — Polaris`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [expedition]);

  // 404 Not Found State
  if (!expedition) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-ice-100 flex items-center justify-center mx-auto text-ice-700">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-polar-950 font-normal">
          Expedition record not found
        </h1>
        <p className="text-polar-700 text-lg max-w-lg mx-auto leading-relaxed">
          No expedition matches the identifier &ldquo;{id}&rdquo;.
        </p>
        <div className="pt-2">
          <Link
            to="/expeditions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-polar-900 text-glacier-50 font-medium text-base hover:bg-polar-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to all expeditions</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. TOP BREADCRUMB & UTILITY ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glacier-border/70 pb-4">
        <Link
          to="/expeditions"
          className="inline-flex items-center gap-2 text-sm text-polar-600 hover:text-polar-950 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-polar-500" />
          <span>All Expeditions</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-glacier-border bg-white text-xs font-medium text-polar-700 hover:text-polar-950 hover:bg-glacier-100 transition-colors shadow-2xs"
            title="Copy share link to clipboard"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-aurora-600" />
                <span>Link copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share mission</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. TITLE BLOCK & SOURCED METADATA */}
      <div data-tour="expedition-header" className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <Tag variant={expedition.region === 'Antarctic' ? 'ice' : expedition.region === 'Arctic' ? 'aurora' : 'default'}>
            {expedition.region}
          </Tag>
          {expedition.year && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-polar-100 text-polar-800">
              Season {expedition.year}
            </span>
          )}
          <span className="text-xs text-polar-500 font-mono">
            {expedition.id}
          </span>
          <JudgeBadge step="1" label="Mission summary and public record overview" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-polar-950 leading-[1.15]">
          {expedition.name || expedition.title}
        </h1>

        {/* Primary Source Verification Box */}
        <div data-tour="expedition-source" className="p-4 rounded-xl bg-glacier-100/90 border border-glacier-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-polar-800">
              Primary Source Documentation
            </span>
            {expedition.sourceUrl && (
              <a
                href={expedition.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-aurora-700 hover:text-aurora-800 transition-colors"
              >
                <span>View Primary Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          {expedition.creditLine && (
            <p className="text-xs text-polar-700 font-medium">
              {expedition.creditLine}
            </p>
          )}
          {expedition.sourceExcerpt && (
            <div className="text-xs text-polar-600 border-l-2 border-aurora-500 pl-3 py-1 bg-white/70 rounded-r">
              <span className="font-semibold text-polar-800 block text-[11px] uppercase tracking-wider">
                Source Excerpt:
              </span>
              <p className="italic mt-0.5">&ldquo;{expedition.sourceExcerpt}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Sourced Metadata Grid (Displays only fields present in ledger) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-sm text-polar-800">
          {(expedition.launchDate || expedition.flagOffDate) && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <Calendar className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Launch / Flag-off</span>
                <span className="font-medium text-polar-900">{expedition.launchDate || expedition.flagOffDate}</span>
              </div>
            </div>
          )}

          {expedition.vessel && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <Anchor className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Expedition Vessel</span>
                <span className="font-medium text-polar-900">{expedition.vessel}</span>
              </div>
            </div>
          )}

          {expedition.departurePort && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <Compass className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Departure Port</span>
                <span className="font-medium text-polar-900">{expedition.departurePort}</span>
              </div>
            </div>
          )}

          {expedition.teamSize && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <Users className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Expedition Contingent</span>
                <span className="font-medium text-polar-900">{expedition.teamSize} members</span>
              </div>
            </div>
          )}

          {expedition.initialBatchSize && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <Users className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Initial Batch</span>
                <span className="font-medium text-polar-900">{expedition.initialBatchSize} members</span>
              </div>
            </div>
          )}

          {expedition.flaggedOffBy && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <Flag className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Flagged Off By</span>
                <span className="font-medium text-polar-900">{expedition.flaggedOffBy}</span>
              </div>
            </div>
          )}

          {expedition.station && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <MapPin className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Primary Station</span>
                <span className="font-medium text-polar-900">{expedition.station}</span>
              </div>
            </div>
          )}

          {expedition.stations && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <MapPin className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Operating Stations</span>
                <span className="font-medium text-polar-900">{expedition.stations.join(', ')}</span>
              </div>
            </div>
          )}

          {expedition.coordinates && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border">
              <Compass className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Sourced Coordinates</span>
                <span className="font-mono text-xs text-polar-900">{expedition.coordinates}</span>
              </div>
            </div>
          )}

          {expedition.nodalAgency && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-glacier-border sm:col-span-2">
              <Building2 className="w-4 h-4 text-aurora-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-polar-500 block">Nodal Agency</span>
                <span className="font-medium text-polar-900">{expedition.nodalAgency}</span>
              </div>
            </div>
          )}
        </div>

        {/* Focus / Mandate / Milestone Sections */}
        {expedition.focus && (
          <div className="p-5 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-1.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-aurora-700">
              Scientific Focus
            </h3>
            <p className="text-sm text-polar-800 leading-relaxed">
              {expedition.focus}
            </p>
          </div>
        )}

        {expedition.primaryMandate && (
          <div className="p-5 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-1.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-aurora-700">
              Primary Mandate
            </h3>
            <p className="text-sm text-polar-800 leading-relaxed">
              {expedition.primaryMandate}
            </p>
          </div>
        )}

        {expedition.milestone && (
          <div className="p-5 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-1.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-aurora-700">
              Operational Milestone
            </h3>
            <p className="text-sm text-polar-800 leading-relaxed">
              {expedition.milestone}
            </p>
          </div>
        )}

        {/* Key Findings: Only shown if ledger contains sourced data */}
        {expedition.keyFindings && expedition.keyFindings.length > 0 && (
          <div className="bg-glacier-50 border border-glacier-border rounded-xl p-5 space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-aurora-700">
              Key Findings Reported
            </h3>
            <ul className="space-y-1.5 text-sm text-polar-800 list-disc list-inside">
              {expedition.keyFindings.map((finding, idx) => (
                <li key={idx} className="leading-relaxed">
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. MAP SECTION: ONLY SHOWN IF COORDINATES EXIST IN LEDGER */}
      {hasCoordinates && (
        <section className="space-y-4 pt-4 border-t border-glacier-border">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
              GEOGRAPHIC LOCATION
            </p>
            <h2 className="font-serif text-2xl text-polar-950 font-normal">
              Base Station Geographic Location
            </h2>
            <p className="text-sm text-polar-700">
              Coordinates ({expedition.coordinates}) sourced directly from the mission announcement.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-glacier-border shadow-xs">
            <ExpeditionMap
              stops={mapStops}
              region={expedition.region}
            />
          </div>
        </section>
      )}

      {/* 4. TIMELINE SECTION: ONLY SHOWN IF SOURCED STOPS EXIST IN LEDGER */}
      {hasTimeline && (
        <section className="space-y-4 pt-4 border-t border-glacier-border">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
              CHRONOLOGY
            </p>
            <h2 className="font-serif text-2xl text-polar-950 font-normal">
              Field Waypoint Timeline
            </h2>
          </div>
          {/* Timeline rendering if sourced data exists */}
        </section>
      )}

      {/* 5. CONNECTED ARCHIVE RECORDS (shown only if sourced records exist) */}
      {expeditionRecords.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-glacier-border">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
              Archive Records for this Mission
            </h2>
            <p className="text-sm text-polar-700">
              Archival records linked to this expedition in the public sources ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {expeditionRecords.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                expedition={expedition}
                onClick={setActiveItem}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. CHRONOLOGICAL EXPEDITION NAVIGATION */}
      <div data-tour="expedition-nav" className="pt-8 border-t border-glacier-border flex items-center justify-between gap-4">
        {adjacent.prev ? (
          <Link
            to={`/expeditions/${adjacent.prev.id}`}
            className="inline-flex items-center gap-2 text-sm text-polar-700 hover:text-polar-950 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{adjacent.prev.name || adjacent.prev.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <div />
        )}

        {adjacent.next ? (
          <Link
            to={`/expeditions/${adjacent.next.id}`}
            className="inline-flex items-center gap-2 text-sm text-polar-700 hover:text-polar-950 font-medium transition-colors"
          >
            <span className="hidden sm:inline">{adjacent.next.name || adjacent.next.title}</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Slide-over item detail when clicked */}
      {activeItem && (
        <ItemDetail
          item={activeItem}
          expedition={expedition}
          onClose={() => setActiveItem(null)}
          totalCount={expeditionRecords.length}
        />
      )}
    </div>
  );
}
