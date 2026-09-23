import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Compass, 
  Eye, 
  Filter, 
  Sparkles,
  Building2,
  Droplet,
  Route,
  Activity,
  Zap,
  Wifi,
  Radio
} from 'lucide-react';
import { CitizenRequest, DistrictProfile, ComputedPriorityScore, CategoryType } from '../types';
import { 
  createCitizenRequestIcon, 
  createDistrictPriorityIcon, 
  getCategoryColor 
} from '../utils/leafletIcons';

interface NationalInfrastructureMapProps {
  districts: DistrictProfile[];
  scoredDistricts: ComputedPriorityScore[];
  requests: CitizenRequest[];
  selectedDistrictId: string | null;
  onSelectDistrict: (districtId: string) => void;
  onNavigateToPriority: (districtId?: string) => void;
  onNavigateToRecommendations: (districtId?: string) => void;
}

type TileProvider = 'carto' | 'osm' | 'topo' | 'dark' | 'satellite';
type MapMetricMode = 'priority' | 'demand' | 'gap';

const TILE_LAYERS: Record<TileProvider, { url: string; attribution: string; maxZoom: number }> = {
  carto: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    maxZoom: 19,
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap, SRTM &copy; OpenTopoMap',
    maxZoom: 17,
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar Geographics',
    maxZoom: 18,
  }
};

export const NationalInfrastructureMap: React.FC<NationalInfrastructureMapProps> = ({
  districts,
  scoredDistricts,
  requests,
  selectedDistrictId,
  onSelectDistrict,
  onNavigateToPriority,
  onNavigateToRecommendations
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const districtLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const requestLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeTile, setActiveTile] = useState<TileProvider>('carto');
  const [metricMode, setMetricMode] = useState<MapMetricMode>('priority');
  const [showCitizenPins, setShowCitizenPins] = useState<boolean>(true);
  const [pinCategoryFilter, setPinCategoryFilter] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.8, 80.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false, // We'll add custom positioned zoom control
        scrollWheelZoom: false,
      });

      // Add Zoom Control to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Base tile
      const initialTileConfig = TILE_LAYERS[activeTile];
      const tile = L.tileLayer(initialTileConfig.url, {
        attribution: initialTileConfig.attribution,
        maxZoom: initialTileConfig.maxZoom,
      }).addTo(map);
      tileLayerRef.current = tile;

      // Layer groups
      districtLayerGroupRef.current = L.layerGroup().addTo(map);
      requestLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    // Resize observer to ensure map renders crisp on layout changes
    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Force map invalidateSize after initial layout render
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Provider Switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const config = TILE_LAYERS[activeTile];
    const newTile = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [activeTile]);

  // Update District Layer Markers (Priority / Demand / Gap)
  useEffect(() => {
    if (!mapInstanceRef.current || !districtLayerGroupRef.current) return;

    districtLayerGroupRef.current.clearLayers();

    scoredDistricts.forEach((distScore) => {
      const dist = districts.find(d => d.id === distScore.districtId);
      if (!dist) return;

      const isSelected = selectedDistrictId === dist.id;

      let radius = 16;
      let color = '#2563eb';
      let titleLabel = '';

      if (metricMode === 'demand') {
        const norm = dist.requestVolume / 3000;
        radius = Math.max(14, Math.min(34, norm * 32));
        color = norm > 0.65 ? '#ef4444' : norm > 0.4 ? '#f59e0b' : '#3b82f6';
        titleLabel = `Demand: ${dist.requestVolume.toLocaleString()} requests`;
      } else if (metricMode === 'gap') {
        const gap = dist.infrastructureGaps.composite;
        radius = Math.max(14, Math.min(34, (gap / 100) * 32));
        color = gap > 75 ? '#dc2626' : gap > 60 ? '#ea580c' : '#16a34a';
        titleLabel = `Deficit Gap Index: ${gap.toFixed(1)}/100`;
      } else {
        // Priority Score
        const p = distScore.score;
        radius = Math.max(16, Math.min(36, (p / 100) * 34));
        color = distScore.rank <= 3 ? '#b91c1c' : distScore.rank <= 8 ? '#d97706' : '#2563eb';
        titleLabel = `Priority Score: ${p} (Rank #${distScore.rank})`;
      }

      // Outer halo for high-urgency or selected district
      const halo = L.circleMarker([dist.lat, dist.lng], {
        radius: radius + 8,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: isSelected ? 0.9 : 0.25,
        fillOpacity: isSelected ? 0.35 : 0.12,
      });

      // Core circle marker
      const circle = L.circleMarker([dist.lat, dist.lng], {
        radius,
        fillColor: color,
        color: isSelected ? '#facc15' : '#ffffff',
        weight: isSelected ? 3.5 : 2,
        opacity: 1,
        fillOpacity: 0.88,
      });

      const popupHtml = `
        <div style="font-family: inherit; min-width: 250px; max-width: 280px; padding: 2px;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <h4 style="margin: 0; font-size: 15px; font-weight: 800; color: #0f172a;">${dist.name}</h4>
                <span style="background: #e0e7ff; color: #3730a3; font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 9999px;">
                  Rank #${distScore.rank}
                </span>
              </div>
              <span style="font-size: 11px; color: #64748b;">${dist.state} • Pop: ${(dist.population / 100000).toFixed(1)} Lakh</span>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 16px; font-weight: 900; color: ${color};">${distScore.score}</span>
              <span style="font-size: 9px; display: block; color: #94a3b8; line-height: 1;">Priority</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; margin-bottom: 8px;">
            <div style="background: #f8fafc; padding: 5px 7px; border-radius: 6px; border: 1px solid #f1f5f9;">
              <span style="color: #64748b; font-size: 9px; display: block;">Citizen Filings</span>
              <strong style="color: #0f172a;">${dist.requestVolume.toLocaleString()}</strong>
            </div>
            <div style="background: #f8fafc; padding: 5px 7px; border-radius: 6px; border: 1px solid #f1f5f9;">
              <span style="color: #64748b; font-size: 9px; display: block;">Infra Deficit Gap</span>
              <strong style="color: #dc2626;">${dist.infrastructureGaps.composite.toFixed(1)}%</strong>
            </div>
            <div style="background: #f8fafc; padding: 5px 7px; border-radius: 6px; border: 1px solid #f1f5f9;">
              <span style="color: #64748b; font-size: 9px; display: block;">Top Citizen Need</span>
              <strong style="color: #0284c7; text-transform: capitalize;">${dist.topCategory}</strong>
            </div>
            <div style="background: #f8fafc; padding: 5px 7px; border-radius: 6px; border: 1px solid #f1f5f9;">
              <span style="color: #64748b; font-size: 9px; display: block;">Public Outlay</span>
              <strong style="color: #16a34a;">₹${dist.existingPublicInvestmentCr.total} Cr</strong>
            </div>
          </div>

          ${dist.flaggedUnderrepresented ? `
            <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 4px 7px; margin-bottom: 8px; font-size: 10px; color: #92400e;">
              ⚖️ <strong>Fairness Multiplier:</strong> Low digital penetration (${dist.digitalPenetrationPct}%). Algorithmic boost applied.
            </div>
          ` : ''}

          <div style="display: flex; gap: 4px; margin-top: 6px;">
            <button 
              id="map-btn-priority-${dist.id}"
              style="flex: 1; font-size: 11px; padding: 6px 8px; background: #312e81; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;"
            >
              Tune Weights →
            </button>
            <button 
              id="map-btn-ai-${dist.id}"
              style="flex: 1; font-size: 11px; padding: 6px 8px; background: #f59e0b; color: #0f172a; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;"
            >
              AI Projects →
            </button>
          </div>
        </div>
      `;

      circle.bindPopup(popupHtml, { maxWidth: 300 });

      circle.on('popupopen', () => {
        onSelectDistrict(dist.id);
        const btnPriority = document.getElementById(`map-btn-priority-${dist.id}`);
        const btnAi = document.getElementById(`map-btn-ai-${dist.id}`);
        if (btnPriority) {
          btnPriority.onclick = () => onNavigateToPriority(dist.id);
        }
        if (btnAi) {
          btnAi.onclick = () => onNavigateToRecommendations(dist.id);
        }
      });

      circle.on('click', () => {
        onSelectDistrict(dist.id);
      });

      districtLayerGroupRef.current?.addLayer(halo);
      districtLayerGroupRef.current?.addLayer(circle);
    });
  }, [metricMode, scoredDistricts, selectedDistrictId, districts]);

  // Update Individual Citizen Grievance Pins Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !requestLayerGroupRef.current) return;

    requestLayerGroupRef.current.clearLayers();

    if (!showCitizenPins) return;

    const filteredRequests = requests.filter(req => {
      if (pinCategoryFilter === 'all') return true;
      return req.category.toLowerCase() === pinCategoryFilter.toLowerCase();
    });

    filteredRequests.forEach((req) => {
      const pinIcon = createCitizenRequestIcon(req.category, req.urgency);
      const marker = L.marker([req.lat, req.lng], { icon: pinIcon });

      const channelBadge = req.channel === 'voice' ? '🎙️ Voice Intake' :
                           req.channel === 'whatsapp' ? '💬 WhatsApp Bot' :
                           req.channel === 'sms' ? '📱 SMS Helpline' : '🌐 Web Portal';

      const popupHtml = `
        <div style="font-family: inherit; min-width: 250px; max-width: 290px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 10px; font-weight: 700; background: #f1f5f9; padding: 1px 5px; border-radius: 4px; color: #475569;">${req.id}</span>
              <span style="font-size: 9px; font-weight: 600; color: #64748b;">${channelBadge}</span>
            </div>
            <span style="
              font-size: 9px; 
              font-weight: 700; 
              padding: 1px 6px; 
              border-radius: 9999px; 
              background: ${req.urgency === 'Critical' ? '#fee2e2' : '#fef3c7'}; 
              color: ${req.urgency === 'Critical' ? '#b91c1c' : '#b45309'};
            ">
              ${req.urgency} Urgency
            </span>
          </div>

          <div style="font-size: 11px; margin-bottom: 4px; color: #0f172a; font-weight: 700;">
            📍 ${req.villageOrWard}, ${req.district} (${req.state})
          </div>

          <div style="font-size: 11px; font-style: italic; color: #334155; background: #f8fafc; padding: 6px 8px; border-radius: 6px; border-left: 3px solid #6366f1; margin-bottom: 6px; line-height: 1.35;">
            "${req.translatedText}"
          </div>

          <div style="font-size: 10px; color: #64748b; line-height: 1.4;">
            <strong>Category:</strong> <span style="text-transform: capitalize; color: #0f172a;">${req.category}</span> • 
            <strong>Beneficiaries:</strong> ${req.estimatedBeneficiaries.toLocaleString()}<br/>
            <strong>Scheme:</strong> ${req.schemeAlignment}<br/>
            <strong>Status:</strong> <span style="color: #16a34a; font-weight: 600;">${req.status}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 310 });
      requestLayerGroupRef.current?.addLayer(marker);
    });
  }, [showCitizenPins, pinCategoryFilter, requests]);

  // Center / Fly to District when selected externally
  useEffect(() => {
    if (!selectedDistrictId || !mapInstanceRef.current) return;
    const dist = districts.find(d => d.id === selectedDistrictId);
    if (dist) {
      mapInstanceRef.current.flyTo([dist.lat, dist.lng], 9, { duration: 1.2 });
    }
  }, [selectedDistrictId, districts]);

  // Reset to India Overview
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([22.8, 80.5], 5, { duration: 1.0 });
  };

  // Fly to specific district from quick jump
  const handleJumpToDistrict = (districtId: string) => {
    const dist = districts.find(d => d.id === districtId);
    if (dist && mapInstanceRef.current) {
      onSelectDistrict(districtId);
      mapInstanceRef.current.flyTo([dist.lat, dist.lng], 9, { duration: 1.2 });
    }
  };

  // Toggle Fullscreen on Container
  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;

    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300);
      }).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300);
      }).catch(() => {});
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Top Map Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <span>National Geospatial Priority & Grievance Map</span>
            </h2>
            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
              Interactive Leaflet Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geospatial synthesis of citizen demand density, infrastructure deficits, and composite priority rankings.
          </p>
        </div>

        {/* Map Metric Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setMetricMode('demand')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricMode === 'demand' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demand Density
            </button>
            <button
              onClick={() => setMetricMode('gap')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricMode === 'gap' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deficit Gap
            </button>
            <button
              onClick={() => setMetricMode('priority')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricMode === 'priority' ? 'bg-indigo-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Priority Score
            </button>
          </div>

          {/* Quick Jump Selector */}
          <select
            value={selectedDistrictId || ''}
            onChange={(e) => handleJumpToDistrict(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
          >
            <option value="">Jump to District...</option>
            {scoredDistricts.map(sd => (
              <option key={sd.districtId} value={sd.districtId}>
                #{sd.rank} {sd.districtName} ({sd.state}) - {sd.score} pts
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Secondary Controls Bar: Basemaps & Pin Layer Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        {/* Basemap Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Basemap:</span>
          </span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              onClick={() => setActiveTile('carto')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTile === 'carto' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Light Carto
            </button>
            <button
              onClick={() => setActiveTile('osm')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTile === 'osm' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setActiveTile('topo')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTile === 'topo' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Topo Terrain
            </button>
            <button
              onClick={() => setActiveTile('dark')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTile === 'dark' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dark Matter
            </button>
            <button
              onClick={() => setActiveTile('satellite')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTile === 'satellite' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Citizen Grievance Pins Overlay Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center space-x-1.5 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={showCitizenPins}
              onChange={(e) => setShowCitizenPins(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span className="text-[11px]">Show Citizen Grievance Pins ({requests.length})</span>
          </label>

          {showCitizenPins && (
            <select
              value={pinCategoryFilter}
              onChange={(e) => setPinCategoryFilter(e.target.value)}
              className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="water">💧 Water (JJM)</option>
              <option value="roads">🛣️ Roads (PMGSY)</option>
              <option value="health">🏥 Health (PM-ABHIM)</option>
              <option value="electricity">⚡ Electricity</option>
              <option value="internet">📶 Broadband</option>
              <option value="sanitation">🚽 Sanitation</option>
            </select>
          )}

          {/* Quick Action Tools */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleResetView}
              title="Reset View to All India"
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleToggleFullscreen}
              title="Toggle Fullscreen"
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative">
        <div 
          ref={mapContainerRef} 
          className="w-full h-[480px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-10" 
        />

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-[10px] space-y-1.5 z-20 pointer-events-auto max-w-[220px]">
          <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-100 pb-1">
            <span>
              {metricMode === 'priority' ? 'Priority Rank Index' : metricMode === 'gap' ? 'Deficit Gap Index' : 'Citizen Filings'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 shadow-xs" />
                <span className="font-semibold text-slate-700">Top Priority (#1 - #3)</span>
              </div>
              <span className="font-mono text-slate-500">Critical</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
                <span className="font-semibold text-slate-700">High Priority (#4 - #10)</span>
              </div>
              <span className="font-mono text-slate-500">Elevated</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 shadow-xs" />
                <span className="font-semibold text-slate-700">Standard (#11 - #20)</span>
              </div>
              <span className="font-mono text-slate-500">Moderate</span>
            </div>
          </div>

          {showCitizenPins && (
            <div className="border-t border-slate-100 pt-1.5 mt-1.5 text-slate-600 space-y-0.5">
              <span className="font-bold block text-slate-700">Citizen Grievance Pins:</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                <span>Pulsing Pin: Critical Urgency</span>
              </div>
              <div className="text-[9px] text-slate-400">
                Click any pin to inspect citizen transcript & channel.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
