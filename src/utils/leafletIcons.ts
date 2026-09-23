import L from 'leaflet';
import { CategoryType, UrgencyLevel } from '../types';

export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'water':
      return '#0284c7'; // sky-600
    case 'roads':
      return '#d97706'; // amber-600
    case 'health':
      return '#dc2626'; // red-600
    case 'electricity':
      return '#ca8a04'; // yellow-600
    case 'internet':
      return '#4f46e5'; // indigo-600
    case 'sanitation':
      return '#16a34a'; // green-600
    case 'housing':
      return '#9333ea'; // purple-600
    case 'education':
      return '#0891b2'; // cyan-600
    case 'transport':
      return '#475569'; // slate-600
    default:
      return '#64748b';
  }
};

export const getUrgencyColor = (urgency: UrgencyLevel): string => {
  switch (urgency) {
    case 'Critical':
      return '#ef4444'; // red-500
    case 'High':
      return '#f97316'; // orange-500
    case 'Medium':
      return '#eab308'; // yellow-500
    case 'Low':
      return '#10b981'; // emerald-500
    default:
      return '#3b82f6';
  }
};

export const getCategoryIconSvg = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'water':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
    case 'roads':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 19 4-14"/><path d="m16 5 4 14"/><path d="M12 5v2"/><path d="M12 11v2"/><path d="M12 17v2"/></svg>`;
    case 'health':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`;
    case 'electricity':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    case 'internet':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`;
    case 'sanitation':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    case 'housing':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    default:
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  }
};

/**
 * Creates a custom marker for a citizen request with category icon & urgency badge
 */
export const createCitizenRequestIcon = (category: string, urgency: UrgencyLevel, isSelected = false): L.DivIcon => {
  const color = getCategoryColor(category);
  const urgencyColor = getUrgencyColor(urgency);
  const iconSvg = getCategoryIconSvg(category);
  const pulseClass = urgency === 'Critical' ? 'animate-ping' : '';

  return L.divIcon({
    className: 'custom-citizen-pin',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        ${urgency === 'Critical' ? `
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background-color: ${urgencyColor}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        ` : ''}
        <div style="
          width: 30px; 
          height: 30px; 
          border-radius: 9999px; 
          background: ${color}; 
          color: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
          border: ${isSelected ? '3px solid #facc15' : '2px solid #ffffff'};
          transition: transform 0.15s ease;
        ">
          ${iconSvg}
        </div>
        <div style="
          position: absolute; 
          top: -2px; 
          right: -2px; 
          width: 10px; 
          height: 10px; 
          border-radius: 9999px; 
          background-color: ${urgencyColor}; 
          border: 1.5px solid white;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

/**
 * Custom Pin for Citizen Location Picker
 */
export const createLocationPickerIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-picker-pin',
    html: `
      <div style="position: relative; width: 38px; height: 46px; display: flex; flex-direction: column; align-items: center;">
        <div style="
          width: 32px; 
          height: 32px; 
          border-radius: 9999px; 
          background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); 
          color: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          border: 2.5px solid #ffffff;
          font-weight: bold;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent; 
          border-right: 6px solid transparent; 
          border-top: 8px solid #312e81; 
          margin-top: -2px;
        "></div>
        <div style="
          width: 14px; 
          height: 4px; 
          background: rgba(0, 0, 0, 0.25); 
          border-radius: 9999px; 
          margin-top: 2px;
        "></div>
      </div>
    `,
    iconSize: [38, 46],
    iconAnchor: [19, 44],
    popupAnchor: [0, -44],
  });
};

/**
 * Custom District Priority DivIcon with rank badge
 */
export const createDistrictPriorityIcon = (
  name: string,
  rank: number,
  score: number,
  color: string,
  isSelected = false
): L.DivIcon => {
  const isTop3 = rank <= 3;
  return L.divIcon({
    className: 'custom-district-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        ${isTop3 ? `
          <div style="
            position: absolute; 
            top: -2px; 
            width: 36px; 
            height: 36px; 
            border-radius: 9999px; 
            background-color: ${color}; 
            opacity: 0.3; 
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        ` : ''}
        <div style="
          display: flex; 
          align-items: center; 
          gap: 4px; 
          padding: 3px 8px; 
          border-radius: 9999px; 
          background: ${color}; 
          color: white; 
          font-weight: 700; 
          font-size: 11px; 
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25); 
          border: ${isSelected ? '2.5px solid #facc15' : '1.5px solid #ffffff'};
          white-space: nowrap;
        ">
          <span style="
            background: rgba(255, 255, 255, 0.25); 
            padding: 1px 4px; 
            border-radius: 4px; 
            font-size: 9px;
          ">#${rank}</span>
          <span>${name}</span>
          <span style="font-size: 10px; opacity: 0.9;">(${score})</span>
        </div>
      </div>
    `,
    iconSize: [100, 28],
    iconAnchor: [50, 14],
    popupAnchor: [0, -14],
  });
};
