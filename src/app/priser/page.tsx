import Link from "next/link";
import { CheckCircle, ChevronLeft } from "lucide-react";
import UpgradeButton from "./UpgradeButton";

export default function PriserPage() {
  const plans = [
    {
      name: "Gratis",
      price: "0",
      period: "",
      description: "Prøv uten risiko",
      features: ["1 kontrakt", "PDF-nedlasting", "Juridisk korrekt innhold"],
      excluded: ["Ubegrenset kontrakter", "E-postutsendelse", "Prioritert support"],
      cta: "Kom i gang gratis",
      href: "/auth?mode=register",
      plan: null as null | "basis" | "pro",
      featured: false,
    },
    {
      name: "Basis",
      price: "99",
      period: "/mnd",
      description: "For privatpersoner",
      features: [
        "Ubegrenset kontrakter",
        "PDF-nedlasting",
        "Kontraktarkiv",
        "E-postutsendelse til leietaker",
        "E-postsupport",
      ],
      excluded: ["Tilpassede maler", "Prioritert support"],
      cta: "Velg Basis",
      href: null,
      plan: "basis" as const,
      featured: true,
    },
    {
      name: "Pro",
      price: "249",
      period: "/mnd",
      description: "For utleiefirmaer",
      features: [
        "Alt i Basis",
        "Tilpassede kontraktmaler",
        "Prioritert support",
        "Fremtidige funksjoner inkludert",
      ],
      excluded: [],
      cta: "Velg Pro",
      href: null,
      plan: "pro" as const,
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4" }}>
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link href="/" className="font-display text-xl font-bold" style={{ color: "#0F1F3D" }}>
            Avtalio
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="font-display text-5xl font-bold mb-4" style={{ color: "#0F1F3D" }}>
            Enkle og ærlige priser
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Start gratis. Ingen bindingstid. Ingen skjulte kostnader.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="p-8 border-2 flex flex-col"
              style={{
                borderRadius: "8px",
                borderColor: plan.featured ? "#C9A84C" : "#e5e7eb",
                background:  plan.featured ? "#0F1F3D" : "#ffffff",
              }}
            >
              {plan.featured && (
                <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#C9A84C" }}>
                  ★ Mest populær
                </div>
              )}

              <div className="font-display text-2xl font-bold mb-1" style={{ color: plan.featured ? "#fff" : "#0F1F3D" }}>
                {plan.name}
              </div>
              <div className="text-sm mb-6" style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : "#9ca3af" }}>
                {plan.description}
              </div>

              <div className="flex items-baseline gap-0.5 mb-8">
                <span className="font-display text-4xl font-bold" style={{ color: plan.featured ? "#fff" : "#0F1F3D" }}>
                  {plan.price} kr
                </span>
                {plan.period && (
                  <span className="text-sm" style={{ color: plan.featured ? "rgba(255,255,255,0.4)" : "#9ca3af" }}>
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: plan.featured ? "#C9A84C" : "#0F1F3D" }}
                    />
                    <span className="text-sm" style={{ color: plan.featured ? "rgba(255,255,255,0.8)" : "#374151" }}>
                      {f}
                    </span>
                  </li>
                ))}
                {plan.excluded.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 opacity-30">
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <div className="w-3 h-px" style={{ background: plan.featured ? "#fff" : "#9ca3af" }} />
                    </div>
                    <span className="text-sm" style={{ color: plan.featured ? "#fff" : "#6b7280" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.plan ? (
                <UpgradeButton
                  plan={plan.plan}
                  label={plan.cta}
                  featured={plan.featured}
                />
              ) : (
                <Link
                  href={plan.href!}
                  className="block w-full text-center py-3 font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{
                    borderRadius: "8px",
                    background: "#0F1F3D",
                    color: "#ffffff",
                  }}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div
          className="bg-white border border-gray-100 p-8 text-center"
          style={{ borderRadius: "8px" }}
        >
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "#0F1F3D" }}>
            Spørsmål om priser?
          </h2>
          <p className="text-gray-400 mb-4 text-sm">Vi hjelper deg gjerne med å velge riktig plan.</p>
          <a
            href="mailto:hei@avtalio.no"
            className="text-sm font-medium hover:underline"
            style={{ color: "#0F1F3D" }}
          >
            Kontakt oss på hei@avtalio.no
          </a>
        </div>
      </main>
    </div>
  );
}
