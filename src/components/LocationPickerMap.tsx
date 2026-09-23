import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Crosshair, 
  Layers, 
  Check, 
  RotateCcw,
  Sparkles,
  Search,
  Compass,
  Loader2
} from 'lucide-react';
import { MOCK_DISTRICTS } from '../data/mockDistricts';
import { createLocationPickerIcon } from '../utils/leafletIcons';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  selectedState: string;
  selectedDistrict: string;
  onChangeLocation: (lat: number, lng: number, nearestDistrict?: string, nearestState?: string) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  selectedState,
  selectedDistrict,
  onChangeLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeTile, setActiveTile] = useState<'streets' | 'satellite' | 'carto'>('streets');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Free OpenStreetMap Geocoding Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Helper to find nearest district in our dataset
  const findNearestDistrict = (targetLat: number, targetLng: number) => {
    let nearest = MOCK_DISTRICTS[0];
    let minDistance = Infinity;

    for (const dist of MOCK_DISTRICTS) {
      const d = Math.hypot(dist.lat - targetLat, dist.lng - targetLng);
      if (d < minDistance) {
        minDistance = d;
        nearest = dist;
      }
    }
    return nearest;
  };

  // Search free OpenStreetMap Nominatim API
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setGpsError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=5`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setSearchResults(data);
        setShowDropdown(true);
      } else {
        setGpsError('No Indian location found for this name. Please try another term or click the map directly.');
      }
    } catch (err) {
      console.error('Nominatim search error:', err);
      setGpsError('Free geocoding search temporarily unavailable. You can click anywhere on the map to set location.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (res: { display_name: string; lat: string; lon: string }) => {
    const newLat = parseFloat(res.lat);
    const newLng = parseFloat(res.lon);
    setShowDropdown(false);
    setSearchQuery(res.display_name.split(',')[0]);

    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([newLat, newLng]);
      mapInstanceRef.current.flyTo([newLat, newLng], 14, { duration: 1.2 });
    }

    const nearest = findNearestDistrict(newLat, newLng);
    onChangeLocation(newLat, newLng, nearest.name, nearest.state);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat || 25.59, lng || 85.13],
        zoom: 12,
        scrollWheelZoom: false,
      });

      const tileUrl = activeTile === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : activeTile === 'carto'
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tile = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; Esri',
        maxZoom: 18,
      }).addTo(map);
      tileLayerRef.current = tile;

      // Draggable marker
      const pinIcon = createLocationPickerIcon();
      const marker = L.marker([lat || 25.59, lng || 85.13], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 11px; padding: 2px;">
          <strong style="color: #312e81;">📍 Selected Ground Location</strong><br/>
          Drag pin or click map to move
        </div>
      `);

      marker.on('dragend', (e) => {
        const markerPos = e.target.getLatLng();
        const nearest = findNearestDistrict(markerPos.lat, markerPos.lng);
        onChangeLocation(markerPos.lat, markerPos.lng, nearest.name, nearest.state);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        const nearest = findNearestDistrict(e.latlng.lat, e.latlng.lng);
        onChangeLocation(e.latlng.lat, e.latlng.lng, nearest.name, nearest.state);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl = activeTile === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : activeTile === 'carto'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tile = L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; Esri',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = tile;
  }, [activeTile]);

  // Sync marker position if coordinates change externally
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current && lat && lng) {
      const current = markerRef.current.getLatLng();
      if (Math.abs(current.lat - lat) > 0.0001 || Math.abs(current.lng - lng) > 0.0001) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.panTo([lat, lng]);
      }
    }
  }, [lat, lng]);

  // Browser Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([userLat, userLng]);
          mapInstanceRef.current.flyTo([userLat, userLng], 14, { duration: 1 });
        }
        const nearest = findNearestDistrict(userLat, userLng);
        onChangeLocation(userLat, userLng, nearest.name, nearest.state);
      },
      (err) => {
        setIsLocating(false);
        setGpsError('Unable to retrieve your location. Please pick manually on the map.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-2">
      {/* Free Search & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search town, block, village (e.g. Danapur)..."
              className="w-full pl-8 pr-16 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-[11px] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Find'}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg z-50 max-h-48 overflow-y-auto">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSearchResult(res)}
                  className="p-2 text-xs hover:bg-indigo-50 text-slate-700 cursor-pointer border-b border-slate-100 last:border-0"
                >
                  <div className="font-semibold text-slate-900">{res.display_name.split(',')[0]}</div>
                  <div className="text-[10px] text-slate-400 truncate">{res.display_name}</div>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="flex items-center space-x-2">
          {/* Basemap switch */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTile('streets')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTile === 'streets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              OSM Streets
            </button>
            <button
              type="button"
              onClick={() => setActiveTile('carto')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTile === 'carto' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Carto Light
            </button>
            <button
              type="button"
              onClick={() => setActiveTile('satellite')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTile === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-semibold flex items-center space-x-1 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'GPS...' : 'My GPS'}</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
          {gpsError}
        </div>
      )}

      {/* Leaflet Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-xs">
        <div 
          ref={mapContainerRef} 
          className="w-full h-[220px] sm:h-[260px] z-10" 
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md border border-slate-200 text-[10px] text-slate-600 shadow-xs z-20 pointer-events-none">
          Click or drag marker • Free OpenStreetMap
        </div>
        <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[10px] font-mono z-20 pointer-events-none">
          {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
        </div>
      </div>
    </div>
  );
};
