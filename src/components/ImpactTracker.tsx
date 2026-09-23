import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Award, 
  Layers, 
  Cpu, 
  Activity,
  FileCheck,
  Building2,
  Users
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { MOCK_IMPACT_INITIATIVES } from '../data/mockImpact';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { ImpactProjectsMap } from './ImpactProjectsMap';

interface ImpactTrackerProps {
  currentLang: SupportedLanguage;
}

export const ImpactTracker: React.FC<ImpactTrackerProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string>(MOCK_IMPACT_INITIATIVES[0].id);

  const selectedInitiative = MOCK_IMPACT_INITIATIVES.find(i => i.id === selectedInitiativeId) || MOCK_IMPACT_INITIATIVES[0];

  const beforeAfterChartData = MOCK_IMPACT_INITIATIVES.map(init => ({
    name: init.district,
    beforeComplaints: init.before.requestVolumeMonthly,
    afterComplaints: init.after.requestVolumeMonthly,
    beforeScore: init.before.satisfactionScore,
    afterScore: init.after.satisfactionScore,
    beforeIndex: init.before.infrastructureIndex,
    afterIndex: init.after.infrastructureIndex,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold border border-white/10">
          <Award className="w-3.5 h-3.5" />
          <span>Post-Implementation Evaluation & DPI Outcomes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          National Infrastructure Impact Tracker
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl">
          Empirical before-and-after audit measuring grievance reduction, citizen satisfaction leaps, and digital public infrastructure saturation across completed interventions.
        </p>
      </div>

      {/* Aggregate DPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Grievance Drop</span>
          <div className="text-2xl font-black text-emerald-700 flex items-center gap-1">
            <ArrowDownRight className="w-6 h-6 text-emerald-600" />
            <span>−78.4%</span>
          </div>
          <span className="text-[10px] text-slate-400">Post project commissioning</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Citizen CSAT Leap</span>
          <div className="text-2xl font-black text-indigo-900 flex items-center gap-1">
            <ArrowUpRight className="w-6 h-6 text-indigo-600" />
            <span>2.0 → 4.6</span>
          </div>
          <span className="text-[10px] text-slate-400">Out of 5.0 scale</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Aadhaar DPI Auth</span>
          <div className="text-2xl font-black text-slate-900">96.8%</div>
          <span className="text-[10px] text-emerald-600 font-medium">Direct benefit verification</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">BharatNet IoT Uptime</span>
          <div className="text-2xl font-black text-sky-700">98.9%</div>
          <span className="text-[10px] text-slate-400">24x7 smart sensor link</span>
        </div>
      </div>

      {/* Before / After Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Grievance Volume Collapse (Monthly Complaints Before vs After) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Monthly Grievance Filings: Before vs After Commissioning
            </h3>
            <p className="text-xs text-slate-500">
              Measured citizen complaint volume drop per district.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beforeAfterChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="beforeComplaints" name="Before Project (Monthly)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="afterComplaints" name="After Commissioning" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Infrastructure Quality Index Jump */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Physical Infrastructure Saturation Index (0 - 100)
            </h3>
            <p className="text-xs text-slate-500">
              Verified ground serviceability jump measured post-commissioning.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beforeAfterChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="beforeIndex" name="Baseline Index (Before)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="afterIndex" name="Commissioned Index (After)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Geospatial Audit Map of Completed Projects (Leaflet) */}
      <ImpactProjectsMap
        initiatives={MOCK_IMPACT_INITIATIVES}
        selectedInitiativeId={selectedInitiativeId}
        onSelectInitiative={setSelectedInitiativeId}
      />

      {/* Deep-Dive Initiative Case Study Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            DPI-Enabled Commissioned Case Studies
          </h3>
          <p className="text-xs text-slate-500">
            Click on any completed project to review telemetry, citizen CSAT change, and DPI architecture.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {MOCK_IMPACT_INITIATIVES.map((init) => (
            <button
              key={init.id}
              onClick={() => setSelectedInitiativeId(init.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedInitiative.id === init.id
                  ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {init.district}: {init.title.slice(0, 32)}...
            </button>
          ))}
        </div>

        {/* Selected Initiative Showcase Card */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Completed Initiative • Commissioned {selectedInitiative.completionDate}</span>
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">
                {selectedInitiative.title}
              </h4>
              <p className="text-xs text-slate-600">
                Location: <strong>{selectedInitiative.district}, {selectedInitiative.state}</strong> • Scheme: <strong>{selectedInitiative.scheme}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-800 shadow-xs">
                {selectedInitiative.beneficiaries.toLocaleString()} Citizens Served
              </span>
            </div>
          </div>

          {/* 3 Metric Cards for this initiative */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Citizen Complaints</span>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-slate-400 line-through text-sm">
                  {selectedInitiative.before.requestVolumeMonthly}
                </span>
                <span className="font-mono text-emerald-700 font-bold text-lg">
                  {selectedInitiative.after.requestVolumeMonthly}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  (−{Math.round(((selectedInitiative.before.requestVolumeMonthly - selectedInitiative.after.requestVolumeMonthly) / selectedInitiative.before.requestVolumeMonthly) * 100)}%)
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Citizen Satisfaction (CSAT)</span>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-slate-400 line-through text-sm">
                  {selectedInitiative.before.satisfactionScore} / 5
                </span>
                <span className="font-mono text-indigo-900 font-bold text-lg">
                  {selectedInitiative.after.satisfactionScore} / 5
                </span>
                <span className="text-[10px] font-bold text-indigo-600">
                  (+{(selectedInitiative.after.satisfactionScore - selectedInitiative.before.satisfactionScore).toFixed(1)})
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Infrastructure Index</span>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-slate-400 line-through text-sm">
                  {selectedInitiative.before.infrastructureIndex}%
                </span>
                <span className="font-mono text-sky-800 font-bold text-lg">
                  {selectedInitiative.after.infrastructureIndex}%
                </span>
                <span className="text-[10px] font-bold text-sky-600">
                  (+{selectedInitiative.after.infrastructureIndex - selectedInitiative.before.infrastructureIndex} pts)
                </span>
              </div>
            </div>
          </div>

          {/* Outcome & DPI Architecture Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Ground Reality Impact</span>
              <p className="text-slate-600 leading-relaxed">
                {selectedInitiative.keyOutcome}
              </p>
            </div>

            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs space-y-1">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-700" />
                DPI (Digital Public Infrastructure) Linkage
              </span>
              <p className="text-indigo-900 leading-relaxed font-mono text-[11px]">
                {selectedInitiative.dpiIntegration}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
