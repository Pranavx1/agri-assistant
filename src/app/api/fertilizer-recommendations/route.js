import { NextResponse } from "next/server";

// --- Fertilizer Database ---
// A simple database of common fertilizers and their properties.
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
    reason: "Concentrated source of Potassium (K) for overall plant health, fruit quality, and disease resistance.",
    application: "Apply during the flowering and fruiting stages."
  },
  balanced: {
    name: "Balanced NPK (e.g., 19-19-19 or 20-20-20)",
    npk: "Varies (e.g., 19-19-19)",
    reason: "Provides an equal ratio of all three primary nutrients, ideal for general purpose feeding or when all nutrients are low.",
    application: "Can be used throughout the growth cycle, especially for vegetables."
  },
  compost: {
    name: "Organic Compost",
    npk: "Varies (e.g., 2-1-1)",
    reason: "Improves soil structure and provides a slow-release, balanced mix of micronutrients.",
    application: "Mix into the soil before planting or use as a top dressing."
  }
};

export async function POST(request) {
  try {
    const sensorData = await request.json();

    if (!sensorData || !sensorData.npk) {
      return NextResponse.json({ error: "Invalid sensor data provided" }, { status: 400 });
    }

    const { nitrogen, phosphorus, potassium } = sensorData.npk;
    let recommendations = [];

    // --- Recommendation Logic based on NPK values ---
    // NOTE: These thresholds are for demonstration. Real-world values would be more nuanced.
    const LOW_THRESHOLD = 10; 

    // If all nutrients are very low, suggest a balanced approach first.
    if (nitrogen < LOW_THRESHOLD && phosphorus < LOW_THRESHOLD && potassium < LOW_THRESHOLD) {
      recommendations.push(fertilizerDatabase.balanced);
      recommendations.push(fertilizerDatabase.compost);
    } else {
      // Recommend specific fertilizers based on the lowest detected nutrient.
      if (nitrogen < LOW_THRESHOLD) {
        recommendations.push(fertilizerDatabase.urea);
      }
      if (phosphorus < LOW_THRESHOLD) {
        recommendations.push(fertilizerDatabase.dap);
      }
      if (potassium < LOW_THRESHOLD) {
        recommendations.push(fertilizerDatabase.mop);
      }
    }
    
    // If readings are fine, recommend compost for soil health
    if (recommendations.length === 0) {
        recommendations.push(fertilizerDatabase.compost);
    }

    // Ensure no duplicates
    const finalRecommendations = [...new Map(recommendations.map(item => [item.name, item])).values()];
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      fertilizers: finalRecommendations,
      notes: "Always test soil pH before application, as it affects nutrient absorption. Follow product instructions for dosage based on your land size."
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}