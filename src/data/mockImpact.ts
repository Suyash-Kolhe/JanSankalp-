import { ImpactInitiative } from '../types';

export const MOCK_IMPACT_INITIATIVES: ImpactInitiative[] = [
  {
    id: 'IMP-2025-VNS-01',
    title: 'Solar Microgrid & Drinking Water Filtration Units',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    scheme: 'Jal Jeevan Mission + PM Surya Ghar Muft Bijli',
    completionDate: 'March 2026',
    beneficiaries: 46000,
    before: {
      requestVolumeMonthly: 412,
      satisfactionScore: 2.1,
      infrastructureIndex: 38
    },
    after: {
      requestVolumeMonthly: 74,
      satisfactionScore: 4.7,
      infrastructureIndex: 88
    },
    keyOutcome: '82% reduction in water contamination complaints; 24x7 solar-powered reverse osmosis dispensing installed across 32 gram panchayats.',
    dpiIntegration: 'Aadhaar e-KYC linked Smart Water Tap Cards + BharatNet IoT flow meters'
  },
  {
    id: 'IMP-2025-BAS-02',
    title: 'Solar Tele-Medicine & Cold-Chain Vaccine Hubs',
    district: 'Bastar',
    state: 'Chhattisgarh',
    scheme: 'Ayushman Bharat PM-ABHIM Tribal Corridor',
    completionDate: 'January 2026',
    beneficiaries: 68000,
    before: {
      requestVolumeMonthly: 290,
      satisfactionScore: 1.8,
      infrastructureIndex: 26
    },
    after: {
      requestVolumeMonthly: 58,
      satisfactionScore: 4.4,
      infrastructureIndex: 79
    },
    keyOutcome: 'Trained tribal community healthcare workers connected to AIIMS Raipur via high-speed VSAT; institutional childbirth rose from 34% to 89%.',
    dpiIntegration: 'ABHA Health ID integration + e-Sanjeevani Tele-consultation network'
  },
  {
    id: 'IMP-2025-KOR-03',
    title: 'All-Weather Box-Culvert Bridges & High-Level Causeway',
    district: 'Koraput',
    state: 'Odisha',
    scheme: 'PMGSY-III Connectivity Mission',
    completionDate: 'November 2025',
    beneficiaries: 38000,
    before: {
      requestVolumeMonthly: 345,
      satisfactionScore: 1.9,
      infrastructureIndex: 32
    },
    after: {
      requestVolumeMonthly: 42,
      satisfactionScore: 4.6,
      infrastructureIndex: 85
    },
    keyOutcome: 'Zero flood cutoff days during recent July monsoons; emergency ambulance response time slashed from 3.5 hours to 28 minutes.',
    dpiIntegration: 'PM Gati Shakti GIS National Master Plan route tracking'
  },
  {
    id: 'IMP-2025-BAR-04',
    title: 'Narmada Canal Sub-Feeder & Brackish Water Desalination',
    district: 'Barmer',
    state: 'Rajasthan',
    scheme: 'Jal Jeevan Mission Desert Sub-Mission',
    completionDate: 'February 2026',
    beneficiaries: 54000,
    before: {
      requestVolumeMonthly: 520,
      satisfactionScore: 1.7,
      infrastructureIndex: 24
    },
    after: {
      requestVolumeMonthly: 88,
      satisfactionScore: 4.5,
      infrastructureIndex: 82
    },
    keyOutcome: 'Eliminated tanker dependency across 48 desert dhanis; fluorosis and kidney stone incidences decreased by 65%.',
    dpiIntegration: 'IoT telemetry & Central Public Water Quality Information System (WQMIS)'
  },
  {
    id: 'IMP-2025-DAH-05',
    title: 'Smart STEM Classrooms & High-Speed BharatNet LAN',
    district: 'Dahod',
    state: 'Gujarat',
    scheme: 'PM SHRI Schools & BharatNet Saturation',
    completionDate: 'December 2025',
    beneficiaries: 29000,
    before: {
      requestVolumeMonthly: 198,
      satisfactionScore: 2.4,
      infrastructureIndex: 41
    },
    after: {
      requestVolumeMonthly: 31,
      satisfactionScore: 4.8,
      infrastructureIndex: 91
    },
    keyOutcome: 'Digital literacy rate surged by 42% in tribal high schools; girls secondary school drop-out rate dropped below 4%.',
    dpiIntegration: 'DIKSHA Open Digital Education Architecture + APAAR One Nation One Student ID'
  }
];
