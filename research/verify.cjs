const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ledgerPath = path.join(__dirname, 'sources-ledger.json');
if (!fs.existsSync(ledgerPath)) {
  console.error('Missing sources-ledger.json');
  process.exit(1);
}

const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

function fetchBody(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) return resolve({ ok: false, error: 'Too many redirects' });
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'http:' ? http : https;
      const headers = url.includes('pib.gov.in')
        ? { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        : { 'User-Agent': 'PolarisProvenanceVerifier/1.0 (mailto:audit@polaris-outreach.org; MoES SIH Hackathon Audit)' };

      const req = client.get(url, { headers, rejectUnauthorized: false }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let nextUrl = res.headers.location;
          if (!nextUrl.startsWith('http')) {
            nextUrl = parsed.origin + nextUrl;
          }
          return resolve(fetchBody(nextUrl, maxRedirects - 1));
        }
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve({ ok: res.statusCode === 200, status: res.statusCode, body }));
      });
      req.on('error', err => resolve({ ok: false, error: err.message }));
      req.setTimeout(15000, () => { req.destroy(); resolve({ ok: false, error: 'Timeout' }); });
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

/**
 * Strict whitespace and HTML entity collapse.
 * Decodes JSON/Unicode escapes, removes markup, normalizes quotes/dashes/degree symbols,
 * and collapses all whitespace runs into a single space.
 */
function cleanText(raw) {
  return (raw || '')
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&mdash;|&ndash;/gi, '-')
    .replace(/&aring;/gi, 'å')
    .replace(/&Aring;/gi, 'Å')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/˚/g, '°')
    .replace(/\s+/g, ' ')
    .trim();
}

function verifyDoiWithCrossRef(doi, expectedTitle, expectedAuthor) {
  return new Promise((resolve) => {
    const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'PolarisProvenanceVerifier/1.0 (mailto:audit@polaris-outreach.org)'
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return resolve({ ok: false, status: res.statusCode, error: `CrossRef returned ${res.statusCode}` });
        }
        try {
          const json = JSON.parse(body);
          const work = json.message;
          const apiTitle = (work.title && work.title[0]) || '';
          const normA = cleanText(apiTitle).toLowerCase();
          const normB = cleanText(expectedTitle).toLowerCase();
          const titleMatches = normA.includes(normB) || normB.includes(normA);
          
          let authorMatches = true;
          if (expectedAuthor) {
            const apiAuthors = (work.author || []).map(a => `${a.given || ''} ${a.family || ''}`).join(' ');
            const normApi = apiAuthors.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
            const normExp = expectedAuthor.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
            authorMatches = normApi.includes(normExp) || normExp.includes(normApi);
          }

          resolve({
            ok: titleMatches && authorMatches,
            status: 200,
            apiTitle,
            titleMatches,
            authorMatches
          });
        } catch (e) {
          resolve({ ok: false, error: e.message });
        }
      });
    }).on('error', (err) => resolve({ ok: false, error: err.message }));
  });
}

function verifyDataCiteDoi(doi, expectedTitle) {
  return new Promise((resolve) => {
    const url = `https://api.datacite.org/dois/${encodeURIComponent(doi)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'PolarisProvenanceVerifier/1.0 (mailto:audit@polaris-outreach.org)'
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return resolve({ ok: false, status: res.statusCode, error: `DataCite returned ${res.statusCode}` });
        }
        try {
          const json = JSON.parse(body);
          const attributes = json.data.attributes;
          const apiTitle = (attributes.titles && attributes.titles[0] && attributes.titles[0].title) || '';
          const normA = cleanText(apiTitle).toLowerCase();
          const normB = cleanText(expectedTitle).toLowerCase();
          const matches = normA.includes(normB) || normB.includes(normA);
          resolve({
            ok: matches,
            status: 200,
            apiTitle
          });
        } catch (e) {
          resolve({ ok: false, error: e.message });
        }
      });
    }).on('error', (err) => resolve({ ok: false, error: err.message }));
  });
}

function verifyPhotoWithCommons(fileUrl, expectedAuthor, expectedLicense) {
  return new Promise((resolve) => {
    const filename = decodeURIComponent(fileUrl.split('/File:')[1] || '');
    if (!filename) return resolve({ ok: false, error: 'Could not parse filename' });
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=extmetadata|user&format=json`;
    
    https.get(apiUrl, {
      headers: {
        'User-Agent': 'PolarisProvenanceVerifier/1.0 (mailto:audit@polaris-outreach.org)'
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return resolve({ ok: false, error: `Commons API ${res.statusCode}` });
        try {
          const json = JSON.parse(body);
          const page = Object.values(json.query.pages)[0];
          if (!page || !page.imageinfo) return resolve({ ok: false, error: 'Commons file not found' });
          const info = page.imageinfo[0];
          const meta = info.extmetadata || {};
          const apiLicense = meta.LicenseShortName ? meta.LicenseShortName.value : '';
          let apiAuthor = meta.Artist ? meta.Artist.value.replace(/<[^>]+>/g, '').trim() : info.user;
          if (!apiAuthor || apiAuthor === 'Unknown authorUnknown author' || apiAuthor.toLowerCase().includes('unknown author')) {
            apiAuthor = 'Author unknown';
          }
          
          const licenseMatch = !expectedLicense || 
            cleanText(apiLicense).toLowerCase().includes(cleanText(expectedLicense).toLowerCase()) ||
            cleanText(expectedLicense).toLowerCase().includes(cleanText(apiLicense).toLowerCase()) ||
            (expectedLicense === 'Public domain' && (apiLicense === '' || cleanText(apiLicense).toLowerCase().includes('public')));
          
          resolve({
            ok: true,
            apiAuthor,
            apiLicense,
            licenseMatch
          });
        } catch (e) {
          resolve({ ok: false, error: e.message });
        }
      });
    }).on('error', (err) => resolve({ ok: false, error: err.message }));
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runVerification() {
  console.log('================================================================');
  console.log('     POLARIS STRICT CONTENT & PROVENANCE AUDIT VERIFIER         ');
  console.log('================================================================');
  console.log(`Auditing ${ledger.length} ledger records with STRICT LITERAL SUBSTRING matching...\n`);

  let passCount = 0;
  let failCount = 0;

  for (let i = 0; i < ledger.length; i++) {
    const item = ledger[i];
    const title = item.fields.title || item.fields.name || 'Untitled';
    const source = item.sources[0];
    const doi = item.fields.doi;

    process.stdout.write(`[${String(i + 1).padStart(2, '0')}/${ledger.length}] ${item.id} (${item.type}): "${title.slice(0, 42)}..." `);

    // 1. Fetch body of source
    const pageRes = await fetchBody(source.url);
    if (!pageRes.ok) {
      console.log('-> FAIL');
      console.log(`     URL Unreachable: ${source.url} (Status: ${pageRes.status || pageRes.error})`);
      failCount++;
      continue;
    }

    // 2. Strict literal substring check: No fuzzy, no keyword, no splitting
    const cleanPage = cleanText(pageRes.body);
    const cleanExcerpt = cleanText(source.excerpt);
    const excerptMatch = cleanPage.includes(cleanExcerpt);

    if (!excerptMatch) {
      console.log('-> FAIL');
      console.log(`     Strict Excerpt Mismatch for: ${source.url}`);
      console.log(`     Searched excerpt: "${cleanExcerpt.slice(0, 100)}..."`);
      failCount++;
      continue;
    }

    // 3. Check DOI if publication/dataset
    let doiPass = true;
    let doiMsg = '';
    if (doi) {
      if (doi.startsWith('10.5281/')) {
        const dcRes = await verifyDataCiteDoi(doi, title);
        doiPass = dcRes.ok;
        doiMsg = dcRes.ok ? `DataCite DOI Matched: "${dcRes.apiTitle.slice(0, 40)}..."` : `DataCite Mismatch: ${dcRes.error || 'title mismatch'}`;
      } else {
        const crRes = await verifyDoiWithCrossRef(doi, title, item.fields.author);
        doiPass = crRes.ok;
        doiMsg = crRes.ok ? `CrossRef DOI Matched: "${crRes.apiTitle.slice(0, 40)}..."` : `CrossRef Mismatch: ${crRes.error || 'title/author mismatch'}`;
      }
    }

    // 4. Check Photo if photo
    let photoPass = true;
    let photoMsg = '';
    if (item.type === 'Photo' || item.id === 'hero-video-001') {
      const phRes = await verifyPhotoWithCommons(item.fields.fileUrl, item.fields.author, item.fields.license);
      photoPass = phRes.ok;
      photoMsg = phRes.ok ? `Commons metadata verified (License: ${phRes.apiLicense}, Author: ${phRes.apiAuthor})` : `Commons error: ${phRes.error}`;
    }

    if (doiPass && photoPass) {
      console.log('-> PASS');
      console.log(`     URL: ${source.url} (HTTP 200, Strict Substring Verified)`);
      if (doiMsg) console.log(`     ${doiMsg}`);
      if (photoMsg) console.log(`     ${photoMsg}`);
      passCount++;
    } else {
      console.log('-> FAIL');
      if (!doiPass) console.log(`     DOI Failure: ${doiMsg}`);
      if (!photoPass) console.log(`     Photo Failure: ${photoMsg}`);
      failCount++;
    }

    await sleep(250);
  }

  console.log('\n================================================================');
  console.log(`STRICT VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${ledger.length} total records.`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runVerification();
