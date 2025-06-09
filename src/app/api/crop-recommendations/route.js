import { NextResponse } from "next/server";

const cropDatabase = {
  loamy: {
    tropical: {
      spring: {
        high: ["Rice", "Sugarcane"],
        medium: ["Maize", "Cotton"],
        low: ["Millet"],
      },
      summer: {
        high: ["Soybeans", "Groundnut"],
        medium: ["Sorghum"],
        low: ["Barley"],
      },
    },
    temperate: {
      spring: {
        high: ["Wheat", "Potatoes"],
        medium: ["Oats"],
        low: ["Rye"],
      },
      summer: {
        high: ["Corn", "Sunflower"],
        medium: ["Buckwheat"],
        low: ["Lentils"],
      },
    },
  },
  sandy: {
    tropical: {
      spring: {
        high: ["Watermelon", "Melons"],
        medium: ["Cassava"],
        low: ["Sweet Potatoes"],
      },
      summer: {
        high: ["Peanuts"],
        medium: ["Cowpeas"],
        low: ["Cluster Beans"],
      },
    },
    temperate: {
      spring: {
        high: ["Carrots", "Radishes"],
        medium: ["Asparagus"],
        low: ["Peas"],
      },
      summer: {
        high: ["Zucchini", "Pumpkins"],
        medium: ["Green Beans"],
        low: ["Tomatoes"],
      },
    },
  },
  clay: {
    tropical: {
      spring: {
        high: ["Rice", "Taro"],
        medium: ["Cabbage"],
        low: ["Sugarcane"],
      },
      summer: {
        high: ["Soybeans"],
        medium: ["Cotton"],
        low: ["Wheat"],
      },
    },
    temperate: {
      spring: {
        high: ["Wheat", "Barley"],
        medium: ["Oats"],
        low: ["Beans"],
      },
      summer: {
        high: ["Corn", "Potatoes"],
        medium: ["Cabbage"],
        low: ["Cauliflower"],
      },
    },
  },
  silty: {
    tropical: {
      spring: {
        high: ["Rice", "Maize"],
        medium: ["Wheat"],
        low: ["Soybeans"],
      },
      summer: {
        high: ["Sugarcane"],
        medium: ["Cotton"],
        low: ["Lentils"],
      },
    },
    temperate: {
      spring: {
        high: ["Wheat", "Oats"],
        medium: ["Barley"],
        low: ["Rye"],
      },
      summer: {
        high: ["Corn", "Soybeans"],
        medium: ["Sunflower"],
        low: ["Buckwheat"],
      },
    },
  },
  peaty: {
    tropical: {
      spring: {
        high: ["Rice", "Taro"],
        medium: ["Cabbage"],
        low: ["Lettuce"],
      },
      summer: {
        high: ["Blueberries"],
        medium: ["Cranberries"],
        low: ["Potatoes"],
      },
    },
    temperate: {
      spring: {
        high: ["Blueberries", "Cranberries"],
        medium: ["Rye"],
        low: ["Oats"],
      },
      summer: {
        high: ["Potatoes", "Carrots"],
        medium: ["Cabbage"],
        low: ["Lettuce"],
      },
    },
  },
};

export async function POST(request) {
  try {
    const { soilType, climate, season, waterAvailability, landSize } =
      await request.json();

    if (!soilType || !climate || !season || !waterAvailability || !landSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let crops = [];
    let notes = "";

    const recommendations =
      cropDatabase?.[soilType]?.[climate]?.[season]?.[waterAvailability];

    if (recommendations && recommendations.length > 0) {
      crops = recommendations;
      notes =
        "These are the top recommendations based on your specific conditions.";
    } else {
      // Fallback recommendations if specific match not found
      crops = ["Maize", "Wheat", "Soybeans", "Rice"];
      notes =
        "No specific recommendations found for your exact combination. Here are some general adaptable crops.";
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ crops, notes });
  } catch (error) {
    console.error("Error in crop recommendations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
