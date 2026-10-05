import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import ArchiveFilters from '../components/ArchiveFilters';
import ItemCard from '../components/ItemCard';
import ItemDetail from '../components/ItemDetail';
import EmptyState from '../components/EmptyState';
import { getItems, getExpeditions } from '../lib/dataLoader';
import { filterItems, sortItems, getFilterOptions } from '../lib/archiveLogic';

export default function Archive() {
  const [searchParams, setSearchParams] = useSearchParams();

  // All static bundled data
  const allItems = useMemo(() => getItems(), []);
  const allExpeditions = useMemo(() => getExpeditions(), []);

  // Quick lookup map for expeditions
  const expMap = useMemo(() => {
    const map = new Map();
    allExpeditions.forEach((exp) => map.set(exp.id, exp));
    return map;
  }, [allExpeditions]);

  // Read filter state from URL query parameters
  const searchQuery = searchParams.get('q') || '';
  const selectedTypes = useMemo(() => {
    const typeParam = searchParams.get('type');
    return typeParam ? typeParam.split(',').filter(Boolean) : [];
  }, [searchParams]);
  const selectedRegion = searchParams.get('region') || 'all';
  const selectedExpedition = searchParams.get('expedition') || 'all';
  const selectedYear = searchParams.get('year') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';
  const activeItemId = searchParams.get('item') || null;

  // Filter options and item counts
  const filterOptions = useMemo(() => {
    return getFilterOptions(allItems, allExpeditions);
  }, [allItems, allExpeditions]);

  // Compute filtered & sorted items
  const filteredItems = useMemo(() => {
    const filtered = filterItems(
      allItems,
      {
        query: searchQuery,
        types: selectedTypes,
        regions: selectedRegion !== 'all' ? [selectedRegion] : [],
        expeditionId: selectedExpedition !== 'all' ? selectedExpedition : null,
        year: selectedYear !== 'all' ? selectedYear : null,
      },
      allExpeditions
    );

    return sortItems(filtered, sortBy);
  }, [allItems, searchQuery, selectedTypes, selectedRegion, selectedExpedition, selectedYear, sortBy, allExpeditions]);

  // Helper to update search params while preserving existing ones
  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Remove empty/default keys to keep URL clean
    Object.keys(merged).forEach((key) => {
      if (!merged[key] || merged[key] === 'all' || (Array.isArray(merged[key]) && merged[key].length === 0)) {
        delete merged[key];
      }
    });

    setSearchParams(merged, { replace: true });
  };

  // Filter handlers
  const handleSearchChange = (query) => {
    updateParams({ q: query });
  };

  const handleToggleType = (typeKey) => {
    let nextTypes = [];
    if (selectedTypes.includes(typeKey)) {
      nextTypes = selectedTypes.filter((t) => t !== typeKey);
    } else {
      nextTypes = [...selectedTypes, typeKey];
    }
    updateParams({ type: nextTypes.length > 0 ? nextTypes.join(',') : null });
  };

  const handleSelectAllTypes = () => {
    updateParams({ type: null });
  };

  const handleSelectRegion = (region) => {
    updateParams({ region });
  };

  const handleSelectExpedition = (expedition) => {
    updateParams({ expedition });
  };

  const handleSelectYear = (year) => {
    updateParams({ year });
  };

  const handleSortChange = (sort) => {
    updateParams({ sort });
  };

  const handleClearAll = () => {
    // Keep activeItemId if open, or clear all filters
    const next = activeItemId ? { item: activeItemId } : {};
    setSearchParams(next, { replace: true });
  };

  const isFiltered = Boolean(
    searchQuery ||
    selectedTypes.length > 0 ||
    selectedRegion !== 'all' ||
    selectedExpedition !== 'all' ||
    selectedYear !== 'all'
  );

  // Active item detail state
  const activeItem = useMemo(() => {
    if (!activeItemId) return null;
    return allItems.find((i) => i.id === activeItemId) || null;
  }, [activeItemId, allItems]);

  const activeItemIndex = useMemo(() => {
    if (!activeItem) return -1;
    return filteredItems.findIndex((i) => i.id === activeItem.id);
  }, [activeItem, filteredItems]);

  const handleOpenItem = (item) => {
    updateParams({ item: item.id });
  };

  const handleCloseItem = () => {
    const current = Object.fromEntries(searchParams.entries());
    delete current.item;
    setSearchParams(current, { replace: true });
  };

  const handlePrevItem = () => {
    if (activeItemIndex > 0) {
      const prevItem = filteredItems[activeItemIndex - 1];
      updateParams({ item: prevItem.id });
    }
  };

  const handleNextItem = () => {
    if (activeItemIndex >= 0 && activeItemIndex < filteredItems.length - 1) {
      const nextItem = filteredItems[activeItemIndex + 1];
      updateParams({ item: nextItem.id });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
      {/* 1. PAGE HEADER */}
      <div className="space-y-3 max-w-3xl">
        <SectionHeading
          kicker="KNOWLEDGE ARCHIVE"
          title="Explore the Collection"
          description={`Browse ${allItems.length} records from Indian polar expeditions, including published research papers, calibrated datasets, high-latitude photographs, videos, and outreach activities.`}
        />
      </div>

      {/* 2. FILTERS CONTROL BAR */}
      <div data-reveal data-reveal-direction="up" className="reveal-on-scroll bg-glacier-50 p-6 sm:p-8 rounded-2xl border border-glacier-border shadow-xs">
        <ArchiveFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedTypes={selectedTypes}
          onToggleType={handleToggleType}
          onSelectAllTypes={handleSelectAllTypes}
          selectedRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
          selectedExpedition={selectedExpedition}
          onSelectExpedition={handleSelectExpedition}
          selectedYear={selectedYear}
          onSelectYear={handleSelectYear}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          filterOptions={filterOptions}
          totalResultsCount={filteredItems.length}
          totalItemsCount={allItems.length}
          isFiltered={isFiltered}
          onClearAll={handleClearAll}
        />
      </div>

      {/* 3. RESULTS GRID OR EMPTY STATE */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <ItemCard
              key={item.id}
              item={item}
              expedition={expMap.get(item.expeditionId)}
              onClick={handleOpenItem}
              dataTour={idx === 0 ? 'archive-first-card' : undefined}
              data-reveal-delay={Math.min((idx % 6) * 60, 300)}
            />
          ))}
        </div>
      ) : (
        <EmptyState onClear={handleClearAll} query={searchQuery} />
      )}

      {/* 4. DETAIL PANEL (MODAL / SLIDE-OVER) */}
      {activeItem && (
        <ItemDetail
          item={activeItem}
          expedition={expMap.get(activeItem.expeditionId)}
          onClose={handleCloseItem}
          onPrev={handlePrevItem}
          onNext={handleNextItem}
          hasPrev={activeItemIndex > 0}
          hasNext={activeItemIndex >= 0 && activeItemIndex < filteredItems.length - 1}
          currentIndex={activeItemIndex >= 0 ? activeItemIndex : 0}
          totalCount={filteredItems.length}
        />
      )}
    </div>
  );
}
