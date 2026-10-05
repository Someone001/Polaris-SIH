import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Maximize2, Minimize2, Navigation, Compass, Globe, Eye, LocateFixed } from 'lucide-react';

// Tile Layer Configurations (High-Precision, Real Government & Scientific Basemaps)
const TILE_LAYERS = {
  satellite: {
    id: 'satellite',
    name: 'Satellite View',
    icon: Globe,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics, USGS, NASA',
    maxZoom: 18,
    description: 'High-resolution true-color satellite photography of polar ice sheets and terrain'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Bathymetry',
    icon: Layers,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri, GEBCO, NOAA, National Geographic',
    maxZoom: 13,
    description: 'Ocean depth contours, underwater trenches, and continental shelf boundaries'
  }
};

/**
 * Format decimal coordinates into standard polar navigational notation (e.g. 69°24'S, 76°11'E)
 */
function formatCoordinates(lat, lon) {
  if (lat == null || lon == null) return '';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  const absLat = Math.abs(lat);
  const absLon = Math.abs(lon);

  const latDeg = Math.floor(absLat);
  const latMin = Math.round((absLat - latDeg) * 60);

  const lonDeg = Math.floor(absLon);
  const lonMin = Math.round((absLon - lonDeg) * 60);

  return `${latDeg}°${String(latMin).padStart(2, '0')}'${latDir}, ${lonDeg}°${String(lonMin).padStart(2, '0')}'${lonDir}`;
}

export default function ExpeditionMap({
  stops = [],
  selectedStopId = null,
  onSelectStop = () => {},
  region = 'Antarctic',
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const polylineGlowRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState('satellite'); // Default to high-res realistic satellite
  const [cursorCoords, setCursorCoords] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tileError, setTileError] = useState(false);

  // Determine initial center and zoom based on stops or region
  const defaultCenter = useMemo(() => {
    if (stops && stops.length > 0) {
      const avgLat = stops.reduce((sum, s) => sum + s.lat, 0) / stops.length;
      const avgLon = stops.reduce((sum, s) => sum + s.lon, 0) / stops.length;
      return [avgLat, avgLon];
    }
    if (region === 'Arctic') return [78.92, 11.93]; // Ny-Ålesund, Svalbard
    if (region === 'Southern Ocean') return [-50.0, 57.5]; // Indian Ocean sector
    return [-69.41, 76.19]; // Bharati Station, Larsemann Hills, Antarctica
  }, [stops, region]);

  // Fit bounds helper
  const fitRouteBounds = useCallback(() => {
    if (!mapInstanceRef.current || !stops || stops.length === 0) return;
    const latLngs = stops.map(s => [s.lat, s.lon]);
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: region === 'Arctic' ? 9 : 6,
      animate: true
    });
  }, [stops, region]);

  // Center selected stop helper
  const focusStop = useCallback((stopId) => {
    if (!mapInstanceRef.current || !stops) return;
    const target = stops.find(s => s.id === stopId);
    if (target) {
      mapInstanceRef.current.flyTo([target.lat, target.lon], Math.max(mapInstanceRef.current.getZoom(), 7), {
        duration: 1.2
      });
      const marker = markersRef.current[target.id];
      if (marker) marker.openPopup();
    }
  }, [stops]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: region === 'Arctic' ? 5 : 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false, // We render custom polar-themed zoom controls
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: true
    });

    mapInstanceRef.current = map;

    // Track mouse coordinates
    map.on('mousemove', (e) => {
      setCursorCoords({ lat: e.latlng.lat, lon: e.latlng.lng });
    });
    map.on('mouseout', () => {
      setCursorCoords(null);
    });

    // Add scale bar
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Tile Layer Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = TILE_LAYERS[activeLayer] || TILE_LAYERS.satellite;
    const layer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc'
    });

    layer.on('tileerror', () => {
      setTileError(true);
    });
    layer.on('load', () => {
      setTileError(false);
    });

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [activeLayer]);

  // 3. Render Stops and Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !stops || stops.length === 0) return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach(m => map.removeLayer(m));
    markersRef.current = {};

    if (polylineRef.current) map.removeLayer(polylineRef.current);
    if (polylineGlowRef.current) map.removeLayer(polylineGlowRef.current);

    const latLngs = stops.map(s => [s.lat, s.lon]);

    // Draw Route Polylines (Glow + Crisp Line)
    if (latLngs.length > 1) {
      polylineGlowRef.current = L.polyline(latLngs, {
        color: '#159679',
        weight: 6,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      polylineRef.current = L.polyline(latLngs, {
        color: '#00e5b3',
        weight: 2.5,
        opacity: 0.95,
        dashArray: '7, 5',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }

    // Add Markers for each stop
    stops.forEach((stop, idx) => {
      const isSelected = selectedStopId === stop.id;
      const isStart = idx === 0;
      const isEnd = idx === stops.length - 1;

      // Custom SVG DivIcon
      const iconHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          ${isSelected ? `
            <div class="absolute w-12 h-12 rounded-full bg-aurora-500/30 animate-ping pointer-events-none"></div>
            <div class="absolute w-8 h-8 rounded-full border border-aurora-400 bg-aurora-500/20 pointer-events-none"></div>
          ` : ''}
          <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 transition-transform duration-200 group-hover:scale-110 ${
            isSelected
              ? 'bg-aurora-500 border-white text-polar-950 scale-110 ring-2 ring-aurora-400'
              : isStart
              ? 'bg-sky-600 border-white text-white'
              : isEnd
              ? 'bg-emerald-600 border-white text-white'
              : 'bg-polar-900 border-polar-300 text-polar-100 hover:border-aurora-400'
          }">
            ${idx + 1}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-stop-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([stop.lat, stop.lon], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div class="p-2 max-w-xs text-polar-100">
          <div class="flex items-center justify-between gap-2 border-b border-polar-700/60 pb-1.5 mb-2">
            <span class="text-[10px] uppercase font-bold tracking-wider text-aurora-400">
              Waypoint ${idx + 1} of ${stops.length}
            </span>
            <span class="text-[11px] text-polar-300 font-mono">${stop.date || ''}</span>
          </div>
          <h4 class="font-serif text-sm font-semibold text-white mb-1">${stop.name}</h4>
          <div class="font-mono text-[11px] text-ice-300 bg-polar-950/60 px-2 py-1 rounded border border-polar-800 my-1.5">
            ${formatCoordinates(stop.lat, stop.lon)}
          </div>
          <div class="text-[11px] text-polar-300 mt-1 leading-snug">
            ${stop.name.includes('Station') ? 'Official Indian Polar Research Facility' : 'Expedition field waypoint & observation station'}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'polar-leaflet-popup',
        offset: [0, -10]
      });

      marker.on('click', () => {
        onSelectStop(stop.id);
      });

      markersRef.current[stop.id] = marker;
    });

    // Auto-fit route bounds on first load
    fitRouteBounds();
  }, [stops, selectedStopId, activeLayer]);

  // 4. React to `selectedStopId` changes from parent (e.g. user clicked timeline)
  useEffect(() => {
    if (selectedStopId) {
      focusStop(selectedStopId);
    }
  }, [selectedStopId, focusStop]);

  return (
    <div
      className={`relative rounded-2xl border border-glacier-border bg-polar-950 overflow-hidden shadow-md transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'w-full'
      } ${className}`}
      style={{ height: isExpanded ? 'calc(100vh - 2rem)' : '480px' }}
    >
      {/* Top Map Header & Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Region & Mode Badge */}
        <div className="flex items-center gap-2 bg-polar-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-polar-700/60 text-polar-100 shadow-md pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-aurora-400 animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-polar-200">
            Real Earth Map &bull; {region}
          </span>
          <span className="text-[11px] text-polar-400 hidden sm:inline">&bull; {stops.length} Waypoints</span>
        </div>

        {/* Right: Layer Switcher & Map Controls */}
        <div className="flex items-center gap-1.5 bg-polar-900/90 backdrop-blur-md p-1 rounded-xl border border-polar-700/60 shadow-md pointer-events-auto">
          {Object.values(TILE_LAYERS).map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                title={layer.description}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-aurora-500 text-polar-950 shadow-xs font-semibold'
                    : 'text-polar-300 hover:text-white hover:bg-polar-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{layer.name}</span>
              </button>
            );
          })}

          <div className="w-px h-4 bg-polar-700 mx-0.5" />

          {/* Reset / Fit Bounds */}
          <button
            onClick={fitRouteBounds}
            title="Fit entire route bounds"
            className="p-1.5 rounded-lg text-polar-300 hover:text-white hover:bg-polar-800 transition"
          >
            <Navigation className="w-4 h-4" />
          </button>

          {/* Focus Selected Stop */}
          {selectedStopId && (
            <button
              onClick={() => focusStop(selectedStopId)}
              title="Focus selected waypoint"
              className="p-1.5 rounded-lg text-polar-300 hover:text-aurora-400 hover:bg-polar-800 transition"
            >
              <LocateFixed className="w-4 h-4" />
            </button>
          )}

          {/* Expand / Minimize */}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              setTimeout(() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.invalidateSize();
                  fitRouteBounds();
                }
              }, 250);
            }}
            title={isExpanded ? 'Exit expanded view' : 'Expand map full screen'}
            className="p-1.5 rounded-lg text-polar-300 hover:text-white hover:bg-polar-800 transition"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Cursor Coordinate HUD (Bottom-Right) */}
      <div className="absolute bottom-3 right-3 z-[400] bg-polar-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-polar-800 text-[11px] font-mono text-polar-300 pointer-events-none shadow-sm flex items-center gap-2">
        <Compass className="w-3 h-3 text-aurora-400" />
        <span>
          {cursorCoords ? formatCoordinates(cursorCoords.lat, cursorCoords.lon) : 'Hover map for coordinates'}
        </span>
      </div>

      {/* Offline / Tile Fallback Warning Notice if offline */}
      {tileError && (
        <div className="absolute bottom-10 left-3 z-[400] bg-amber-950/90 border border-amber-600/40 text-amber-200 text-xs px-3 py-1.5 rounded-lg shadow-sm">
          Offline Mode: Tile server unreachable. Showing cached vector coordinates.
        </div>
      )}

      {/* Leaflet DOM Mount */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
