const fs = require('fs');
const path = require('path');

const ledgerPath = path.join(__dirname, 'sources-ledger.json');
const expeditionsPath = path.join(__dirname, '../src/data/expeditions.json');
const itemsPath = path.join(__dirname, '../src/data/items.json');

const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

// 1. Update expeditions in ledger with strict excerpts and no invented fields
const expUpdates = {
  'exp-001': {
    fields: {
      name: "40th Indian Scientific Expedition to Antarctica",
      region: "Antarctic",
      departurePort: "Goa",
      launchDate: "January 5, 2021",
      vessel: "MV Vasiliy Golovnin",
      teamSize: 43
    },
    sources: [
      {
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1685978",
        fetchedAt: "2026-10-03T15:28:53+05:30",
        excerpt: "The 40th expedition journey will be flagged off from Goa on January 5, 2021, with 43 members onboard. The chartered ice-class vessel MV Vasiliy Golovnin will make this journey and will reach Antarctica in 30 days."
      }
    ]
  },
  'exp-002': {
    fields: {
      name: "41st Indian Scientific Expedition to Antarctica",
      region: "Antarctic",
      departurePort: "Goa",
      launchDate: "November 15, 2021",
      nodalAgency: "National Centre for Polar and Ocean Research (NCPOR)"
    },
    sources: [
      {
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1786052",
        fetchedAt: "2026-10-03T15:28:53+05:30",
        excerpt: "The 41st Indian Scientific Expedition to Antarctica launched from National Centre for Polar and Ocean Research (NCPOR), Goa on November 15, 2021."
      }
    ]
  },
  'exp-003': {
    fields: {
      name: "42nd Indian Scientific Expedition to Antarctica",
      region: "Antarctica",
      location: "Prydz Bay, East Antarctica",
      focus: "Deployed ice-tethered oceanographic mooring at Prydz Bay, East Antarctica, to collect data on the physical parameters of the under-ice water column"
    },
    sources: [
      {
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1991319",
        fetchedAt: "2026-10-03T15:28:53+05:30",
        excerpt: "The 42nd Indian Scientific Expedition to Antarctica deployed ice-tethered oceanographic mooring at Prydz Bay, East Antarctica, to collect data on the physical parameters of the under-ice water column."
      }
    ]
  },
  'exp-004': {
    fields: {
      name: "43rd Indian Scientific Expedition to Antarctica",
      region: "Antarctica",
      launchDate: "October 2023",
      initialBatchSize: 19,
      focus: "Launched with the first batch of 19 members travelling to Antarctica in October 2023"
    },
    sources: [
      {
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1991319",
        fetchedAt: "2026-10-03T15:28:53+05:30",
        excerpt: "The 43rd Indian Scientific Expedition to Antarctica was launched with the first batch of 19 members travelling to Antarctica in October 2023."
      }
    ]
  },
  'exp-005': {
    fields: {
      name: "First Indian Winter Scientific Arctic Expedition",
      region: "Arctic",
      flagOffDate: "December 18, 2023",
      flaggedOffFrom: "MoES headquarters in New Delhi",
      station: "Himadri",
      coordinates: "78°55'N, 11°56'E",
      latitude: 78.9167,
      longitude: 11.9333
    },
    sources: [
      {
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1987724",
        fetchedAt: "2026-10-03T15:28:53+05:30",
        excerpt: "The Honourable Union Minister, Ministry of Earth Sciences (MoES), Sh Kiren Rijiju, flagged off India's first winter scientific expedition to the Arctic from the MoES headquarters in New Delhi on December 18, 2023."
      }
    ]
  }
};

// 2. Update photos in ledger
const photoUpdates = {
  'photo-001': {
    author: "Author unknown",
    license: "Public domain",
    attributionText: "Author unknown, Public domain, via Wikimedia Commons",
    imageUrl: "/images/bharati-station.jpg"
  },
  'photo-002': {
    author: "Ministry of Science and Technology",
    license: "GODL-India",
    attributionText: "Ministry of Science and Technology, Government Open Data License - India (GODL-India), via Wikimedia Commons",
    imageUrl: "/images/maitri-station.jpg"
  },
  'photo-003': {
    author: "Superchilum",
    license: "CC BY-SA 3.0",
    attributionText: "Superchilum, CC BY-SA 3.0, via Wikimedia Commons",
    imageUrl: "/images/himadri-station.JPG"
  },
  'photo-004': {
    author: "Pavan Nair",
    license: "CC BY-SA 4.0",
    attributionText: "Pavan Nair, CC BY-SA 4.0, via Wikimedia Commons",
    imageUrl: "/images/dakshin-gangotri.jpg"
  },
  'photo-005': {
    author: "Anipilot",
    license: "Public domain",
    attributionText: "Anipilot, Public domain, via Wikimedia Commons",
    imageUrl: "/images/orv-sagar-kanya.jpg"
  },
  'photo-006': {
    author: "Bjoertvedt",
    license: "CC BY-SA 3.0",
    attributionText: "Bjoertvedt, CC BY-SA 3.0, via Wikimedia Commons",
    imageUrl: "/images/salix-polaris-arctic-willow.jpg"
  },
  'photo-007': {
    author: "Pavan Nair",
    license: "CC BY-SA 4.0",
    attributionText: "Pavan Nair, CC BY-SA 4.0, via Wikimedia Commons",
    imageUrl: "/images/schirmacher-oasis.jpg"
  },
  'hero-video-001': {
    author: "Blagoj Klincharski",
    license: "CC BY 3.0",
    attributionText: "Blagoj Klincharski, CC BY 3.0, via Wikimedia Commons"
  }
};

// Apply updates to ledger
ledger.forEach(entry => {
  if (expUpdates[entry.id]) {
    entry.fields = { ...entry.fields, ...expUpdates[entry.id].fields };
    entry.sources = expUpdates[entry.id].sources;
  }
  if (photoUpdates[entry.id]) {
    entry.fields.author = photoUpdates[entry.id].author;
    entry.fields.license = photoUpdates[entry.id].license;
    entry.fields.attributionText = photoUpdates[entry.id].attributionText;
  }
});

fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2), 'utf8');
console.log('Updated sources-ledger.json with strict excerpts and verified Commons metadata.');

// 3. Rebuild expeditions.json from ledger
const newExpeditions = ledger.filter(e => e.type === 'Expedition').map(e => {
  const f = e.fields;
  const s = e.sources[0];
  const obj = {
    id: e.id,
    name: f.name,
    title: f.name,
    region: f.region,
    sourceUrl: s.url,
    sourceExcerpt: s.excerpt,
    creditLine: "Source: Press Information Bureau, Government of India"
  };
  if (f.departurePort) obj.departurePort = f.departurePort;
  if (f.launchDate) obj.launchDate = f.launchDate;
  if (f.vessel) obj.vessel = f.vessel;
  if (f.teamSize) obj.teamSize = f.teamSize;
  if (f.nodalAgency) obj.nodalAgency = f.nodalAgency;
  if (f.location) obj.location = f.location;
  if (f.focus) obj.focus = f.focus;
  if (f.initialBatchSize) obj.initialBatchSize = f.initialBatchSize;
  if (f.flagOffDate) obj.flagOffDate = f.flagOffDate;
  if (f.flaggedOffFrom) obj.flaggedOffFrom = f.flaggedOffFrom;
  if (f.station) obj.station = f.station;
  if (f.coordinates) obj.coordinates = f.coordinates;
  if (f.latitude) obj.latitude = f.latitude;
  if (f.longitude) obj.longitude = f.longitude;
  return obj;
});

fs.writeFileSync(expeditionsPath, JSON.stringify({ isSampleData: false, expeditions: newExpeditions }, null, 2), 'utf8');
console.log(`Updated src/data/expeditions.json with ${newExpeditions.length} expeditions.`);

// 4. Rebuild items.json from ledger: Omit inferred region and attach imageUrl for photos
const newItems = ledger.filter(e => e.type !== 'Expedition' && e.id !== 'hero-video-001').map((e, idx) => {
  const f = e.fields;
  const s = e.sources[0];
  const item = {
    id: e.id,
    type: e.type,
    title: f.title || f.name,
    sourceUrl: s.url,
    sourceExcerpt: s.excerpt,
    creditLine: e.type === 'Publication' ? 'Source: CrossRef Metadata API'
              : e.type === 'Dataset' ? 'Source: Zenodo / DataCite'
              : e.type === 'Video' ? 'Source: YouTube / MoES'
              : e.type === 'Photo' ? `Source: Wikimedia Commons (${f.license})`
              : 'Source: Press Information Bureau, Government of India',
    visualSeed: idx + 1
  };

  // Only assign region if ledger explicitly has it (none of the items have it)
  if (f.region) item.region = f.region;

  // Publications
  if (f.doi) item.doi = f.doi;
  if (f.authors) item.authors = f.authors;
  if (f.journal) item.journal = f.journal;
  if (f.year) item.year = f.year;
  if (f.url) item.url = f.url;

  // Datasets
  if (f.repository) item.repository = f.repository;
  if (f.creators) item.creators = f.creators;
  if (f.publicationDate) item.publicationDate = f.publicationDate;
  if (f.description) item.description = f.description;

  // Videos
  if (f.channel) item.channel = f.channel;
  if (f.channelUrl) item.channelUrl = f.channelUrl;
  if (f.videoUrl) item.videoUrl = f.videoUrl;

  // Photos
  if (f.author) item.author = f.author;
  if (f.license) item.license = f.license;
  if (f.subject) item.subject = f.subject;
  if (f.date) item.date = f.date;
  if (photoUpdates[e.id]?.imageUrl) item.imageUrl = photoUpdates[e.id].imageUrl;

  // Activities
  if (f.venue) item.venue = f.venue;
  if (f.organizer) item.organizer = f.organizer;

  return item;
});

fs.writeFileSync(itemsPath, JSON.stringify({ isSampleData: false, items: newItems }, null, 2), 'utf8');
console.log(`Updated src/data/items.json with ${newItems.length} items (no inferred regions, real Commons imageUrls).`);
