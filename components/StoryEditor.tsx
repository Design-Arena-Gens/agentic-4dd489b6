"use client";

import { useAutobiographyStore } from "@/lib/useAutobiographyStore";

export const StoryEditor = () => {
  const story = useAutobiographyStore((state) => state.data.generatedStory || "");
  const setStory = useAutobiographyStore((state) => state.setGeneratedStory);

  return (
    <div className="glass-panel p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Edit & Refine</h3>
        <p className="text-sm text-slate-400">
          Fine-tune the AI draft in your own words. This editor updates in real time so your exports always match the latest version.
        </p>
      </div>
      <textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder="Your generated story will appear here. You can start writing manually too."
        className="min-h-[320px] w-full bg-slate-950/60 border border-slate-700/70 rounded-2xl p-4 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  );
};
