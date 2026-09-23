import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Languages, 
  Layers, 
  Search, 
  Filter, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Sliders,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CitizenRequest, DistrictProfile, PriorityWeights } from '../types';
import { MOCK_DISTRICTS } from '../data/mockDistricts';
import { calculateDistrictPriorities } from '../utils/priorityCalculator';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { NationalInfrastructureMap } from './NationalInfrastructureMap';

interface PolicymakerDashboardProps {
  requests: CitizenRequest[];
  currentLang: SupportedLanguage;
  onNavigateToPriority: (districtId?: string) => void;
  onNavigateToRecommendations: (districtId?: string) => void;
  lowBandwidth: boolean;
}

export const PolicymakerDashboard: React.FC<PolicymakerDashboardProps> = ({
  requests,
  currentLang,
  onNavigateToPriority,
  onNavigateToRecommendations,
  lowBandwidth
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [sortField, setSortField] = useState<'demand' | 'gap' | 'priority'>('priority');

  // Compute live priority scores for map & table
  const defaultWeights: PriorityWeights = {
    citizenDemand: 0.35,
    infrastructureGap: 0.30,
    vulnerability: 0.25,
    investmentOffset: 0.10
  };
  const scoredDistricts = calculateDistrictPriorities(MOCK_DISTRICTS, defaultWeights);

  // Aggregate Trend Data for Charts
  const monthlyTrends = [
    { month: 'Apr', requests: 1420, water: 480, roads: 410, health: 260 },
    { month: 'May', requests: 1980, water: 820, roads: 510, health: 320 },
    { month: 'Jun', requests: 2750, water: 1140, roads: 790, health: 430 },
    { month: 'Jul', requests: 3640, water: 1390, roads: 1210, health: 540 }, // Peak Monsoon
    { month: 'Aug', requests: 3410, water: 1220, roads: 1180, health: 580 },
    { month: 'Sep', requests: 4120, water: 1540, roads: 1350, health: 690 },
  ];

  const categoryMixData = [
    { name: 'Water (JJM)', value: 34.2, count: 6280, color: '#0284c7' },
    { name: 'Roads (PMGSY)', value: 27.8, count: 5120, color: '#d97706' },
    { name: 'Health (ABHIM)', value: 16.4, count: 3020, color: '#dc2626' },
    { name: 'Broadband (BharatNet)', value: 8.5, count: 1560, color: '#4f46e5' },
    { name: 'Power (KUSUM)', value: 6.2, count: 1140, color: '#eab308' },
    { name: 'Sanitation (SBM)', value: 4.5, count: 830, color: '#16a34a' },
    { name: 'Housing (PMAY)', value: 2.4, count: 470, color: '#9333ea' },
  ];

  const channelMixData = [
    { name: 'Voice Intake', value: 41, color: '#f59e0b' },
    { name: 'WhatsApp Bot', value: 32, color: '#10b981' },
    { name: 'SMS Helpline', value: 16, color: '#6366f1' },
    { name: 'Web Portal', value: 11, color: '#3b82f6' },
  ];

  // Filtered Hotspot Table
  const filteredDistricts = scoredDistricts.filter((item) => {
    const dist = MOCK_DISTRICTS.find(d => d.id === item.districtId);
    if (!dist) return false;

    const matchesSearch = dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dist.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dist.topCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filterState === 'all' || dist.state === filterState;
    const matchesCategory = filterCategory === 'all' || dist.topCategory === filterCategory;

    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>National Infrastructure Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Citizen Demand & Prioritization Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Live telemetry synthesizing 18,420+ citizen requests across 20 priority districts into actionable budget allocations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateToPriority()}
            className="px-4 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Tune Priority Weights</span>
          </button>
          <button
            onClick={() => onNavigateToRecommendations()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <span>AI Project Queue →</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{t.kpiTotalRequests}</span>
          <div className="text-2xl font-black text-slate-900">18,420+</div>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +14.2% this month
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{t.kpiDistrictsCovered}</span>
          <div className="text-2xl font-black text-indigo-950">20 Districts</div>
          <span className="text-[10px] text-slate-400">Across 12 States & UTs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{t.kpiTopNeed}</span>
          <div className="text-lg font-bold text-sky-700 truncate">Piped Water (JJM)</div>
          <span className="text-[10px] text-slate-400">34.2% of all citizen filings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{t.kpiAvgResolution}</span>
          <div className="text-2xl font-black text-slate-900">18.4 Days</div>
          <span className="text-[10px] text-emerald-600 font-medium">-3.2 days vs 2025</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{t.kpiLanguagesUsed}</span>
          <div className="text-2xl font-black text-amber-700">12 Languages</div>
          <span className="text-[10px] text-slate-400">Full Indic OCR & Voice NLP</span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Side Hotspot Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map Column (8 cols) */}
        <div className="lg:col-span-8">
          {lowBandwidth ? (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-center space-y-2">
              <p className="text-xs font-bold text-amber-900">
                Low-Bandwidth Mode Active (Map tiles disabled to save data on 2G networks)
              </p>
              <p className="text-[11px] text-amber-700">
                Use the Demand Hotspot Table below to review and filter all district data.
              </p>
            </div>
          ) : (
            <NationalInfrastructureMap
              districts={MOCK_DISTRICTS}
              scoredDistricts={scoredDistricts}
              requests={requests}
              selectedDistrictId={selectedDistrictId}
              onSelectDistrict={setSelectedDistrictId}
              onNavigateToPriority={onNavigateToPriority}
              onNavigateToRecommendations={onNavigateToRecommendations}
            />
          )}
        </div>

        {/* Top Hotspots Side Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Top Critical Hotspots</span>
              </h3>
              <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-semibold border border-rose-200">
                Urgent Action
              </span>
            </div>

            <div className="space-y-2.5">
              {scoredDistricts.slice(0, 5).map((item) => {
                const dist = MOCK_DISTRICTS.find(d => d.id === item.districtId);
                return (
                  <div
                    key={item.districtId}
                    onClick={() => onNavigateToPriority(item.districtId)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                          #{item.rank}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-900">
                          {item.districtName}, {dist?.state}
                        </h4>
                      </div>
                      <span className="font-mono font-bold text-xs text-indigo-950">
                        {item.score} pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Top: <strong className="text-slate-700 capitalize">{dist?.topCategory}</strong></span>
                      <span>Gap: <strong className="text-rose-600">{dist?.infrastructureGaps.composite.toFixed(0)}%</strong></span>
                      <span>₹{dist?.existingPublicInvestmentCr.total} Cr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigateToRecommendations()}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1 transition-colors"
            >
              <span>View Recommended Solutions in AI Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Trend Charts Row (Recharts) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trend 1: Requests Over Time (Area Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Request Volume Surge (Peak Monsoon)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Monthly</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="requests" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend 2: Category Mix (Horizontal Bar Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Category Breakdown (% of Requests)</span>
            </h3>
            <span className="text-[10px] text-slate-400">National</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryMixData.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 40]} unit="%" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={90} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#d97706" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend 3: Channel Mix (Donut Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multimodal Channel Intake</span>
            </h3>
            <span className="text-[10px] text-slate-400">Voice-First</span>
          </div>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {channelMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Demand Hotspot Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Demand Hotspot & Infrastructure Deficit Registry
            </h3>
            <p className="text-xs text-slate-500">
              Filterable multi-criteria ledger prioritizing capital allocations.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district, state, issue..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-48 sm:w-56"
              />
            </div>

            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All States</option>
              {Array.from(new Set(MOCK_DISTRICTS.map(d => d.state))).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="water">Water (JJM)</option>
              <option value="roads">Roads (PMGSY)</option>
              <option value="health">Health (ABHIM)</option>
              <option value="education">Education</option>
              <option value="transport">Transport</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-2.5 px-3">Rank & District</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Top Unmet Need</th>
                <th className="py-2.5 px-3 text-right">Citizen Demand</th>
                <th className="py-2.5 px-3 text-right">Deficit Index</th>
                <th className="py-2.5 px-3 text-right">Existing Outlay</th>
                <th className="py-2.5 px-3 text-center">Priority Score</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDistricts.map((item) => {
                const dist = MOCK_DISTRICTS.find(d => d.id === item.districtId);
                return (
                  <tr key={item.districtId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[11px] text-slate-400 w-6">
                          #{item.rank}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{item.districtName}</div>
                          <div className="text-[10px] text-slate-400">Pop: {(dist?.population || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {dist?.state}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 uppercase">
                        {dist?.topCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                      {item.demandVolume.toLocaleString()} reqs
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-rose-600">
                        {item.gapIndex.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₹{item.allocationCr} Cr
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                        item.score > 75 
                          ? 'bg-rose-100 text-rose-900 border border-rose-300' 
                          : item.score > 60 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        {item.score}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onNavigateToPriority(item.districtId)}
                        className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-0.5 transition-colors"
                      >
                        Tune →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
