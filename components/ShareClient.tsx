"use client";

import { useEffect, useState } from "react";
import { fetchSharedStory } from "@/lib/firestore";
import { SharedStory } from "@/lib/types";

export const ShareClient = ({ shareId }: { shareId: string }) => {
  const [story, setStory] = useState<SharedStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await fetchSharedStory(shareId);
        if (!result) {
          setError("Story not found or access revoked.");
        } else {
          setStory(result);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load shared story.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading shared story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="glass-panel p-8 max-w-md text-center space-y-3">
          <h1 className="text-2xl font-semibold">Story unavailable</h1>
          <p className="text-sm text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const { data } = story;

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        background: `linear-gradient(135deg, ${data.customizations.accentColor}22, #0f172a)`
      }}
    >
      <div className="max-w-3xl mx-auto py-16 px-6 text-slate-200">
        <div className="glass-panel overflow-hidden">
          {data.customizations.coverImage && (
            <img
              src={data.customizations.coverImage}
              alt="Cover"
              className="h-64 w-full object-cover"
            />
          )}
          <div
            className="p-8 space-y-6"
            style={{
              fontFamily:
                data.customizations.fontFamily === "serif"
                  ? "Playfair Display, serif"
                  : data.customizations.fontFamily === "mono"
                  ? "Space Mono, monospace"
                  : "Inter, sans-serif"
            }}
          >
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-primary-200">
                Autobiography
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold"
                style={{ color: data.customizations.accentColor }}
              >
                {data.customizations.title}
              </h1>
              <p className="text-sm text-slate-400">
                {data.customizations.subtitle}
              </p>
              {data.customizations.quote && (
                <blockquote className="text-sm text-slate-300 italic border-l-2 border-primary-400/40 pl-4">
                  “{data.customizations.quote}”
                </blockquote>
              )}
            </div>
            <article className="space-y-4 leading-relaxed text-slate-200">
              {(data.generatedStory || "")
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
