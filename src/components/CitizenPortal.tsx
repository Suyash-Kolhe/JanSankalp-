import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Clock, 
  Copy, 
  Share2, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  Building,
  Smartphone,
  Info
} from 'lucide-react';
import { CategoryType, ChannelType, CitizenRequest } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { analyzeCitizenRequest, AnalyzeResultOutput } from '../services/geminiService';
import { MOCK_DISTRICTS } from '../data/mockDistricts';
import { LocationPickerMap } from './LocationPickerMap';

interface CitizenPortalProps {
  currentLang: SupportedLanguage;
  onAddRequest: (newReq: CitizenRequest) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ currentLang, onAddRequest }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Form State
  const [submissionMode, setSubmissionMode] = useState<ChannelType>('web');
  const [selectedState, setSelectedState] = useState<string>('Bihar');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Patna');
  const [villageOrWard, setVillageOrWard] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('water');
  const [description, setDescription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 25.5941, lng: 85.1376 });
  const [showMapPicker, setShowMapPicker] = useState<boolean>(true);

  // Submission & Result State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResultOutput | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Simulated WhatsApp State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to JanSankalp Indian Digital Public Good helpline. Send your village development request in any Indian language or dialect.',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Extract unique states and districts
  const stateOptions = Array.from(new Set(MOCK_DISTRICTS.map(d => d.state)));
  const districtOptions = MOCK_DISTRICTS.filter(d => d.state === selectedState);

  // Initialize Speech Recognition check
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Simulate speech input for demonstration if browser doesn't have native microphone support
      setIsRecording(true);
      setTimeout(() => {
        setDescription('हमार गाँव में पानी की टंकी टूट गईल बा, 2 हफ्ता से पीने का पानी नइखे मिलत। बच्चे बीमार पड़ रहे हैं।');
        setIsRecording(false);
      }, 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Select recognition lang based on current lang
      const langMap: Record<string, string> = {
        hi: 'hi-IN',
        en: 'en-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        pa: 'pa-IN',
        or: 'or-IN',
        as: 'as-IN'
      };
      recognition.lang = langMap[currentLang] || 'hi-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setDescription(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleQuickSample = (sampleText: string, sampleCat: CategoryType, state: string, dist: string, village: string) => {
    setDescription(sampleText);
    setCategory(sampleCat);
    setSelectedState(state);
    setSelectedDistrict(dist);
    setVillageOrWard(village);
    const d = MOCK_DISTRICTS.find(item => item.name.toLowerCase() === dist.toLowerCase());
    if (d) {
      setCoords({ lat: d.lat, lng: d.lng });
    }
  };

  const handleLocationChange = (lat: number, lng: number, nearestDistrict?: string, nearestState?: string) => {
    setCoords({ lat, lng });
    if (nearestState) setSelectedState(nearestState);
    if (nearestDistrict) setSelectedDistrict(nearestDistrict);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeCitizenRequest({
        text: description,
        statedLocation: {
          state: selectedState,
          district: selectedDistrict,
          village: villageOrWard || 'Village Center'
        },
        statedCategory: category,
        channel: submissionMode
      });

      setAnalysisResult(result);

      // Create new request object to append to local store using exact Leaflet pinned coordinates
      const newRequest: CitizenRequest = {
        id: result.trackingId,
        timestamp: new Date().toISOString(),
        originalText: result.originalText,
        originalLanguage: result.detectedLanguage,
        translatedText: result.translatedEnglish,
        category: (result.category.toLowerCase() as CategoryType) || category,
        urgency: (result.urgency as CitizenRequest['urgency']) || 'High',
        sentiment: (result.sentiment as CitizenRequest['sentiment']) || 'Urgent',
        channel: submissionMode,
        state: result.state || selectedState,
        district: result.district || selectedDistrict,
        villageOrWard: result.villageOrWard || villageOrWard || 'Gram Panchayat Sector',
        status: 'AI Triaged',
        upvotes: 1,
        schemeAlignment: result.schemeAlignment || 'Jal Jeevan Mission',
        lat: coords.lat,
        lng: coords.lng,
        estimatedBeneficiaries: result.estimatedBeneficiaries || 3500
      };

      onAddRequest(newRequest);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time }]);
    setChatInput('');

    // Call AI analysis
    const result = await analyzeCitizenRequest({
      text: userMsg,
      statedLocation: {
        state: selectedState,
        district: selectedDistrict,
        village: villageOrWard || 'WhatsApp User Location'
      },
      channel: 'whatsapp'
    });

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: `✅ Request received & AI Triaged!\n\n📋 Tracking ID: ${result.trackingId}\n🌐 Detected Language: ${result.detectedLanguage}\n📂 Category: ${result.category.toUpperCase()}\n⚠️ Urgency: ${result.urgency}\n🏛️ Scheme: ${result.schemeAlignment}\n\nYour request has been routed to the District Magistrate's Priority Engine queue.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setAnalysisResult(result);
  };

  const copyTrackingId = () => {
    if (analysisResult?.trackingId) {
      navigator.clipboard.writeText(analysisResult.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-medium border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multilingual AI Triage • Digital Public Good</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.submitRequestHeading}
          </h1>
          <p className="text-slate-300 text-sm">
            {t.submitRequestSub}
          </p>
        </div>
      </div>

      {/* Mode Switch: Text vs Voice vs WhatsApp/SMS simulator */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSubmissionMode('web')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            submissionMode === 'web'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.methodText}</span>
        </button>

        <button
          onClick={() => setSubmissionMode('voice')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            submissionMode === 'voice'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{t.methodVoice}</span>
        </button>

        <button
          onClick={() => setSubmissionMode('whatsapp')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            submissionMode === 'whatsapp'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>{t.methodSocial}</span>
        </button>
      </div>

      {/* WhatsApp / SMS Simulator View */}
      {submissionMode === 'whatsapp' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-2xl mx-auto">
          <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-sm">
                JS
              </div>
              <div>
                <h4 className="font-semibold text-sm">JanSankalp Official Bot (Govt of India DPG)</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Online • 12 Languages Auto-Detect
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200 font-mono">
              WhatsApp 2.26
            </span>
          </div>

          <div className="bg-slate-100 p-4 h-80 overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Type in Hindi, Tamil, Telugu, Bengali, etc..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSendChatMessage}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Standard Web / Voice Submission Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Quick-Fill Sample Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Try a realistic citizen grievance in your native language (One-Click Demo):</span>
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickSample(
                  'हमार गांव में पानी की टंकी टूट गईल बा, 2 हफ्ता से पीने का पानी नइखे मिलत। बच्चे बीमार पड़ रहे हैं।',
                  'water',
                  'Bihar',
                  'Patna',
                  'Danapur Ward 12'
                )}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-900 transition-colors"
              >
                🇮🇳 <strong>Bhojpuri/Hindi:</strong> टूटी पानी टंकी (Patna)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSample(
                  'பஞ்சாயத்து ஆரம்ப சுகாதார நிலையத்தில் இரவு நேரத்தில் மின்சாரம் இல்லை மற்றும் பிரசவ மருத்துவர் இல்லை.',
                  'health',
                  'Andhra Pradesh',
                  'Chittoor',
                  'Nagari Border Sector'
                )}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-900 transition-colors"
              >
                🇮🇳 <strong>Tamil:</strong> மருத்துவமனை மின்சாரம் (Chittoor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSample(
                  'ભામરાગડ નદી પરનો પુલ ચોમાસામાં ડૂબી જાય છે, 60 આદિવાસી ગામડાઓનો સંપર્ક તૂટી જાય છે.',
                  'roads',
                  'Gujarat',
                  'Dahod',
                  'Garbada Taluka'
                )}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-900 transition-colors"
              >
                🇮🇳 <strong>Gujarati:</strong> પુલનું ધોવાણ (Dahod)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSample(
                  'ବର୍ଷା ଦିନେ ନଦୀ ପାଣିରେ ରାସ୍ତା ଧୋଇ ହୋଇଯାଉଛି, ଆମ୍ବୁଲାନ୍ସ ଆସିପାରୁନାହିଁ। ପୋଲ ନିର୍ମାଣ ଅତ୍ୟନ୍ତ ଜରୁରୀ।',
                  'transport',
                  'Odisha',
                  'Koraput',
                  'Laxmipur Block'
                )}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-900 transition-colors"
              >
                🇮🇳 <strong>Odia:</strong> ପୋଲ ନିର୍ମାଣ (Koraput)
              </button>
            </div>
          </div>

          {/* Location Fields: State, District, Village/Ward */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.stateLabel}
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  const firstDist = MOCK_DISTRICTS.find(d => d.state === e.target.value);
                  if (firstDist) setSelectedDistrict(firstDist.name);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {stateOptions.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.districtLabel}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {districtOptions.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.villageLabel}
              </label>
              <input
                type="text"
                value={villageOrWard}
                onChange={(e) => setVillageOrWard(e.target.value)}
                placeholder="e.g. Rampur Tola, Ward 4"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Interactive Leaflet Location Picker */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  Pinpoint Ground Location on Interactive Map (Leaflet)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold cursor-pointer"
              >
                {showMapPicker ? 'Hide Map ▲' : 'Show Map ▼'}
              </button>
            </div>

            {showMapPicker && (
              <LocationPickerMap
                lat={coords.lat}
                lng={coords.lng}
                selectedState={selectedState}
                selectedDistrict={selectedDistrict}
                onChangeLocation={handleLocationChange}
              />
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.categoryLabel}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {[
                { id: 'roads', label: 'Roads', icon: '🛣️' },
                { id: 'water', label: 'Water', icon: '💧' },
                { id: 'sanitation', label: 'Sanitation', icon: '🚻' },
                { id: 'electricity', label: 'Power', icon: '⚡' },
                { id: 'health', label: 'Health', icon: '🏥' },
                { id: 'education', label: 'Education', icon: '📚' },
                { id: 'internet', label: 'Broadband', icon: '📡' },
                { id: 'housing', label: 'Housing', icon: '🏠' },
                { id: 'transport', label: 'Transit', icon: '🚌' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id as CategoryType)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    category === cat.id
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-semibold shadow-xs ring-1 ring-indigo-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base mb-0.5">{cat.icon}</span>
                  <span className="text-[10px] leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description / Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {t.descriptionLabel}
              </label>

              {/* Voice button in form */}
              <button
                type="button"
                onClick={startVoiceRecording}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-md'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? t.voiceStop : t.voiceStart}</span>
              </button>
            </div>

            {isRecording && (
              <div className="p-3 mb-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span className="font-medium">{t.voiceListening}</span>
                </div>
                <div className="flex space-x-1 items-center">
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-rose-600 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-1 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            )}

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-900 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.analyzingWithGemini}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.submitBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* AI Triage & Verification Result Card */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Top Result Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t.trackingIdLabel}
                </span>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold font-mono text-indigo-950">
                    {analysisResult.trackingId}
                  </h3>
                  <button
                    onClick={copyTrackingId}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                    title="Copy Tracking ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                {t.urgencyLevelLabel}: {analysisResult.urgency}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                {analysisResult.category}
              </span>
            </div>
          </div>

          {/* AI Extraction Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original vs Translated */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">{t.detectedLanguageLabel}</span>
                <span className="font-medium text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
                  {analysisResult.detectedLanguage}
                </span>
              </div>
              <p className="text-xs text-slate-800 italic bg-white p-2.5 rounded-lg border border-slate-100">
                "{analysisResult.originalText}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-900">{t.translatedEnglishLabel}</span>
                <span className="text-[10px] text-amber-700 font-mono">Gemini 3.8 Flash</span>
              </div>
              <p className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-amber-100 font-medium">
                "{analysisResult.translatedEnglish}"
              </p>
            </div>
          </div>

          {/* Administrative Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
              <span className="font-semibold text-slate-800">{analysisResult.district}, {analysisResult.state}</span>
              <span className="text-slate-500 block truncate text-[11px]">{analysisResult.villageOrWard}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Flagship Scheme</span>
              <span className="font-semibold text-emerald-800">{analysisResult.schemeAlignment}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Est. Beneficiaries</span>
              <span className="font-semibold text-slate-800">{analysisResult.estimatedBeneficiaries.toLocaleString()} citizens</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Citizen Sentiment</span>
              <span className="font-semibold text-rose-700">{analysisResult.sentiment}</span>
            </div>
          </div>

          {/* Lifecycle Status Timeline (6 Stages) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.statusTimelineLabel} (Public Citizen Audit Trail)
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              {[
                { stage: '1. Submitted', done: true, current: false },
                { stage: '2. AI Triaged', done: true, current: true },
                { stage: '3. Geo-Clustered', done: false, current: false },
                { stage: '4. Dept Assigned', done: false, current: false },
                { stage: '5. Priority Queue', done: false, current: false },
                { stage: '6. Sanctioned', done: false, current: false },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-[11px] font-medium transition-all ${
                    step.current
                      ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                      : step.done
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {step.done ? (
                      <CheckCircle className={`w-3.5 h-3.5 ${step.current ? 'text-amber-400' : 'text-emerald-600'}`} />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </div>
                  <span>{step.stage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
