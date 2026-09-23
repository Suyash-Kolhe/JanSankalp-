import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, Sparkles, Filter, IndianRupee, Users } from 'lucide-react';
import { AIProjectRecommendation } from '../types';
import { MOCK_DISTRICTS } from '../data/mockDistricts';
import { getCategoryColor, getCategoryIconSvg } from '../utils/leafletIcons';

interface RecommendationsProjectMapProps {
  recommendations: AIProjectRecommendation[];
  selectedRecommendationId: string | null;
  onSelectRecommendation: (rec: AIProjectRecommendation) => void;
}

export const RecommendationsProjectMap: React.FC<RecommendationsProjectMapProps> = ({
  recommendations,
  selectedRecommendationId,
  onSelectRecommendation
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeTile, setActiveTile] = useState<'carto' | 'satellite'>('carto');

  // Find coordinates for each recommendation based on its district
  const getRecommendationCoords = (districtName: string): [number, number] => {
    const dist = MOCK_DISTRICTS.find(d => d.name.toLowerCase() === districtName.toLowerCase());
    if (dist) return [dist.lat, dist.lng];
    return [22.8, 80.5];
  };

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
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      const markerGroup = L.layerGroup().addTo(map);
      markerGroupRef.current = markerGroup;
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

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markerGroupRef.current) return;

    markerGroupRef.current.clearLayers();

    recommendations.forEach((rec) => {
      const coords = getRecommendationCoords(rec.district);
      const isSelected = selectedRecommendationId === rec.id;
      const color = getCategoryColor(rec.category);
      const iconSvg = getCategoryIconSvg(rec.category);

      const divIcon = L.divIcon({
        className: 'custom-rec-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              position: absolute; 
              width: 38px; 
              height: 38px; 
              border-radius: 9999px; 
              background-color: ${color}; 
              opacity: 0.25; 
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width: 32px; 
              height: 32px; 
              border-radius: 9999px; 
              background: ${color}; 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
              border: ${isSelected ? '3px solid #facc15' : '2px solid #ffffff'};
              transition: transform 0.2s ease;
            ">
              ${iconSvg}
            </div>
            <div style="
              margin-top: 2px;
              background: #0f172a;
              color: white;
              font-size: 9px;
              font-weight: 700;
              padding: 1px 5px;
              border-radius: 4px;
              white-space: nowrap;
              border: 1px solid rgba(255,255,255,0.2);
            ">
              ₹${rec.estimatedCostCr} Cr
            </div>
          </div>
        `,
        iconSize: [60, 48],
        iconAnchor: [30, 24],
        popupAnchor: [0, -24],
      });

      const marker = L.marker(coords, { icon: divIcon });

      const popupHtml = `
        <div style="font-family: inherit; min-width: 240px; max-width: 270px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 1px 6px; border-radius: 9999px;">
              ${rec.id} • ${rec.suggestedPriority}
            </span>
            <span style="font-size: 11px; font-weight: 800; color: #0f172a;">₹${rec.estimatedCostCr} Cr</span>
          </div>

          <h5 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.25;">
            ${rec.title}
          </h5>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            📍 ${rec.district}, ${rec.state} • ${(rec.beneficiariesEstimate / 1000).toFixed(0)}k citizens
          </div>

          <p style="font-size: 10px; color: #334155; margin-bottom: 8px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${rec.rationale}
          </p>

          <button 
            id="map-btn-inspect-rec-${rec.id}"
            style="width: 100%; font-size: 11px; padding: 5px 8px; background: #312e81; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;"
          >
            Inspect Explainability & Risks →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        onSelectRecommendation(rec);
        const btn = document.getElementById(`map-btn-inspect-rec-${rec.id}`);
        if (btn) {
          btn.onclick = () => onSelectRecommendation(rec);
        }
      });

      marker.on('click', () => {
        onSelectRecommendation(rec);
      });

      markerGroupRef.current?.addLayer(marker);
    });
  }, [recommendations, selectedRecommendationId]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Geospatial Pipeline Distribution</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-800 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              {recommendations.length} Capital Projects
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Geographic dispersion of AI recommendations across aspirational corridors and tribal belts.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400">Map Tile:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[10px] font-semibold">
            <button
              onClick={() => setActiveTile('carto')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTile === 'carto' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Light Carto
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
          className="w-full h-[320px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-10" 
        />
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] space-y-0.5 shadow-md z-20 pointer-events-none">
          <span className="font-bold text-slate-700 block">Project Categories:</span>
          <div className="flex flex-wrap gap-2 text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-600" /> Water</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600" /> Roads</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Health</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Broadband</span>
          </div>
        </div>
      </div>
    </div>
  );
};
