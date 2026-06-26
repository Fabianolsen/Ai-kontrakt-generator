"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PaidPlan } from "@/lib/stripe";

export default function UpgradeButton({
  plan,
  label,
  featured,
}: {
  plan: PaidPlan;
  label: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) {
        router.push(`/auth?mode=register&plan=${plan}`);
        return;
      }
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Noe gikk galt. Prøv igjen.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{
        borderRadius: "8px",
        background: featured ? "#C9A84C" : "#0F1F3D",
        color:      featured ? "#0F1F3D" : "#ffffff",
      }}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {label}
    </button>
  );
}
