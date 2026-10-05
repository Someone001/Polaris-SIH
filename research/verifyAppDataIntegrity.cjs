const fs = require('fs');
const path = require('path');

const ledgerPath = path.join(__dirname, 'sources-ledger.json');
const expeditionsPath = path.join(__dirname, '../src/data/expeditions.json');
const itemsPath = path.join(__dirname, '../src/data/items.json');

const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const expeditionsData = JSON.parse(fs.readFileSync(expeditionsPath, 'utf8'));
const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

const expeditions = Array.isArray(expeditionsData) ? expeditionsData : (expeditionsData.expeditions || []);
const items = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);

let failures = [];

// 1. Gather all DOIs from ledger
const ledgerDOIs = new Set();
// 2. Gather all approved persons from ledger
const ledgerPersons = new Set();

function cleanName(n) {
  return n.trim().toLowerCase();
}

ledger.forEach(entry => {
  const f = entry.fields || {};
  const doi = f.doi || entry.doi;
  if (doi) {
    ledgerDOIs.add(doi.toLowerCase().trim());
  }

  const authors = f.authors || entry.authors;
  if (authors && Array.isArray(authors)) {
    authors.forEach(a => ledgerPersons.add(cleanName(a)));
  }

  const photographer = f.photographer || entry.photographer;
  if (photographer) {
    ledgerPersons.add(cleanName(photographer));
  }

  const author = f.author || entry.author;
  if (author) {
    ledgerPersons.add(cleanName(author));
  }

  const channelTitle = f.channelTitle || entry.channelTitle;
  if (channelTitle) {
    ledgerPersons.add(cleanName(channelTitle));
  }
});

console.log(`[Ledger] Loaded ${ledger.length} ledger entries.`);
console.log(`[Ledger] Found ${ledgerDOIs.size} distinct DOIs in ledger:`, Array.from(ledgerDOIs));
console.log(`[Ledger] Found ${ledgerPersons.size} distinct author/photographer names in ledger.`);

// Check Expeditions
console.log(`\nChecking ${expeditions.length} expeditions in src/data/expeditions.json...`);
expeditions.forEach(exp => {
  if (!exp.sourceUrl) {
    failures.push(`Expedition ${exp.id} (${exp.title || exp.name}) lacks sourceUrl!`);
  }
  // Check if any leader or author was added
  if (exp.leader) {
    failures.push(`Expedition ${exp.id} contains leader field "${exp.leader}"! (Invented leaders must not exist)`);
  }
  if (exp.stops && exp.stops.length > 0) {
    failures.push(`Expedition ${exp.id} contains waypoint stops! (Invented waypoints must not exist)`);
  }
  if (exp.keyFindings && exp.keyFindings.length > 0) {
    failures.push(`Expedition ${exp.id} contains keyFindings! (Invented keyFindings must not exist)`);
  }
  // Check against ledger ID
  const inLedger = ledger.find(l => l.id === exp.id);
  if (!inLedger) {
    failures.push(`Expedition ${exp.id} is not present in sources-ledger.json!`);
  }
});

// Check Items
console.log(`\nChecking ${items.length} items in src/data/items.json...`);
items.forEach(item => {
  if (!item.sourceUrl) {
    failures.push(`Item ${item.id} (${item.title}) lacks sourceUrl!`);
  }
  if (item.doi) {
    const cleanDoi = item.doi.toLowerCase().trim();
    if (!ledgerDOIs.has(cleanDoi)) {
      failures.push(`Item ${item.id} has DOI "${item.doi}" which is NOT in sources-ledger.json!`);
    }
  }
  // Check persons
  if (item.authors && Array.isArray(item.authors)) {
    item.authors.forEach(a => {
      if (!ledgerPersons.has(cleanName(a))) {
        failures.push(`Item ${item.id} has author "${a}" which is NOT in sources-ledger.json!`);
      }
    });
  }
  if (item.photographer) {
    if (!ledgerPersons.has(cleanName(item.photographer))) {
      failures.push(`Item ${item.id} has photographer "${item.photographer}" which is NOT in sources-ledger.json!`);
    }
  }
  if (item.author) {
    if (!ledgerPersons.has(cleanName(item.author))) {
      failures.push(`Item ${item.id} has author "${item.author}" which is NOT in sources-ledger.json!`);
    }
  }
  if (item.dataPoints) {
    failures.push(`Item ${item.id} has dataPoints spec table! (Invented spec tables must not exist)`);
  }

  // Check against ledger ID
  const inLedger = ledger.find(l => l.id === item.id);
  if (!inLedger) {
    failures.push(`Item ${item.id} is not present in sources-ledger.json!`);
  }
});

// Check for invented composite names in codebase
const inventedNames = [
  "Dr. Kavita Nambiar",
  "Kavita Nambiar",
  "Dr. Rajeshwar Rao",
  "Rajeshwar Rao",
  "Dr. Sunil Deshmukh",
  "Sunil Deshmukh",
  "Dr. Ananya Roy",
  "Ananya Roy",
  "Dr. Tenzing Norbu",
  "Tenzing Norbu",
  "Dr. Vikramaditya Sen",
  "Vikramaditya Sen",
  "Dr. Parvati Pillai",
  "Parvati Pillai",
  "Capt. Harminder Singh",
  "Harminder Singh",
  "Dr. Arvind Kulkarni",
  "Arvind Kulkarni",
  "Dr. Meenakshi Sundaram",
  "Meenakshi Sundaram",
  "Dr. Sandeep Banerjee",
  "Sandeep Banerjee"
];

const srcDir = path.join(__dirname, '../src');
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      scanDir(full);
    } else if (/\.(js|jsx|json)$/.test(ent.name)) {
      const content = fs.readFileSync(full, 'utf8');
      inventedNames.forEach(name => {
        if (content.includes(name)) {
          failures.push(`Found invented name "${name}" in ${path.relative(__dirname, full)}`);
        }
      });
    }
  }
}
scanDir(srcDir);

console.log('\n----------------------------------------');
if (failures.length > 0) {
  console.error(`FAILED: ${failures.length} issues detected:`);
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log(`SUCCESS: All ${expeditions.length} expeditions and ${items.length} archive items have valid sourceUrl, valid DOIs in ledger, and no unsourced persons or invented personas!`);
  process.exit(0);
}
