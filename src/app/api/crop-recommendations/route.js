import { NextResponse } from "next/server";

// --- Crop Database ---
// A simple database of crops and their ideal growing conditions.
// In a real-world application, this would be a much larger database.
const cropDatabase = [
  {
    name: "Rice",
    idealTemp: [25, 35], // Ideal temperature range in Celsius
    idealHumidity: [70, 90], // Ideal humidity range in %
    notes: "Requires significant water and high humidity."
  },
  {
    name: "Wheat",
    idealTemp: [15, 25],
    idealHumidity: [50, 70],
    notes: "A staple crop that prefers cooler, moderate conditions."
  },
  {
    name: "Maize (Corn)",
    idealTemp: [21, 27],
    idealHumidity: [60, 80],
    notes: "Versatile crop that thrives in warm and humid weather."
  },
  {
    name: "Cotton",
    idealTemp: [25, 35],
    idealHumidity: [50, 65],
    notes: "Prefers hot temperatures but moderate humidity."
  },
  {
    name: "Sugarcane",
    idealTemp: [26, 33],
    idealHumidity: [75, 90],
    notes: "A tropical plant that requires high heat and moisture."
  },
  {
    name: "Potatoes",
    idealTemp: [15, 20],
    idealHumidity: [60, 75],
    nutrientBoost: "potassium", // This crop benefits from higher potassium
    notes: "A cool-weather crop that benefits from potassium for tuber growth."
  },
  {
    name: "Tomatoes",
    idealTemp: [21, 29],
    idealHumidity: [65, 85],
    nutrientBoost: "potassium",
    notes: "Loves warm weather and potassium for fruiting."
  },
  {
    name: "Millet",
    idealTemp: [26, 30],
    idealHumidity: [30, 50],
    notes: "Extremely drought-resistant, perfect for arid conditions."
  },
];

export async function POST(request) {
  try {
    // 1. Get sensor data from the request
    const sensorData = await request.json();

    // Validate that the necessary data exists
    if (!sensorData || !sensorData.dht || !sensorData.npk) {
      return NextResponse.json({ error: "Invalid sensor data provided" }, { status: 400 });
    }

    const { temperature, humidity } = sensorData.dht;
    const { potassium } = sensorData.npk;

    // 2. Score each crop based on the sensor data
    const cropScores = cropDatabase.map(crop => {
      let score = 0;

      // Score based on temperature
      if (temperature >= crop.idealTemp[0] && temperature <= crop.idealTemp[1]) {
        score += 3; // High score for being in the ideal range
      } else if (Math.abs((crop.idealTemp[0] + crop.idealTemp[1]) / 2 - temperature) < 5) {
        score += 1; // Lower score for being close to the ideal range
      }

      // Score based on humidity
      if (humidity >= crop.idealHumidity[0] && humidity <= crop.idealHumidity[1]) {
        score += 2; // High score for ideal humidity
      }

      // Bonus score for specific nutrient needs (e.g., potassium for potatoes/tomatoes)
      if (crop.nutrientBoost === "potassium" && potassium > 0) {
        score += 1;
      }
      
      return { name: crop.name, score, notes: crop.notes };
    });

    // 3. Sort the crops by score in descending order
    cropScores.sort((a, b) => b.score - a.score);

    // 4. Filter out crops with a score of 0 and get the top 3 recommendations
    const topCrops = cropScores.filter(crop => crop.score > 0).slice(0, 3);

    if (topCrops.length === 0) {
      return NextResponse.json({
        crops: ["Millet"],
        notes: "Current conditions are challenging. Millet is a highly resilient option."
      });
    }

    // 5. Format the final response
    const recommendedCrops = topCrops.map(c => c.name);
    const recommendationNotes = `Based on the current conditions, ${topCrops[0].name} appears to be an excellent choice. ${topCrops[0].notes}`;

    return NextResponse.json({
      crops: recommendedCrops,
      notes: recommendationNotes,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}