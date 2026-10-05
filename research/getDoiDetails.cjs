const https = require('https');

const dois = [
  '10.54302/mausam.v73i3.1322',
  '10.1016/j.orggeochem.2023.104587',
  '10.5252/cryptogamie-algologie2021v42a15',
  '10.1007/s00300-024-03319-9',
  '10.1016/j.polar.2018.08.003',
  '10.54302/mausam.v62i4.341',
  '10.1177/05529360231183470'
];

function fetchDoi(doi) {
  return new Promise((resolve) => {
    https.get(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: { 'User-Agent': 'PolarisProvenanceVerifier/1.0 (mailto:audit@polaris-outreach.org)' }
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(b).message;
          resolve({
            doi,
            title: j.title ? j.title[0] : '',
            authors: (j.author || []).map(a => `${a.given || ''} ${a.family || ''}`.trim())
          });
        } catch (e) {
          resolve({ doi, error: e.message, status: res.statusCode });
        }
      });
    }).on('error', err => resolve({ doi, error: err.message }));
  });
}

async function run() {
  for (const d of dois) {
    const res = await fetchDoi(d);
    console.log('DOI:', res.doi);
    console.log('Title:', res.title);
    console.log('Authors:', res.authors);
    console.log('--------------------');
  }
}

run();
