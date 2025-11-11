"use client";

import { useState } from "react";
import { useAutobiographyStore } from "@/lib/useAutobiographyStore";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { useAuth } from "./AuthProvider";
import { createShareableStory } from "@/lib/firestore";

const fontMap = {
  serif: "times",
  sans: "helvetica",
  mono: "courier"
};

export const ExportActions = () => {
  const data = useAutobiographyStore((state) => state.data);
  const [sharing, setSharing] = useState(false);
  const { user } = useAuth();

  const createPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const lineHeight = 18;
    const maxLineWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let cursorY = margin;

    const writeLine = (text: string, fontSize = 12, bold = false) => {
      doc.setFont(fontMap[data.customizations.fontFamily], bold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxLineWidth);
      lines.forEach((line: string) => {
        if (cursorY > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });
      cursorY += 6;
    };

    writeLine(data.customizations.title, 26, true);
    writeLine(data.customizations.subtitle, 14);
    if (data.customizations.quote) {
      writeLine(`"${data.customizations.quote}"`, 12, false);
    }
    writeLine("");
    writeLine(data.generatedStory || "", 12);

    doc.save("autobiography.pdf");
    toast.success("PDF exported");
  };

  const createDocx = async () => {
    const storyParagraphs = (data.generatedStory || "").split("\n");

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: data.customizations.title,
              heading: "Heading1"
            }),
            new Paragraph({
              text: data.customizations.subtitle,
              spacing: {
                after: 200
              }
            }),
            ...(data.customizations.quote
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `"${data.customizations.quote}"`,
                        italics: true
                      })
                    ],
                    spacing: { after: 400 }
                  })
                ]
              : []),
            ...storyParagraphs.map(
              (paragraph) =>
                new Paragraph({
                  children: [new TextRun(paragraph)],
                  spacing: { after: 200 }
                })
            )
          ]
        }
      ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "autobiography.docx");
    toast.success("DOCX exported");
  };

  const createShareLink = async () => {
    if (!data.generatedStory) {
      toast.error("Generate or write a story before sharing");
      return;
    }
    if (!user) {
      toast.error("Sign in to create a share link");
      return;
    }
    setSharing(true);
    try {
      const { shareId } = await createShareableStory(user.uid, data);
      const link = `${window.location.origin}/share/${shareId}`;
      await navigator.clipboard.writeText(link);
      toast.success("Shareable link copied to clipboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to share");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Export & Share</h3>
        <p className="text-sm text-slate-400">
          Bring your story into the world as a polished document or share it with collaborators.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={createPdf}
          className="rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-primary-400 transition px-4 py-3 text-sm font-semibold"
        >
          Export as PDF
        </button>
        <button
          type="button"
          onClick={createDocx}
          className="rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-primary-400 transition px-4 py-3 text-sm font-semibold"
        >
          Export as DOCX
        </button>
        <button
          type="button"
          disabled={sharing}
          onClick={createShareLink}
          className="rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-primary-400 transition px-4 py-3 text-sm font-semibold disabled:opacity-70"
        >
          {sharing ? "Generating link..." : "Copy Shareable Link"}
        </button>
      </div>
    </div>
  );
};
