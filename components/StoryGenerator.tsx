"use client";

import { useState } from "react";
import { useAutobiographyStore } from "@/lib/useAutobiographyStore";
import { WritingStyle } from "@/lib/types";
import toast from "react-hot-toast";

const styleLabels: Record<WritingStyle, string> = {
  emotional: "Emotional & Heartfelt",
  professional: "Professional & Formal",
  simple: "Simple & Clear",
  poetic: "Poetic & Lyrical"
};

export const StoryGenerator = () => {
  const data = useAutobiographyStore((state) => state.data);
  const setStory = useAutobiographyStore((state) => state.setGeneratedStory);
  const setWritingStyle = useAutobiographyStore((state) => state.setWritingStyle);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
      });
      if (!response.ok) {
        throw new Error("Failed to generate story");
      }
      const payload = await response.json();
      setStory(payload.story);
      toast.success("Autobiography draft generated");
    } catch (error: any) {
      toast.error(error.message || "Unable to generate story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold">AI Story Generator</h3>
          <p className="text-sm text-slate-400">
            Transform your memories and milestones into a beautifully written narrative. Select a style, then let the AI craft your story.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {(Object.keys(styleLabels) as WritingStyle[]).map((style) => {
            const active = data.writingStyle === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => setWritingStyle(style)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-primary-400 bg-primary-500/20"
                    : "border-slate-800 bg-slate-900/40 hover:border-primary-400/60"
                }`}
              >
                <p className="font-semibold text-sm">{styleLabels[style]}</p>
                <p className="text-xs text-slate-400">
                  {style === "emotional" && "Rich in feelings and reflections."}
                  {style === "professional" && "Crisp, polished, and executive-ready."}
                  {style === "simple" && "Straightforward language for every reader."}
                  {style === "poetic" && "Metaphorical, rhythmic storytelling."}
                </p>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 transition rounded-2xl py-3 font-semibold disabled:opacity-70"
        >
          {loading ? "Crafting your story..." : "Generate Autobiography Draft"}
        </button>
      </div>
    </div>
  );
};
