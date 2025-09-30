import { NextResponse } from "next/server";

// --- Database of common fertilizers ---
const fertilizerDatabase = {
  urea: {
    name: "Urea",
    npk: "46-0-0",
    reason: "Excellent source of Nitrogen (N) for promoting leafy, vegetative growth.",
    application: "Apply during the early to mid-growth stages. Avoid direct contact with seeds."
  },
  dap: {
    name: "Di-Ammonium Phosphate (DAP)",
    npk: "18-46-0",
    reason: "High in Phosphorus (P) for strong root development and flowering.",
    application: "Best applied at the time of sowing or for young plants."
  },
  mop: {
    name: "Muriate of Potash (MOP)",
    npk: "0-0-60",
    reason: "Concentrated source of Potassium (K) for overall plant health and fruit quality.",
    application: "Apply during the flowering and fruiting stages."
  },
  compost: {
    name: "Organic Compost",
    npk: "Varies",
    reason: "Improves soil structure, water retention, and provides a slow-release of essential micronutrients.",
    application: "Mix into the soil before planting or use as a top dressing."
  }
};

// --- NEW: Database of crop-specific nutrient needs ---
const cropNutrientNeeds = {
  "Default": { primary: "All", notes: "A balanced fertilizer is generally a safe choice." },
  "Rice": { primary: "Nitrogen", notes: "Rice has a high demand for Nitrogen, especially during its vegetative stage to ensure healthy growth." },
  "Wheat": { primary: "Nitrogen", notes: "Nitrogen is crucial for achieving high yields and protein content in wheat." },
  "Maize": { primary: "Nitrogen", notes: "Maize is a heavy feeder of Nitrogen, essential for its rapid growth." },
  "Cotton": { primary: "Nitrogen", notes: "Nitrogen is vital for cotton's early growth, but excess can delay maturity." },
  "Sugarcane": { primary: "Potassium", notes: "Potassium is key for sugarcane's stalk growth and sugar accumulation." },
  "Potatoes": { primary: "Potassium", notes: "Potassium is essential for tuber development and quality in potatoes." },
  "Tomatoes": { primary: "Potassium", notes: "Tomatoes require high levels of Potassium for fruit development and disease resistance." },
};

export async function POST(request) {
  try {
    const data = await request.json();
    // --- MODIFIED: Get all inputs from the request body ---
    const { npk, soilType, crop } = data;

    if (!npk || !soilType || !crop) {
      return NextResponse.json({ error: "Invalid data: NPK, soilType, and crop are required." }, { status: 400 });
    }

    const { nitrogen, phosphorus, potassium } = npk;
    const recommendations = new Map();

    const LOW_N_THRESHOLD = 15;
    const LOW_P_THRESHOLD = 10;
    const LOW_K_THRESHOLD = 10;

    const cropNeeds = cropNutrientNeeds[crop] || cropNutrientNeeds["Default"];

    // --- NEW: More intelligent recommendation logic ---

    // 1. Check for nutrient deficiencies
    if (nitrogen < LOW_N_THRESHOLD) {
      recommendations.set("urea", { ...fertilizerDatabase.urea });
    }
    if (phosphorus < LOW_P_THRESHOLD) {
      recommendations.set("dap", { ...fertilizerDatabase.dap });
    }
    if (potassium < LOW_K_THRESHOLD) {
      recommendations.set("mop", { ...fertilizerDatabase.mop });
    }

    // 2. Prioritize based on the selected crop's primary need
    if (cropNeeds.primary === "Nitrogen" && recommendations.has("urea")) {
      recommendations.get("urea").reason = `CRITICAL: Your selected crop, ${crop}, has a high demand for Nitrogen, which is currently low in your soil.`;
    }
    if (cropNeeds.primary === "Potassium" && recommendations.has("mop")) {
      recommendations.get("mop").reason = `CRITICAL: Your selected crop, ${crop}, requires significant Potassium for healthy growth, which is currently low in your soil.`;
    }

    // 3. Always recommend compost for soil health
    recommendations.set("compost", { ...fertilizerDatabase.compost });
    
    // 4. Generate dynamic notes based on soil type and crop
    let finalNotes = cropNeeds.notes;
    if (soilType === "Sandy") {
      finalNotes += " Sandy soil drains quickly, so consider smaller, more frequent fertilizer applications.";
    } else if (soilType === "Clay") {
      finalNotes += " Clay soil retains nutrients well, but ensure good drainage to prevent waterlogging.";
    }

    return NextResponse.json({
      fertilizers: Array.from(recommendations.values()),
      notes: finalNotes
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}