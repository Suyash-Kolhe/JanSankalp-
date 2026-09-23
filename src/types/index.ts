export type CategoryType = 
  | 'roads' 
  | 'water' 
  | 'sanitation' 
  | 'electricity' 
  | 'health' 
  | 'education' 
  | 'internet' 
  | 'housing' 
  | 'transport';

export type ChannelType = 'web' | 'voice' | 'whatsapp' | 'sms' | 'telegram';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RequestStatus = 
  | 'Submitted' 
  | 'AI Triaged' 
  | 'Geo-Clustered' 
  | 'Department Assigned' 
  | 'Priority Queue' 
  | 'Sanctioned' 
  | 'Resolved';

export interface CitizenRequest {
  id: string; // e.g. JS-2026-BR-PAT-1042
  timestamp: string;
  originalText: string;
  originalLanguage: string;
  translatedText: string;
  category: CategoryType;
  urgency: UrgencyLevel;
  sentiment: 'Frustrated' | 'Urgent' | 'Neutral' | 'Hopeful';
  channel: ChannelType;
  state: string;
  district: string;
  villageOrWard: string;
  status: RequestStatus;
  upvotes: number;
  schemeAlignment: string; // e.g. "Jal Jeevan Mission"
  lat: number;
  lng: number;
  estimatedBeneficiaries: number;
}

export interface DistrictProfile {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  ruralSharePct: number;
  literacyPct: number;
  vulnerabilityScore: number; // 0 - 100 (high = vulnerable SC/ST/BPL)
  
  // Infrastructure gap indices (0 = perfect, 100 = severe deficit)
  infrastructureGaps: {
    roads: number;
    water: number;
    sanitation: number;
    electricity: number;
    health: number;
    education: number;
    internet: number;
    housing: number;
    transport: number;
    composite: number;
  };

  // Public investment allocations in Crores INR (e.g. PM Gati Shakti, JJM, BharatNet)
  existingPublicInvestmentCr: {
    total: number;
    roads: number;
    water: number;
    health: number;
    broadband: number;
  };

  // Aggregated citizen demand metrics
  requestVolume: number;
  topCategory: CategoryType;
  avgUrgencyScore: number; // 1-4
  digitalPenetrationPct: number; // For fairness & digital divide compensation
  flaggedUnderrepresented?: boolean;
}

export interface PriorityWeights {
  citizenDemand: number;        // w1 (default 0.35)
  infrastructureGap: number;    // w2 (default 0.30)
  vulnerability: number;        // w3 (default 0.25)
  investmentOffset: number;     // w4 (default 0.10)
}

export interface ComputedPriorityScore {
  districtId: string;
  districtName: string;
  state: string;
  category: CategoryType | 'composite';
  score: number; // 0 - 100
  demandComponent: number;
  gapComponent: number;
  vulnerabilityComponent: number;
  investmentDeduction: number;
  rank: number;
  demandVolume: number;
  gapIndex: number;
  allocationCr: number;
}

export interface AIProjectRecommendation {
  id: string;
  title: string;
  district: string;
  state: string;
  category: CategoryType;
  suggestedPriority: 'Critical' | 'High' | 'Medium';
  beneficiariesEstimate: number;
  estimatedCostCr: number;
  alignedSchemes: string[];
  rationale: string;
  risks: string[];
  explainability: {
    citizenDemandCount: number;
    infrastructureGapPct: number;
    vulnerabilityRank: string;
    publicInvestmentGapCr: number;
    aiConfidencePct: number;
  };
}

export interface ImpactInitiative {
  id: string;
  title: string;
  district: string;
  state: string;
  scheme: string;
  completionDate: string;
  beneficiaries: number;
  before: {
    requestVolumeMonthly: number;
    satisfactionScore: number; // 1 - 5
    infrastructureIndex: number; // 0 - 100
  };
  after: {
    requestVolumeMonthly: number;
    satisfactionScore: number;
    infrastructureIndex: number;
  };
  keyOutcome: string;
  dpiIntegration: string; // e.g. "Aadhaar + BharatNet Smart Metering"
}
