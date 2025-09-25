'use client';

import { useState } from 'react';
import { useSettings } from '@/components/SettingsProvider';

const TravelPlannerForm = () => {
  const { t, formatCurrency, language } = useSettings();
  const [formData, setFormData] = useState({
    origin: '',
    people: 2,
    budget: 15000,
    days: 3,
    transport: [],
    preferences: []
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const transportOptions = [
    { id: 'bus', label: language === 'hi' ? 'बस' : 'Bus', icon: '🚌', description: language === 'hi' ? 'किफायती और बार-बार' : 'Economical & frequent' },
    { id: 'train', label: language === 'hi' ? 'ट्रेन' : 'Train', icon: '🚂', description: language === 'hi' ? 'आरामदायक और दर्शनीय' : 'Comfortable & scenic' },
    { id: 'flight', label: language === 'hi' ? 'उड़ान' : 'Flight', icon: '✈️', description: language === 'hi' ? 'तेज़ और सुविधाजनक' : 'Fast & convenient' }
  ];

  const preferenceOptions = [
    { id: 'waterfalls', label: language === 'hi' ? 'झरने' : 'Waterfalls', icon: '💧', description: 'Hundru, Jonha, Dassam Falls' },
    { id: 'temples', label: language === 'hi' ? 'मंदिर' : 'Temples', icon: '🛕', description: 'Deoghar, Rajrappa, Pahari Mandir' },
    { id: 'forests', label: language === 'hi' ? 'जंगल' : 'Forests', icon: '🌲', description: 'National parks & wildlife' },
    { id: 'hills', label: language === 'hi' ? 'पहाड़ी स्टेशन' : 'Hill Stations', icon: '⛰️', description: 'Netarhat, Parasnath Hill' },
    { id: 'valleys', label: language === 'hi' ? 'घाटी' : 'Valleys', icon: '🏞️', description: 'Scenic valleys & landscapes' },
    { id: 'tribal', label: language === 'hi' ? 'आदिवासी संस्कृति' : 'Tribal Culture', icon: '🎭', description: 'Villages & handicrafts' },
    { id: 'adventure', label: language === 'hi' ? 'रोमांच' : 'Adventure', icon: '🧗', description: 'Trekking, rock climbing' },
    { id: 'heritage', label: language === 'hi' ? 'विरासत' : 'Heritage', icon: '🏛️', description: 'Historical & cultural sites' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    // Validation
    if (!formData.origin.trim()) {
      setError(language === 'hi' ? 'कृपया अपना शहर दर्ज करें' : 'Please enter your origin city');
      setLoading(false);
      return;
    }

    if (formData.transport.length === 0) {
      setError(language === 'hi' ? 'कृपया कम से कम एक परिवहन विकल्प चुनें' : 'Please select at least one transport option');
      setLoading(false);
      return;
    }

    if (formData.preferences.length === 0) {
      setError(language === 'hi' ? 'कृपया कम से कम एक पसंद चुनें' : 'Please select at least one travel preference');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, language })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
        // Persist and log to localStorage if backend prepared formatted coordinates
        persistAndLogLocalStorage(data);
      } else {
        setError(data.error || (language === 'hi' ? 'यात्रा योजना बनाने में विफल' : 'Failed to create travel plan'));
      }
    } catch (err) {
      setError(language === 'hi' ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।' : 'Network error. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Persist to localStorage and log comprehensive details
  const persistAndLogLocalStorage = (apiResponse) => {
    try {
      const now = new Date().toISOString();
      console.log('[localStorage] BEGIN', now);

      // Prefer the new formatted structure from API
      const formatted = apiResponse?.data?.formattedCoordinates;
      const key = 'jharkhand_travel_coordinates';

      if (formatted) {
        localStorage.setItem(key, JSON.stringify(formatted));
        console.log('[localStorage] STORED KEY:', key);
        console.log('[localStorage] METADATA:', formatted?.metadata || {});
        // Clean up legacy key to avoid confusion
        if (localStorage.getItem('tavily_day1')) {
          localStorage.removeItem('tavily_day1');
          console.log('[localStorage] REMOVED LEGACY KEY: tavily_day1');
        }
      } else if (apiResponse?.data?.tavilyJson?.day1) {
        // Fallback to simple day1 JSON if present
        localStorage.setItem('tavily_day1', JSON.stringify(apiResponse.data.tavilyJson.day1));
        console.log('[localStorage] STORED KEY: tavily_day1');
        console.log('[localStorage] VALUE:', apiResponse.data.tavilyJson.day1);
      } else {
        console.log('[localStorage] No formatted coordinates found in API response');
      }

      // Read back and dump all keys with parsed preview
      const dump = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k) || '';
        let parsed = null;
        try { parsed = JSON.parse(v); } catch {}
        dump[k] = parsed ?? v;
        console.log(`  - key: ${k}, size: ${v.length} chars`);
      }
      console.log('[localStorage] FULL DUMP:', dump);
      console.log('[localStorage] END', new Date().toISOString());
    } catch (err) {
      console.error('[localStorage] ERROR:', err);
    }
  };

  const formatPlanContent = (planText) => {
    if (!planText) return null;

    // Remove coordinate brackets from display text
    const cleanText = planText.replace(/\[([^:]+):\s*(-?\d+\.?\d*),\s*(-?\d+\.?\d*)\]/g, '');
    
    // Split by markdown-style headers
    const sections = cleanText.split(/\*\*(.*?)\*\*/g).filter(section => section.trim());
    
    const formattedSections = [];
    
    for (let i = 0; i < sections.length; i += 2) {
      const title = sections[i]?.trim();
      const content = sections[i + 1]?.trim();
      
      if (title && content) {
        formattedSections.push({
          title: title,
          content: content
        });
      }
    }
    return formattedSections;
  };

  const renderPlanSection = (section) => {
    const { title, content } = section;
    
    // Handle different section types
    const getSectionIcon = (title) => {
      if (title.toLowerCase().includes('budget')) return '💰';
      if (title.toLowerCase().includes('destination')) return '🎯';
      if (title.toLowerCase().includes('transport')) return '🚗';
      if (title.toLowerCase().includes('accommodation')) return '🏨';
      if (title.toLowerCase().includes('itinerary')) return '📋';
      if (title.toLowerCase().includes('cost')) return '💳';
      return '📍';
    };

    const formatContent = (content) => {
      // Split by lines and format lists
      const lines = content.split('\n').map(line => line.trim()).filter(line => line);
      
      return lines.map((line, index) => {
        // Handle list items starting with -
        if (line.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start mb-2">
              <span className="text-green-600 mr-2 mt-1">•</span>
              <span className="flex-1">{line.substring(2)}</span>
            </div>
          );
        }
        
        // Handle day items (Day 1:, Day 2:, etc.)
        if (line.match(/^Day \d+:/i)) {
          return (
            <div key={index} className="bg-green-50 p-3 rounded-lg mb-2 border-l-4 border-green-400">
              <div className="font-semibold text-green-800">{line}</div>
            </div>
          );
        }
        
        // Handle cost items (Rs. amounts)
        if (line.includes('Rs.')) {
          return (
            <div key={index} className="bg-blue-50 p-2 rounded mb-1 text-blue-800 font-mono">
              {line}
            </div>
          );
        }
        
        // Regular content
        return (
          <div key={index} className="mb-2">
            {line}
          </div>
        );
      });
    };

    return (
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-xl mr-2">{getSectionIcon(title)}</span>
          {title}
        </h3>
        <div className="text-gray-700 space-y-1">
          {formatContent(content)}
        </div>
      </div>
    );
  };

  const getBudgetStatus = (planText) => {
    if (!planText) return null;
    
    // Extract budget analysis from the plan
    const budgetMatch = planText.match(/BUDGET ANALYSIS[:\s]*([^*]+)/i);
    if (!budgetMatch) return null;
    
    const budgetText = budgetMatch[1].trim();
    const isFeasible = budgetText.toLowerCase().includes('yes') || 
                      budgetText.toLowerCase().includes('feasible: yes');
    
    return {
      feasible: isFeasible,
      text: budgetText
    };
  };

  const MapComponent = ({ coordinates }) => {
    if (!coordinates || coordinates.length === 0) return null;

    return (
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-xl mr-2">🗺️</span>
          {language === 'hi' ? 'स्थान निर्देशांक' : 'Location Coordinates'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coordinates.map((coord, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border">
              <div className="font-medium text-gray-800">{coord.name}</div>
              <div className="text-sm text-gray-600 font-mono">
                {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
              </div>
              {coord.fallback && (
                <div className="text-xs text-orange-600 mt-1">
                  📍 {language === 'hi' ? 'अनुमानित स्थान' : 'Approximate location'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
            {language === 'hi' ? '🌿 अपनी झारखंड यात्रा की योजना बनाएं' : '🌿 Plan Your Jharkhand Journey'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'hi' ? 'एआई-संचालित यात्रा योजना, वास्तविक समय मूल्य और व्यक्तिगत सिफारिशें' : 'AI-powered travel planning with real-time pricing & personalized recommendations'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  📍 {language === 'hi' ? 'यात्रा विवरण' : 'Trip Details'}
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'hi' ? 'से (आपका शहर)' : 'From (Your City)'}
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    placeholder={language === 'hi' ? 'उदा., दिल्ली, मुंबई, कोलकाता' : 'e.g., Delhi, Mumbai, Kolkata'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-black focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'hi' ? 'लोग' : 'People'}
                    </label>
                    <input
                      type="number"
                      name="people"
                      value={formData.people}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'hi' ? 'दिन' : 'Days'}
                    </label>
                    <input
                      type="number"
                      name="days"
                      value={formData.days}
                      onChange={handleInputChange}
                      min="1"
                      max="14"
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'hi' ? 'कुल बजट' : 'Total Budget'} ({language === 'hi' ? '₹' : 'INR'})
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="5000"
                    step="1000"
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-green-500"
                  /> 
                  <p className="text-sm text-gray-500 mt-1">
                    {language === 'hi' ? 'प्रति व्यक्ति:' : 'Per person:'} {formatCurrency(Math.floor(formData.budget / formData.people))} |
                    {" "}{language === 'hi' ? 'प्रति दिन:' : 'Per day:'} {formatCurrency(Math.floor(formData.budget / formData.people / formData.days))}
                  </p>
                </div>
              </div>

              {/* Transport Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  🚗 {language === 'hi' ? 'परिवहन पसंद' : 'Transport Preference'}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {transportOptions.map(option => (
                    <label key={option.id} className="flex items-center p-3 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.transport.includes(option.id)}
                        onChange={() => handleCheckboxChange('transport', option.id)}
                        className="mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{option.icon}</span>
                        <div>
                          <div className="font-medium text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Travel Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  ❤️ {language === 'hi' ? 'आपको क्या पसंद है?' : 'What Interests You?'}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {preferenceOptions.map(option => (
                    <label key={option.id} className="flex items-center p-3 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.preferences.includes(option.id)}
                        onChange={() => handleCheckboxChange('preferences', option.id)}
                        className="mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{option.icon}</span>
                        <div>
                          <div className="font-medium text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 shadow-lg'
                } text-white`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'hi' ? 'आपकी योजना बनाई जा रही है...' : 'Creating Your Plan...'}
                  </span>
                ) : (
                  (language === 'hi' ? '✨ मेरी झारखंड योजना बनाएं' : '✨ Create My Jharkhand Plan')
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!result && !loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {language === 'hi' ? 'आपकी यात्रा योजना यहाँ दिखेगी' : 'Your Travel Plan Will Appear Here'}
                </h3>
                <p className="text-gray-500">
                  {language === 'hi' ? 'फॉर्म भरें और "मेरी योजना बनाएं" दबाएं!' : 'Fill out the form and hit "Create My Plan" to get started!'}
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-16">
                <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {language === 'hi' ? 'आपकी परफेक्ट ट्रिप तैयार की जा रही है...' : 'Crafting Your Perfect Trip...'}
                </h3>
                <p className="text-gray-500">
                  {language === 'hi' ? 'रियल-टाइम कीमतें खोजी जा रही हैं और व्यक्तिगत सिफारिशें बनाई जा रही हैं' : 'Searching real-time prices & creating personalized recommendations'}
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Header with Status */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-green-800 flex items-center">
                    🎯 {language === 'hi' ? 'आपकी यात्रा योजना' : 'Your Travel Plan'}
                  </h2>
                  {result.success && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <span className="text-lg mr-1">✅</span>
                      {language === 'hi' ? 'सफलतापूर्वक बनाई गई' : 'Generated Successfully'}
                    </span>
                  )}
                </div>

                {/* Budget Status Alert */}
                {result.success && (() => {
                  const budgetStatus = getBudgetStatus(result.plan);
                  if (budgetStatus && !budgetStatus.feasible) {
                    return (
                      <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg mb-6 flex items-start">
                        <span className="text-xl mr-2 mt-0.5">⚠️</span>
                        <div>
                          <div className="font-semibold mb-1">
                            {language === 'hi' ? 'बजट चेतावनी' : 'Budget Alert'}
                          </div>
                          <div className="text-sm">
                            {language === 'hi' ? 'आपका बजट इस यात्रा के लिए पर्याप्त नहीं हो सकता। कृपया बजट बढ़ाने या दिन कम करने पर विचार करें।' 
                                              : 'Your budget might not be sufficient for this trip. Please consider increasing the budget or reducing the number of days.'}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                {/* Main Plan Content */}
                <div className="space-y-4">
                  {result.success ? (
                    <>
                      {formatPlanContent(result.plan)?.map((section, index) => (
                        <div key={index}>
                          {renderPlanSection(section)}
                        </div>
                      ))}
                      
                      {/* Coordinates Map */}
                      <MapComponent coordinates={result.coordinates} />
                      
                      {/* Recommended Destinations */}
                      {result.destinations && result.destinations.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                            <span className="text-xl mr-2">📍</span>
                            {language === 'hi' ? 'सुझाए गए गंतव्य:' : 'Recommended Destinations:'}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.destinations.map((dest, index) => (
                              <span key={index} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {dest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Search Data Info */}
                      {result.searchData && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-sm text-blue-700">
                          <span className="text-lg mr-2">🔍</span>
                          {language === 'hi' ? `${result.searchData} रियल-टाइम खोजें की गईं` : `${result.searchData} real-time searches performed`}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                      <span className="text-xl mr-2">❌</span>
                      <div>
                        <div className="font-semibold mb-1">
                          {language === 'hi' ? 'योजना बनाने में त्रुटि' : 'Plan Generation Error'}
                        </div>
                        <div className="text-sm">
                          {result.error || result.plan}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerForm;