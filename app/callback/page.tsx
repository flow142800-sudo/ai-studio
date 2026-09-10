"use client";

import { useEffect } from "react";

export default function CallbackPage() {
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.slice(1));
      const apiKey = params.get("api_key");

      if (apiKey) {
        sessionStorage.setItem("pollinations_user_key", apiKey);
      }
    }

    window.location.href = "/";
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050507] text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Connecting Pollinations...
        </h1>

        <p className="mt-3 text-gray-400">
          Please wait...
        </p>
      </div>
    </main>
  );
}