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

    const videoAspectRatio =
      aspectRatio === "9:16" ? "9:16" : "16:9";

    const videoUrl =
      `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}` +
      `?model=amazon/nova-reel-v1&aspectRatio=${videoAspectRatio}&duration=5`;

    const response = await fetch(videoUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Pollinations video error:", errorText);

     return NextResponse.json(
  { error: `Pollinations video generation failed: ${errorText}` },
  { status: response.status }
);
    }

    const videoBuffer = await response.arrayBuffer();

    const contentType =
      response.headers.get("content-type") || "video/mp4";

    return new Response(videoBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Video generation error:", error);

    return NextResponse.json(
      { error: "Video generation failed" },
      { status: 500 }
    );
  }
}