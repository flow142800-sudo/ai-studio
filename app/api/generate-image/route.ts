import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, aspectRatio } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!apiKey) {
      return NextResponse.json(
        { error: "POLLINATIONS_API_KEY is missing" },
        { status: 500 }
      );
    }

    const dimensions =
  aspectRatio === "9:16"
    ? { width: 576, height: 1024 }
    : aspectRatio === "16:9"
      ? { width: 1024, height: 576 }
      : { width: 1024, height: 1024 };

const imageUrl =
  `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}` +
  `?model=flux&width=${dimensions.width}&height=${dimensions.height}`;

    const response = await fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Pollinations error:", errorText);

      return NextResponse.json(
        { error: "Pollinations image generation failed" },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

   const contentType =
  response.headers.get("content-type") || "image/png";

return new Response(imageBuffer, {
  headers: {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  },
});

  } catch (error) {
    console.error("Image generation error:", error);

    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}