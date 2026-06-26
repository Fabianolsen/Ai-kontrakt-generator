import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft, Mail, Edit2 } from "lucide-react";
import { Contract } from "@/lib/types";
import PdfDownload from "./PdfDownload";

export default async function KontraktPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!contract) notFound();

  const c = contract as Contract;

  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4" }}>
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="font-display font-bold text-base" style={{ color: "#0F1F3D" }}>
                {c.form_data?.bolig?.adresse || "Leiekontrakt"}
              </span>
              <span className="ml-3 text-xs text-gray-400">
                {new Date(c.created_at).toLocaleDateString("nb-NO", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/kontrakt/${c.id}/rediger`}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-gray-300 px-3 py-2 text-sm font-medium transition-colors"
              style={{ borderRadius: "8px" }}
            >
              <Edit2 className="w-3.5 h-3.5" />
              Rediger
            </Link>
            <PdfDownload kontraktId={c.id} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Contract document */}
        <div
          className="bg-white border border-gray-100 px-12 py-14 shadow-sm"
          style={{ borderRadius: "8px" }}
        >
          <pre
            className="whitespace-pre-wrap text-sm leading-relaxed"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#0F1F3D" }}
          >
            {c.generated_text}
          </pre>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <PdfDownload kontraktId={c.id} variant="full" />
          <SendEmailButton leietakerEpost={c.form_data?.leietaker?.epost} />
        </div>
      </main>
    </div>
  );
}

function SendEmailButton({ leietakerEpost }: { leietakerEpost?: string }) {
  return (
    <button
      className="flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 border-2 transition-colors"
      style={{ borderColor: "#0F1F3D", color: "#0F1F3D", borderRadius: "8px" }}
    >
      <Mail className="w-4 h-4" />
      Send til {leietakerEpost ? `(${leietakerEpost})` : "leietaker"}
    </button>
  );
}
