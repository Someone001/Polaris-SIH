import React from 'react';
import { Search, X, RotateCcw, ArrowUpDown } from 'lucide-react';
import { TYPE_LABELS } from '../lib/archiveLogic';
import InfoTip from './InfoTip';
import JudgeBadge from './JudgeBadge';

export default function ArchiveFilters({
  searchQuery,
  onSearchChange,
  selectedTypes = [],
  onToggleType,
  onSelectAllTypes,
  selectedRegion,
  onSelectRegion,
  selectedExpedition,
  onSelectExpedition,
  selectedYear,
  onSelectYear,
  sortBy,
  onSortChange,
  filterOptions,
  totalResultsCount,
  totalItemsCount,
  isFiltered,
  onClearAll,
}) {
  const { types = [], regions = [], years = [], expeditions = [] } = filterOptions || {};

  return (
    <div className="space-y-6">
      {/* 1. PROMINENT SEARCH INPUT */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="archive-search-input" className="text-xs uppercase tracking-wider font-semibold text-polar-600">
            Keyword Search
          </label>
          <JudgeBadge step="1" label="Full-text query across title, description & tags" />
        </div>
        <div data-tour="archive-search" className="relative max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-polar-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="archive-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by topic, place or keyword (try 'penguins' or 'ice')"
            className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-xl border border-glacier-border bg-glacier-50 text-polar-950 placeholder-polar-500 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent transition-all shadow-2xs"
            aria-label="Search archive items"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-polar-400 hover:text-polar-700 focus:outline-none"
              title="Clear search query"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. LARGE, CLEAR SELECTABLE TYPE CHIPS */}
      <div data-tour="archive-types" className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-polar-600">
              Browse by type
            </span>
            <InfoTip termKey="metadata" />
            <JudgeBadge step="2" label="Selectable category facets with live counts" />
          </div>
          {selectedTypes.length > 0 && (
            <button
              type="button"
              onClick={onSelectAllTypes}
              className="text-xs font-medium text-aurora-700 hover:text-aurora-600 transition-colors"
            >
              Show all types
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {/* "All" button */}
          <button
            type="button"
            onClick={onSelectAllTypes}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
              selectedTypes.length === 0
                ? 'bg-polar-900 text-glacier-50 shadow-2xs'
                : 'bg-glacier-50 text-polar-700 border border-glacier-border hover:border-polar-300 hover:bg-glacier-100'
            }`}
          >
            All records ({totalItemsCount})
          </button>

          {/* Individual Type Chips */}
          {types.map((typeOption) => {
            const isSelected = selectedTypes.includes(typeOption.key);
            return (
              <button
                key={typeOption.key}
                type="button"
                onClick={() => onToggleType(typeOption.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                  isSelected
                    ? 'bg-polar-900 text-glacier-50 shadow-2xs'
                    : 'bg-glacier-50 text-polar-700 border border-glacier-border hover:border-polar-300 hover:bg-glacier-100'
                }`}
              >
                <span>{typeOption.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-polar-800 text-polar-200'
                      : 'bg-polar-100 text-polar-600'
                  }`}
                >
                  {typeOption.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SECONDARY FILTERS & SORTING ROW (COMPACT, RECEDING) */}
      <div className="pt-4 border-t border-glacier-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Dropdown selectors */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Region Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-region" className="text-xs font-semibold text-polar-500 uppercase tracking-wider flex items-center">
              Region:
              <InfoTip termKey="region" />
            </label>
            <select
              id="filter-region"
              value={selectedRegion || 'all'}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="py-1.5 pl-3 pr-8 rounded-md border border-glacier-border bg-glacier-50 text-polar-800 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-aurora-500 cursor-pointer"
            >
              <option value="all">All regions ({totalItemsCount})</option>
              {regions.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label} ({r.count})
                </option>
              ))}
            </select>
          </div>

          {/* Expedition Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-expedition" className="text-xs font-semibold text-polar-500 uppercase tracking-wider flex items-center">
              Expedition:
              <InfoTip termKey="expedition" />
            </label>
            <select
              id="filter-expedition"
              value={selectedExpedition || 'all'}
              onChange={(e) => onSelectExpedition(e.target.value)}
              className="py-1.5 pl-3 pr-8 rounded-md border border-glacier-border bg-glacier-50 text-polar-800 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-aurora-500 max-w-[220px] truncate cursor-pointer"
            >
              <option value="all">All expeditions</option>
              {expeditions.map((e) => (
                <option key={e.key} value={e.key}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-year" className="text-xs font-semibold text-polar-500 uppercase tracking-wider flex items-center">
              Year:
              <InfoTip termKey="year" />
            </label>
            <select
              id="filter-year"
              value={selectedYear || 'all'}
              onChange={(e) => onSelectYear(e.target.value)}
              className="py-1.5 pl-3 pr-8 rounded-md border border-glacier-border bg-glacier-50 text-polar-800 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-aurora-500 cursor-pointer"
            >
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y.key} value={y.key}>
                  {y.label} ({y.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and Count */}
        <div className="flex items-center gap-4 text-sm justify-between md:justify-end">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-polar-500" />
            <span className="text-xs font-semibold text-polar-500 uppercase tracking-wider">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="py-1.5 pl-2 pr-7 rounded-md border border-glacier-border bg-glacier-50 text-polar-800 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-aurora-500 cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. RESULT COUNT & CLEAR ALL LINK */}
      <div className="flex items-center justify-between text-sm text-polar-600 pt-1">
        <p className="font-medium">
          Showing <span className="text-polar-950 font-bold">{totalResultsCount}</span> of {totalItemsCount} items
        </p>

        {isFiltered && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-aurora-700 hover:text-aurora-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear all filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
