/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CitizenPortal } from './components/CitizenPortal';
import { PolicymakerDashboard } from './components/PolicymakerDashboard';
import { PriorityEngine } from './components/PriorityEngine';
import { AIRecommendations } from './components/AIRecommendations';
import { ImpactTracker } from './components/ImpactTracker';
import { TrustAndDPG } from './components/TrustAndDPG';
import { SEEDED_CITIZEN_REQUESTS } from './data/mockRequests';
import { CitizenRequest } from './types';
import { SupportedLanguage } from './data/translations';
import { ShieldCheck, HeartHandshake, Globe } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('hi');
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);
  const [requests, setRequests] = useState<CitizenRequest[]>(SEEDED_CITIZEN_REQUESTS);
  const [targetDistrictId, setTargetDistrictId] = useState<string | null>(null);

  const handleAddRequest = (newReq: CitizenRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  const navigateToPriority = (districtId?: string) => {
    if (districtId) {
      setTargetDistrictId(districtId);
    }
    setCurrentTab('priority');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToRecommendations = (districtId?: string) => {
    if (districtId) {
      setTargetDistrictId(districtId);
    }
    setCurrentTab('recommendations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Universal Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        lowBandwidth={lowBandwidth}
        setLowBandwidth={setLowBandwidth}
      />

      {/* Main Module Content */}
      <main className="flex-1">
        {currentTab === 'citizen' && (
          <CitizenPortal
            currentLang={currentLang}
            onAddRequest={handleAddRequest}
          />
        )}

        {currentTab === 'dashboard' && (
          <PolicymakerDashboard
            requests={requests}
            currentLang={currentLang}
            onNavigateToPriority={navigateToPriority}
            onNavigateToRecommendations={navigateToRecommendations}
            lowBandwidth={lowBandwidth}
          />
        )}

        {currentTab === 'priority' && (
          <PriorityEngine
            currentLang={currentLang}
            onNavigateToRecommendations={navigateToRecommendations}
            preselectedDistrictId={targetDistrictId}
          />
        )}

        {currentTab === 'recommendations' && (
          <AIRecommendations
            currentLang={currentLang}
            targetDistrictId={targetDistrictId}
          />
        )}

        {currentTab === 'impact' && (
          <ImpactTracker
            currentLang={currentLang}
          />
        )}

        {currentTab === 'trust' && (
          <TrustAndDPG
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Universal DPG Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-900 flex items-center justify-center font-bold text-white text-sm">
              JS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">JanSankalp (जनसंकल्प)</span>
                <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                  DPG Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                National Multilingual Citizen Demand Aggregator & Priority Engine for India
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <button onClick={() => setCurrentTab('trust')} className="hover:text-white transition-colors">
              Privacy & DPDP Act
            </button>
            <button onClick={() => setCurrentTab('trust')} className="hover:text-white transition-colors">
              Bias & Fairness Policy
            </button>
            <button onClick={() => setCurrentTab('trust')} className="hover:text-white transition-colors">
              Open API Spec
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Demo Prototype • Real Data Grounding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
