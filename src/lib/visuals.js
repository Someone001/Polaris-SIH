/**
 * Deterministic visual generation for Polaris archive items.
 * Uses item.visualSeed and item.type to render distinct, abstract polar SVG art.
 */

// Simple deterministic pseudo-random generator (Mulberry32)
function createRng(seed) {
  let s = Math.floor(seed || 1) + 12345;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateItemSvg(item, width = 600, height = 380) {
  const seed = item?.visualSeed || 1;
  const type = item?.type || 'Report';
  const rng = createRng(seed);

  const idPrefix = `p-${seed}-${type.toLowerCase()}`;

  // Palette references matching project design tokens
  const darkNavy = '#0b192c';
  const midNavy = '#142c4b';
  const lightNavy = '#1e3e67';
  const icePale = '#edf5fa';
  const iceLight = '#d5e8f4';
  const iceMid = '#94c3de';
  const iceDeep = '#3582b2';
  const auroraSoft = '#3eb499';
  const auroraGlow = '#159679';

  let visualContent = '';

  if (type === 'Photo') {
    // Landscape composition: sky, celestial body, layered icebergs/mountains, calm water reflection
    const sunY = 50 + Math.floor(rng() * 40);
    const sunX = 120 + Math.floor(rng() * (width - 240));
    const isAuroraSky = rng() > 0.5;

    visualContent = `
      <defs>
        <linearGradient id="${idPrefix}-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${isAuroraSky ? midNavy : darkNavy}" />
          <stop offset="60%" stop-color="${isAuroraSky ? '#12394c' : lightNavy}" />
          <stop offset="100%" stop-color="${isAuroraSky ? auroraGlow : iceDeep}" />
        </linearGradient>
        <linearGradient id="${idPrefix}-ice1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${icePale}" />
          <stop offset="100%" stop-color="${iceMid}" />
        </linearGradient>
        <linearGradient id="${idPrefix}-ice2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${iceLight}" />
          <stop offset="100%" stop-color="${iceDeep}" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#${idPrefix}-sky)" />
      
      <!-- Celestial sun/moon disk -->
      <circle cx="${sunX}" cy="${sunY}" r="${24 + Math.floor(rng() * 12)}" fill="${icePale}" fill-opacity="0.85" />
      <circle cx="${sunX}" cy="${sunY}" r="${40 + Math.floor(rng() * 20)}" fill="${auroraSoft}" fill-opacity="0.18" />

      <!-- Distant ice peaks -->
      <polygon points="0,${height * 0.58} ${width * 0.25},${height * 0.38} ${width * 0.55},${height * 0.6} ${width},${height * 0.55} ${width},${height} 0,${height}" fill="${midNavy}" fill-opacity="0.7" />
      
      <!-- Mid-ground iceberg geometry -->
      <polygon points="${width * 0.15},${height * 0.65} ${width * 0.42},${height * 0.42} ${width * 0.72},${height * 0.68} 0,${height * 0.72}" fill="url(#${idPrefix}-ice1)" fill-opacity="0.95" />
      <polygon points="${width * 0.42},${height * 0.42} ${width * 0.72},${height * 0.68} ${width * 0.88},${height * 0.52} ${width},${height * 0.7} ${width},${height} 0,${height}" fill="url(#${idPrefix}-ice2)" fill-opacity="0.85" />

      <!-- Water horizon & reflection -->
      <rect y="${height * 0.68}" width="${width}" height="${height * 0.32}" fill="${darkNavy}" fill-opacity="0.92" />
      <line x1="0" y1="${height * 0.68}" x2="${width}" y2="${height * 0.68}" stroke="${iceMid}" stroke-width="1.5" stroke-opacity="0.6" />
      <line x1="${width * 0.3}" y1="${height * 0.74}" x2="${width * 0.7}" y2="${height * 0.74}" stroke="${icePale}" stroke-width="1" stroke-opacity="0.4" />
      <line x1="${width * 0.2}" y1="${height * 0.82}" x2="${width * 0.6}" y2="${height * 0.82}" stroke="${iceMid}" stroke-width="1" stroke-opacity="0.3" />
    `;
  } else if (type === 'Video') {
    // Similar to landscape but tailored and overlaid with a clean, tasteful play icon
    visualContent = `
      <defs>
        <linearGradient id="${idPrefix}-vbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${darkNavy}" />
          <stop offset="100%" stop-color="${midNavy}" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#${idPrefix}-vbg)" />
      
      <!-- Layered ice shelf contours -->
      <path d="M0,${height * 0.4} Q${width * 0.3},${height * 0.25} ${width * 0.6},${height * 0.45} T${width},${height * 0.35} L${width},${height} L0,${height} Z" fill="${iceDeep}" fill-opacity="0.35" />
      <path d="M0,${height * 0.55} Q${width * 0.4},${height * 0.42} ${width * 0.75},${height * 0.58} T${width},${height * 0.52} L${width},${height} L0,${height} Z" fill="${iceMid}" fill-opacity="0.3" />
      <path d="M0,${height * 0.7} Q${width * 0.5},${height * 0.62} ${width},${height * 0.72} L${width},${height} L0,${height} Z" fill="${iceLight}" fill-opacity="0.4" />
      
      <!-- Subtle aurora arc in sky -->
      <path d="M0,${height * 0.22} Q${width * 0.5},${height * 0.05} ${width},${height * 0.18}" stroke="${auroraSoft}" stroke-width="4" stroke-opacity="0.5" fill="none" filter="blur(2px)" />

      <!-- Center Play Glass Badge -->
      <g transform="translate(${width / 2}, ${height / 2})">
        <circle cx="0" cy="0" r="32" fill="${darkNavy}" fill-opacity="0.75" stroke="${icePale}" stroke-width="1.5" />
        <polygon points="-8,-14 -8,14 16,0" fill="${auroraSoft}" />
      </g>
    `;
  } else if (type === 'Dataset') {
    // Data/line contour and wave matrix
    const stepX = width / 12;
    let gridLines = '';
    for (let x = stepX; x < width; x += stepX) {
      gridLines += `<line x1="${x}" y1="20" x2="${x}" y2="${height - 20}" stroke="${midNavy}" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="3 3" />`;
    }
    for (let y = 40; y < height; y += 40) {
      gridLines += `<line x1="20" y1="${y}" x2="${width - 20}" y2="${y}" stroke="${midNavy}" stroke-width="1" stroke-opacity="0.25" />`;
    }

    const midY = height * 0.52;
    const wavePoints = [];
    for (let i = 0; i <= 20; i++) {
      const px = (width / 20) * i;
      const py = midY + Math.sin(i * 0.7 + seed) * 45 + Math.cos(i * 1.2) * 20;
      wavePoints.push(`${px},${py}`);
    }

    const wavePoints2 = [];
    for (let i = 0; i <= 20; i++) {
      const px = (width / 20) * i;
      const py = midY + 30 + Math.cos(i * 0.6 + seed * 2) * 35;
      wavePoints2.push(`${px},${py}`);
    }

    visualContent = `
      <defs>
        <linearGradient id="${idPrefix}-dbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#071221" />
          <stop offset="100%" stop-color="${darkNavy}" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#${idPrefix}-dbg)" />
      
      <!-- Coordinate grid -->
      ${gridLines}

      <!-- Shaded metric area -->
      <polygon points="0,${height} ${wavePoints.join(' ')} ${width},${height}" fill="${auroraSoft}" fill-opacity="0.12" />

      <!-- Primary data wave line -->
      <polyline points="${wavePoints.join(' ')}" fill="none" stroke="${auroraSoft}" stroke-width="2.5" />

      <!-- Secondary sensor line -->
      <polyline points="${wavePoints2.join(' ')}" fill="none" stroke="${iceMid}" stroke-width="1.8" stroke-dasharray="6 4" stroke-opacity="0.8" />

      <!-- Discrete data node points -->
      <circle cx="${width * 0.35}" cy="${midY + Math.sin(7 * 0.7 + seed) * 45 + Math.cos(7 * 1.2) * 20}" r="4" fill="${icePale}" stroke="${auroraGlow}" stroke-width="2" />
      <circle cx="${width * 0.65}" cy="${midY + Math.sin(13 * 0.7 + seed) * 45 + Math.cos(13 * 1.2) * 20}" r="4" fill="${icePale}" stroke="${auroraGlow}" stroke-width="2" />
      
      <!-- Axis indicator badge -->
      <rect x="28" y="24" width="70" height="20" rx="3" fill="${midNavy}" fill-opacity="0.8" />
      <text x="35" y="38" fill="${icePale}" font-size="10" font-family="Inter, sans-serif" letter-spacing="1">LOG // ${seed * 11}.4</text>
    `;
  } else if (type === 'Report' || type === 'Publication') {
    // Document / scientific publication layout with abstract lines and expedition seal
    visualContent = `
      <defs>
        <linearGradient id="${idPrefix}-docbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a182b" />
          <stop offset="100%" stop-color="#11253e" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#${idPrefix}-docbg)" />
      
      <!-- Simulated document folio frame -->
      <rect x="40" y="30" width="${width - 80}" height="${height - 60}" rx="6" fill="#081424" stroke="${lightNavy}" stroke-width="1.2" />
      
      <!-- Document header band -->
      <line x1="65" y1="65" x2="${width - 65}" y2="65" stroke="${auroraSoft}" stroke-width="2" stroke-opacity="0.8" />
      <rect x="65" y="78" width="${width * 0.38}" height="10" rx="2" fill="${icePale}" fill-opacity="0.85" />
      <rect x="65" y="98" width="${width * 0.5}" height="7" rx="2" fill="${iceMid}" fill-opacity="0.6" />

      <!-- Abstract paragraph lines -->
      <rect x="65" y="130" width="${width - 130}" height="4" rx="2" fill="${lightNavy}" />
      <rect x="65" y="145" width="${width - 150}" height="4" rx="2" fill="${lightNavy}" />
      <rect x="65" y="160" width="${width - 170}" height="4" rx="2" fill="${lightNavy}" />
      
      <rect x="65" y="185" width="${width - 140}" height="4" rx="2" fill="${lightNavy}" />
      <rect x="65" y="200" width="${width - 190}" height="4" rx="2" fill="${lightNavy}" />

      <rect x="65" y="225" width="${width - 130}" height="4" rx="2" fill="${lightNavy}" />
      <rect x="65" y="240" width="${width - 210}" height="4" rx="2" fill="${lightNavy}" />

      <!-- Expedition emblem / compass mark -->
      <g transform="translate(${width - 110}, ${height - 95})">
        <circle cx="0" cy="0" r="22" fill="none" stroke="${auroraSoft}" stroke-width="1.2" stroke-dasharray="4 2" stroke-opacity="0.7" />
        <circle cx="0" cy="0" r="14" fill="none" stroke="${iceMid}" stroke-width="1" stroke-opacity="0.5" />
        <line x1="0" y1="-18" x2="0" y2="18" stroke="${icePale}" stroke-width="1.2" stroke-opacity="0.8" />
        <line x1="-18" y1="0" x2="18" y2="0" stroke="${icePale}" stroke-width="1.2" stroke-opacity="0.8" />
        <circle cx="0" cy="0" r="2" fill="${auroraSoft}" />
      </g>
    `;
  } else {
    // Activity: people, station gathering, outreach beacon rings
    visualContent = `
      <defs>
        <radialGradient id="${idPrefix}-actglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${auroraSoft}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="${midNavy}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#081424" />
      
      <!-- Radiating outreach circles from polar station focal point -->
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="120" fill="url(#${idPrefix}-actglow)" />
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="130" fill="none" stroke="${auroraSoft}" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="8 6" />
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="85" fill="none" stroke="${iceMid}" stroke-width="1" stroke-opacity="0.4" />
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="45" fill="none" stroke="${icePale}" stroke-width="1.5" stroke-opacity="0.6" />

      <!-- Center station icon/beacon -->
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="12" fill="${auroraGlow}" />
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="5" fill="${icePale}" />

      <!-- Surrounding participants/school nodes -->
      <circle cx="${width * 0.3}" cy="${height * 0.35}" r="7" fill="${iceMid}" fill-opacity="0.8" />
      <line x1="${width * 0.3}" y1="${height * 0.35}" x2="${width * 0.48}" y2="${height * 0.48}" stroke="${lightNavy}" stroke-width="1" stroke-opacity="0.5" />

      <circle cx="${width * 0.72}" cy="${height * 0.4}" r="6" fill="${iceMid}" fill-opacity="0.8" />
      <line x1="${width * 0.72}" y1="${height * 0.4}" x2="${width * 0.52}" y2="${height * 0.48}" stroke="${lightNavy}" stroke-width="1" stroke-opacity="0.5" />

      <circle cx="${width * 0.42}" cy="${height * 0.72}" r="8" fill="${auroraSoft}" fill-opacity="0.9" />
      <line x1="${width * 0.42}" y1="${height * 0.72}" x2="${width * 0.49}" y2="${height * 0.52}" stroke="${lightNavy}" stroke-width="1" stroke-opacity="0.5" />

      <circle cx="${width * 0.65}" cy="${height * 0.68}" r="7" fill="${iceMid}" fill-opacity="0.8" />
      <line x1="${width * 0.65}" y1="${height * 0.68}" x2="${width * 0.52}" y2="${height * 0.52}" stroke="${lightNavy}" stroke-width="1" stroke-opacity="0.5" />
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-full block select-none" preserveAspectRatio="xMidYMid meet">
      ${visualContent}
    </svg>
  `;
}
