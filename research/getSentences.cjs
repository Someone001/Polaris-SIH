const https = require('https');
const http = require('http');

function fetchBody(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) return resolve({ ok: false, error: 'Too many redirects' });
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'http:' ? http : https;
      const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
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
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&mdash;|&ndash;/gi, '-')
    .replace(/&Aring;/gi, 'Å')
    .replace(/\s+/g, ' ')
    .trim();
}

async function run() {
  const r1 = await fetchBody('https://www.pib.gov.in/PressReleasePage.aspx?PRID=1991319');
  const t1 = cleanHtml(r1.body);
  const p1 = t1.match(/[^.!?\n]+(?:42nd|43rd|mooring|Prydz|Antarctica)[^.!?\n]+[.!?]/gi) || [];
  console.log('=== PIB 1991319 SENTENCES ===');
  p1.forEach((s, i) => console.log(`[${i}] ${s.trim()}`));

  const r2 = await fetchBody('https://www.pib.gov.in/PressReleasePage.aspx?PRID=1987724');
  const t2 = cleanHtml(r2.body);
  const p2 = t2.match(/[^.!?\n]+(?:winter|Himadri|78°55|flagged off|December)[^.!?\n]+[.!?]/gi) || [];
  console.log('\n=== PIB 1987724 SENTENCES ===');
  p2.forEach((s, i) => console.log(`[${i}] ${s.trim()}`));
}

run();
