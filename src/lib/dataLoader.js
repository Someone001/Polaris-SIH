import expeditionsData from '../data/expeditions.json';
import itemsData from '../data/items.json';

/**
 * Returns all expeditions from the sample dataset.
 */
export function getExpeditions() {
  return expeditionsData.expeditions || [];
}

/**
 * Returns all expeditions sorted chronologically by start date (oldest to newest or newest to oldest).
 */
export function getExpeditionsSortedByDate(ascending = true) {
  const expeditions = [...getExpeditions()];
  return expeditions.sort((a, b) => {
    const dateA = a.start || `${a.year}-01-01`;
    const dateB = b.start || `${b.year}-01-01`;
    return ascending ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
  });
}

/**
 * Returns a specific expedition by its ID.
 */
export function getExpedition(id) {
  const expeditions = getExpeditions();
  return expeditions.find((exp) => exp.id === id) || null;
}

/**
 * Returns the previous and next expeditions chronologically.
 */
export function getAdjacentExpeditions(id) {
  const sorted = getExpeditionsSortedByDate(true);
  const index = sorted.findIndex((exp) => exp.id === id);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

/**
 * Returns all archive items from the sample dataset.
 */
export function getItems() {
  return itemsData.items || [];
}

/**
 * Returns all archive items associated with a given expedition ID.
 */
export function getItemsByExpedition(expeditionId) {
  const items = getItems();
  return items.filter((item) => item.expeditionId === expeditionId);
}

/**
 * Returns a single archive item by its ID.
 */
export function getItem(id) {
  const items = getItems();
  return items.find((item) => item.id === id) || null;
}

/**
 * Returns calculated summary statistics for display.
 */
export function getPortalStats() {
  const expeditions = getExpeditions();
  const items = getItems();
  const regions = new Set(expeditions.map((e) => e.region));

  return {
    expeditionsCount: expeditions.length,
    itemsCount: items.length,
    regionsCount: regions.size,
    regionsList: Array.from(regions),
  };
}
