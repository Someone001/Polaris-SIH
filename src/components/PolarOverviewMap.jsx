import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe, Compass, Layers, MapPin, ArrowRight, Eye, Navigation } from 'lucide-react';

const POLAR_BASES = [
  {
    id: 'base-bharati',
    name: 'Bharati Station',
    region: 'Antarctic',
    coordinates: [-69.41, 76.19],
    location: 'Larsemann Hills, East Antarctica',
    established: '2012',
    status: 'Year-Round Active',
    image: '/images/bharati-station.jpg',
    expeditionId: 'exp-ant-43',
    description: 'India’s state-of-the-art aerodynamic modular station supporting research in glaciology, atmospheric sciences, and satellite telemetry.'
  },
  {
    id: 'base-maitri',
    name: 'Maitri Station',
    region: 'Antarctic',
    coordinates: [-70.77, 11.73],
    location: 'Schirmacher Oasis, Antarctica',
    established: '1989',
    status: 'Year-Round Active',
    image: '/images/maitri-station.jpg',
    expeditionId: 'exp-ant-42',
    description: 'India’s inland rock oasis base supporting paleoclimate study of Lake Priyadarshini, meteorology, and human physiology.'
  },
  {
    id: 'base-dg',
    name: 'Dakshin Gangotri (Historical)',
    region: 'Antarctic',
    coordinates: [-70.75, 11.63],
    location: 'Princess Astrid Coast Ice Shelf',
    established: '1983',
    status: 'Historic Monument (Submerged in Ice)',
    image: '/images/dakshin-gangotri.jpg',
    expeditionId: 'exp-ant-42',
    description: 'India’s historic first permanent base in Antarctica, commissioned during the 3rd Indian Scientific Expedition.'
  },
  {
    id: 'base-himadri',
    name: 'Himadri Research Station',
    region: 'Arctic',
    coordinates: [78.92, 11.93],
    location: 'Ny-Ålesund, Spitsbergen, Svalbard',
    established: '2008',
    status: 'Year-Round & Seasonal Operations',
    image: '/images/himadri-station.JPG',
    expeditionId: 'exp-arc-16',
    description: 'India’s permanent station in the high Arctic, serving as the northernmost base for aerosol physics, marine biology, and glaciology.'
  },
  {
    id: 'base-indarc',
    name: 'IndARC Underwater Observatory',
    region: 'Arctic',
    coordinates: [78.95, 12.05],
    location: 'Kongsfjorden Fjord (192m depth)',
    established: '2014',
    status: 'Active Moored Array',
    image: '/images/kongsfjorden-glacier.jpg',
    expeditionId: 'exp-arc-17',
    description: 'India’s multisensor underwater moored observatory deployed at 192m depth to continuously monitor Arctic water temperature and salinity.'
  },
  {
    id: 'base-so-kanya',
    name: 'Southern Ocean Transect (ORV Sagar Kanya)',
    region: 'Southern Ocean',
    coordinates: [-50.0, 57.5],
    location: 'Subantarctic to Polar Front Zone',
    established: '2004',
    status: 'Active Cruise Transect',
    image: '/images/orv-sagar-kanya.jpg',
    expeditionId: 'exp-so-12',
    description: 'MoES oceanic hydrographic transects investigating Southern Ocean carbon sinks, heat transport, and deep ocean circulation.'
  }
];

export default function PolarOverviewMap({ selectedRegion = 'all', onSelectRegion = () => {} }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [activeBase, setActiveBase] = useState(null);
  const [activeLayer, setActiveLayer] = useState('satellite');

  // Filter bases by region if specified
  const filteredBases = useMemo(() => {
    if (!selectedRegion || selectedRegion === 'all') return POLAR_BASES;
    return POLAR_BASES.filter(b => b.region === selectedRegion);
  }, [selectedRegion]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [-25.0, 50.0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      worldCopyJump: true
    });

    mapInstanceRef.current = map;

    // Layer selection (High-resolution true-color satellite and ocean bathymetry)
    const tileUrl = activeLayer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';

    L.tileLayer(tileUrl, {
      attribution: activeLayer === 'satellite'
        ? 'Tiles &copy; Esri &mdash; NASA, USGS'
        : 'Tiles &copy; Esri, GEBCO, NOAA',
      subdomains: 'abcd',
      maxZoom: 18
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeLayer]);

  // Update Markers and Camera based on region/filter
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add Markers for bases
    filteredBases.forEach((base) => {
      const isAntarctic = base.region === 'Antarctic';
      const isArctic = base.region === 'Arctic';

      const iconHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <div class="absolute w-8 h-8 rounded-full ${isArctic ? 'bg-amber-400/30' : isAntarctic ? 'bg-aurora-400/30' : 'bg-sky-400/30'} animate-ping pointer-events-none"></div>
          <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg font-bold text-xs transition-transform group-hover:scale-125 ${
            isArctic ? 'bg-amber-500 text-polar-950' : isAntarctic ? 'bg-aurora-500 text-polar-950' : 'bg-sky-500 text-white'
          }">
            📍
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'polar-base-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(base.coordinates, { icon: customIcon }).addTo(map);

      const popupContent = `
        <div class="p-2.5 max-w-xs text-polar-100">
          <img src="${base.image}" alt="${base.name}" class="w-full h-24 object-cover rounded-lg mb-2 border border-polar-700/60" />
          <div class="text-[10px] font-bold uppercase tracking-wider text-aurora-400">${base.region} &bull; Est. ${base.established}</div>
          <h4 class="font-serif text-sm font-semibold text-white my-1">${base.name}</h4>
          <p class="text-xs text-polar-300 leading-relaxed mb-2">${base.description}</p>
          <div class="font-mono text-[10px] text-ice-300 bg-polar-950/70 p-1.5 rounded border border-polar-800 mb-2">
            ${base.location} (${base.coordinates[0].toFixed(2)}°, ${base.coordinates[1].toFixed(2)}°)
          </div>
          <a href="/expeditions/${base.expeditionId}" class="inline-flex items-center gap-1.5 text-xs font-semibold text-aurora-300 hover:text-aurora-200">
            <span>Explore expedition log</span> &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, { className: 'polar-leaflet-popup' });
      marker.on('click', () => setActiveBase(base));

      markersRef.current.push(marker);
    });

    // Fly to region if filtered
    if (selectedRegion === 'Antarctic') {
      map.flyTo([-70.0, 45.0], 3, { duration: 1.2 });
    } else if (selectedRegion === 'Arctic') {
      map.flyTo([78.9, 15.0], 5, { duration: 1.2 });
    } else if (selectedRegion === 'Southern Ocean') {
      map.flyTo([-50.0, 57.5], 3, { duration: 1.2 });
    } else {
      map.flyTo([-25.0, 50.0], 2, { duration: 1.2 });
    }
  }, [filteredBases, selectedRegion]);

  return (
    <div className="relative rounded-2xl border border-glacier-border bg-polar-950 overflow-hidden shadow-lg mb-10">
      {/* Map Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-polar-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-polar-700/60 shadow-md pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-aurora-400 animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-polar-200">
            India's Polar Territory & Station Network
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-polar-900/90 backdrop-blur-md p-1 rounded-xl border border-polar-700/60 shadow-md pointer-events-auto">
          <button
            onClick={() => setActiveLayer('satellite')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeLayer === 'satellite' ? 'bg-aurora-500 text-polar-950 font-semibold' : 'text-polar-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setActiveLayer('ocean')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeLayer === 'ocean' ? 'bg-aurora-500 text-polar-950 font-semibold' : 'text-polar-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bathymetry</span>
          </button>
        </div>
      </div>

      {/* Leaflet Mount */}
      <div ref={mapContainerRef} className="w-full h-80 sm:h-96 z-0" />

      {/* Bottom Info Banner */}
      <div className="bg-polar-900 border-t border-polar-800 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-polar-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-aurora-400"></span>
            <span>Antarctica: Bharati & Maitri</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Arctic: Himadri & IndARC</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>Southern Ocean: Sagar Kanya</span>
          </span>
        </div>
        <span>Click any station marker on the map to view field base details</span>
      </div>
    </div>
  );
}
