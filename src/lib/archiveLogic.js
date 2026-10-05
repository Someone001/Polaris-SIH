/**
 * Pure functions for Archive filtering, sorting, and options generation.
 */

// Human-friendly plain labels for item types
export const TYPE_LABELS = {
  Publication: 'Published papers',
  Dataset: 'Research data',
  Photo: 'Photographs',
  Video: 'Videos',
  Activity: 'Activities & events',
};

/**
 * Filter items with:
 * - Case-insensitive query across title, description, author/creators, journal, doi, and tags
 * - AND combination between different filters
 * - OR combination within a multi-select filter (e.g. types, regions)
 */
export function filterItems(items = [], filters = {}, expeditions = []) {
  const { query, types, regions, expeditionId, year } = filters;

  // Build a fast lookup map for expedition details (to get region and year)
  const expMap = new Map();
  if (Array.isArray(expeditions)) {
    expeditions.forEach((exp) => expMap.set(exp.id, exp));
  }

  const cleanQuery = query ? query.trim().toLowerCase() : '';
  const selectedTypes = Array.isArray(types)
    ? types.filter(Boolean)
    : types
    ? [types]
    : [];
  const selectedRegions = Array.isArray(regions)
    ? regions.filter(Boolean)
    : regions
    ? [regions]
    : [];

  return items.filter((item) => {
    const itemRegion = item.region || '';
    const itemYear = item.year ? String(item.year) : item.date ? item.date.slice(0, 4) : '';

    // 1. Query search across title, description, authors, journal, doi, and tags
    if (cleanQuery) {
      const matchTitle = item.title?.toLowerCase().includes(cleanQuery);
      const matchDesc = (item.description || item.subject || item.highlights || '')?.toLowerCase().includes(cleanQuery);
      const matchAuthor = (item.author || (Array.isArray(item.creators) ? item.creators.join(' ') : ''))?.toLowerCase().includes(cleanQuery);
      const matchJournal = item.journal?.toLowerCase().includes(cleanQuery);
      const matchDoi = item.doi?.toLowerCase().includes(cleanQuery);
      const matchTags = Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(cleanQuery));

      if (!matchTitle && !matchDesc && !matchAuthor && !matchJournal && !matchDoi && !matchTags) {
        return false;
      }
    }

    // 2. Types filter (OR within types)
    if (selectedTypes.length > 0) {
      if (!selectedTypes.includes(item.type)) {
        return false;
      }
    }

    // 3. Regions filter (OR within regions)
    if (selectedRegions.length > 0) {
      if (!selectedRegions.includes(itemRegion)) {
        return false;
      }
    }

    // 4. Expedition filter (exact match)
    if (expeditionId && expeditionId !== 'all') {
      if (item.expeditionId !== expeditionId) {
        return false;
      }
    }

    // 5. Year filter (exact match)
    if (year && year !== 'all') {
      if (itemYear !== String(year)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts items by "newest", "oldest", or "title"
 */
export function sortItems(items = [], sortBy = 'newest') {
  const cloned = [...items];

  const getDateOrYear = (item) => {
    if (item.date) return item.date;
    if (item.year) return `${item.year}-01-01`;
    return '1900-01-01';
  };

  switch (sortBy) {
    case 'oldest':
      return cloned.sort((a, b) => getDateOrYear(a).localeCompare(getDateOrYear(b)));
    case 'title':
      return cloned.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'newest':
    default:
      return cloned.sort((a, b) => getDateOrYear(b).localeCompare(getDateOrYear(a)));
  }
}

/**
 * Computes available filter options and their item counts based on items and expeditions.
 */
export function getFilterOptions(items = [], expeditions = []) {
  const expMap = new Map();
  expeditions.forEach((exp) => expMap.set(exp.id, exp));

  const typeCounts = {};
  const regionCounts = {};
  const yearCounts = {};
  const expeditionCounts = {};

  items.forEach((item) => {
    // Type counts
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;

    const region = item.region;
    if (region) {
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    }

    const year = item.year ? String(item.year) : item.date ? item.date.slice(0, 4) : exp?.year ? String(exp.year) : null;
    if (year) {
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }

    if (item.expeditionId) {
      expeditionCounts[item.expeditionId] = (expeditionCounts[item.expeditionId] || 0) + 1;
    }
  });

  const typesList = Object.keys(typeCounts).map((key) => ({
    key,
    label: TYPE_LABELS[key] || key,
    count: typeCounts[key] || 0,
  }));

  const regionsList = Object.keys(regionCounts)
    .sort()
    .map((region) => ({
      key: region,
      label: region,
      count: regionCounts[region],
    }));

  const yearsList = Object.keys(yearCounts)
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({
      key: year,
      label: year,
      count: yearCounts[year],
    }));

  const expeditionsList = expeditions
    .filter((exp) => expeditionCounts[exp.id])
    .map((exp) => ({
      key: exp.id,
      label: exp.title || exp.name,
      count: expeditionCounts[exp.id] || 0,
      region: exp.region,
      year: exp.year,
    }));

  return {
    types: typesList,
    regions: regionsList,
    years: yearsList,
    expeditions: expeditionsList,
  };
}
