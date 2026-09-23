import React from 'react';
import { 
  Building2, 
  MapPin, 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Globe2, 
  WifiOff, 
  Wifi, 
  CheckCircle2
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentLang: SupportedLanguage;
  setCurrentLang: (lang: SupportedLanguage) => void;
  lowBandwidth: boolean;
  setLowBandwidth: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentLang,
  setCurrentLang,
  lowBandwidth,
  setLowBandwidth
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const navItems = [
    { id: 'citizen', label: t.navCitizenPortal, icon: MapPin },
    { id: 'dashboard', label: t.navDashboard, icon: Building2 },
    { id: 'priority', label: t.navPriorityEngine, icon: Sliders },
    { id: 'recommendations', label: t.navAiRecommendations, icon: Sparkles },
    { id: 'impact', label: t.navImpactTracker, icon: TrendingUp },
    { id: 'trust', label: t.navDpgTrust, icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Tricolor Government of India / DPG Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & National Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <span className="font-extrabold text-xl tracking-tighter">JS</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  {t.appName}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    DPG Standard
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-md">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Right Controls: Language Selector & Low Bandwidth Switch */}
          <div className="flex items-center space-x-3">
            {/* Low-Bandwidth Mode Button */}
            <button
              onClick={() => setLowBandwidth(!lowBandwidth)}
              title={lowBandwidth ? 'Low-Bandwidth Mode Active' : 'Switch to Low-Bandwidth Mode'}
              className={`flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                lowBandwidth 
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lowBandwidth ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden md:inline">{lowBandwidth ? '2G Low-Data' : 'Normal Data'}</span>
            </button>

            {/* 12-Language Selector Dropdown */}
            <div className="relative flex items-center">
              <div className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus-within:ring-2 focus-within:ring-indigo-500">
                <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                <select
                  value={currentLang}
                  onChange={(e) => setCurrentLang(e.target.value as SupportedLanguage)}
                  className="bg-transparent border-none text-xs font-medium focus:outline-hidden cursor-pointer"
                  aria-label="Select Regional Language"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Prototype Demo Banner */}
      <div className="bg-amber-500/10 border-y border-amber-500/20 px-4 py-1 text-center text-[11px] text-amber-900 flex items-center justify-center gap-2">
        <span className="font-semibold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] uppercase tracking-wider">Demo Prototype</span>
        <span>{t.demoDataNotice}</span>
      </div>
    </header>
  );
};
