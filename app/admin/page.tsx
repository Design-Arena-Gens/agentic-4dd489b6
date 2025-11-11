"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { listAllAutobiographies } from "@/lib/firestore";
import { AutobiographyData } from "@/lib/types";
import toast from "react-hot-toast";

interface RecordRow {
  userId: string;
  data: AutobiographyData;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(false);
  const adminEmails = useMemo(() => {
    const value = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
    return value.split(",").map((email) => email.trim()).filter(Boolean);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      if (!adminEmails.includes(user.email ?? "")) return;
      setLoading(true);
      try {
        const data = await listAllAutobiographies();
        setRecords(data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load user autobiographies");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, adminEmails]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="glass-panel p-8 text-center space-y-3">
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-slate-400">
            Sign in using an authorized admin account to access this view.
          </p>
        </div>
      </div>
    );
  }

  if (!adminEmails.includes(user.email ?? "")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="glass-panel p-8 text-center space-y-3">
          <h1 className="text-2xl font-semibold">Restricted area</h1>
          <p className="text-sm text-slate-400">
            This page is restricted. Contact the account owner if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      <header className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary-300">
          Admin Command Center
        </p>
        <h1 className="text-3xl font-semibold">Autobiography Universe Overview</h1>
        <p className="text-sm text-slate-400">
          Monitor the flow of stories, their status, and last updates across all users.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900/70">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">User ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Full Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Updated At</th>
                  <th className="px-4 py-3 text-left font-semibold">Story Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      Loading records...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      No autobiographies captured yet.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.userId} className="hover:bg-primary-500/5 transition">
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {record.userId}
                      </td>
                      <td className="px-4 py-3">
                        {record.data.personalInfo.fullName || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {record.data.updatedAt
                          ? new Date(record.data.updatedAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {record.data.generatedStory
                          ? "Draft generated"
                          : "Awaiting AI draft"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
