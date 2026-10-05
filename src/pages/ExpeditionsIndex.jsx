import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Compass, ArrowRight, RotateCcw, MapPin, Database, ExternalLink, Anchor, Users } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Tag from '../components/Tag';
import { getExpeditionsSortedByDate, getItems } from '../lib/dataLoader';

export default function ExpeditionsIndex() {
  const [searchParams, setSearchParams] = useSearchParams();

  const allExpeditions = useMemo(() => getExpeditionsSortedByDate(true), []);
  const allItems = useMemo(() => getItems(), []);

  // Compute record counts per expedition
  const itemCountsByExp = useMemo(() => {
    const counts = {};
    allItems.forEach((item) => {
      if (item.expeditionId) {
        counts[item.expeditionId] = (counts[item.expeditionId] || 0) + 1;
      }
    });
    return counts;
  }, [allItems]);

  // Read filter state from query string
  const selectedRegion = searchParams.get('region') || 'all';
  const selectedYear = searchParams.get('year') || 'all';

  // Available filter options
  const regions = ['Antarctic', 'Arctic'];
  const years = useMemo(() => {
    const ySet = new Set(allExpeditions.map((e) => String(e.year || '')));
    return Array.from(ySet).filter(Boolean).sort().reverse();
  }, [allExpeditions]);

  // Update query string helper
  const updateFilters = (newFilters) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newFilters };
    Object.keys(merged).forEach((k) => {
      if (!merged[k] || merged[k] === 'all') delete merged[k];
    });
    setSearchParams(merged, { replace: true });
  };

  // Filtered expeditions list
  const filteredExpeditions = useMemo(() => {
    return allExpeditions.filter((exp) => {
      if (selectedRegion !== 'all' && exp.region !== selectedRegion) {
        return false;
      }
      const expYear = String(exp.year || '');
      if (selectedYear !== 'all' && expYear !== selectedYear) {
        return false;
      }
      return true;
    });
  }, [allExpeditions, selectedRegion, selectedYear]);

  const isFiltered = selectedRegion !== 'all' || selectedYear !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <SectionHeading
          kicker="NATIONAL POLAR MISSIONS"
          title="Indian Scientific Expeditions"
          description="Chronological records of scientific expeditions documented by the Ministry of Earth Sciences across Antarctica and the Arctic."
        />
      </div>

      {/* Filter Chips Bar */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll bg-glacier-50 p-6 sm:p-7 rounded-2xl border border-glacier-border space-y-5 shadow-xs">
        {/* Region Filter Chips */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-polar-600">
            Filter by region
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateFilters({ region: 'all' })}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedRegion === 'all'
                  ? 'bg-polar-900 text-glacier-50'
                  : 'bg-glacier-100 text-polar-700 border border-glacier-border hover:bg-glacier-200'
              }`}
            >
              All regions ({allExpeditions.length})
            </button>
            {regions.map((reg) => {
              const count = allExpeditions.filter((e) => e.region === reg).length;
              const isSelected = selectedRegion === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => updateFilters({ region: isSelected ? 'all' : reg })}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-polar-900 text-glacier-50'
                      : 'bg-glacier-100 text-polar-700 border border-glacier-border hover:bg-glacier-200'
                  }`}
                >
                  {reg} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Year Filter Chips */}
        {years.length > 0 && (
          <div className="pt-3 border-t border-glacier-border/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-polar-600 mr-1">
                Year:
              </span>
              <button
                type="button"
                onClick={() => updateFilters({ year: 'all' })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedYear === 'all'
                    ? 'bg-polar-900 text-glacier-50'
                    : 'bg-glacier-100 text-polar-700 border border-glacier-border hover:bg-glacier-200'
                }`}
              >
                All
              </button>
              {years.map((yr) => {
                const isSelected = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => updateFilters({ year: isSelected ? 'all' : yr })}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-polar-900 text-glacier-50'
                        : 'bg-glacier-100 text-polar-700 border border-glacier-border hover:bg-glacier-200'
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={() => setSearchParams({}, { replace: true })}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-aurora-700 hover:text-aurora-600"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expeditions List Rows */}
      <div className="space-y-4">
        {filteredExpeditions.map((exp, idx) => {
          const recordCount = itemCountsByExp[exp.id] || 0;
          const dateStr = exp.launchDate || exp.flagOffDate;
          const stationsStr = exp.stations?.join(', ') || exp.station;

          return (
            <article
              key={exp.id}
              data-reveal
              data-reveal-direction="up"
              data-reveal-delay={Math.min((idx % 5) * 70, 300)}
              className="reveal-card group bg-glacier-50 border border-glacier-border rounded-xl p-6 sm:p-7 hover:border-ice-300 hover:shadow-xs transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Column: Title, Dates, Region, Sourced Details */}
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Tag variant={exp.region === 'Antarctic' ? 'ice' : exp.region === 'Arctic' ? 'aurora' : 'default'} size="sm">
                    {exp.region}
                  </Tag>
                  {exp.year && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-polar-100 text-polar-800">
                      Season {exp.year}
                    </span>
                  )}
                  {dateStr && (
                    <span className="text-xs text-polar-500 font-mono">
                      {dateStr}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-polar-950 group-hover:text-aurora-700 transition-colors">
                  <Link to={`/expeditions/${exp.id}`}>
                    {exp.name || exp.title}
                  </Link>
                </h3>

                {/* Sourced Summary / Mandate / Excerpt */}
                <p className="text-sm sm:text-base text-polar-700 leading-relaxed">
                  {exp.focus || exp.primaryMandate || exp.milestone || exp.sourceExcerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-polar-600 pt-1">
                  {stationsStr && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-polar-400" />
                      <span>{stationsStr}</span>
                    </span>
                  )}
                  {exp.vessel && (
                    <span className="inline-flex items-center gap-1">
                      <Anchor className="w-3.5 h-3.5 text-polar-400" />
                      <span>{exp.vessel}</span>
                    </span>
                  )}
                  {exp.teamSize && (
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-polar-400" />
                      <span>{exp.teamSize} members</span>
                    </span>
                  )}
                  {exp.initialBatchSize && (
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-polar-400" />
                      <span>First batch: {exp.initialBatchSize} members</span>
                    </span>
                  )}
                  {recordCount > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-polar-400" />
                      <span>{recordCount} archive records</span>
                    </span>
                  )}
                </div>

                {/* Primary Source Credit */}
                {exp.sourceUrl && (
                  <div className="pt-1 flex items-center gap-2 text-xs text-polar-500">
                    <span className="font-semibold text-polar-600">Source:</span>
                    <a
                      href={exp.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-aurora-700 hover:text-aurora-800 underline inline-flex items-center gap-0.5"
                    >
                      <span>Press Information Bureau</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: CTA Button */}
              <div className="shrink-0 flex items-center md:justify-end">
                <Link
                  to={`/expeditions/${exp.id}`}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-polar-900 text-glacier-50 text-sm font-medium hover:bg-polar-800 transition-colors shadow-2xs group-hover:translate-x-0.5"
                >
                  <span>View mission record</span>
                  <ArrowRight className="w-4 h-4 text-aurora-300" />
                </Link>
              </div>
            </article>
          );
        })}

        {filteredExpeditions.length === 0 && (
          <div className="py-16 text-center rounded-xl border border-dashed border-glacier-border bg-glacier-50">
            <p className="text-polar-600 text-base">
              No expeditions match the selected filters.
            </p>
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              className="mt-3 text-sm font-semibold text-aurora-700 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
