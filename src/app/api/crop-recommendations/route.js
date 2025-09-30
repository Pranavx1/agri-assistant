import { NextResponse } from "next/server";

// --- MODIFIED: Crop Database now includes preferred soil types ---
const cropDatabase = [
    {
        name: "Rice",
        idealTemp: [25, 35],
        idealHumidity: [70, 90],
        preferredSoil: ["Clay", "Loamy"],
        notes: "Requires significant water and high humidity. Thrives in clay and loamy soils."
    },
    {
        name: "Wheat",
        idealTemp: [15, 25],
        idealHumidity: [50, 70],
        preferredSoil: ["Loamy"],
        notes: "A staple crop that prefers well-drained loamy soil."
    },
    {
        name: "Maize",
        idealTemp: [21, 27],
        idealHumidity: [60, 80],
        preferredSoil: ["Loamy", "Sandy"],
        notes: "Versatile crop that thrives in warm weather and sandy or loamy soils."
    },
    {
        name: "Cotton",
        idealTemp: [25, 35],
        idealHumidity: [50, 65],
        preferredSoil: ["Sandy", "Loamy"],
        notes: "Prefers hot temperatures and well-drained sandy loam."
    },
    {
        name: "Sugarcane",
        idealTemp: [26, 33],
        idealHumidity: [75, 90],
        preferredSoil: ["Clay", "Loamy"],
        notes: "A tropical plant that requires high heat and moisture-retentive soils."
    },
    {
        name: "Jute",
        idealTemp: [24, 35],
        idealHumidity: [70, 90],
        preferredSoil: ["Loamy", "Silty"],
        notes: "A fiber crop that loves alluvial (silty and loamy) soils."
    },
    {
        name: "Coffee",
        idealTemp: [18, 25],
        idealHumidity: [70, 80],
        preferredSoil: ["Loamy", "Peaty"],
        notes: "Prefers moderate temperatures and well-drained, acidic loamy soils."
    }
];

export async function POST(request) {
  try {
    // 1. Get all data from the request
    const sensorData = await request.json();
    // --- MODIFIED: Destructure soilType from the request body ---
    const { soilType } = sensorData;

    if (!sensorData || !sensorData.dht || !soilType) {
      return NextResponse.json({ error: "Invalid data: temperature, humidity, and soilType are required." }, { status: 400 });
    }

    const { temperature, humidity } = sensorData.dht;

    // 2. Score each crop based on the sensor data and soil type
    const cropScores = cropDatabase.map(crop => {
      let score = 0;

      // Score based on temperature
      if (temperature >= crop.idealTemp[0] && temperature <= crop.idealTemp[1]) {
        score += 3;
      } else if (Math.abs((crop.idealTemp[0] + crop.idealTemp[1]) / 2 - temperature) < 5) {
        score += 1;
      }

      // Score based on humidity
      if (humidity >= crop.idealHumidity[0] && humidity <= crop.idealHumidity[1]) {
        score += 2;
      }

      // --- NEW: Score based on selected soil type ---
      if (crop.preferredSoil.includes(soilType)) {
        score += 3; // High score for matching the preferred soil type
      }

      return { name: crop.name, score, notes: crop.notes };
    });

    // 3. Sort and filter the results (logic remains the same)
    cropScores.sort((a, b) => b.score - a.score);
    const topCrops = cropScores.filter(crop => crop.score > 2).slice(0, 3); // Increased minimum score for better results

    if (topCrops.length === 0) {
      return NextResponse.json({
        crops: ["Millet (Resilient Option)"],
        notes: "Current conditions are challenging for most crops. Millet is a highly resilient alternative."
      });
    }

    // 4. Format the final response (logic remains the same)
    const recommendedCrops = topCrops.map(c => c.name);
    const recommendationNotes = `Based on the current temperature, humidity, and ${soilType.toLowerCase()} soil, ${topCrops[0].name} is an excellent choice. ${topCrops[0].notes}`;

    return NextResponse.json({
      crops: recommendedCrops,
      notes: recommendationNotes,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}