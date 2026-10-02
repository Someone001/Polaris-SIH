import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Building2,
  Users,
  Database,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';
import Tag from '../components/Tag';
import ExpeditionMap from '../components/ExpeditionMap';
import ExpeditionTimeline from '../components/ExpeditionTimeline';
import ItemCard from '../components/ItemCard';
import ItemDetail from '../components/ItemDetail';
import InfoTip from '../components/InfoTip';
import JudgeBadge from '../components/JudgeBadge';
import { getExpedition, getAdjacentExpeditions, getItemsByExpedition } from '../lib/dataLoader';

export default function ExpeditionDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Fetch expedition data
  const expedition = useMemo(() => getExpedition(id), [id]);
  const adjacent = useMemo(() => getAdjacentExpeditions(id), [id]);
  const expeditionRecords = useMemo(() => getItemsByExpedition(id), [id]);

  // Selected stop from URL query string
  const selectedStopId = searchParams.get('stop') || expedition?.stops?.[0]?.id || null;

  // Sync stop in URL
  const handleSelectStop = (stopId) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, stop: stopId }, { replace: true });
  };

  // Dynamic document title and meta tags
  useEffect(() => {
    if (expedition) {
      document.title = `${expedition.name || expedition.title} — Polaris`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', expedition.summary || "India's Polar Science Portal");
      }
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
          No expedition matches the code &ldquo;{id}&rdquo;. It may have been relocated or renamed in our polar catalog.
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

  const formatDateRange = (start, end) => {
    if (!start) return '';
    try {
      const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const e = end ? new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Ongoing';
      return `${s} – ${e}`;
    } catch {
      return `${start} – ${end || 'Ongoing'}`;
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const isOngoing = expedition.status === 'active' || expedition.status === 'Ongoing';

  // Read return path to archive preserving filters
  const returnToArchiveUrl = location.state?.fromArchiveSearch
    ? `/archive?${location.state.fromArchiveSearch}`
    : `/archive?expedition=${expedition.id}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
      {/* 1. TOP BREADCRUMBS & RETURN NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glacier-border/80 pb-5">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-polar-600">
          <Link to="/" className="hover:text-polar-950 transition-colors">
            Home
          </Link>
          <span className="text-polar-400">/</span>
          <Link to="/expeditions" className="hover:text-polar-950 transition-colors">
            Expeditions
          </Link>
          <span className="text-polar-400">/</span>
          <span className="text-polar-950 font-medium truncate max-w-[220px] sm:max-w-xs">
            {expedition.name || expedition.title}
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to={returnToArchiveUrl}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-polar-700 hover:text-polar-950 px-3 py-1.5 rounded-md border border-glacier-border hover:bg-glacier-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Archive</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-polar-700 hover:text-polar-950 px-3 py-1.5 rounded-md border border-glacier-border hover:bg-glacier-100 transition-colors"
            title="Copy shareable link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-aurora-600" />
                <span className="text-aurora-700">Link copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share journey</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. TITLE BLOCK & SUMMARY */}
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Tag variant={expedition.region === 'Antarctic' ? 'ice' : expedition.region === 'Arctic' ? 'aurora' : 'default'}>
              {expedition.region}
            </Tag>
            <InfoTip termKey="region" />
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isOngoing
                  ? 'bg-aurora-50 text-aurora-700 border border-aurora-200'
                  : 'bg-polar-100 text-polar-700'
              }`}
            >
              {isOngoing ? 'Active Mission' : 'Completed'}
            </span>
            <InfoTip termKey="status" />
          </div>
          <span className="text-xs text-polar-500 font-mono">
            {expedition.id}
          </span>
          <JudgeBadge step="1" label="Official mission overview, timeline & scientific discoveries" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-polar-950 leading-[1.15]">
          {expedition.name || expedition.title}
        </h1>

        {/* Expedition Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-sm text-polar-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-polar-400 shrink-0" />
            <span>{formatDateRange(expedition.start, expedition.end)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-polar-400 shrink-0" />
            <span className="truncate">{expedition.institution || 'NCPOR / MoES'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-polar-400 shrink-0" />
            <span>{expedition.teamSize} crew &bull; Led by {expedition.leaderName}</span>
          </div>
        </div>

        {/* Plain-English Summary */}
        <p className="text-lg sm:text-xl text-polar-800 leading-relaxed font-normal pt-2 border-t border-glacier-border/80">
          {expedition.summary}
        </p>

        {/* 3 Key Findings */}
        {expedition.keyFindings && expedition.keyFindings.length > 0 && (
          <div className="bg-glacier-50 border border-glacier-border rounded-xl p-5 sm:p-6 space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-aurora-700">
              Key Discoveries Reported
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-polar-800 list-disc list-inside">
              {expedition.keyFindings.map((finding, idx) => (
                <li key={idx} className="leading-relaxed">
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Deep Authentic Scientific Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {expedition.missionMandate && (
            <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-2.5">
              <h3 className="font-serif text-lg font-normal text-polar-950 flex items-center gap-2">
                <span>National Mandate & Scientific Objectives</span>
              </h3>
              <p className="text-sm text-polar-700 leading-relaxed font-sans">
                {expedition.missionMandate}
              </p>
            </div>
          )}

          {expedition.logisticsOverview && (
            <div className="p-6 rounded-xl border border-glacier-border bg-white shadow-2xs space-y-2.5">
              <h3 className="font-serif text-lg font-normal text-polar-950 flex items-center gap-2">
                <span>Field Logistics & Harsh Environment Operations</span>
              </h3>
              <p className="text-sm text-polar-700 leading-relaxed font-sans">
                {expedition.logisticsOverview}
              </p>
            </div>
          )}
        </div>

        {expedition.climateSignificance && (
          <div className="p-6 rounded-xl border border-aurora-200/80 bg-aurora-50/40 space-y-2">
            <h3 className="font-serif text-lg font-normal text-polar-950">
              Climate Significance & Direct Impact on India
            </h3>
            <p className="text-sm text-polar-800 leading-relaxed font-sans">
              {expedition.climateSignificance}
            </p>
          </div>
        )}

        {expedition.participatingInstitutions && expedition.participatingInstitutions.length > 0 && (
          <div className="p-5 rounded-xl border border-glacier-border bg-glacier-50 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-polar-700">
              Key Collaborating Institutions & Universities
            </h4>
            <div className="flex flex-wrap gap-2">
              {expedition.participatingInstitutions.map((inst, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md bg-white border border-glacier-border text-xs font-medium text-polar-800 shadow-2xs"
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. INTERACTIVE MAP & TIMELINE SECTION */}
      <section className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-widest font-semibold text-aurora-600">
              EXPEDITION PATH & LOGS
            </p>
            <JudgeBadge step="2" label="Synchronized interactive route map and chronological log" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
            Track the journey stop by stop
          </h2>
          <p className="text-base text-polar-700 max-w-2xl">
            Click any waypoint on the map or select a timeline event below to see where scientists camped, drilled, and gathered observations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Map Pane (Sticky on desktop, above timeline on mobile) */}
          <div data-tour="expedition-map" className="lg:col-span-7 lg:sticky lg:top-24 space-y-3">
            <ExpeditionMap
              stops={expedition.stops}
              selectedStopId={selectedStopId}
              onSelectStop={handleSelectStop}
              region={expedition.region}
            />
            <div className="flex flex-wrap items-center justify-between text-xs text-polar-500 gap-2">
              <p>Tip: Click waypoints 1 through {expedition.stops?.length || 5} to step through the route.</p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span>Coordinates</span>
                  <InfoTip termKey="coordinates" />
                </span>
                <span className="flex items-center gap-1">
                  <span>Projection</span>
                  <InfoTip termKey="projection" />
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Pane */}
          <div data-tour="expedition-timeline" className="lg:col-span-5">
            <div className="bg-glacier-50/70 border border-glacier-border rounded-2xl p-6 sm:p-7">
              <h3 className="font-serif text-xl font-normal text-polar-950 mb-6">
                Chronological Log
              </h3>
              <ExpeditionTimeline
                events={expedition.events}
                selectedStopId={selectedStopId}
                onSelectStop={handleSelectStop}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPEDITION ARCHIVE RECORDS */}
      <section data-tour="expedition-records" className="space-y-6 pt-8 border-t border-glacier-border">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-polar-600">
                COLLECTION RECORDS
              </p>
              <JudgeBadge step="3" label="All data records tied to this voyage" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-polar-950 font-normal">
              Reports, Photos & Data from this Voyage ({expeditionRecords.length})
            </h2>
          </div>

          <Link
            to={`/archive?expedition=${expedition.id}`}
            className="text-sm font-semibold text-aurora-700 hover:text-aurora-600 transition-colors"
          >
            Open in full archive &rarr;
          </Link>
        </div>

        {expeditionRecords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {expeditionRecords.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                expedition={expedition}
                onClick={(clicked) => setActiveItem(clicked)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-glacier-50 rounded-xl border border-glacier-border text-polar-600">
            No archive records have been added to this expedition yet.
          </div>
        )}
      </section>

      {/* 5. PREV / NEXT EXPEDITION NAVIGATION */}
      <div data-tour="expedition-nav" className="pt-10 border-t border-glacier-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {adjacent.prev ? (
          <Link
            to={`/expeditions/${adjacent.prev.id}`}
            className="flex-1 p-4 rounded-xl border border-glacier-border bg-glacier-50 hover:bg-glacier-100 hover:border-ice-300 transition-all text-left space-y-1 group"
          >
            <span className="text-xs text-polar-500 flex items-center gap-1 group-hover:text-aurora-700">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Expedition</span>
            </span>
            <span className="block font-serif text-base text-polar-950 font-medium truncate">
              {adjacent.prev.name || adjacent.prev.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {adjacent.next && (
          <Link
            to={`/expeditions/${adjacent.next.id}`}
            className="flex-1 p-4 rounded-xl border border-glacier-border bg-glacier-50 hover:bg-glacier-100 hover:border-ice-300 transition-all text-right space-y-1 group"
          >
            <span className="text-xs text-polar-500 flex items-center justify-end gap-1 group-hover:text-aurora-700">
              <span>Next Expedition</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <span className="block font-serif text-base text-polar-950 font-medium truncate">
              {adjacent.next.name || adjacent.next.title}
            </span>
          </Link>
        )}
      </div>

      {/* Optional Card Detail Modal if item clicked */}
      {activeItem && (
        <ItemDetail
          item={activeItem}
          expedition={expedition}
          onClose={() => setActiveItem(null)}
          onPrev={() => {
            const idx = expeditionRecords.findIndex((r) => r.id === activeItem.id);
            if (idx > 0) setActiveItem(expeditionRecords[idx - 1]);
          }}
          onNext={() => {
            const idx = expeditionRecords.findIndex((r) => r.id === activeItem.id);
            if (idx < expeditionRecords.length - 1) setActiveItem(expeditionRecords[idx + 1]);
          }}
          hasPrev={expeditionRecords.findIndex((r) => r.id === activeItem.id) > 0}
          hasNext={expeditionRecords.findIndex((r) => r.id === activeItem.id) < expeditionRecords.length - 1}
          currentIndex={expeditionRecords.findIndex((r) => r.id === activeItem.id)}
          totalCount={expeditionRecords.length}
        />
      )}
    </div>
  );
}
