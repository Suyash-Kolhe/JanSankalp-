import { AIProjectRecommendation } from '../types';

export const BASELINE_AI_RECOMMENDATIONS: AIProjectRecommendation[] = [
  {
    id: 'REC-01',
    title: 'Solar-Powered Micro Water Supply & Multi-Village RO Treatment Grids',
    district: 'Patna',
    state: 'Bihar',
    category: 'water',
    suggestedPriority: 'Critical',
    beneficiariesEstimate: 142000,
    estimatedCostCr: 125,
    alignedSchemes: ['Jal Jeevan Mission (JJM)', 'PM-KUSUM Component C'],
    rationale: 'Patna records 2,430 citizen demand filings with 78% infrastructure deficit index in drinking water. Despite being a major district, rural perimeters suffer acute arsenic and seasonal microbial contamination with 110 Cr low allocation relative to population.',
    risks: [
      'Monsoon flood waterlogging delaying trenching operations',
      'Groundwater depletion requiring deeper exploratory drilling',
      'Panchayat operations & maintenance training gaps'
    ],
    explainability: {
      citizenDemandCount: 2430,
      infrastructureGapPct: 78,
      vulnerabilityRank: 'High (78/100, 56.9% rural)',
      publicInvestmentGapCr: 185,
      aiConfidencePct: 96
    }
  },
  {
    id: 'REC-02',
    title: 'Tribal Belt Primary Healthcare Modernization & Solar Cold-Chain Network',
    district: 'Bastar',
    state: 'Chhattisgarh',
    category: 'health',
    suggestedPriority: 'Critical',
    beneficiariesEstimate: 85000,
    estimatedCostCr: 68,
    alignedSchemes: ['Ayushman Bharat PM-ABHIM', 'National Health Mission (Tribal Sub-Plan)'],
    rationale: 'Highest vulnerability score in dataset (92/100) and 91% health gap index. While request volume is artificially muted (920 requests) due to 18% digital penetration, urgency is maximum (3.8/4.0) with maternal transport distances exceeding 40km.',
    risks: [
      'Challenging forested terrain and left-wing extremism legacy sensitivities',
      'Specialist doctor retention in remote tribal talukas',
      'Uninterrupted optical fiber connectivity for tele-medicine'
    ],
    explainability: {
      citizenDemandCount: 920,
      infrastructureGapPct: 91,
      vulnerabilityRank: 'Severe (92/100, 86.2% rural)',
      publicInvestmentGapCr: 145,
      aiConfidencePct: 98
    }
  },
  {
    id: 'REC-03',
    title: 'All-Weather High-Level River Bridges & Village Arterial Corridors',
    district: 'Koraput',
    state: 'Odisha',
    category: 'roads',
    suggestedPriority: 'Critical',
    beneficiariesEstimate: 98000,
    estimatedCostCr: 94,
    alignedSchemes: ['PMGSY-IV Special Focus', 'PM Gati Shakti Multi-Modal Logistics'],
    rationale: '84% road deficit index compounded by hilly river gorges that isolate 60+ tribal habitations every monsoon. Lowest public investment allocation in region (195 Cr total), with extreme vulnerability score of 94/100.',
    risks: [
      'Heavy torrential monsoons shortening construction working season to 5 months',
      'Forest and environmental clearances for hill road cutting',
      'Local tribal consensus on right-of-way alignment'
    ],
    explainability: {
      citizenDemandCount: 780,
      infrastructureGapPct: 84,
      vulnerabilityRank: 'Severe (94/100, 49.2% literacy)',
      publicInvestmentGapCr: 110,
      aiConfidencePct: 95
    }
  },
  {
    id: 'REC-04',
    title: 'Deep Desert Piped Canal Water Network & Brackish Fluorosis Remediation',
    district: 'Barmer',
    state: 'Rajasthan',
    category: 'water',
    suggestedPriority: 'High',
    beneficiariesEstimate: 165000,
    estimatedCostCr: 180,
    alignedSchemes: ['Jal Jeevan Mission Desert Sub-Plan', 'Atal Bhujal Yojana'],
    rationale: 'Highest water gap index in nation at 96%, with extreme urgency rating (3.9/4.0). Citizen requests cite saline water ingestion causing severe bone fluorosis across 14 tehsil clusters.',
    risks: [
      'Extensive distance between dispersed desert dhanis driving up per-capita pipe cost',
      'Sand shifting dunes causing physical strain on underground HDPE pipelines',
      'High electricity cost for booster pumping stations'
    ],
    explainability: {
      citizenDemandCount: 1490,
      infrastructureGapPct: 96,
      vulnerabilityRank: 'High (81/100, 93% rural)',
      publicInvestmentGapCr: 210,
      aiConfidencePct: 97
    }
  },
  {
    id: 'REC-05',
    title: 'Model Kasturba Tribal Girls Residential Schools & STEM Labs',
    district: 'Dahod',
    state: 'Gujarat',
    category: 'education',
    suggestedPriority: 'High',
    beneficiariesEstimate: 42000,
    estimatedCostCr: 45,
    alignedSchemes: ['PM SHRI Schools Scheme', 'Samagra Shiksha Abhiyan'],
    rationale: 'Dahod displays high education infrastructure deficit (68%) and school infrastructure complaints (leaking roofs, no boundary walls). Female literacy is low (48%), making residential educational upgrades transformational.',
    risks: [
      'Contractor execution delays in remote hilly blocks',
      'Need for bilingual educators fluent in Bhili and Gujarati',
      'Adequate hostel capacity to match high tribal enrolment'
    ],
    explainability: {
      citizenDemandCount: 1310,
      infrastructureGapPct: 68,
      vulnerabilityRank: 'Severe (86/100, 90% rural)',
      publicInvestmentGapCr: 65,
      aiConfidencePct: 92
    }
  },
  {
    id: 'REC-06',
    title: 'Brahmaputra Flood-Resilient Embankments & High-Grade Causeway Roads',
    district: 'Kamrup Rural',
    state: 'Assam',
    category: 'roads',
    suggestedPriority: 'High',
    beneficiariesEstimate: 115000,
    estimatedCostCr: 110,
    alignedSchemes: ['North East Special Infrastructure (NESIDS)', 'PMGSY'],
    rationale: 'Annual river breaching consistently cuts off silk weaver villages in Hajo and Sualkuchi. High citizen demand volume (1,420) requesting permanent elevated road embankments.',
    risks: [
      'Severe erosion during peak Brahmaputra monsoon discharge',
      'Land acquisition along agricultural floodplains',
      'Requirement for geotextile slope stabilization'
    ],
    explainability: {
      citizenDemandCount: 1420,
      infrastructureGapPct: 78,
      vulnerabilityRank: 'Moderate (71/100)',
      publicInvestmentGapCr: 90,
      aiConfidencePct: 91
    }
  },
  {
    id: 'REC-07',
    title: 'Fluoride-Free Community Deep Borewell & Solar Powered Purification Plants',
    district: 'Gaya',
    state: 'Bihar',
    category: 'water',
    suggestedPriority: 'High',
    beneficiariesEstimate: 130000,
    estimatedCostCr: 95,
    alignedSchemes: ['Jal Jeevan Mission', 'State Har Ghar Nal Yojana'],
    rationale: 'Gaya registers 85% water gap index with 84 vulnerability rating. Hard-rock plateau terrain prevents shallow handpumps from yielding clean water, leaving 1,840 citizen complaints unresolved.',
    risks: [
      'Drilling through granite bedrock requires heavy percussion rigs',
      'Seasonal depletion of water table between March and June',
      'Grid power fluctuations necessitating mandatory battery solar backups'
    ],
    explainability: {
      citizenDemandCount: 1840,
      infrastructureGapPct: 85,
      vulnerabilityRank: 'Severe (84/100, 86.8% rural)',
      publicInvestmentGapCr: 120,
      aiConfidencePct: 94
    }
  },
  {
    id: 'REC-08',
    title: 'Underground Stormwater Drainage & Community Biogas Sanitation Units',
    district: 'Nuh (Mewat)',
    state: 'Haryana',
    category: 'sanitation',
    suggestedPriority: 'Medium',
    beneficiariesEstimate: 76000,
    estimatedCostCr: 58,
    alignedSchemes: ['Swachh Bharat Mission (Grameen) 2.0', 'GOBARdhan Scheme'],
    rationale: 'Nuh holds an 82% sanitation gap and 88% health deficit. Waterlogging combined with dense cattle population leads to severe seasonal outbreaks of water-borne pathogens.',
    risks: [
      'High subsoil salinity eroding conventional concrete sewage pipes',
      'Community participation required for segregation of organic waste',
      'Inter-departmental coordination between PWD and Rural Development'
    ],
    explainability: {
      citizenDemandCount: 1530,
      infrastructureGapPct: 82,
      vulnerabilityRank: 'Severe (89/100, 54.1% literacy)',
      publicInvestmentGapCr: 70,
      aiConfidencePct: 90
    }
  },
  {
    id: 'REC-09',
    title: 'Disaster-Resilient Hill Slope Housing & Landslide Warning Sensors',
    district: 'Wayanad',
    state: 'Kerala',
    category: 'housing',
    suggestedPriority: 'High',
    beneficiariesEstimate: 36000,
    estimatedCostCr: 82,
    alignedSchemes: ['PMAY-G Hill States Package', 'National Disaster Management Mission'],
    rationale: 'Repeated landslide susceptibility in Meppadi and Vythiri sectors requires relocation of vulnerable tribal hamlets to geotechnical-approved terraced sites with prefabricated light-steel homes.',
    risks: [
      'Extreme slope gradients and fragile Western Ghats ecology',
      'Land parcel identification acceptable to indigenous communities',
      'Extended monsoon season limiting construction window'
    ],
    explainability: {
      citizenDemandCount: 1650,
      infrastructureGapPct: 52,
      vulnerabilityRank: 'Moderate (58/100, 96.1% rural)',
      publicInvestmentGapCr: 85,
      aiConfidencePct: 93
    }
  },
  {
    id: 'REC-10',
    title: 'Bridge Over Pearlkot River & Road Connectivity to Cutoff Tribal Blocks',
    district: 'Gadchiroli',
    state: 'Maharashtra',
    category: 'transport',
    suggestedPriority: 'Critical',
    beneficiariesEstimate: 52000,
    estimatedCostCr: 74,
    alignedSchemes: ['Road Connectivity Project for LWE Areas (RCPLWEA)', 'PM Gati Shakti'],
    rationale: 'Bhamragad Tehsil faces annual 90-day cut-off during flood surges. Health and ration deliveries stall completely, creating critical vulnerability for Madia Gond populations.',
    risks: [
      'High-water torrent velocity requiring deep caisson foundations',
      'Forest clearance within tiger reserve buffer corridor',
      'Heavy monsoon delays'
    ],
    explainability: {
      citizenDemandCount: 890,
      infrastructureGapPct: 83,
      vulnerabilityRank: 'Severe (85/100, 22% digital penetration)',
      publicInvestmentGapCr: 125,
      aiConfidencePct: 97
    }
  }
];
