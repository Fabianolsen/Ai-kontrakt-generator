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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Feil ved PDF-generering. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  const icon = loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />;

  if (variant === "full") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center justify-center gap-2 text-sm font-semibold px-8 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "#0F1F3D", borderRadius: "8px" }}
      >
        {icon}
        Last ned som PDF
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{ background: "#0F1F3D", borderRadius: "8px" }}
    >
      {icon}
      PDF
    </button>
  );
}
