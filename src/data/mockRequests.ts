import { CitizenRequest } from '../types';

export const SEEDED_CITIZEN_REQUESTS: CitizenRequest[] = [
  {
    id: 'JS-2026-BR-PAT-1042',
    timestamp: '2026-09-21T09:30:00Z',
    originalText: 'हमार गांव में जल जीवन मिशन के पाइप 3 महीना से फूटल बा। पूरा टोला में पीने का पानी नइखे मिलत, गंदा पानी पिए से लईकन के हैजा हो गइल बा।',
    originalLanguage: 'Bhojpuri / Hindi',
    translatedText: 'The Jal Jeevan Mission pipe in our village has been burst for 3 months. The entire settlement is deprived of safe drinking water; children have contracted cholera due to dirty water.',
    category: 'water',
    urgency: 'Critical',
    sentiment: 'Frustrated',
    channel: 'voice',
    state: 'Bihar',
    district: 'Patna',
    villageOrWard: 'Danapur Ward 12, Rampur Tola',
    status: 'Priority Queue',
    upvotes: 42,
    schemeAlignment: 'Jal Jeevan Mission (JJM)',
    lat: 25.6291,
    lng: 85.0476,
    estimatedBeneficiaries: 3400
  },
  {
    id: 'JS-2026-CG-BAS-0891',
    timestamp: '2026-09-20T14:15:00Z',
    originalText: 'प्राथमिक स्वास्थ्य केंद्र दरभा में प्रसव कक्ष में रात को बिजली नहीं रहती और कोई महिला डॉक्टर उपलब्ध नहीं है। गर्भवती महिलाओं को 40 किमी दूर जगदलपुर ले जाना पड़ता है।',
    originalLanguage: 'Hindi (Chhattisgarhi)',
    translatedText: 'Darbha Primary Health Center has no electricity in the maternity ward at night and no female doctor is available. Expectant mothers must be taken 40 km away to Jagdalpur.',
    category: 'health',
    urgency: 'Critical',
    sentiment: 'Urgent',
    channel: 'whatsapp',
    state: 'Chhattisgarh',
    district: 'Bastar',
    villageOrWard: 'Darbha Block, Panchayat Bhavan',
    status: 'Department Assigned',
    upvotes: 68,
    schemeAlignment: 'Ayushman Bharat Health Infrastructure (PM-ABHIM)',
    lat: 18.8821,
    lng: 81.8920,
    estimatedBeneficiaries: 12500
  },
  {
    id: 'JS-2026-OD-KOR-0422',
    timestamp: '2026-09-19T11:20:00Z',
    originalText: 'ବର୍ଷା ଦିନେ ଆମ ଗାଁକୁ ଯିବା ରାସ୍ତା ନଦୀ ପାଣିରେ ଭାସିଯାଉଛି। ପିଲାମାନେ ସ୍କୁଲ ଯାଇପାରୁ ନାହାଁନ୍ତି ଏବଂ ଆମ୍ବୁଲାନ୍ସ ପହଞ୍ଚିପାରୁ ନାହିଁ। ପୋଲ ନିର୍ମାଣ ଅତ୍ୟନ୍ତ ଜରୁରୀ।',
    originalLanguage: 'Odia',
    translatedText: 'During monsoon, the access road to our village gets washed away by the river. Children cannot attend school and ambulances cannot enter. Bridge construction is urgent.',
    category: 'roads',
    urgency: 'High',
    sentiment: 'Frustrated',
    channel: 'voice',
    state: 'Odisha',
    district: 'Koraput',
    villageOrWard: 'Laxmipur Block, Toyaput Village',
    status: 'Geo-Clustered',
    upvotes: 55,
    schemeAlignment: 'Pradhan Mantri Gram Sadak Yojana (PMGSY)',
    lat: 18.9135,
    lng: 83.0123,
    estimatedBeneficiaries: 4100
  },
  {
    id: 'JS-2026-UP-VNS-3104',
    timestamp: '2026-09-22T08:05:00Z',
    originalText: 'पिंडरा ब्लॉक के 4 गांवों में भारतनेट की ऑप्टिकल फाइबर केबल कट गई है। ग्राम पंचायत डिजिटल सेवा केंद्र और राशन वितरण का ई-पॉस सर्वर 15 दिनों से ठप है।',
    originalLanguage: 'Hindi',
    translatedText: 'Optical fiber cable of BharatNet is snapped across 4 villages in Pindra Block. Gram Panchayat digital citizen center and Ration e-PoS server down for 15 days.',
    category: 'internet',
    urgency: 'Medium',
    sentiment: 'Frustrated',
    channel: 'web',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    villageOrWard: 'Pindra Block, Baragaon Ward 3',
    status: 'AI Triaged',
    upvotes: 31,
    schemeAlignment: 'BharatNet Phase II Digital India',
    lat: 25.4521,
    lng: 82.8512,
    estimatedBeneficiaries: 8900
  },
  {
    id: 'JS-2026-RJ-BAR-2187',
    timestamp: '2026-09-18T16:40:00Z',
    originalText: 'चौहटन क्षेत्र में खारे पानी की समस्या बहुत गंभीर है। ट्यूबवेल का पानी पीने योग्य नहीं है। नर्मदा नहर का पानी हमारे ढाणी तक पहुंचाने के लिए पाइपलाइन बिछाई जाए।',
    originalLanguage: 'Hindi (Rajasthani)',
    translatedText: 'Saline water contamination in Chohtan is severe. Tube-well water is undrinkable. Pipeline must be laid to supply Narmada canal drinking water to our hamlet.',
    category: 'water',
    urgency: 'Critical',
    sentiment: 'Urgent',
    channel: 'sms',
    state: 'Rajasthan',
    district: 'Barmer',
    villageOrWard: 'Chohtan Tehsil, Doodhu Dhani',
    status: 'Priority Queue',
    upvotes: 89,
    schemeAlignment: 'Jal Jeevan Mission / Desert Water Grid',
    lat: 25.5132,
    lng: 71.0181,
    estimatedBeneficiaries: 5200
  },
  {
    id: 'JS-2026-TN-CHE-0931',
    timestamp: '2026-09-22T10:10:00Z',
    originalText: 'குடிசை மாற்று வாரிய குடியிருப்புகளில் மழைநீர் தேங்கி டெங்கு பரவுகிறது. முறையான கழிவுநீர் வடிகால் மற்றும் சுகாதார வசதி உடனடியாக தேவை.',
    originalLanguage: 'Tamil',
    translatedText: 'Rainwater stagnation in tenement board colony is causing dengue spread. Stormwater drainage and sanitation infrastructure urgently required.',
    category: 'sanitation',
    urgency: 'High',
    sentiment: 'Urgent',
    channel: 'whatsapp',
    state: 'Andhra Pradesh',
    district: 'Chittoor',
    villageOrWard: 'Nagari Border Colony, Ward 7',
    status: 'Department Assigned',
    upvotes: 47,
    schemeAlignment: 'Swachh Bharat Mission (Grameen) 2.0',
    lat: 13.3172,
    lng: 79.5903,
    estimatedBeneficiaries: 6800
  },
  {
    id: 'JS-2026-GJ-DAH-1520',
    timestamp: '2026-09-17T12:00:00Z',
    originalText: 'ગરબાડા તાલુકામાં પ્રાથમિક શાળાનું મકાન જર્જરિત થઈ ગયું છે. ચોમાસામાં છતમાંથી પાણી ટપકે છે અને 250 આદિવાસી બાળકો માટે કોઈ સલામત વર્ગખંડ નથી.',
    originalLanguage: 'Gujarati',
    translatedText: 'Garbada taluka primary school building is dilapidated. Roof leaks during monsoons and there are no safe classrooms for 250 tribal students.',
    category: 'education',
    urgency: 'High',
    sentiment: 'Frustrated',
    channel: 'voice',
    state: 'Gujarat',
    district: 'Dahod',
    villageOrWard: 'Garbada Taluka, Jesawada Gram',
    status: 'Geo-Clustered',
    upvotes: 62,
    schemeAlignment: 'Samagra Shiksha Abhiyan / PM SHRI',
    lat: 22.7396,
    lng: 74.3146,
    estimatedBeneficiaries: 1800
  },
  {
    id: 'JS-2026-KL-WAY-0744',
    timestamp: '2026-09-19T07:45:00Z',
    originalText: 'മേപ്പാടി പഞ്ചായത്തിൽ ഉരുൾപൊട്ടൽ സാധ്യതയുള്ള പ്രദേശങ്ങളിലെ ആദിവാസി കുടുംബങ്ങൾക്ക് സുരക്ഷിതമായ ഭവന നിർമ്മാണവും മാറ്റിപ്പാർപ്പിക്കലും ഉടൻ വേണം.',
    originalLanguage: 'Malayalam',
    translatedText: 'Immediate disaster-resilient housing and rehabilitation required for tribal families living in landslide-prone zones of Meppadi panchayat.',
    category: 'housing',
    urgency: 'Critical',
    sentiment: 'Urgent',
    channel: 'web',
    state: 'Kerala',
    district: 'Wayanad',
    villageOrWard: 'Meppadi Panchayat, Ward 11',
    status: 'Sanctioned',
    upvotes: 112,
    schemeAlignment: 'Pradhan Mantri Awas Yojana (Gramin)',
    lat: 11.5554,
    lng: 76.1220,
    estimatedBeneficiaries: 3200
  },
  {
    id: 'JS-2026-MH-GAD-0312',
    timestamp: '2026-09-16T15:20:00Z',
    originalText: 'भामरागड ते अहेरी रस्त्यावरील पर्लकोटा नदीवरील पूल दरवर्षी पुरामुळे बुडतो. यामुळे ६० आदिवासी गावे ३ महिने जगाशी तुटतात. तातडीने उंच पुलाचे बांधकाम व्हावे.',
    originalLanguage: 'Marathi',
    translatedText: 'The bridge over Pearlkot river on Bhamragad-Aheri road submerges every monsoon, cutting off 60 tribal villages for 3 months. High-level bridge must be built.',
    category: 'transport',
    urgency: 'Critical',
    sentiment: 'Urgent',
    channel: 'voice',
    state: 'Maharashtra',
    district: 'Gadchiroli',
    villageOrWard: 'Bhamragad Tehsil, Pearlkot River crossing',
    status: 'Priority Queue',
    upvotes: 94,
    schemeAlignment: 'PM Gati Shakti / Road Connectivity Project for LWE Areas',
    lat: 19.3809,
    lng: 80.3539,
    estimatedBeneficiaries: 24000
  },
  {
    id: 'JS-2026-AS-KAM-1890',
    timestamp: '2026-09-21T18:10:00Z',
    originalText: 'ব্ৰহ্মপুত্ৰৰ বানপানীয়ে হাজো সমষ্টিৰ বান্ধ ভাঙি পেলাইছে। বান নিয়ন্ত্ৰণ মথাউৰি আৰু পকী ৰাস্তা নিৰ্মাণ নকৰিলে অহা সপ্তাহত সমগ্ৰ অঞ্চলটো জলমগ্ন হ’ব।',
    originalLanguage: 'Assamese',
    translatedText: 'Brahmaputra floodwaters have breached the dyke in Hajo constituency. If flood control embankment and paved road are not built, the entire area will submerge.',
    category: 'roads',
    urgency: 'Critical',
    sentiment: 'Urgent',
    channel: 'whatsapp',
    state: 'Assam',
    district: 'Kamrup Rural',
    villageOrWard: 'Hajo Block, Sualkuchi Road Sector 2',
    status: 'Department Assigned',
    upvotes: 124,
    schemeAlignment: 'PMGSY / North East Infrastructure Development (NESIDS)',
    lat: 26.2506,
    lng: 91.5222,
    estimatedBeneficiaries: 18500
  },
  {
    id: 'JS-2026-WB-MAL-2411',
    timestamp: '2026-09-15T13:30:00Z',
    originalText: 'আমাদের মানিকচক ব্লকে ভূগর্ভস্থ জলে আর্সেনিকের মাত্রা মারাত্মক। পাইপলাইনের গভীর নলকূপ ও আর্সেনিক মুক্ত পরিশোধনাগার অতি দ্রুত স্থাপন করা হোক।',
    originalLanguage: 'Bengali',
    translatedText: 'Arsenic contamination in groundwater is dangerous in Manikchak block. Piped deep tube-well water and arsenic filtration plant must be installed urgently.',
    category: 'water',
    urgency: 'Critical',
    sentiment: 'Frustrated',
    channel: 'web',
    state: 'West Bengal',
    district: 'Malda',
    villageOrWard: 'Manikchak Block, Enayetpur Gram',
    status: 'Priority Queue',
    upvotes: 76,
    schemeAlignment: 'Jal Jeevan Mission Arsenic Remediation Sub-Mission',
    lat: 25.0908,
    lng: 87.9011,
    estimatedBeneficiaries: 9800
  },
  {
    id: 'JS-2026-PB-LUD-1198',
    timestamp: '2026-09-20T17:00:00Z',
    originalText: 'ਸਾਡੇ ਪਿੰਡ ਦੀ ਸਰਕਾਰੀ ਡਿਸਪੈਂਸਰੀ ਵਿੱਚ ਨਾ ਕੋਈ ਲੈਬ ਟੈਕਨੀਸ਼ੀਅਨ ਹੈ ਤੇ ਨਾ ਹੀ ਦਵਾਈਆਂ। ਬਜ਼ੁਰਗਾਂ ਨੂੰ ਸ਼ੂਗਰ ਤੇ ਬੀਪੀ ਦੀ ਦਵਾਈ ਲਈ 25 ਕਿਲੋਮੀਟਰ ਦੂਰ ਸ਼ਹਿਰ ਜਾਣਾ ਪੈਂਦਾ ਹੈ।',
    originalLanguage: 'Punjabi',
    translatedText: 'In our village dispensary, there is neither a lab technician nor medicines. Senior citizens must travel 25 km to the city for diabetes and BP medication.',
    category: 'health',
    urgency: 'Medium',
    sentiment: 'Frustrated',
    channel: 'sms',
    state: 'Haryana',
    district: 'Nuh (Mewat)',
    villageOrWard: 'Tauru Block, Chhapera Village',
    status: 'AI Triaged',
    upvotes: 38,
    schemeAlignment: 'Ayushman Arogya Mandir (Health & Wellness Centres)',
    lat: 28.2177,
    lng: 76.9525,
    estimatedBeneficiaries: 4600
  }
];

// Dynamically generate the remaining ~210 realistic requests to exceed the 200+ request requirement
const categories: CitizenRequest['category'][] = [
  'roads', 'water', 'sanitation', 'electricity', 'health', 'education', 'internet', 'housing', 'transport'
];

const channels: CitizenRequest['channel'][] = ['voice', 'whatsapp', 'sms', 'web', 'telegram'];
const urgencies: CitizenRequest['urgency'][] = ['Critical', 'High', 'Medium', 'Low'];
const sentiments: CitizenRequest['sentiment'][] = ['Frustrated', 'Urgent', 'Neutral', 'Hopeful'];
const statuses: CitizenRequest['status'][] = [
  'Submitted', 'AI Triaged', 'Geo-Clustered', 'Department Assigned', 'Priority Queue', 'Sanctioned', 'Resolved'
];

const districtSeeds = [
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, lang: 'Hindi / Bhojpuri', topNeed: 'water' },
  { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002, lang: 'Hindi / Magahi', topNeed: 'water' },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, lang: 'Hindi', topNeed: 'roads' },
  { name: 'Bastar', state: 'Chhattisgarh', lat: 19.0748, lng: 82.0239, lang: 'Gondi / Halbi / Hindi', topNeed: 'health' },
  { name: 'Koraput', state: 'Odisha', lat: 18.8135, lng: 82.7123, lang: 'Odia / Desia', topNeed: 'roads' },
  { name: 'Kalahandi', state: 'Odisha', lat: 19.9137, lng: 83.1649, lang: 'Odia', topNeed: 'water' },
  { name: 'Barmer', state: 'Rajasthan', lat: 25.7532, lng: 71.4181, lang: 'Marwari / Hindi', topNeed: 'water' },
  { name: 'Dahod', state: 'Gujarat', lat: 22.8396, lng: 74.2546, lang: 'Gujarati / Bhili', topNeed: 'education' },
  { name: 'Wayanad', state: 'Kerala', lat: 11.6854, lng: 76.1320, lang: 'Malayalam', topNeed: 'transport' },
  { name: 'Mayurbhanj', state: 'Odisha', lat: 21.9287, lng: 86.7454, lang: 'Odia / Santhali', topNeed: 'roads' },
  { name: 'Kamrup Rural', state: 'Assam', lat: 26.2006, lng: 91.6022, lang: 'Assamese', topNeed: 'roads' },
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, lang: 'Hindi / Kurukh', topNeed: 'water' },
  { name: 'Nuh (Mewat)', state: 'Haryana', lat: 28.1077, lng: 77.0125, lang: 'Mewati / Hindi', topNeed: 'water' },
  { name: 'Chittoor', state: 'Andhra Pradesh', lat: 13.2172, lng: 79.1003, lang: 'Telugu / Tamil', topNeed: 'water' },
  { name: 'Gadchiroli', state: 'Maharashtra', lat: 20.1809, lng: 80.0039, lang: 'Marathi / Madia', topNeed: 'health' },
  { name: 'Raichur', state: 'Karnataka', lat: 16.2120, lng: 77.3439, lang: 'Kannada', topNeed: 'water' }
];

const sampleIssueTemplates: Record<string, { orig: string; trans: string; scheme: string }> = {
  roads: {
    orig: 'ग्राम संपर्क सड़क कच्ची होने के कारण दलदल बन गई है, दोपहिया वाहन भी नहीं निकल पाते।',
    trans: 'Gram connectivity all-weather road is unpaved and submerged in mud; two-wheelers cannot pass.',
    scheme: 'PMGSY-IV Road Infrastructure'
  },
  water: {
    orig: 'गाँव का सोलर पंप खराब है और पाइपलाइन से गंदा मटमैला पानी आ रहा है। तत्काल मरम्मत चाहिए।',
    trans: 'Village solar pump is defunct and tap water is muddy. Immediate technical repair needed.',
    scheme: 'Jal Jeevan Mission Har Ghar Nal Se Jal'
  },
  sanitation: {
    orig: 'सार्वजनिक सामुदायिक शौचालय में पानी की टंकी नहीं है और सीवेज नाली खुली रहने से बीमारी फैल रही है।',
    trans: 'Community toilet complex lacks water tank and open sewage drains are causing disease outbreak.',
    scheme: 'Swachh Bharat Mission (Grameen)'
  },
  electricity: {
    orig: 'कृषि फीडर पर केवल 3 घंटे बिजली मिल रही है, जिससे धान की फसल सूख रही है। 24 घंटे आपूर्ति की मांग।',
    trans: 'Agricultural electricity feeder operates only 3 hours daily; crops drying up. Dedicated supply demanded.',
    scheme: 'PM-KUSUM / Revamped Distribution Sector Scheme'
  },
  health: {
    orig: 'उपकेंद्र पर कोई एएनएम या दवाइयां उपलब्ध नहीं हैं। आपातकाल में प्रसव के लिए दूर जाना पड़ता है।',
    trans: 'Sub-centre has neither nurse nor emergency medicines. Maternity deliveries suffer delays.',
    scheme: 'Ayushman Bharat PM-ABHIM'
  },
  education: {
    orig: 'उच्च प्राथमिक विद्यालय में चारदीवारी नहीं है और बालिकाओं के लिए अलग शौचालय नहीं है।',
    trans: 'Upper primary school lacks boundary wall and separate functional sanitation units for girls.',
    scheme: 'PM SHRI / Samagra Shiksha'
  },
  internet: {
    orig: 'ग्राम पंचायत में 4जी नेटवर्क नहीं आता। छात्रों को ऑनलाइन पढ़ाई के लिए पेड़ पर चढ़ना पड़ता है।',
    trans: 'No cellular 4G coverage in gram panchayat. Students must climb hills to access digital study materials.',
    scheme: 'BharatNet Gram WiFi & 4G Saturation Scheme'
  },
  housing: {
    orig: 'बाढ़ में मिट्टी का मकान ढह गया, प्रधानमंत्री आवास योजना की सूची में नाम होने के बाद भी किस्त नहीं मिली।',
    trans: 'Mud house collapsed during flash floods; installment pending despite sanction in housing portal.',
    scheme: 'Pradhan Mantri Awas Yojana (PMAY-G)'
  },
  transport: {
    orig: 'तहसील मुख्यालय जाने के लिए कोई सरकारी बस सेवा नहीं है। निजी जीप वाले मनमाना किराया वसूलते हैं।',
    trans: 'No public transit bus to tehsil sub-division headquarters. Private operators charge exorbitant fares.',
    scheme: 'PM-eBus Sewa / Rural Mobility Scheme'
  }
};

const generatedRequests: CitizenRequest[] = [];

for (let i = 1; i <= 210; i++) {
  const dist = districtSeeds[i % districtSeeds.length];
  const cat = (i % 3 === 0) ? (dist.topNeed as CitizenRequest['category']) : categories[i % categories.length];
  const tmpl = sampleIssueTemplates[cat] || sampleIssueTemplates.roads;
  const channel = channels[i % channels.length];
  const urgency = urgencies[(i + (cat === 'water' || cat === 'health' ? 1 : 0)) % urgencies.length];
  const sentiment = sentiments[i % sentiments.length];
  const status = statuses[i % statuses.length];
  const upvotes = Math.floor(Math.random() * 80) + 12;
  const dayOffset = (i % 28) + 1;
  const hour = (i * 3) % 24;
  const min = (i * 7) % 60;
  
  // Slight jitter for map pins
  const latOffset = (Math.sin(i) * 0.08);
  const lngOffset = (Math.cos(i) * 0.08);

  generatedRequests.push({
    id: `JS-2026-${dist.state.slice(0, 2).toUpperCase()}-${dist.name.slice(0, 3).toUpperCase()}-${4000 + i}`,
    timestamp: `2026-09-${String(dayOffset).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00Z`,
    originalText: `${tmpl.orig} [गाँव/वार्ड #${(i % 14) + 1}, ब्लॉक ${dist.name} ग्रामीण]`,
    originalLanguage: dist.lang,
    translatedText: `${tmpl.trans} [Village/Ward #${(i % 14) + 1}, ${dist.name} Rural Sector]`,
    category: cat,
    urgency,
    sentiment,
    channel,
    state: dist.state,
    district: dist.name,
    villageOrWard: `Sector ${(i % 12) + 1}, Gram Panchayat ${dist.name} North`,
    status,
    upvotes,
    schemeAlignment: tmpl.scheme,
    lat: dist.lat + latOffset,
    lng: dist.lng + lngOffset,
    estimatedBeneficiaries: 1200 + (i * 75)
  });
}

export const ALL_CITIZEN_REQUESTS: CitizenRequest[] = [
  ...SEEDED_CITIZEN_REQUESTS,
  ...generatedRequests
];
