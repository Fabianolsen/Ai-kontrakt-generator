import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft, Mail, Edit2 } from "lucide-react";
import { Kontrakt } from "@/lib/types";
import PdfDownload from "./PdfDownload";

export default async function KontraktPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: kontrakt } = await supabase
    .from("kontrakter")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!kontrakt) notFound();

  const k = kontrakt as Kontrakt;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-navy-500 hover:text-navy-900">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="font-display text-xl font-bold text-navy-800">
              {k.data?.bolig_adresse || "Leiekontrakt"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/kontrakt/${k.id}/rediger`}
              className="flex items-center gap-2 border border-gray-200 text-navy-600 hover:border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Rediger
            </Link>
            <PdfDownload kontraktId={k.id} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
          <article className="prose prose-navy max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-navy-800 leading-relaxed text-sm">
              {k.innhold}
            </pre>
          </article>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <PdfDownload kontraktId={k.id} variant="full" />
          <button className="flex items-center justify-center gap-2 border-2 border-navy-200 hover:border-navy-400 text-navy-700 font-semibold px-6 py-3 rounded-xl transition-colors">
            <Mail className="w-5 h-5" />
            Send til leietaker
          </button>
        </div>
      </main>
    </div>
  );
}
