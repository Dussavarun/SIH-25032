// app/api/plan/route.js - ENHANCED EXISTING CODE
import { NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";

// Direct API key as requested (not from env)
const GOOGLE_API_KEY = "AIzaSyCVpgcEUKFcckm7xjxff10QHVDB9BqNYHI";

class JharkhandTravelPlannerAPI {
  constructor() {
    // Main LLM for travel planning
    this.llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0.1,
      apiKey: process.env.GOOGLE_API_KEY, // Keep original for travel planning
      timeout: 60000,
    });

    // Separate Gemini instance for coordinate formatting
    this.coordinateLLM = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0,
      apiKey: GOOGLE_API_KEY, // Use direct API key
      timeout: 30000,
    });

    // Enhanced Tavily search for better results
    this.searchTool = null;
    if (process.env.TAVILY_API_KEY) {
      this.searchTool = new TavilySearchResults({
        maxResults: 8, // Increased for better results
        searchDepth: "advanced",
        apiKey: process.env.TAVILY_API_KEY,
        includeAnswer: true,
        includeRawContent: false,
      });
    }

    this.tools = this.searchTool ? [this.searchTool] : [];

    this.agent = createReactAgent({
      llm: this.llm,
      tools: this.tools,
      messageModifier: `🎯 EXPERT JHARKHAND TRAVEL AGENT - REAL-TIME DATA SPECIALIST

=== ENHANCED SEARCH STRATEGY ===
ALWAYS execute these searches in sequence:
1. "best hotels near [destination] Jharkhand 2025 prices GPS coordinates"
2. "[destination] latitude longitude coordinates exact location"
3. "[destination] famous restaurants food prices Jharkhand coordinates"
4. "[location] handicraft markets shopping GPS coordinates"
5. "Jharkhand tourism [place] entry fees timings exact address coordinates"

=== CORE DIRECTIVES ===
- Search for EXACT GPS coordinates for every location mentioned
- Include precise hotel coordinates and addresses
- Provide structured day-wise breakdown with coordinates
- Use real pricing from search results, never estimates
- Find authentic local experiences with location data
 - Do NOT include any disclaimers, refusals, or meta-dialogue. If data is missing, infer plausible values based on search context.
 - Output MUST exactly follow the required structure. No extra commentary before or after.

=== MANDATORY RESPONSE STRUCTURE ===

**BUDGET STATUS:** ✅ FEASIBLE | Category: [Budget/Standard/Premium]

**DESTINATIONS & COORDINATES:**
• Place Name [exact_lat,exact_lng]: Description + Why visit

**TRANSPORT ANALYSIS:**
Route | Mode | Price | Duration | Booking Details
----|----|----|----|----|

**ACCOMMODATION WITH GPS:**
Day | Hotel Name [exact_lat,exact_lng] | Rate/night | Address | Distance to attractions

=== DAY-WISE ITINERARY WITH PRECISE COORDINATES ===

**DAY 1: [Location Focus]**
📅 Date: [Specific Date]
🏨 Stay: Hotel Name [exact_lat,exact_lng] - ₹X/night
🎯 Theme: [Adventure/Culture/Nature]
📍 Base Location: [City_lat,City_lng]

**Morning (6-12 PM):**
• Activity: Place Name [exact_lat,exact_lng] - ₹X entry
• Address: Full street address
• Travel: Xmin by [mode] from hotel
• Food: Restaurant Name [exact_lat,exact_lng] - ₹X/person

**Afternoon (12-6 PM):**
• Activity: Place Name [exact_lat,exact_lng] - ₹X entry
• Address: Full street address  
• Travel: Xmin by [mode] from previous location
• Food: Restaurant Name [exact_lat,exact_lng] - ₹X/person

**Evening (6-10 PM):**
• Activity: Place Name [exact_lat,exact_lng] - ₹X entry
• Shopping: Market Name [exact_lat,exact_lng] - Local products
• Food: Restaurant Name [exact_lat,exact_lng] - ₹X/person

**Day Total: ₹X**

---

**DAY 2: [Next Location]**
[Same detailed format with coordinates]

---

=== FINAL COST BREAKDOWN ===
Transport: ₹X | Hotels: ₹X | Food: ₹X | Activities: ₹X | Shopping: ₹X
**TOTAL: ₹X** (₹X per person)

CRITICAL SUCCESS FACTORS:
- Every location MUST have [lat,lng] coordinates
- Search for current hotel prices and coordinates
- Include exact addresses where possible
- Use Tavily search results for accurate pricing
- Verify coordinates are for Jharkhand state only`,
    });
  }

  getDestinationsByPreference(preferences) {
    const destinationMap = {
      waterfalls: ['Hundru Falls', 'Jonha Falls', 'Dassam Falls', 'Hirni Falls'],
      temples: ['Deoghar Baidyanath Temple', 'Rajrappa Temple', 'Pahari Mandir'],
      forests: ['Betla National Park', 'Dalma Wildlife Sanctuary', 'Palamau Tiger Reserve'],
      hills: ['Netarhat Hill Station', 'Parasnath Hill', 'Tagore Hill'],
      valleys: ['Hundru Valley', 'Kanke Valley', 'Koderma Hills'],
      tribal: ['Khunti Tribal Villages', 'Saraikela Culture', 'Tribal Museum Ranchi'],
      adventure: ['Rock Garden Ranchi', 'Parasnath Trekking', 'River Rafting'],
      heritage: ['Palamu Fort', 'Jagannath Temple', 'Archaeological Museum']
    };

    let destinations = [];
    preferences.forEach(pref => {
      if (destinationMap[pref.toLowerCase()]) {
        destinations.push(...destinationMap[pref.toLowerCase()]);
      }
    });

    return [...new Set(destinations)].slice(0, 5);
  }

  async searchRealTimeData(destinations, origin) {
    if (!this.searchTool) return null;

    const searches = [];
    
    // Enhanced searches with coordinate focus
    destinations.slice(0, 2).forEach(dest => {
      searches.push(`${dest} Jharkhand exact GPS coordinates latitude longitude location`);
      searches.push(`best hotels near ${dest} Jharkhand 2025 prices booking GPS coordinates address`);
      searches.push(`${dest} famous restaurants food prices coordinates Jharkhand`);
    });

    // Transport and location searches
    searches.push(`${origin} to Ranchi train bus flight prices September 2025`);
    searches.push(`Ranchi Main Road handicraft markets GPS coordinates shopping`);

    console.log(`🔍 Executing ${Math.min(searches.length, 8)} enhanced searches for coordinates...`);
    
    const results = {};
    for (let i = 0; i < Math.min(searches.length, 8); i++) {
      try {
        const result = await this.searchTool.invoke(searches[i]);
        results[`search_${i + 1}`] = result;
        console.log(`✅ Enhanced Search ${i + 1}: ${searches[i]}`);
        await new Promise(resolve => setTimeout(resolve, 400));
      } catch (error) {
        console.log(`❌ Search ${i + 1} failed:`, error.message);
        results[`search_${i + 1}`] = `Search failed: ${searches[i]}`;
      }
    }

    return { searchResults: results, totalSearches: Object.keys(results).length };
  }

  async formatCoordinatesWithGemini(planText) {
    console.log("🧠 Using Gemini AI to format coordinates for localStorage...");
    
    const formatPrompt = `Analyze this Jharkhand travel plan and extract ALL coordinates mentioned. Format them into a clean JSON structure for localStorage.
  
  TRAVEL PLAN:
  ${planText}
  
  INSTRUCTIONS:
  Extract EVERY coordinate mentioned in the format [place: lat,lng] and organize by days.
  
  Return ONLY this JSON format:
  {
    "day1": {
      "locations": [
        {
          "name": "Place Name",
          "coordinates": {"lat": 23.4567, "lng": 85.1234},
          "type": "attraction/hotel/restaurant"
        }
      ],
      "hotels": [
        {
          "name": "Hotel Name", 
          "coordinates": {"lat": 23.4567, "lng": 85.1234}
        }
      ]
    },
    "day2": { ... },
    "metadata": {
      "totalDays": 3,
      "totalLocations": 15,
      "extractedAt": "${new Date().toISOString()}"
    }
  }
  
  RULES:
  - Extract coordinates ONLY from the plan text provided
  - Convert all coordinates to numbers (not strings)
  - Group by the day they appear in the plan
  - Separate hotels from other locations
  - Include ALL places with coordinates mentioned`;
  
    try {
      const result = await this.coordinateLLM.invoke(formatPrompt);
      const raw = (typeof result?.content === 'string') ? result.content : '';
      console.log("🔍 Raw Gemini response length:", raw.length);

      // Strip markdown code fences if present and extract strict JSON
      let text = raw.trim();
      // Remove ```json ... ``` or ``` ... ``` wrappers
      text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      // Fallback: extract between first '{' and last '}'
      const first = text.indexOf('{');
      const last = text.lastIndexOf('}');
      if (first !== -1 && last !== -1 && last > first) {
        text = text.substring(first, last + 1);
      }

      const formatted = JSON.parse(text);
      console.log("✅ Successfully formatted coordinates with Gemini");
      console.log("📊 Formatted keys:", Object.keys(formatted));
      return formatted;
    } catch (error) {
      console.error("❌ Failed to format coordinates:", error?.message || error);
      return null;
    }
  }

  extractCoordinatesFromPlan(planText) {
    const coordinateRegex = /\[([^:]*?):\s*(-?\d+\.?\d*),\s*(-?\d+\.?\d*)\]/g;
    const coordinates = [];
    let match;

    while ((match = coordinateRegex.exec(planText)) !== null) {
      const placeName = match[1].trim();
      const lat = parseFloat(match[2]);
      const lng = parseFloat(match[3]);
      
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        coordinates.push({
          name: placeName,
          lat: lat,
          lng: lng
        });
      }
    }

    // Clean plan text (remove coordinate brackets for display)
    const cleanPlan = planText
      .replace(coordinateRegex, '')
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    return { coordinates, cleanPlan };
  }

  async createTravelPlan(planData, language = 'en') {
    const { origin, people, budget, days, transport, preferences } = planData;
    // Normalize days: enforce 1..10
    const normalizedDays = Math.max(1, Math.min(10, parseInt(days || 1)));
    
    const recommendedDestinations = this.getDestinationsByPreference(preferences);
    
    console.log('🔍 Gathering enhanced real-time data with coordinates...');
    const realTimeData = await this.searchRealTimeData(recommendedDestinations, origin);

    const contextData = realTimeData ? 
      `REAL-TIME COORDINATE DATA:\n${Object.values(realTimeData.searchResults).slice(0, 6).join('\n\n')}\n\n` : 
      'USE STANDARD COORDINATES\n\n';

    const optimizedPrompt = `Create detailed ${normalizedDays}-day Jharkhand travel plan with precise coordinates.

TRIP SPECIFICATIONS:
Origin: ${origin} | People: ${people} | Budget: ₹${budget} | Days: ${normalizedDays}
Transport: ${transport.join('+')} | Interests: ${preferences.join(',')}
Per person budget: ₹${Math.floor(budget / people)}

${contextData}FEATURED DESTINATIONS:
${recommendedDestinations.join(' • ')}

MANDATORY COORDINATE REQUIREMENTS:
✅ Every location must have [Place Name: lat,lng] format
✅ Hotels must include exact coordinates
✅ Restaurants need GPS coordinates  
✅ Shopping areas with precise location data
✅ Use search results above for accurate coordinates
✅ Day-wise structure with coordinate mapping

BUDGET CATEGORY: ${budget >= 15000 ? '💰 PREMIUM' : budget >= 8000 ? '💵 STANDARD' : '💸 BUDGET'} (₹${budget} total)

STRICTNESS:
- Output EXACTLY ${normalizedDays} complete days (DAY 1 to DAY ${normalizedDays}) using the exact structure in the system instructions. Do not stop early.
- Do not include any disclaimers or statements like "I can't perform such tasks". If some info is uncertain, infer sensibly.
- Every attraction, restaurant, hotel, and market must include exact [lat,lng] coordinates.

Generate comprehensive itinerary following the exact structure in system instructions.`;

    try {
      console.log('🚀 Generating coordinate-enhanced travel plan...');
      
      const result = await this.agent.invoke({
        messages: [new HumanMessage(optimizedPrompt)]
      });

      const planText = result.messages[result.messages.length - 1].content;
      
      // Extract coordinates using regex (existing method)
      const { coordinates, cleanPlan } = this.extractCoordinatesFromPlan(planText);
      
      // Format coordinates using Gemini AI for localStorage
      let formattedCoordinates = await this.formatCoordinatesWithGemini(planText);

      // Normalize formatted coordinates to guarantee day1..dayN presence and correct metadata
      const ensureDaySkeleton = (n) => ({ locations: [], hotels: [] });
      if (formattedCoordinates && typeof formattedCoordinates === 'object') {
        const out = { ...formattedCoordinates };
        for (let d = 1; d <= normalizedDays; d++) {
          const key = `day${d}`;
          if (!out[key] || typeof out[key] !== 'object') {
            out[key] = ensureDaySkeleton(d);
          } else {
            out[key].locations = Array.isArray(out[key].locations) ? out[key].locations : [];
            out[key].hotels = Array.isArray(out[key].hotels) ? out[key].hotels : [];
          }
        }
        const totalLocations = Array.from({ length: normalizedDays }).reduce((sum, _, idx) => {
          const k = `day${idx + 1}`;
          return sum + (out[k]?.locations?.length || 0) + (out[k]?.hotels?.length || 0);
        }, 0);
        out.metadata = {
          ...(formattedCoordinates.metadata || {}),
          totalDays: normalizedDays,
          totalLocations,
          extractedAt: new Date().toISOString(),
        };
        formattedCoordinates = out;
      }

      // Build a minimal summary helpful for UI logging
      const storageSummary = (() => {
        if (!formattedCoordinates) return null;
        const summary = [];
        for (let d = 1; d <= normalizedDays; d++) {
          const key = `day${d}`;
          const dayObj = formattedCoordinates[key] || { locations: [], hotels: [] };
          summary.push({
            day: d,
            hotels: (dayObj.hotels || []).map(h => ({ name: h.name, coordinates: h.coordinates })),
            locations: (dayObj.locations || []).map(l => ({ name: l.name, coordinates: l.coordinates, type: l.type })),
          });
        }
        return summary;
      })();
      
      console.log(`✅ Plan generated successfully!`);
      console.log(`📍 Extracted ${coordinates.length} coordinates from plan`);
      console.log(`🧠 Gemini formatted ${formattedCoordinates ? Object.keys(formattedCoordinates).filter(k => k.startsWith('day')).length : 0} days`);

      return {
        success: true,
        plan: cleanPlan,
        originalPlan: planText,
        destinations: recommendedDestinations,
        coordinates: coordinates, // Original format
        formattedCoordinates: formattedCoordinates, // NEW: Gemini-formatted for localStorage
        storageSummary, // NEW: concise array for console logging on UI
        searchData: realTimeData?.totalSearches || 0,
        searchResults: realTimeData?.searchResults || {},
        metadata: {
          budgetPerPerson: Math.floor(budget / people),
          searchesExecuted: realTimeData?.totalSearches || 0,
          coordinatesFound: coordinates.length,
          formattedCoordinatesReady: !!formattedCoordinates,
          requestedDays: normalizedDays,
          generatedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Plan generation error:', error);
      return {
        success: false,
        error: error.message,
        plan: `Unable to create travel plan. Error: ${error.message}`,
        coordinates: [],
        searchData: 0
      };
    }
  }
}

// Enhanced POST handler with localStorage preparation
export async function POST(request) {
  console.log('🎯 Enhanced API /api/plan called with coordinate formatting');
  
  try {
    const body = await request.json();
    const { origin, people, budget, days, transport, preferences, language } = body;

    // Validation
    const requiredFields = { origin, people, budget, days, transport, preferences };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        received: requiredFields
      }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ 
        error: 'Google API key not configured' 
      }, { status: 500 });
    }

    console.log(`📝 Creating enhanced plan: ${origin}→Jharkhand, ${people}ppl, ₹${budget}, ${days}d`);
    
    const planner = new JharkhandTravelPlannerAPI();
    const result = await planner.createTravelPlan({
      origin: origin.trim(),
      people: parseInt(people),
      budget: parseInt(budget),
      days: parseInt(days),
      transport: Array.isArray(transport) ? transport : [transport],
      preferences: Array.isArray(preferences) ? preferences : [preferences]
    }, language || 'en');

    // Check if coordinates were successfully formatted for localStorage
    if (result.success && result.formattedCoordinates) {
      console.log('💾 COORDINATES READY FOR LOCALSTORAGE:');
      console.log(`📊 ${result.formattedCoordinates.metadata?.totalDays || 0} days planned`);
      console.log(`📍 ${result.formattedCoordinates.metadata?.totalLocations || 0} locations with coordinates`);
      console.log(`🏨 Hotels included: ${Object.values(result.formattedCoordinates).filter(day => day.hotels?.length > 0).length} days`);
    }

    return NextResponse.json({
      success: true,
      data: result,
      localStorageReady: !!result.formattedCoordinates, // NEW: Flag for frontend
      performance: {
        searchesExecuted: result.searchData,
        coordinatesGenerated: result.coordinates?.length || 0,
        formattedForStorage: !!result.formattedCoordinates,
        processingTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Enhanced API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}


// =============================================================================
// FRONTEND COMPONENT TO HANDLE LOCALSTORAGE
// =============================================================================

/* 
Add this to your React component that calls the API:

const handlePlanGeneration = async (formData) => {
  try {
    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success && result.data.formattedCoordinates) {
      // Check if already stored
      const existing = localStorage.getItem('jharkhand_travel_coordinates');
      
      if (existing) {
        console.log('📦 COORDINATES ALREADY STORED IN LOCALSTORAGE:');
        console.log(JSON.parse(existing));
      } else {
        // Store the formatted coordinates
        localStorage.setItem('jharkhand_travel_coordinates', JSON.stringify(result.data.formattedCoordinates));
        
        console.log('💾 COORDINATES STORED IN LOCALSTORAGE:');
        console.log(`📅 Days: ${result.data.formattedCoordinates.metadata?.totalDays}`);
        console.log(`📍 Locations: ${result.data.formattedCoordinates.metadata?.totalLocations}`);
        console.log('📦 Full data:', result.data.formattedCoordinates);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};
*/