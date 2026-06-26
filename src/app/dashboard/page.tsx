import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, FileText, Clock, CheckCircle, LogOut } from "lucide-react";
import { Kontrakt } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: kontrakter } = await supabase
    .from("kontrakter")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-navy-800">
            Avtalio
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-navy-500">{user.email}</span>
            <form action="/auth/signout" method="POST">
              <button className="flex items-center gap-2 text-sm text-navy-500 hover:text-navy-900">
                <LogOut className="w-4 h-4" />
                Logg ut
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy-900">Mine kontrakter</h1>
            <p className="text-navy-500 mt-1">Administrer dine leiekontrakter</p>
          </div>
          <Link
            href="/kontrakt/ny"
            className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ny kontrakt
          </Link>
        </div>

        {!kontrakter || kontrakter.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {kontrakter.map((k: Kontrakt) => (
              <KontraktCard key={k.id} kontrakt={k} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
      <FileText className="w-12 h-12 text-navy-200 mx-auto mb-4" />
      <h3 className="font-display text-xl font-semibold text-navy-900 mb-2">Ingen kontrakter ennå</h3>
      <p className="text-navy-400 mb-6">Lag din første leiekontrakt på under 2 minutter.</p>
      <Link
        href="/kontrakt/ny"
        className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
      >
        <Plus className="w-4 h-4" />
        Lag første kontrakt
      </Link>
    </div>
  );
}

function KontraktCard({ kontrakt }: { kontrakt: Kontrakt }) {
  const statusConfig = {
    utkast: { label: "Utkast", icon: <Clock className="w-3.5 h-3.5" />, color: "text-amber-600 bg-amber-50" },
    generert: { label: "Generert", icon: <FileText className="w-3.5 h-3.5" />, color: "text-blue-600 bg-blue-50" },
    signert: { label: "Signert", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-green-600 bg-green-50" },
  };

  const status = statusConfig[kontrakt.status];

  return (
    <Link
      href={`/kontrakt/${kontrakt.id}`}
      className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 p-6 flex items-center justify-between transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center">
          <FileText className="w-5 h-5 text-navy-600" />
        </div>
        <div>
          <div className="font-semibold text-navy-900 group-hover:text-navy-700">
            {kontrakt.data?.bolig_adresse || "Ukjent adresse"}
          </div>
          <div className="text-sm text-navy-400 mt-0.5">
            {kontrakt.data?.leietaker_navn} · Opprettet {new Date(kontrakt.created_at).toLocaleDateString("nb-NO")}
          </div>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
        {status.icon}
        {status.label}
      </div>
    </Link>
  );
}
