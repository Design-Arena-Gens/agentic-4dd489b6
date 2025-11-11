"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useAutobiographyStore } from "@/lib/useAutobiographyStore";
import { loadAutobiography, saveAutobiography } from "@/lib/firestore";
import { StoryGenerator } from "./StoryGenerator";
import { StoryEditor } from "./StoryEditor";
import { TimelineEditor } from "./TimelineEditor";
import { CustomizationPanel } from "./CustomizationPanel";
import { ExportActions } from "./ExportActions";
import toast from "react-hot-toast";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const steps = [
  {
    key: "personalInfo",
    title: "Personal Information",
    description: "Lay the foundation with your origins and background."
  },
  {
    key: "childhoodMemories",
    title: "Childhood Memories",
    description: "Capture the stories that shaped your early years."
  },
  {
    key: "educationJourney",
    title: "Education Journey",
    description: "Document the lessons, mentors, and discoveries."
  },
  {
    key: "careerAchievements",
    title: "Career & Achievements",
    description: "Highlight milestones, accolades, and moments of pride."
  },
  {
    key: "familyRelationships",
    title: "Family & Relationships",
    description: "Celebrate the people who define your inner circle."
  },
  {
    key: "lifeChallenges",
    title: "Life Challenges & Lessons",
    description: "Reflect on hurdles, resilience, and hard-won insights."
  },
  {
    key: "dreamsBeliefs",
    title: "Dreams, Beliefs & Future Goals",
    description: "Describe the legacy you are building and what comes next."
  }
];

export const AutobiographyDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const data = useAutobiographyStore((state) => state.data);
  const setData = useAutobiographyStore((state) => state.setData);
  const updateField = useAutobiographyStore((state) => state.updateField);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const result = await loadAutobiography(user.uid);
        setData(result);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your autobiography");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, setData]);

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await saveAutobiography(user.uid, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      toast.success("Autobiography saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const progress = useMemo(() => {
    const filledSections = steps.filter((step) => {
      if (step.key === "personalInfo") {
        return Object.values(data.personalInfo).some((value) => value.trim().length);
      }
      const value = data[step.key as keyof typeof data];
      if (typeof value === "string") {
        return value.trim().length > 0;
      }
      return false;
    }).length;
    return Math.round((filledSections / steps.length) * 100);
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading your story workspace...</p>
        </div>
      </div>
    );
  }

  const renderStepContent = (stepKey: string) => {
    switch (stepKey) {
      case "personalInfo":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Full Name
              </label>
              <input
                value={data.personalInfo.fullName}
                onChange={(e) =>
                  updateField("personalInfo", {
                    ...data.personalInfo,
                    fullName: e.target.value
                  })
                }
                className="bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Date of Birth
              </label>
              <input
                type="date"
                value={data.personalInfo.dateOfBirth}
                onChange={(e) =>
                  updateField("personalInfo", {
                    ...data.personalInfo,
                    dateOfBirth: e.target.value
                  })
                }
                className="bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Birthplace
              </label>
              <input
                value={data.personalInfo.birthplace}
                onChange={(e) =>
                  updateField("personalInfo", {
                    ...data.personalInfo,
                    birthplace: e.target.value
                  })
                }
                className="bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Background & Heritage
              </label>
              <textarea
                value={data.personalInfo.background}
                onChange={(e) =>
                  updateField("personalInfo", {
                    ...data.personalInfo,
                    background: e.target.value
                  })
                }
                placeholder="Share your cultural heritage, family roots, and the story of your beginnings."
                className="bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[140px]"
              />
            </div>
          </div>
        );
      case "childhoodMemories":
      case "educationJourney":
      case "careerAchievements":
      case "familyRelationships":
      case "lifeChallenges":
      case "dreamsBeliefs": {
        const value = data[stepKey as keyof typeof data] as string;
        const placeholders: Record<string, string> = {
          childhoodMemories:
            "Paint vivid scenes from your earliest memories, family traditions, and formative adventures.",
          educationJourney:
            "Detail the schools, mentors, and aha moments that shaped your learning.",
          careerAchievements:
            "Capture the roles, achievements, and breakthroughs that define your professional story.",
          familyRelationships:
            "Share the relationships and communities that give your life meaning.",
          lifeChallenges:
            "Reflect on the challenges you've faced and the lessons they taught you.",
          dreamsBeliefs:
            "Describe your guiding principles and the future you're striving to create."
        };
        return (
          <textarea
            value={value}
            onChange={(e) =>
              updateField(stepKey as keyof typeof data, e.target.value as any)
            }
            placeholder={placeholders[stepKey]}
            className="w-full bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[220px]"
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-300">
              Autobiography Data Builder
            </p>
            <h1 className="text-2xl font-semibold">
              Welcome back, {data.personalInfo.fullName || user?.email}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs text-slate-400">
                Progress {progress}%
              </span>
              {data.updatedAt && (
                <span className="text-[11px] text-slate-500">
                  Last updated {new Date(data.updatedAt).toLocaleString()}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-400 transition text-sm font-semibold disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="px-4 py-2 rounded-xl border border-slate-700 text-sm hover:border-primary-400 transition"
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-4">
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-12">
        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          <div className="glass-panel p-4 h-fit sticky top-28 space-y-4">
            <h2 className="text-lg font-semibold">Story Builder</h2>
            <nav className="space-y-2">
              {steps.map((step, index) => {
                const completed = index < activeStep;
                const active = index === activeStep;
                return (
                  <button
                    key={step.key}
                    onClick={() => setActiveStep(index)}
                    className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                      active
                        ? "border-primary-400 bg-primary-500/20"
                        : "border-slate-800 bg-slate-900/40 hover:border-primary-400/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {completed ? (
                        <CheckCircleIcon className="h-5 w-5 text-primary-300" />
                      ) : (
                        <span className="h-5 w-5 rounded-full border border-slate-600 flex items-center justify-center text-[11px]">
                          {index + 1}
                        </span>
                      )}
                      <div>
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {steps[activeStep].title}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {steps[activeStep].description}
                  </p>
                </div>
              </div>
              <div className="space-y-6">{renderStepContent(steps[activeStep].key)}</div>
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                  disabled={activeStep === 0}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-sm flex items-center gap-2 disabled:opacity-70"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
                  }
                  disabled={activeStep === steps.length - 1}
                  className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-400 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <TimelineEditor />
            <CustomizationPanel />
            <StoryGenerator />
            <StoryEditor />
            <ExportActions />
          </div>
        </div>
      </main>
    </div>
  );
};
