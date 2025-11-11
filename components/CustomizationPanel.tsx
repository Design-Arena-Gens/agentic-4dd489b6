"use client";

import { useAutobiographyStore } from "@/lib/useAutobiographyStore";

const fontSamples: Record<string, string> = {
  serif: "Playfair Display, serif",
  sans: "Inter, sans-serif",
  mono: "Space Mono, monospace"
};

const covers = [
  "https://images.unsplash.com/photo-1529336953121-4971f7f1c3c7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1485550409059-9afb054cada4?auto=format&fit=crop&w=1200&q=80"
];

export const CustomizationPanel = () => {
  const customizations = useAutobiographyStore(
    (state) => state.data.customizations
  );
  const updateField = useAutobiographyStore((state) => state.updateField);

  const handleChange = (key: keyof typeof customizations, value: string) => {
    updateField("customizations", {
      ...customizations,
      [key]: value
    });
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Customization</h3>
        <p className="text-sm text-slate-400">
          Personalize your autobiography with a signature title, cover, and typography that match your voice.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Title
          </label>
          <input
            value={customizations.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="My Story"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Subtitle
          </label>
          <input
            value={customizations.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            className="w-full bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="An Autobiography"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Favorite Quote
          </label>
          <textarea
            value={customizations.quote}
            onChange={(e) => handleChange("quote", e.target.value)}
            className="w-full bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
            placeholder='"The purpose of our lives is to be happy." – Dalai Lama'
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Font Family
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["serif", "sans", "mono"] as const).map((family) => (
            <button
              key={family}
              type="button"
              onClick={() => handleChange("fontFamily", family)}
              style={{ fontFamily: fontSamples[family] }}
              className={`px-4 py-3 rounded-2xl border text-sm transition ${
                customizations.fontFamily === family
                  ? "border-primary-400 bg-primary-500/10"
                  : "border-slate-800 bg-slate-900/40 hover:border-primary-400/60"
              }`}
            >
              {family.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Accent Color
        </label>
        <input
          type="color"
          value={customizations.accentColor}
          onChange={(e) => handleChange("accentColor", e.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-700/70"
        />
      </div>

      <div className="space-y-3">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Cover Image
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {covers.map((cover) => {
            const active = customizations.coverImage === cover;
            return (
              <button
                key={cover}
                type="button"
                onClick={() => handleChange("coverImage", cover)}
                className={`rounded-2xl overflow-hidden border-2 transition ${
                  active ? "border-primary-400" : "border-transparent"
                }`}
              >
                <img src={cover} alt="cover option" className="h-32 w-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
