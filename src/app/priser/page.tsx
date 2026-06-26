import Link from "next/link";
import { CheckCircle, ChevronLeft } from "lucide-react";

export default function PriserPage() {
  const plans = [
    {
      name: "Gratis",
      price: "0",
      description: "Prøv tjenesten uten risiko",
      features: [
        "1 kontrakt",
        "PDF-nedlasting",
        "Grunnleggende leiekontrakt",
        "Juridisk korrekt innhold",
      ],
      notIncluded: ["Ubegrenset kontrakter", "E-postutsendelse", "Kontraktarkiv"],
      cta: "Kom i gang gratis",
      href: "/auth?mode=register",
      highlight: false,
    },
    {
      name: "Basis",
      price: "99",
      description: "For privatpersoner som leier ut",
      features: [
        "Ubegrenset kontrakter",
        "PDF-nedlasting",
        "Kontraktarkiv",
        "E-postutsendelse til leietaker",
        "Juridisk korrekt innhold",
        "E-postsupport",
      ],
      notIncluded: ["Prioritert support", "Tilpassede vilkår"],
      cta: "Velg Basis",
      href: "/auth?mode=register&plan=basis",
      highlight: true,
    },
    {
      name: "Pro",
      price: "249",
      description: "For småbedrifter med flere utleieenheter",
      features: [
        "Alt i Basis",
        "Prioritert support",
        "Tilpassede kontraktmaler",
        "Fremtidige funksjoner inkludert",
        "API-tilgang (kommer)",
        "Dedikert kontaktperson",
      ],
      notIncluded: [],
      cta: "Velg Pro",
      href: "/auth?mode=register&plan=pro",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="text-navy-500 hover:text-navy-900">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link href="/" className="font-display text-2xl font-bold text-navy-800">
            Avtalio
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold text-navy-900 mb-4">Enkle og ærlige priser</h1>
          <p className="text-navy-500 text-xl max-w-2xl mx-auto">
            Start gratis. Oppgrader når du trenger mer. Ingen bindingstid, ingen skjulte kostnader.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlight
                  ? "bg-navy-950 border-2 border-gold-500 shadow-xl"
                  : "bg-white border border-gray-100"
              }`}
            >
              {plan.highlight && (
                <div className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-4">
                  ★ Mest populær
                </div>
              )}
              <div className={`font-display text-2xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-navy-900"}`}>
                {plan.name}
              </div>
              <div className={`text-sm mb-6 ${plan.highlight ? "text-navy-300" : "text-navy-400"}`}>
                {plan.description}
              </div>
              <div className="mb-8">
                <span className={`font-display text-5xl font-bold ${plan.highlight ? "text-white" : "text-navy-900"}`}>
                  {plan.price} kr
                </span>
                {plan.price !== "0" && (
                  <span className={`text-sm ml-1 ${plan.highlight ? "text-navy-400" : "text-navy-400"}`}>/mnd</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-gold-400" : "text-green-500"}`} />
                    <span className={`text-sm ${plan.highlight ? "text-navy-200" : "text-navy-700"}`}>{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-3 opacity-40">
                    <div className="w-4 h-4 flex-shrink-0 rounded-full border border-current flex items-center justify-center">
                      <div className="w-2 h-px bg-current" />
                    </div>
                    <span className={`text-sm ${plan.highlight ? "text-navy-300" : "text-navy-500"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-gold-500 hover:bg-gold-400 text-navy-900"
                    : "bg-navy-800 hover:bg-navy-700 text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">Spørsmål om priser?</h2>
          <p className="text-navy-500 mb-4">Vi hjelper deg gjerne med å finne riktig plan.</p>
          <a
            href="mailto:hei@avtalio.no"
            className="inline-flex items-center gap-2 text-navy-700 font-medium hover:text-navy-900"
          >
            Kontakt oss på hei@avtalio.no
          </a>
        </div>
      </main>
    </div>
  );
}
