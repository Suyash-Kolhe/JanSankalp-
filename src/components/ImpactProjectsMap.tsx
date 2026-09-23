import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Award, CheckCircle, ArrowDownRight, Layers, Users, MapPin } from 'lucide-react';
import { ImpactInitiative } from '../types';
import { MOCK_DISTRICTS } from '../data/mockDistricts';

interface ImpactProjectsMapProps {
  initiatives: ImpactInitiative[];
  selectedInitiativeId: string;
  onSelectInitiative: (id: string) => void;
}

export const ImpactProjectsMap: React.FC<ImpactProjectsMapProps> = ({
  initiatives,
  selectedInitiativeId,
  onSelectInitiative
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  const getDistrictCoords = (districtName: string): [number, number] => {
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

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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

  useEffect(() => {
    if (!mapInstanceRef.current || !markerGroupRef.current) return;

    markerGroupRef.current.clearLayers();

    initiatives.forEach((init) => {
      const coords = getDistrictCoords(init.district);
      const isSelected = selectedInitiativeId === init.id;
      const dropPct = Math.round(
        ((init.before.requestVolumeMonthly - init.after.requestVolumeMonthly) / init.before.requestVolumeMonthly) * 100
      );

      const divIcon = L.divIcon({
        className: 'custom-impact-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              width: 34px; 
              height: 34px; 
              border-radius: 9999px; 
              background: #059669; 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
              border: ${isSelected ? '3px solid #facc15' : '2px solid #ffffff'};
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style="
              margin-top: 2px;
              background: #064e3b;
              color: #a7f3d0;
              font-size: 9px;
              font-weight: 800;
              padding: 1px 5px;
              border-radius: 4px;
              white-space: nowrap;
              border: 1px solid rgba(255,255,255,0.2);
            ">
              -${dropPct}% Grievances
            </div>
          </div>
        `,
        iconSize: [80, 52],
        iconAnchor: [40, 26],
        popupAnchor: [0, -26],
      });

      const marker = L.marker(coords, { icon: divIcon });

      const popupHtml = `
        <div style="font-family: inherit; min-width: 240px; max-width: 270px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; background: #d1fae5; color: #065f46; padding: 1px 6px; border-radius: 9999px;">
              ✓ Commissioned ${init.completionDate}
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #059669;">-${dropPct}%</span>
          </div>

          <h5 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0f172a;">
            ${init.title}
          </h5>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            📍 ${init.district}, ${init.state} • ${init.beneficiaries.toLocaleString()} citizens
          </div>

          <div style="font-size: 10px; background: #f8fafc; padding: 5px 7px; border-radius: 6px; margin-bottom: 6px;">
            <div><strong>Complaints:</strong> ${init.before.requestVolumeMonthly} → <span style="color: #059669; font-weight: bold;">${init.after.requestVolumeMonthly}/mo</span></div>
            <div><strong>Citizen CSAT:</strong> ${init.before.satisfactionScore} → <span style="color: #4f46e5; font-weight: bold;">${init.after.satisfactionScore}/5.0</span></div>
          </div>

          <button 
            id="map-btn-impact-${init.id}"
            style="width: 100%; font-size: 11px; padding: 5px 8px; background: #065f46; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;"
          >
            Review Audit Details →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        onSelectInitiative(init.id);
        const btn = document.getElementById(`map-btn-impact-${init.id}`);
        if (btn) {
          btn.onclick = () => onSelectInitiative(init.id);
        }
      });

      marker.on('click', () => {
        onSelectInitiative(init.id);
      });

      markerGroupRef.current?.addLayer(marker);
    });
  }, [initiatives, selectedInitiativeId]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Geospatial Audit of Completed DPI Interventions</span>
          </h3>
          <p className="text-xs text-slate-500">
            Click any verified project site to review empirical before-and-after outcome metrics.
          </p>
        </div>
        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
          {initiatives.length} Completed Projects
        </span>
      </div>

      <div className="relative">
        <div 
          ref={mapContainerRef} 
          className="w-full h-[280px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-10" 
        />
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-semibold text-emerald-800 shadow-xs z-20 pointer-events-none">
          ✓ Verified Field Commissioning Ground Sites
        </div>
      </div>
    </div>
  );
};
