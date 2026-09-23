import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Sliders, MapPin, Sparkles, TrendingUp, Info } from 'lucide-react';
import { ComputedPriorityScore, DistrictProfile } from '../types';
import { MOCK_DISTRICTS } from '../data/mockDistricts';

interface PrioritySimulationMapProps {
  scoredDistricts: ComputedPriorityScore[];
  selectedDistrictId: string | null;
  onSelectDistrict: (districtId: string) => void;
}

export const PrioritySimulationMap: React.FC<PrioritySimulationMapProps> = ({
  scoredDistricts,
  selectedDistrictId,
  onSelectDistrict
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeTile, setActiveTile] = useState<'carto' | 'osm' | 'satellite'>('carto');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.8, 80.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 16,
        scrollWheelZoom: false,
      });

      const tileUrl = activeTile === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : activeTile === 'osm'
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
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

  // Update circles when scoredDistricts or selectedDistrictId changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    scoredDistricts.forEach((sd) => {
      const distData = MOCK_DISTRICTS.find(d => d.id === sd.districtId);
      if (!distData) return;

      const isSelected = selectedDistrictId === sd.districtId;
      const score = sd.score;
      
      // Color and radius based on priority
      let color = '#3b82f6';
      if (score >= 75) color = '#ef4444'; // Red (Top Urgent)
      else if (score >= 60) color = '#f59e0b'; // Amber
      else color = '#10b981'; // Green / Controlled

      const radius = Math.max(12, Math.min(28, (score / 100) * 26));

      const circle = L.circleMarker([distData.lat, distData.lng], {
        radius,
        fillColor: color,
        color: isSelected ? '#312e81' : '#ffffff',
        weight: isSelected ? 3.5 : 2,
        opacity: 1,
        fillOpacity: isSelected ? 0.95 : 0.75,
      });

      const popupHtml = `
        <div style="font-family: inherit; padding: 3px; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-weight: 800; font-size: 13px; color: #0f172a;">${distData.name}</span>
            <span style="font-size: 10px; font-weight: 700; background: ${color}20; color: ${color}; padding: 1px 6px; border-radius: 9999px;">
              Rank #${sd.rank}
            </span>
          </div>
          <div style="font-size: 11px; margin-bottom: 4px; color: #334155;">
            <strong>Simulated Priority:</strong> <span style="color: ${color}; font-weight: bold;">${score} / 100</span>
          </div>
          <div style="font-size: 10px; color: #64748b; line-height: 1.4; margin-bottom: 8px;">
            • Demand: ${distData.requestVolume} filings<br/>
            • Gap Index: ${distData.infrastructureGaps.composite}/100<br/>
            • Vulnerability: ${distData.vulnerabilityScore}/100<br/>
            • Existing Outlay: ₹${distData.existingPublicInvestmentCr.total} Cr
          </div>
          <button
            id="map-sim-select-${distData.id}"
            style="width: 100%; font-size: 10px; padding: 4px 8px; background: #312e81; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;"
          >
            Inspect Factor Breakdown ↓
          </button>
        </div>
      `;

      circle.bindPopup(popupHtml);

      circle.on('popupopen', () => {
        onSelectDistrict(distData.id);
        const btn = document.getElementById(`map-sim-select-${distData.id}`);
        if (btn) {
          btn.onclick = () => onSelectDistrict(distData.id);
        }
      });

      circle.on('click', () => {
        onSelectDistrict(distData.id);
      });

      layerGroupRef.current?.addLayer(circle);
    });
  }, [scoredDistricts, selectedDistrictId]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Live Priority Sensitivity Geospatial Simulation</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-800 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              Open Free Maps
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            District circle radii and colors dynamically respond as you drag the weight sliders below.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400">Basemap:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[10px] font-semibold">
            <button
              onClick={() => setActiveTile('carto')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTile === 'carto' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Carto Light
            </button>
            <button
              onClick={() => setActiveTile('osm')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTile === 'osm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setActiveTile('satellite')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTile === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={mapContainerRef} 
          className="w-full h-[300px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-10" 
        />
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] space-y-1 shadow-md z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>Score Sensitivity:</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> ≥75 (Urgent)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 60-74 (Moderate)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> &lt;60 (Standard)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
