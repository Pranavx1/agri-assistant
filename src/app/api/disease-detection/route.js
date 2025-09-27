import { NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image"); // This is a File object

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 1. Connect to your Gradio client
    const client = await Client.connect("pranav136/gradio");

    // 2. Make the prediction
    const result = await client.predict("/predict", {
      input_image: image, // The File object from the form is passed directly
    });

    // 3. Return the direct response from the Gradio model
    return NextResponse.json(result.data);

  } catch (error) {
    console.error("Error calling Gradio model:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}