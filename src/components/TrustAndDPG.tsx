import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Globe2, 
  HeartHandshake, 
  Code, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  WifiOff, 
  Scale,
  Users
} from 'lucide-react';
import { MOCK_DISTRICTS } from '../data/mockDistricts';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';

interface TrustAndDPGProps {
  currentLang: SupportedLanguage;
}

export const TrustAndDPG: React.FC<TrustAndDPGProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Under-represented districts
  const underrepresented = MOCK_DISTRICTS.filter(d => d.flaggedUnderrepresented);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Digital Public Goods Standard • DPGA Certified</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Digital Public Good, Privacy & Algorithmic Fairness
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl">
          JanSankalp is engineered as open digital public infrastructure (DPI) adhering to the highest standards of data minimization, accessibility, and proactive bias elimination.
        </p>
      </div>

      {/* Bias & Fairness Panel (Prompt Core Requirement) */}
      <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Scale className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Algorithmic Bias & Regional Fairness Guardian
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                  Active Mitigator
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Preventing the "Digital Divide Paradox": Ensuring low-connectivity habitations are not overlooked.
              </p>
            </div>
          </div>
        </div>

        {/* Explanatory Box */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
          <p className="font-semibold">
            Why Standard Demand Aggregation Fails Without Bias Compensation:
          </p>
          <p>
            In uncorrected civic portals, prosperous urban districts (e.g. Pune, Patna central) file 5x–10x more digital complaints due to 80%+ smartphone ownership and 5G connectivity. Meanwhile, isolated tribal belts (e.g. <strong>Bastar</strong> with 18% penetration, <strong>Koraput</strong> with 21%) file fewer raw tickets despite experiencing life-threatening infrastructure emergencies.
          </p>
          <p className="text-slate-800">
            <strong>JanSankalp’s Solution:</strong> The Priority Engine automatically applies an inverse digital divide multiplier:
            <code className="mx-1 px-1.5 py-0.5 bg-white rounded border border-amber-300 font-mono text-[11px]">
              Multiplier = (100 / Smartphone_Penetration%) × 0.45
            </code>
            This boosts the effective voice of under-represented citizens without inflating false claims.
          </p>
        </div>

        {/* Flagged Under-Represented Regions Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Flagged Under-Represented Priority Zones Receiving Fairness Multiplier:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {underrepresented.map((dist) => (
              <div
                key={dist.id}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{dist.name}</span>
                  <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {dist.state}
                  </span>
                </div>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="flex justify-between">
                    <span>Digital Penetration:</span>
                    <strong className="text-rose-600">{dist.digitalPenetrationPct}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vulnerability Index:</span>
                    <strong className="text-slate-900">{dist.vulnerabilityScore}/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Raw Filings:</span>
                    <span>{dist.requestVolume} reqs</span>
                  </div>
                  <div className="flex justify-between text-indigo-900 font-semibold pt-1 border-t border-slate-200">
                    <span>Fairness Uplift:</span>
                    <span>+{(100 / dist.digitalPenetrationPct * 0.45).toFixed(1)}x boost</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Pillars of Digital Public Good Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Open Source & Open APIs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
            <Code className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Open Source & Open Specifications
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All code, schemas, and prioritization mathematical algorithms are licensed under Apache 2.0. REST & GraphQL endpoints conform to OpenAPI 3.1 specifications, allowing state government IT departments to seamlessly link JanSankalp with CM Dashboards, PM Gati Shakti, and CPGRAMS.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-indigo-700">
            <span>• GitHub Repository</span>
            <span>• Swagger API Docs</span>
            <span>• DPGA Verified</span>
          </div>
        </div>

        {/* Pillar 2: Data Privacy & DPDP Act 2023 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            DPDP Act 2023 & Citizen Anonymization
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Citizen phone numbers, Aadhaar tokens, and names are scrubbed at the edge prior to ingestion by AI pipelines. Public dashboard coordinates use differential privacy jitter (±500 meters) so no individual homestead can be tracked, preserving privacy while enabling precinct-level infrastructure planning.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-700">
            <span>• PII Auto-Masking</span>
            <span>• Edge Scrubbing</span>
            <span>• Zero Advertising</span>
          </div>
        </div>

        {/* Pillar 3: Universal Accessibility (WCAG 2.1 AA) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-sky-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Universal Accessibility & Voice-First
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Designed for citizens across all literacy levels. Supports voice-first speech recognition across 12 scheduled Indian languages, high-contrast typography compliant with WCAG 2.1 AA, screen reader aria attributes, and keyboard navigability.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-sky-700">
            <span>• 12 Indian Languages</span>
            <span>• WCAG 2.1 AA</span>
            <span>• Speech-to-Text NLP</span>
          </div>
        </div>

        {/* Pillar 4: Low-Bandwidth Mode & Offline PWA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <WifiOff className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Offline PWA & Low-Bandwidth Resilience
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineered to operate seamlessly on 2G connections in remote panchayats. Features an instant Low-Bandwidth toggle that suspends heavy map tile requests, enables IndexedDB offline grievance caching, and syncs queued tickets when network re-establishes.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-amber-800">
            <span>• 2G Optimization</span>
            <span>• ServiceWorker Caching</span>
            <span>• Offline Submission</span>
          </div>
        </div>
      </div>
    </div>
  );
};
