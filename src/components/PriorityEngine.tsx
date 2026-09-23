import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  Info, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  FileText, 
  CheckCircle, 
  ShieldAlert, 
  ExternalLink,
  Layers,
  Database
} from 'lucide-react';
import { CategoryType, PriorityWeights, ComputedPriorityScore, DistrictProfile } from '../types';
import { MOCK_DISTRICTS } from '../data/mockDistricts';
import { calculateDistrictPriorities } from '../utils/priorityCalculator';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { PrioritySimulationMap } from './PrioritySimulationMap';

interface PriorityEngineProps {
  currentLang: SupportedLanguage;
  onNavigateToRecommendations: (districtId?: string) => void;
  preselectedDistrictId?: string | null;
}

export const PriorityEngine: React.FC<PriorityEngineProps> = ({
  currentLang,
  onNavigateToRecommendations,
  preselectedDistrictId
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Weight Sliders
  const [weights, setWeights] = useState<PriorityWeights>({
    citizenDemand: 0.35,
    infrastructureGap: 0.30,
    vulnerability: 0.25,
    investmentOffset: 0.10,
  });

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'composite'>('composite');
  const [inspectedDistrictId, setInspectedDistrictId] = useState<string | null>(preselectedDistrictId || null);
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);

  // Baseline scores to compute rank change (delta)
  const baselineScores = useMemo(() => {
    return calculateDistrictPriorities(MOCK_DISTRICTS, {
      citizenDemand: 0.35,
      infrastructureGap: 0.30,
      vulnerability: 0.25,
      investmentOffset: 0.10,
    }, selectedCategory);
  }, [selectedCategory]);

  // Current scores based on active sliders
  const currentScores = useMemo(() => {
    return calculateDistrictPriorities(MOCK_DISTRICTS, weights, selectedCategory);
  }, [weights, selectedCategory]);

  const presetProfiles = [
    {
      name: 'Balanced National Standard',
      desc: 'Cabinet-approved balanced weighting across all criteria',
      weights: { citizenDemand: 0.35, infrastructureGap: 0.30, vulnerability: 0.25, investmentOffset: 0.10 }
    },
    {
      name: 'Citizen Crisis (Demand-First)',
      desc: 'Prioritizes acute grievances and immediate public distress',
      weights: { citizenDemand: 0.60, infrastructureGap: 0.20, vulnerability: 0.15, investmentOffset: 0.05 }
    },
    {
      name: 'Aspirational Tribal Focus',
      desc: 'Weights marginalized demographics and remote connectivity deficit',
      weights: { citizenDemand: 0.20, infrastructureGap: 0.25, vulnerability: 0.45, investmentOffset: 0.10 }
    },
    {
      name: 'Greenfield Infrastructure Deficit',
      desc: 'Focuses heavily on unserviced physical gaps regardless of population',
      weights: { citizenDemand: 0.15, infrastructureGap: 0.55, vulnerability: 0.15, investmentOffset: 0.15 }
    }
  ];

  const inspectedDistrict = MOCK_DISTRICTS.find(d => d.id === (inspectedDistrictId || currentScores[0]?.districtId));
  const inspectedScore = currentScores.find(s => s.districtId === (inspectedDistrictId || currentScores[0]?.districtId));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Formula Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold border border-white/10 mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Transparent Algorithmic Governance • No Black Box</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              National Infrastructure Priority Engine
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Dynamically computes transparent composite scores combining 4 national datasets: Citizen Demands, Demographics (Census), Infrastructure Indices, and Public Capital Outlays.
            </p>
          </div>

          <button
            onClick={() => setShowFormulaModal(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center space-x-2 transition-all self-start sm:self-center"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span>Audit Mathematical Formula</span>
          </button>
        </div>

        {/* Live Mathematical Formula Visualization */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl font-mono text-xs text-amber-200/90 overflow-x-auto">
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-white font-bold">Priority Score =</span>
            <span className="text-amber-300">({weights.citizenDemand.toFixed(2)} × Demand)</span>
            <span className="text-white">+</span>
            <span className="text-emerald-300">({weights.infrastructureGap.toFixed(2)} × Gap Index)</span>
            <span className="text-white">+</span>
            <span className="text-sky-300">({weights.vulnerability.toFixed(2)} × Vulnerability)</span>
            <span className="text-white">−</span>
            <span className="text-rose-300">({weights.investmentOffset.toFixed(2)} × Existing Investment)</span>
          </div>
        </div>
      </div>

      {/* Preset Buttons & Category Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Presets */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Policy Presets</span>
          <div className="flex flex-wrap gap-2">
            {presetProfiles.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setWeights(p.weights)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  JSON.stringify(weights) === JSON.stringify(p.weights)
                    ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={p.desc}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sector Category Toggle */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Sector Filter</span>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="composite">Composite (All Sectors)</option>
              <option value="water">Drinking Water (Jal Jeevan Mission)</option>
              <option value="roads">Road Connectivity (PMGSY)</option>
              <option value="health">Health Infrastructure (PM-ABHIM)</option>
              <option value="electricity">Power & Solar (PM-KUSUM)</option>
              <option value="internet">Digital Broadband (BharatNet)</option>
              <option value="education">Education (PM SHRI)</option>
              <option value="sanitation">Sanitation (Swachh Bharat)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Weight Sliders (4 Sliders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Slider 1: Citizen Demand */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">w1: Citizen Demand</span>
            <span className="font-mono text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              {weights.citizenDemand.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights.citizenDemand}
            onChange={(e) => setWeights({ ...weights, citizenDemand: parseFloat(e.target.value) })}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            Citizen volume, urgency levels, and repeated grievance intensity.
          </p>
        </div>

        {/* Slider 2: Infrastructure Gap */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">w2: Infrastructure Gap</span>
            <span className="font-mono text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {weights.infrastructureGap.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights.infrastructureGap}
            onChange={(e) => setWeights({ ...weights, infrastructureGap: parseFloat(e.target.value) })}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            Physical deficit index in roads, tap water, power, and broadband.
          </p>
        </div>

        {/* Slider 3: Vulnerability & Demographics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">w3: Vulnerability & Census</span>
            <span className="font-mono text-sm font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
              {weights.vulnerability.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights.vulnerability}
            onChange={(e) => setWeights({ ...weights, vulnerability: parseFloat(e.target.value) })}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            SC/ST %, poverty ratio, remote rural share, and female literacy.
          </p>
        </div>

        {/* Slider 4: Existing Investment Offset */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">w4: Investment Deduction</span>
            <span className="font-mono text-sm font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              {weights.investmentOffset.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights.investmentOffset}
            onChange={(e) => setWeights({ ...weights, investmentOffset: parseFloat(e.target.value) })}
            className="w-full accent-rose-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            Prioritizes capital-starved zones over already heavily funded districts.
          </p>
        </div>
      </div>

      {/* Live Geospatial Priority Sensitivity Simulation Map (Free Leaflet) */}
      <PrioritySimulationMap
        scoredDistricts={currentScores}
        selectedDistrictId={inspectedDistrictId}
        onSelectDistrict={(id) => {
          setInspectedDistrictId(id);
        }}
      />

      {/* Main Two-Column View: Ranking Table (Left) + Detailed District Inspection Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Ranking Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Live Re-Ranked Priority Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Updates in real-time as you tweak slider weights. Click any row to inspect datasets.
              </p>
            </div>
            <button
              onClick={() => setWeights({ citizenDemand: 0.35, infrastructureGap: 0.30, vulnerability: 0.25, investmentOffset: 0.10 })}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Rank & Shift</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-right">Demand</th>
                  <th className="py-2.5 px-3 text-right">Gap %</th>
                  <th className="py-2.5 px-3 text-right">Allocation</th>
                  <th className="py-2.5 px-3 text-center">Priority Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentScores.map((item) => {
                  const baselineRank = baselineScores.find(b => b.districtId === item.districtId)?.rank || item.rank;
                  const rankDiff = baselineRank - item.rank;
                  const isSelected = item.districtId === inspectedDistrict?.id;

                  return (
                    <tr
                      key={item.districtId}
                      onClick={() => setInspectedDistrictId(item.districtId)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/80 font-medium' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-xs text-slate-900 w-5">
                            #{item.rank}
                          </span>
                          {rankDiff > 0 ? (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center" title={`Moved up ${rankDiff} ranks`}>
                              <ArrowUp className="w-3 h-3" /> {rankDiff}
                            </span>
                          ) : rankDiff < 0 ? (
                            <span className="text-[10px] font-bold text-rose-500 flex items-center" title={`Moved down ${Math.abs(rankDiff)} ranks`}>
                              <ArrowDown className="w-3 h-3" /> {Math.abs(rankDiff)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-300">
                              <Minus className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{item.districtName}</div>
                        <div className="text-[10px] text-slate-500">{item.state}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        {item.demandVolume.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-600">
                        {item.gapIndex.toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        ₹{item.allocationCr} Cr
                      </td>
                      <td className="py-2.5 px-3 text-center">
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Combined Datasets Inspection Drawer (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          {inspectedDistrict && inspectedScore ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                    District Dataset Audit
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {inspectedDistrict.name}, {inspectedDistrict.state}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Current Rank</span>
                  <span className="font-mono text-lg font-extrabold text-indigo-950">
                    #{inspectedScore.rank} ({inspectedScore.score} pts)
                  </span>
                </div>
              </div>

              {/* 4 Underlying Datasets Breakdown */}
              <div className="space-y-3">
                {/* Dataset 1: Citizen Demand */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      1. Citizen Demand Registry
                    </span>
                    <span className="font-mono">{inspectedDistrict.requestVolume.toLocaleString()} filings</span>
                  </div>
                  <div className="text-[11px] text-amber-900 flex justify-between">
                    <span>Avg Urgency: {inspectedDistrict.avgUrgencyScore} / 4.0</span>
                    <span>Top Need: <strong className="capitalize">{inspectedDistrict.topCategory}</strong></span>
                  </div>
                  {inspectedDistrict.flaggedUnderrepresented && (
                    <div className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded font-medium mt-1">
                      ⚠️ Low digital penetration ({inspectedDistrict.digitalPenetrationPct}%). Digital Divide Multiplier applied.
                    </div>
                  )}
                </div>

                {/* Dataset 2: Demographics (Census) */}
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-sky-950">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-sky-700" />
                      2. Census Demographics
                    </span>
                    <span className="font-mono">{inspectedDistrict.population.toLocaleString()} pop</span>
                  </div>
                  <div className="text-[11px] text-sky-900 grid grid-cols-2 gap-2 pt-1">
                    <span>Rural Share: <strong>{inspectedDistrict.ruralSharePct}%</strong></span>
                    <span>Literacy: <strong>{inspectedDistrict.literacyPct}%</strong></span>
                    <span className="col-span-2">Vulnerability Score: <strong>{inspectedDistrict.vulnerabilityScore} / 100</strong></span>
                  </div>
                </div>

                {/* Dataset 3: Infrastructure Gaps */}
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-rose-950">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-rose-700" />
                      3. Physical Infrastructure Deficit
                    </span>
                    <span className="font-mono font-bold text-rose-600">
                      {inspectedDistrict.infrastructureGaps.composite.toFixed(1)}% Gap
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-rose-900 pt-1">
                    <div>Water: <strong>{inspectedDistrict.infrastructureGaps.water}%</strong></div>
                    <div>Roads: <strong>{inspectedDistrict.infrastructureGaps.roads}%</strong></div>
                    <div>Health: <strong>{inspectedDistrict.infrastructureGaps.health}%</strong></div>
                    <div>Power: <strong>{inspectedDistrict.infrastructureGaps.electricity}%</strong></div>
                    <div>Fiber: <strong>{inspectedDistrict.infrastructureGaps.internet}%</strong></div>
                    <div>Sanitation: <strong>{inspectedDistrict.infrastructureGaps.sanitation}%</strong></div>
                  </div>
                </div>

                {/* Dataset 4: Public Investments (Allocations) */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      4. Public Investment Plans
                    </span>
                    <span className="font-mono font-bold text-emerald-700">
                      ₹{inspectedDistrict.existingPublicInvestmentCr.total} Cr Total
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-900 flex justify-between pt-1">
                    <span>Roads: ₹{inspectedDistrict.existingPublicInvestmentCr.roads} Cr</span>
                    <span>Water: ₹{inspectedDistrict.existingPublicInvestmentCr.water} Cr</span>
                    <span>Health: ₹{inspectedDistrict.existingPublicInvestmentCr.health} Cr</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Jump to AI Recommendations for this district */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToRecommendations(inspectedDistrict.id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Synthesize AI Recommendations for {inspectedDistrict.name} →</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a district row to audit its datasets.
            </div>
          )}
        </div>
      </div>

      {/* Audit Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                JanSankalp Priority Formula Specification
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <p>
                <strong>Mathematical Formulation:</strong><br/>
                <code>Score = [w1·D + w2·G + w3·V − w4·I] / (w1 + w2 + w3)</code>
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>D (Demand Density):</strong> Aggregated citizen filings normalized to 0-100. Incorporates the Digital Divide Multiplier to avoid penalizing low-connectivity rural zones.</li>
                <li><strong>G (Infrastructure Deficit):</strong> Standardized sector gap metric derived from Ministry MIS portals.</li>
                <li><strong>V (Demographic Vulnerability):</strong> Normalized index based on Census indicators (SC/ST population, rural share %, female literacy).</li>
                <li><strong>I (Public Capital Offset):</strong> Total central and state scheme outlays (PM Gati Shakti, Jal Jeevan Mission, PMGSY, BharatNet). High existing investment reduces score to avoid duplicate funding.</li>
              </ul>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-medium border border-emerald-200">
                ✅ Certified Digital Public Good standard: Fully auditable, open source, and deterministic. No opaque black-box machine learning in final funding ranking.
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-900 text-white text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
