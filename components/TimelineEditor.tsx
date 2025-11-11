"use client";

import { useState } from "react";
import { LifeEvent } from "@/lib/types";
import { useAutobiographyStore } from "@/lib/useAutobiographyStore";
import { v4 as uuid } from "uuid";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export const TimelineEditor = () => {
  const timeline = useAutobiographyStore((state) => state.data.timeline);
  const addEvent = useAutobiographyStore((state) => state.addTimelineEvent);
  const updateEvent = useAutobiographyStore(
    (state) => state.updateTimelineEvent
  );
  const removeEvent = useAutobiographyStore(
    (state) => state.removeTimelineEvent
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<LifeEvent, "id">>({
    title: "",
    description: "",
    year: "",
    imageUrl: "",
    notes: ""
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      year: "",
      imageUrl: "",
      notes: ""
    });
    setEditingId(null);
  };

  const startEdit = (event: LifeEvent) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      year: event.year,
      imageUrl: event.imageUrl || "",
      notes: event.notes || ""
    });
  };

  const handleSubmit = () => {
    if (!form.title || !form.year) return;

    if (editingId) {
      updateEvent({ id: editingId, ...form });
    } else {
      addEvent({ id: uuid(), ...form });
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Year
          </label>
          <input
            className="bg-slate-900/70 border border-slate-700/80 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="1994"
            value={form.year}
            onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Title
          </label>
          <input
            className="bg-slate-900/70 border border-slate-700/80 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Started university"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Description
          </label>
          <textarea
            className="bg-slate-900/70 border border-slate-700/80 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
            placeholder="Share the story of this milestone..."
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Image URL
          </label>
          <input
            className="bg-slate-900/70 border border-slate-700/80 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Notes
          </label>
          <input
            className="bg-slate-900/70 border border-slate-700/80 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add a caption or reflection"
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-400 transition font-semibold text-sm"
        >
          {editingId ? "Update Event" : "Add Event"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-xl border border-slate-700 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="space-y-4">
        {timeline.length === 0 ? (
          <p className="text-sm text-slate-500">
            No events yet. Add milestones to build your visual timeline.
          </p>
        ) : (
          timeline
            .slice()
            .sort((a, b) => a.year.localeCompare(b.year))
            .map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col md:flex-row md:items-center gap-3"
              >
                <div className="flex-1">
                  <p className="text-primary-300 text-sm">{event.year}</p>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-slate-400">{event.description}</p>
                  {event.notes && (
                    <p className="text-xs text-slate-500 mt-2">Notes: {event.notes}</p>
                  )}
                  {event.imageUrl && (
                    <a
                      href={event.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-300 hover:underline mt-2 inline-block"
                    >
                      View image
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(event)}
                    className="p-2 rounded-xl border border-slate-800 hover:border-primary-400 transition"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEvent(event.id)}
                    className="p-2 rounded-xl border border-slate-800 hover:border-red-400 transition text-red-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};
