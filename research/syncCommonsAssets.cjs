const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const commonsItems = [
  {
    id: 'photo-001',
    filename: 'Bharati_permanent_Antarctic_research_station.jpg',
    localPath: path.join(__dirname, '../public/images/bharati-station.jpg')
  },
  {
    id: 'photo-002',
    filename: 'An_aerial_view_of_the_Indian_Station_Maitri,_Antarctica_on_February_2,_2005.jpg',
    localPath: path.join(__dirname, '../public/images/maitri-station.jpg')
  },
  {
    id: 'photo-003',
    filename: 'Indian_station_1.JPG',
    localPath: path.join(__dirname, '../public/images/himadri-station.JPG')
  },
  {
    id: 'photo-004',
    filename: 'Dakshin_Gangotri_station.jpg',
    localPath: path.join(__dirname, '../public/images/dakshin-gangotri.jpg')
  },
  {
    id: 'photo-005',
    filename: 'Sagar_kanya3.jpg',
    localPath: path.join(__dirname, '../public/images/orv-sagar-kanya.jpg')
  },
  {
    id: 'photo-006',
    filename: 'Salix_polaris_IMG_3686_polarvier_longyeardalen.JPG',
    localPath: path.join(__dirname, '../public/images/salix-polaris-arctic-willow.jpg')
  },
  {
    id: 'photo-007',
    filename: 'An_aerial_view_of_Schirmacher_Hills.jpg',
    localPath: path.join(__dirname, '../public/images/schirmacher-oasis.jpg')
  },
  {
    id: 'hero-video-001',
    filename: 'Time-lapse_of_navigation_through_Lemaire_Channel,_Antarctica.webm',
    localPath: path.join(__dirname, '../public/videos/polar-hero-bg.webm')
  }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PolarisProvenanceVerifier/1.0 (audit@polaris-outreach.org)' } }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(b));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PolarisProvenanceVerifier/1.0 (audit@polaris-outreach.org)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadFile(res.headers.location, destPath));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

function getHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function getSize(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size;
}

async function run() {
  console.log('=== COMMONS ASSET AUDIT & SYNC ===\n');
  const metadataResults = {};

  for (const item of commonsItems) {
    console.log(`Auditing ${item.id}: ${item.filename}...`);
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(item.filename)}&prop=imageinfo&iiprop=url|size|extmetadata|user&format=json`;
    const data = await fetchJson(apiUrl);
    const pages = data.query.pages;
    const page = Object.values(pages)[0];
    if (!page || !page.imageinfo) {
      console.error(`  Could not find Commons info for ${item.filename}`);
      continue;
    }

    const info = page.imageinfo[0];
    const directUrl = info.url;
    const remoteSize = info.size;
    const meta = info.extmetadata || {};

    let artist = meta.Artist ? meta.Artist.value.replace(/<[^>]+>/g, '').trim() : (info.user || 'Unknown');
    if (!artist || artist === 'Unknown authorUnknown author' || artist.toLowerCase().includes('unknown author')) {
      artist = 'Author unknown';
    }
    const license = meta.LicenseShortName ? meta.LicenseShortName.value : 'Public domain';
    const credit = meta.Credit ? meta.Credit.value.replace(/<[^>]+>/g, '').trim() : '';

    metadataResults[item.id] = {
      filename: item.filename,
      directUrl,
      remoteSize,
      artist,
      license,
      credit
    };

    const localSize = getSize(item.localPath);
    const localHash = getHash(item.localPath);

    console.log(`  Remote URL: ${directUrl}`);
    console.log(`  Remote size: ${remoteSize} bytes`);
    console.log(`  Local size:  ${localSize} bytes`);
    console.log(`  Author:      ${artist}`);
    console.log(`  License:     ${license}`);

    // If local file size or content is missing or mismatched:
    // Note: For hero video webm, check if local size matches or if it needs download
    if (localSize !== remoteSize) {
      console.log(`  [MISMATCH] Local size (${localSize}) !== Remote size (${remoteSize}). Downloading Commons original...`);
      const tempPath = item.localPath + '.original';
      await downloadFile(directUrl, tempPath);
      const newHash = getHash(tempPath);
      const newSize = getSize(tempPath);
      console.log(`  Downloaded: ${newSize} bytes (SHA256: ${newHash.slice(0, 16)}...)`);
      fs.copyFileSync(tempPath, item.localPath);
      fs.unlinkSync(tempPath);
      console.log(`  Replaced local file with Commons original.`);
    } else {
      console.log(`  [MATCH] File size matches Commons original.`);
    }
    console.log('');
  }

  fs.writeFileSync(path.join(__dirname, 'commons-metadata.json'), JSON.stringify(metadataResults, null, 2));
  console.log('Saved fetched metadata to research/commons-metadata.json');
}

run().catch(console.error);
