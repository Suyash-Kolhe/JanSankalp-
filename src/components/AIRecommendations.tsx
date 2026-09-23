import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Building, 
  Send, 
  Info, 
  ChevronRight, 
  ExternalLink,
  Users,
  IndianRupee,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { AIProjectRecommendation, CategoryType } from '../types';
import { BASELINE_AI_RECOMMENDATIONS } from '../data/mockRecommendations';
import { askPolicyData } from '../services/geminiService';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { RecommendationsProjectMap } from './RecommendationsProjectMap';

interface AIRecommendationsProps {
  currentLang: SupportedLanguage;
  targetDistrictId?: string | null;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ currentLang, targetDistrictId }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [recommendations, setRecommendations] = useState<AIProjectRecommendation[]>(BASELINE_AI_RECOMMENDATIONS);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIProjectRecommendation | null>(null);

  // "Ask the Data" Conversational State
  const [chatQuery, setChatQuery] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: `Namaste! I am the JanSankalp AI Policy Advisor. I am grounded in live citizen demand telemetry, 2026 demographic vulnerability indices, and Ministry capital allocations.\n\nAsk me any natural language question, e.g.:\n- *"Which districts in Bihar lack piped water but have low allocation?"*\n- *"What are the primary infrastructure bottlenecks in Bastar and Koraput?"*\n- *"How is the digital divide skewing reporting in tribal regions?"*`,
      timestamp: 'Ready'
    }
  ]);

  const presetQueries = [
    'Which districts in Bihar lack piped water but have low allocation?',
    'Identify top 3 road connectivity priorities in tribal belts',
    'How does digital divide affect citizen reporting in Bastar vs Patna?',
    'What are the highest-urgency healthcare needs in aspirational districts?'
  ];

  const handleAsk = async (queryText?: string) => {
    const q = queryText || chatQuery;
    if (!q.trim() || isAsking) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { sender: 'user', text: q, timestamp: time }]);
    if (!queryText) setChatQuery('');
    setIsAsking(true);

    try {
      const response = await askPolicyData(q);
      setChatHistory(prev => [...prev, {
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Ask data error:', err);
      setChatHistory(prev => [...prev, {
        sender: 'ai',
        text: 'Sorry, unable to process query at this time. Please retry.',
        timestamp: 'Error'
      }]);
    } finally {
      setIsAsking(false);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedFilterCategory === 'all') return true;
    return rec.category === selectedFilterCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Synthesized National Project Pipeline • Powered by Gemini 3.8</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Prioritized Infrastructure Recommendations
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Top 10 strategic interventions mathematically ranked and articulated from 18,420+ citizen requests and national ministry mission roadmaps.
          </p>
        </div>
      </div>

      {/* Geospatial Project Pipeline Distribution Map (Leaflet) */}
      <RecommendationsProjectMap
        recommendations={filteredRecommendations}
        selectedRecommendationId={selectedRecommendation?.id || null}
        onSelectRecommendation={(rec) => {
          setSelectedRecommendation(rec);
          window.scrollTo({ top: 480, behavior: 'smooth' });
        }}
      />

      {/* Main Grid: Projects List (8 cols) + "Ask the Data" Chat Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top 10 Project Recommendations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Top Recommended Capital Projects
              </h2>
              <span className="text-[11px] text-slate-500">
                Grounded in empirical citizen filings & deficit indices
              </span>
            </div>

            {/* Category Filter */}
            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Sectors ({recommendations.length})</option>
              <option value="water">Drinking Water</option>
              <option value="roads">Roads & Bridges</option>
              <option value="health">Healthcare Facilities</option>
              <option value="education">Schools & Education</option>
              <option value="housing">Resilient Housing</option>
              <option value="transport">Transit & Connectivity</option>
            </select>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredRecommendations.map((project, idx) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                {/* Header: Title + Priority Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-600 flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-indigo-950">
                        {project.district}, {project.state}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 uppercase border border-indigo-200">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                    project.suggestedPriority === 'Critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : project.suggestedPriority === 'High'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {project.suggestedPriority} Priority
                  </span>
                </div>

                {/* Rationale */}
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {project.rationale}
                </p>

                {/* Metrics Row: Beneficiaries + Cost + Schemes */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-3 text-slate-600 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      {project.beneficiariesEstimate.toLocaleString()} Beneficiaries
                    </span>
                    <span className="flex items-center gap-0.5 font-semibold text-slate-800">
                      ₹{project.estimatedCostCr} Cr Outlay
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedRecommendation(project)}
                      className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold border border-indigo-200 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Explain Recommendation</span>
                    </button>
                  </div>
                </div>

                {/* Aligned Schemes */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Schemes:</span>
                  {project.alignedSchemes.map((scheme, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200"
                    >
                      {scheme}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: "Ask the Data" Chat Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[740px] sticky top-24 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs">Ask the Data (Policy AI)</h3>
                <span className="text-[10px] text-slate-300">Natural Language Telemetry Query Engine</span>
              </div>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-amber-300">
              Gemini 3.8 Flash
            </span>
          </div>

          {/* Preset Prompts Chips */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Suggested Prompts</span>
            <div className="flex flex-wrap gap-1.5">
              {presetQueries.map((pq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(pq)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-900 text-left transition-colors"
                >
                  {pq}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            {isAsking && (
              <div className="flex items-center space-x-2 text-xs text-indigo-900 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 animate-pulse">
                <div className="w-3 h-3 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                <span>Gemini is synthesizing cross-district telemetry...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="e.g. Which districts in Bihar lack piped water..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleAsk()}
              disabled={isAsking || !chatQuery.trim()}
              className="p-2 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* "Explain this Recommendation" Modal (Explainability Audit Trail) */}
      {selectedRecommendation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-900 uppercase">Explainability Audit Trail</span>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {selectedRecommendation.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 space-y-1">
                <span className="font-bold text-indigo-950 block">AI Reasoning Transparency</span>
                <p className="text-indigo-900 leading-relaxed">
                  This project was prioritized based on empirical triangulation between citizen request density, physical deficit metrics, and census vulnerability indicators.
                </p>
              </div>

              {/* Exact Data Points Used */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Citizen Filings</span>
                  <span className="font-mono text-base font-extrabold text-slate-900">
                    {selectedRecommendation.explainability.citizenDemandCount.toLocaleString()} requests
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Physical Gap Index</span>
                  <span className="font-mono text-base font-extrabold text-rose-600">
                    {selectedRecommendation.explainability.infrastructureGapPct}% Deficit
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Census Vulnerability</span>
                  <span className="font-semibold text-slate-800">
                    {selectedRecommendation.explainability.vulnerabilityRank}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Capital Deficit</span>
                  <span className="font-mono text-base font-extrabold text-amber-700">
                    ₹{selectedRecommendation.explainability.publicInvestmentGapCr} Cr Unfunded
                  </span>
                </div>
              </div>

              {/* Implementation Risks */}
              <div>
                <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1 text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Identified Execution Risks & Mitigation Notes:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {selectedRecommendation.risks.map((risk, rIdx) => (
                    <li key={rIdx}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Gemini Verification Confidence: {selectedRecommendation.explainability.aiConfidencePct}%
                </span>
                <span>DPG Explainability Compliant</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedRecommendation(null)}
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
