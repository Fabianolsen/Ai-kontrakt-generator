"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function PdfDownload({
  kontraktId,
  variant = "icon",
}: {
  kontraktId: string;
  variant?: "icon" | "full";
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/pdf/${kontraktId}`);
      if (!res.ok) throw new Error("Kunne ikke generere PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leiekontrakt-${kontraktId.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Feil ved PDF-generering. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors flex-1 sm:flex-none"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        Last ned som PDF
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      Last ned PDF
    </button>
  );
}
