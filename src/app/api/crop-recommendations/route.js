import { NextResponse } from "next/server";

// Knowledge base capturing soil specific combinations of temperature, humidity, and crops.
const soilKnowledgeBase = {
  Loamy: [
    {
      temperature: [16, 26],
      humidity: [45, 65],
      crops: ["Wheat", "Barley", "Pea"],
      description: "Cool to mild weather in loamy soil favours small grains and legumes.",
      priority: 2,
    },
    {
      temperature: [24, 32],
      humidity: [55, 75],
      crops: ["Maize", "Soybean", "Groundnut"],
      description: "Warm, moderately humid conditions drive strong growth for grains and oilseeds.",
      priority: 2,
    },
    {
      temperature: [28, 36],
      humidity: [65, 90],
      crops: ["Rice", "Sugarcane"],
      description: "High heat and humidity with moisture retentive loam suits water-loving crops.",
      priority: 3,
    },
  ],
  Sandy: [
    {
      temperature: [22, 32],
      humidity: [35, 55],
      crops: ["Millet", "Groundnut", "Cotton"],
      description: "Fast-draining sand with lower humidity rewards drought tolerant crops.",
      priority: 3,
    },
    {
      temperature: [25, 35],
      humidity: [45, 65],
      crops: ["Watermelon", "Sweet Potato", "Sunflower"],
      description: "Warm, moderately moist conditions suit sprawling vines and oilseeds.",
      priority: 2,
    },
    {
      temperature: [18, 26],
      humidity: [40, 60],
      crops: ["Carrot", "Onion", "Cabbage"],
      description: "Cooler spells allow hardy vegetables to thrive even in sandy beds.",
      priority: 1,
    },
  ],
  Clay: [
    {
      temperature: [20, 30],
      humidity: [65, 90],
      crops: ["Rice", "Sugarcane", "Taro"],
      description: "Heavy clay retains water, making it ideal for water-intensive crops.",
      priority: 3,
    },
    {
      temperature: [16, 24],
      humidity: [55, 75],
      crops: ["Mustard", "Chickpea", "Lentil"],
      description: "Cooler seasons support pulses that tolerate heavier soils.",
      priority: 2,
    },
    {
      temperature: [24, 32],
      humidity: [50, 70],
      crops: ["Cotton", "Wheat"],
      description: "Managed clay fields can support fibre crops when humidity stays moderate.",
      priority: 1,
    },
  ],
  Silty: [
    {
      temperature: [20, 30],
      humidity: [60, 85],
      crops: ["Rice", "Jute", "Sugar Beet"],
      description: "Fertile silts stay moist and favour fibre and sugar crops.",
      priority: 2,
    },
    {
      temperature: [15, 22],
      humidity: [55, 75],
      crops: ["Potato", "Pea", "Cabbage"],
      description: "Cool, moist weather benefits tubers and leafy vegetables.",
      priority: 1,
    },
    {
      temperature: [24, 32],
      humidity: [50, 70],
      crops: ["Maize", "Soybean"],
      description: "Warmth with balanced humidity delivers dependable grain yields.",
      priority: 1,
    },
  ],
  Peaty: [
    {
      temperature: [12, 20],
      humidity: [70, 90],
      crops: ["Cranberry", "Blueberry", "Lettuce"],
      description: "Acidic peat with cool, moist air suits berries and leafy greens.",
      priority: 3,
    },
    {
      temperature: [18, 24],
      humidity: [65, 85],
      crops: ["Carrot", "Celery", "Potato"],
      description: "Moderate warmth allows root vegetables to flourish in peat beds.",
      priority: 2,
    },
    {
      temperature: [20, 28],
      humidity: [55, 70],
      crops: ["Onion", "Spinach"],
      description: "Partially drained peat still favours fast maturing vegetables.",
      priority: 1,
    },
  ],
  Chalky: [
    {
      temperature: [14, 22],
      humidity: [45, 65],
      crops: ["Barley", "Beetroot", "Spinach"],
      description: "Alkaline chalk soils with mild weather support hardy cereals and greens.",
      priority: 2,
    },
    {
      temperature: [20, 28],
      humidity: [40, 60],
      crops: ["Lavender", "Sage", "Grape"],
      description: "Warm, dry spells help aromatic herbs and vines manage chalky drainage.",
      priority: 2,
    },
    {
      temperature: [24, 32],
      humidity: [50, 65],
      crops: ["Asparagus", "Carrot"],
      description: "Deep-rooting vegetables adapt well when warmth improves soil friability.",
      priority: 1,
    },
  ],
  Laterite: [
    {
      temperature: [24, 32],
      humidity: [60, 85],
      crops: ["Tea", "Coffee", "Black Pepper"],
      description: "Humid tropics with iron-rich laterite sustain beverage and spice crops.",
      priority: 3,
    },
    {
      temperature: [25, 35],
      humidity: [50, 70],
      crops: ["Cashew", "Pineapple", "Banana"],
      description: "Perennial tree crops exploit lateritic soils under warm skies.",
      priority: 2,
    },
    {
      temperature: [20, 26],
      humidity: [55, 75],
      crops: ["Rubber", "Arecanut"],
      description: "Moderate climates still keep moisture locked in lateritic beds.",
      priority: 1,
    },
  ],
  Any: [
    {
      temperature: [10, 20],
      humidity: [40, 65],
      crops: ["Oats", "Rye", "Cabbage"],
      description: "Cool and relatively dry weather supports hardy cereals and brassicas.",
      priority: 0,
    },
    {
      temperature: [20, 30],
      humidity: [40, 60],
      crops: ["Sorghum", "Pearl Millet"],
      description: "Resilient dryland cereals handle a broad range of soils.",
      priority: 0,
    },
    {
      temperature: [26, 36],
      humidity: [60, 80],
      crops: ["Okra", "Eggplant", "Chili"],
      description: "Tropical vegetables handle warmth and humidity across many soil types.",
      priority: 0,
    },
  ],
};

const rangeScore = (range, value) => {
  if (!Array.isArray(range) || range.length !== 2 || value === undefined || value === null) {
    return 0;
  }
  const [min, max] = range;
  if (value >= min && value <= max) {
    return 4;
  }
  const span = max - min;
  const tolerance = Math.max(2, span * 0.3);
  if (value >= min - tolerance && value <= max + tolerance) {
    const distance = value < min ? min - value : value - max;
    return distance <= tolerance / 2 ? 2 : 1;
  }
  return 0;
};

const aggregateCropScores = (matches) => {
  const cropScores = new Map();
  matches.forEach(({ rule, score, soilType }) => {
    rule.crops.forEach((crop) => {
      const existing = cropScores.get(crop) || { score: 0, reasons: [] };
      existing.score += score;
      if (rule.description) {
        existing.reasons.push(`${soilType}: ${rule.description}`);
      }
      cropScores.set(crop, existing);
    });
  });
  return Array.from(cropScores.entries()).map(([name, data]) => ({
    name,
    score: data.score,
    reasons: Array.from(new Set(data.reasons)).slice(0, 3),
  }));
};

export async function POST(request) {
  try {
    const payload = await request.json();
    const soilType = payload?.soilType;
    const temperature = payload?.dht?.temperature;
    const humidity = payload?.dht?.humidity;

    if (!soilType || temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { error: "Invalid data: temperature, humidity, and soilType are required." },
        { status: 400 }
      );
    }

    const normalizedSoil = soilType.trim();
    const soilRules = soilKnowledgeBase[normalizedSoil] || [];
    const generalRules = soilKnowledgeBase.Any;
    const applicableRules = [...soilRules, ...generalRules];

    const scoredRules = applicableRules
      .map((rule) => {
        const tempScore = rangeScore(rule.temperature, temperature);
        const humidityScore = rangeScore(rule.humidity, humidity);
        const compositeScore = tempScore + humidityScore + (rule.priority || 0);
        return { rule, score: compositeScore, soilType: soilRules.includes(rule) ? normalizedSoil : "General" };
      })
      .filter(({ score }) => score > 0);

    const matches = scoredRules.length > 0 ? scoredRules : applicableRules.map((rule) => ({
      rule,
      soilType: soilRules.includes(rule) ? normalizedSoil : "General",
      score: rule.priority || 0,
    }));

    const rankedCrops = aggregateCropScores(matches).sort((a, b) => b.score - a.score);

    if (rankedCrops.length === 0) {
      return NextResponse.json({
        crops: ["Millet (Resilient Option)"],
        notes: "Conditions fall outside the knowledge base. Millet remains a hardy fallback crop.",
      });
    }

    const topThree = rankedCrops.slice(0, 3);
    const primary = topThree[0];
    const reasonSnippet = primary.reasons[0] || "Matched climate pattern from historical agronomy data.";
    const contextSnippet = `Current readings: ${temperature}°C, ${humidity}% humidity, ${normalizedSoil.toLowerCase()} soil.`;
    const notes = `${contextSnippet} ${reasonSnippet}`;

    return NextResponse.json({
      crops: topThree.map((item) => item.name),
      notes,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}