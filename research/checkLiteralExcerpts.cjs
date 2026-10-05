const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ledger = JSON.parse(fs.readFileSync(path.join(__dirname, 'sources-ledger.json'), 'utf8'));

function fetchBody(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) return resolve({ ok: false, error: 'Too many redirects' });
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'http:' ? http : https;
      const headers = url.includes('pib.gov.in') 
        ? { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
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

function cleanHtml(raw) {
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
    .replace(/˚/g, '°') // normalize degree symbol if any
    .replace(/\s+/g, ' ')
    .trim();
}

async function checkAll() {
  console.log(`Checking literal substring presence for all ${ledger.length} records...\n`);
  const results = [];

  for (let i = 0; i < ledger.length; i++) {
    const item = ledger[i];
    const source = item.sources[0];
    const res = await fetchBody(source.url);
    if (!res.ok) {
      results.push({ id: item.id, pass: false, reason: `HTTP error: ${res.status || res.error}` });
      continue;
    }

    const cleanPage = cleanHtml(res.body);
    const cleanExcerpt = cleanHtml(source.excerpt);

    const literalMatch = cleanPage.includes(cleanExcerpt);
    results.push({
      id: item.id,
      type: item.type,
      pass: literalMatch,
      excerptLen: cleanExcerpt.length,
      url: source.url,
      currentExcerpt: source.excerpt,
      pageLen: cleanPage.length
    });
    console.log(`[${i+1}/${ledger.length}] ${item.id} -> ${literalMatch ? 'EXACT SUBSTRING MATCH' : 'MISMATCH'}`);
  }

  const failures = results.filter(r => !r.pass);
  console.log(`\nDiagnostic Summary: ${results.length - failures.length} Passed, ${failures.length} Failed.`);
  if (failures.length > 0) {
    console.log('\nFailed entries:');
    failures.forEach(f => console.log(`- ${f.id} (${f.type}): ${f.reason || 'Excerpt not literal substring'}`));
  }
}

checkAll();
