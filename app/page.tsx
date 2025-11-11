"use client";

import { AutobiographyDashboard } from "@/components/AutobiographyDashboard";
import { LoginCard } from "@/components/LoginCard";
import { useAuth } from "@/components/AuthProvider";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25),_transparent_50%)] flex items-center justify-center px-4">
        <LoginCard />
      </div>
    );
  }

  return <AutobiographyDashboard />;
}
