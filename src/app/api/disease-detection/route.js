import { NextResponse } from "next/server";

// Mock disease database - In a real application, this would use a machine learning model
const diseaseDatabase = {
  leaf_blight: {
    disease: "Bacterial Leaf Blight",
    description:
      "A bacterial disease that causes water-soaked lesions on leaves",
    confidence: 95,
    treatments: [
      "Apply copper-based bactericides",
      "Practice crop rotation",
      "Remove and destroy infected plants",
      "Maintain proper plant spacing for air circulation",
    ],
  },
  leaf_spot: {
    disease: "Fungal Leaf Spot",
    description: "A fungal disease that causes circular spots on leaves",
    confidence: 88,
    treatments: [
      "Apply fungicide treatment",
      "Improve air circulation",
      "Avoid overhead watering",
      "Remove infected leaves",
    ],
  },
  rust: {
    disease: "Plant Rust",
    description: "A fungal disease that causes orange or brown powdery spots",
    confidence: 92,
    treatments: [
      "Apply sulfur-based fungicide",
      "Remove infected plant parts",
      "Maintain proper plant nutrition",
      "Ensure good air circulation",
    ],
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Process the image
    // 2. Run it through a machine learning model
    // 3. Get the actual disease prediction

    // For now, we'll simulate a prediction by randomly selecting a disease
    const diseases = Object.keys(diseaseDatabase);
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const result = diseaseDatabase[randomDisease];

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in disease detection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
