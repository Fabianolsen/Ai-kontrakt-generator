import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, FileText, Clock, CheckCircle, LogOut, CreditCard } from "lucide-react";
import { Contract } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const [{ data: contracts }, { data: sub }] = await Promise.all([
    supabase
      .from("contracts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .single(),
  ]);

  const plan = sub?.plan ?? "gratis";
  const isGratis = plan === "gratis";
  const contractCount = contracts?.length ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold" style={{ color: "#0F1F3D" }}>
            Avtalio
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden md:block">{user.email}</span>
            <PlanBadge plan={plan} />
            <form action="/auth/signout" method="POST">
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:block">Logg ut</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold" style={{ color: "#0F1F3D" }}>
              Mine kontrakter
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {contractCount} kontrakt{contractCount !== 1 ? "er" : ""}
            </p>
          </div>
          {(!isGratis || contractCount < 1) ? (
            <Link
              href="/kontrakt/ny"
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 text-white transition-opacity hover:opacity-90"
              style={{ background: "#0F1F3D", borderRadius: "8px" }}
            >
              <Plus className="w-4 h-4" />
              Ny kontrakt
            </Link>
          ) : (
            <Link
              href="/priser"
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-opacity hover:opacity-90"
              style={{ background: "#C9A84C", color: "#0F1F3D", borderRadius: "8px" }}
            >
              <CreditCard className="w-4 h-4" />
              Oppgrader for mer
            </Link>
          )}
        </div>

        {/* Upgrade banner */}
        {isGratis && contractCount >= 1 && (
          <div
            className="flex items-center justify-between p-5 mb-6 border"
            style={{ background: "#0F1F3D", borderRadius: "8px", borderColor: "#0F1F3D" }}
          >
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">Du har brukt din gratis kontrakt</p>
              <p className="text-blue-100/60 text-sm">Oppgrader til Basis (99 kr/mnd) for ubegrenset kontrakter.</p>
            </div>
            <Link
              href="/priser"
              className="flex-shrink-0 text-sm font-semibold px-4 py-2 ml-4 transition-opacity hover:opacity-90"
              style={{ background: "#C9A84C", color: "#0F1F3D", borderRadius: "8px" }}
            >
              Se planer
            </Link>
          </div>
        )}

        {/* Contracts list */}
        {!contracts || contracts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {contracts.map((c: Contract) => (
              <ContractCard key={c.id} contract={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const label = { gratis: "Gratis", basis: "Basis", pro: "Pro" }[plan] ?? plan;
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1"
      style={{
        borderRadius: "8px",
        background: plan === "gratis" ? "#f3f4f6" : "#0F1F3D",
        color:      plan === "gratis" ? "#6b7280"  : "#C9A84C",
      }}
    >
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div
      className="text-center py-20 bg-white border border-gray-100"
      style={{ borderRadius: "8px" }}
    >
      <FileText className="w-10 h-10 mx-auto mb-4" style={{ color: "#e5e7eb" }} />
      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "#0F1F3D" }}>
        Ingen kontrakter ennå
      </h3>
      <p className="text-gray-400 text-sm mb-6">Lag din første leiekontrakt på under 2 minutter.</p>
      <Link
        href="/kontrakt/ny"
        className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 text-white"
        style={{ background: "#0F1F3D", borderRadius: "8px" }}
      >
        <Plus className="w-4 h-4" />
        Lag første kontrakt
      </Link>
    </div>
  );
}

function ContractCard({ contract }: { contract: Contract }) {
  const statusConfig = {
    utkast:   { label: "Utkast",   icon: <Clock className="w-3 h-3" />,       bg: "#fffbeb", fg: "#92400e" },
    generert: { label: "Generert", icon: <FileText className="w-3 h-3" />,     bg: "#eff6ff", fg: "#1d4ed8" },
    signert:  { label: "Signert",  icon: <CheckCircle className="w-3 h-3" />,  bg: "#f0fdf4", fg: "#166534" },
  };
  const s = statusConfig[contract.status];

  return (
    <Link
      href={`/kontrakt/${contract.id}`}
      className="flex items-center justify-between bg-white border border-gray-100 hover:border-gray-200 px-6 py-4 group transition-colors"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ background: "#f8f7f4", borderRadius: "8px" }}
        >
          <FileText className="w-4 h-4" style={{ color: "#0F1F3D" }} />
        </div>
        <div>
          <div className="text-sm font-semibold group-hover:underline" style={{ color: "#0F1F3D" }}>
            {contract.form_data?.bolig?.adresse || "Ukjent adresse"}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {contract.form_data?.leietaker?.navn} ·{" "}
            {new Date(contract.created_at).toLocaleDateString("nb-NO", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </div>
        </div>
      </div>
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
        style={{ background: s.bg, color: s.fg, borderRadius: "8px" }}
      >
        {s.icon}
        {s.label}
      </div>
    </Link>
  );
}
