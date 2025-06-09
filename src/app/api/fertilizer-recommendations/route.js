import { NextResponse } from "next/server";

// Mock fertilizer database - In a real application, this would come from a database
const fertilizerDatabase = {
  rice: {
    clay: {
      seedling: {
        6.5: [
          {
            name: "NPK 10-20-10",
            description: "High phosphorus for root development",
            npk: "10-20-10",
            application: [
              "Apply 50 kg/ha at planting",
              "Ensure even distribution",
            ],
          },
        ],
        "7.0": [
          {
            name: "NPK 12-24-12",
            description: "Balanced nutrients for alkaline soil",
            npk: "12-24-12",
            application: [
              "Apply 45 kg/ha at planting",
              "Mix thoroughly with soil",
            ],
          },
        ],
      },
      vegetative: {
        6.5: [
          {
            name: "NPK 20-10-10",
            description: "High nitrogen for vegetative growth",
            npk: "20-10-10",
            application: [
              "Apply 60 kg/ha every 3 weeks",
              "Water immediately after application",
            ],
          },
        ],
      },
    },
  },
  wheat: {
    loamy: {
      seedling: {
        "6.0": [
          {
            name: "NPK 15-15-15",
            description: "Balanced nutrients for wheat seedlings",
            npk: "15-15-15",
            application: ["Apply 40 kg/ha at planting", "Broadcast evenly"],
          },
        ],
      },
    },
  },
  corn: {
    sandy: {
      vegetative: {
        "6.0": [
          {
            name: "Urea (46-0-0)",
            description: "High nitrogen for rapid growth",
            npk: "46-0-0",
            application: [
              "Side-dress at V6 stage",
              "Avoid contact with leaves",
            ],
          },
        ],
      },
    },
  },
  soybeans: {
    clay: {
      flowering: {
        6.8: [
          {
            name: "Potash (0-0-60)",
            description: "Essential for pod filling and overall health",
            npk: "0-0-60",
            application: ["Apply before flowering", "Incorporate into soil"],
          },
        ],
      },
    },
  },
  vegetables: {
    silty: {
      fruiting: {
        6.5: [
          {
            name: "Calcium Nitrate",
            description: "Prevents blossom end rot in fruiting vegetables",
            npk: "15-0-0 + 19% Calcium",
            application: [
              "Foliar spray or soil application",
              "Apply regularly during fruiting",
            ],
          },
        ],
      },
    },
  },
};

export async function POST(request) {
  try {
    const { cropType, soilType, growthStage, soilPh } = await request.json();

    if (!cropType || !soilType || !growthStage || !soilPh) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let recommendations = [];
    let notes = "";

    const specificRecommendations =
      fertilizerDatabase?.[cropType]?.[soilType]?.[growthStage]?.[soilPh];

    if (specificRecommendations && specificRecommendations.length > 0) {
      recommendations = specificRecommendations;
      notes =
        "These are the top recommendations based on your specific conditions.";
    } else {
      // Fallback recommendations if specific match not found
      recommendations = [
        {
          name: "NPK 14-14-14",
          description: "Balanced fertilizer suitable for most crops",
          npk: "14-14-14",
          application: ["Apply 50 kg/ha", "General application guidelines"],
        },
      ];
      notes =
        "No specific recommendations found for your exact combination. Here are some general adaptable fertilizers.";
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ fertilizers: recommendations, notes });
  } catch (error) {
    console.error("Error in fertilizer recommendations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
