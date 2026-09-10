"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mode, setMode] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [imageCount, setImageCount] = useState<number>(1);
const imageOptions = [1, 2, 3, 4];
const [aspectRatio, setAspectRatio] = useState<"1:1" | "9:16" | "16:9">("1:1");
const aspectOptions = ["1:1", "9:16", "16:9"];
  const [connected, setConnected] = useState(false);
  const connectPollinations = () => {
    const appKey = process.env.NEXT_PUBLIC_POLLINATIONS_APP_KEY;

    if (!appKey) {
      alert("Pollinations App Key is missing.");
      return;
    }

   const redirectUri = "http://localhost:3000/callback";

    window.location.href =
      `https://enter.pollinations.ai/authorize` +
      `?redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&client_id=${encodeURIComponent(appKey)}` +
      `&scope=usage`;
  };
  useEffect(() => {
    const key = sessionStorage.getItem("pollinations_user_key");
    setConnected(!!key);
  }, []);
  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Badge */}
        <div className="mx-auto mb-8 w-fit rounded-full border border-purple-500/40 bg-purple-500/10 px-6 py-3 text-purple-300">
          ✨ AI Image & Video Generator
        </div>
        <div className="mb-6 flex justify-center">
          <button
            onClick={connectPollinations}
            className="rounded-2xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
          >
            {connected
              ? "✅ Pollinations Connected"
              : "🔗 Connect Pollinations"}
          </button>
        </div>
        {/* Heading */}
        <h1 className="text-center text-5xl font-bold md:text-7xl">
          Create anything with
          <span className="block text-purple-400">AI</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-400">
          Turn your ideas into stunning images and videos using simple text prompts.
        </p>

        {/* Generator Box */}
        <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-white/10 bg-[#101116] p-5 shadow-2xl">

          {/* Tabs */}
          <div className="mb-5 flex rounded-2xl bg-black/50 p-1">
            <button
              onClick={() => setMode("image")}
              className={`w-1/2 rounded-xl py-4 font-medium transition ${
                mode === "image"
                  ? "bg-white text-black"
                  : "text-gray-400"
              }`}
            >
              🖼️ Image
            </button>

            <button
              onClick={() => setMode("video")}
              className={`w-1/2 rounded-xl py-4 font-medium transition ${
                mode === "video"
                  ? "bg-white text-black"
                  : "text-gray-400"
              }`}
            >
              🎬 Video
            </button>
          </div>

          {/* Prompt */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === "image"
                ? "Describe the image you want to create..."
                : "Describe the video you want to create..."
            }
            className="min-h-[180px] w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-5 text-lg outline-none placeholder:text-gray-600 focus:border-purple-500"
          />
<div className="mt-4">
  <p className="mb-2 text-sm text-gray-400">Number of images</p>

  <div className="flex gap-2">
    {imageOptions.map((count) => (
      <button
        key={count}
        onClick={() => setImageCount(count)}
        className={`flex-1 rounded-xl py-3 font-semibold ${
          imageCount === count
            ? "bg-purple-600 text-white"
            : "bg-black/40 text-gray-400"
        }`}
      >
        {count}
      </button>
    ))}
  </div>
</div>
<div className="mt-4">
  <p className="mb-2 text-sm text-gray-400">Aspect Ratio</p>

  <div className="flex gap-2">
    {aspectOptions.map((ratio) => (
      <button
        key={ratio}
        onClick={() =>
          setAspectRatio(ratio as "1:1" | "9:16" | "16:9")
        }
        className={`flex-1 rounded-xl py-3 font-semibold ${
          aspectRatio === ratio
            ? "bg-purple-600 text-white"
            : "bg-black/40 text-gray-400"
        }`}
      >
        {ratio}
      </button>
    ))}
  </div>
</div>
         <div className="mt-4">
  <p className="mb-2 text-sm text-gray-400">Aspect Ratio</p>

  <div className="flex gap-2">
    {aspectOptions.map((ratio) => (
      <button
        key={ratio}
        onClick={() =>
          setAspectRatio(ratio as "1:1" | "9:16" | "16:9")
        }
        className={`flex-1 rounded-xl py-3 font-semibold ${
          aspectRatio === ratio
            ? "bg-purple-600 text-white"
            : "bg-black/40 text-gray-400"
        }`}
      >
        {ratio}
      </button>
    ))}
  </div>
</div> 
          {/* Generate */}
                    <button
            onClick={async () => {
              if (!prompt.trim()) {
                alert("Please enter a prompt first.");
                return;
              }
setGenerating(true);
              try {
               mode === "image" ? setImageUrls([]) : setVideoUrls([]);

                const requests = Array.from(
                  { length: imageCount },
                  async () => {
                    const response = await fetch(
  mode === "image" ? "/api/generate-image" : "/api/generate-video",
  {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("pollinations_user_key") || ""}`,
                      },
                     body: JSON.stringify({ prompt, aspectRatio }),
                    });

                    if (!response.ok) {
                      const data = await response.json();
                      throw new Error(
                        data.error || "Image generation failed"
                      );
                    }

                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                  }
                );

                const urls = await Promise.all(requests);
                mode === "image" ? setImageUrls(urls) : setVideoUrls(urls);
              } catch (error) {
                console.error(error);
               alert(error instanceof Error ? error.message : "Something went wrong. Please try again.");
              }
            }}
            className="mt-5 w-full rounded-2xl bg-purple-600 py-4 text-lg font-semibold transition hover:bg-purple-500"
          >
            {generating ? "⏳ Generating..." : `✨ Generate ${mode === "image" ? "Image" : "Video"}`}
          </button>
      

{mode === "image"
  ? imageUrls.map((url, index) => (
      <div key={index} className="mt-6 mx-auto max-w-4xl">
        <img
          src={url}
          alt={`Generated image ${index + 1}`}
          className="w-full rounded-2xl"
        />

        <a
          href={url}
          download={`ai-generated-image-${index + 1}.png`}
          className="mt-4 block w-full rounded-2xl bg-white py-4 text-center text-lg font-semibold text-black"
        >
          ⬇️ Download Image {index + 1}
        </a>
      </div>
    ))
  : videoUrls.map((url, index) => (
      <div key={index} className="mt-6 mx-auto max-w-4xl">
        <video
          src={url}
          controls
          className="w-full rounded-2xl"
        />

        <a
          href={url}
          download={`ai-generated-video-${index + 1}.mp4`}
          className="mt-4 block w-full rounded-2xl bg-white py-4 text-center text-lg font-semibold text-black"
        >
          ⬇️ Download Video {index + 1}
        </a>
      </div>
    ))}
        {/* Features */}
        <section className="mt-16 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#101116] p-6">
            <div className="mb-4 text-3xl">🖼️</div>
            <h2 className="text-xl font-semibold">AI Images</h2>
            <p className="mt-2 text-gray-400">
              Create beautiful images from simple text prompts.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101116] p-6">
            <div className="mb-4 text-3xl">🎬</div>
            <h2 className="text-xl font-semibold">AI Videos</h2>
            <p className="mt-2 text-gray-400">
              Generate cinematic videos from your ideas.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101116] p-6">
            <div className="mb-4 text-3xl">⚡</div>
            <h2 className="text-xl font-semibold">Fast & Simple</h2>
            <p className="mt-2 text-gray-400">
              Write a prompt, generate your creation, and download it.
            </p>
          </div>

        </section>
      </div>
      </div>
    </main>
  );
}