import Link from "next/link";
import { CheckCircle, Shield, Zap, Clock, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4" }}>
      <Nav />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold" style={{ color: "#0F1F3D" }}>
          Avtalio
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#slik-fungerer-det" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Slik fungerer det
          </Link>
          <Link href="/priser" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Priser
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="text-sm font-medium px-4 py-2 rounded text-gray-600 hover:text-gray-900"
          >
            Logg inn
          </Link>
          <Link
            href="/auth?mode=register"
            className="text-sm font-semibold px-4 py-2 rounded text-white transition-opacity hover:opacity-90"
            style={{ background: "#0F1F3D", borderRadius: "8px" }}
          >
            Kom i gang
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="py-24 md:py-32" style={{ background: "#0F1F3D" }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold tracking-wide"
          style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
        >
          <Shield className="w-3.5 h-3.5" />
          Basert på husleieloven av 1999
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6 text-balance">
          Juridisk korrekt{" "}
          <span style={{ color: "#C9A84C" }}>leiekontrakt</span>{" "}
          på 2 minutter
        </h1>

        <p className="text-lg md:text-xl text-blue-100/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          AI-drevet plattform for norske leiekontrakter. Trygg, rask og alltid
          i samsvar med husleieloven — for privatpersoner og småbedrifter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth?mode=register"
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded text-white transition-opacity hover:opacity-90"
            style={{ background: "#C9A84C", color: "#0F1F3D", borderRadius: "8px" }}
          >
            Lag din første kontrakt gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#slik-fungerer-det"
            className="inline-flex items-center justify-center font-semibold px-8 py-4 rounded text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px" }}
          >
            Se hvordan det fungerer
          </Link>
        </div>

        <p className="text-blue-100/40 text-sm mt-6">
          Ingen kredittkort · 1 gratis kontrakt · Klar på 2 minutter
        </p>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    "Husleieloven av 1999",
    "Sikker lagring",
    "PDF-nedlasting",
    "Norsk bokmål",
  ];
  return (
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-x-10 gap-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4" style={{ color: "#C9A84C" }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Juridisk korrekt",
      description:
        "Alle kontrakter er utarbeidet i henhold til husleieloven av 1999. Depositumsgrenser og oppsigelsestider valideres automatisk.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Ferdig på 2 minutter",
      description:
        "Fyll ut et strukturert skjema, klikk generer. AI-en skriver en komplett kontrakt med alle nødvendige paragrafer.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Trygt arkivert",
      description:
        "Kontraktene dine lagres sikkert og er tilgjengelige når du trenger dem. Last ned som PDF eller send direkte til leietaker.",
    },
  ];

  return (
    <section className="py-20" style={{ background: "#F8F7F4" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white p-8 border border-gray-100"
              style={{ borderRadius: "8px" }}
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 mb-5"
                style={{ background: "#0F1F3D", borderRadius: "8px", color: "#C9A84C" }}
              >
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-semibold mb-3" style={{ color: "#0F1F3D" }}>
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Fyll ut skjemaet",
      description:
        "Angi informasjon om utleier, leietaker, boligen og leievilkårene i vårt trinnvise skjema. Tar 2 minutter.",
    },
    {
      n: "02",
      title: "AI genererer kontrakten",
      description:
        "Vår AI analyserer informasjonen og skriver en komplett leiekontrakt med alle relevante paragrafer.",
    },
    {
      n: "03",
      title: "Last ned og del",
      description:
        "Last ned som PDF, send til leietaker på e-post og arkiver kontrakten trygt i dashbordet ditt.",
    },
  ];

  return (
    <section id="slik-fungerer-det" className="py-24" style={{ background: "#0F1F3D" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-white mb-3">
            Slik fungerer det
          </h2>
          <p className="text-blue-100/60">Tre steg til en ferdig, juridisk korrekt kontrakt</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-6 left-full w-full h-px -translate-x-4"
                  style={{ background: "rgba(201,168,76,0.2)" }}
                />
              )}
              <div
                className="font-display text-4xl font-bold mb-4"
                style={{ color: "rgba(201,168,76,0.25)" }}
              >
                {s.n}
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{s.title}</h3>
              <p className="text-blue-100/50 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Gratis",
      price: "0",
      period: "",
      description: "Prøv tjenesten",
      features: ["1 kontrakt", "PDF-nedlasting", "Grunnleggende vilkår"],
      excluded: ["Ubegrenset kontrakter", "E-postutsendelse"],
      cta: "Kom i gang gratis",
      href: "/auth?mode=register",
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
        "E-postutsendelse",
        "E-postsupport",
      ],
      excluded: ["Tilpassede maler"],
      cta: "Velg Basis",
      href: "/auth?mode=register&plan=basis",
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
        "Fremtidige funksjoner",
      ],
      excluded: [],
      cta: "Velg Pro",
      href: "/auth?mode=register&plan=pro",
      featured: false,
    },
  ];

  return (
    <section id="priser" className="py-24" style={{ background: "#F8F7F4" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-3" style={{ color: "#0F1F3D" }}>
            Enkle priser
          </h2>
          <p className="text-gray-500">Ingen bindingstid. Ingen skjulte kostnader.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="p-8 border-2"
              style={{
                borderRadius: "8px",
                borderColor: plan.featured ? "#C9A84C" : "#e5e7eb",
                background: plan.featured ? "#0F1F3D" : "#ffffff",
              }}
            >
              {plan.featured && (
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#C9A84C" }}
                >
                  Mest populær
                </div>
              )}
              <div
                className="font-display text-2xl font-bold mb-1"
                style={{ color: plan.featured ? "#ffffff" : "#0F1F3D" }}
              >
                {plan.name}
              </div>
              <div
                className="text-sm mb-6"
                style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : "#6b7280" }}
              >
                {plan.description}
              </div>
              <div className="flex items-baseline gap-0.5 mb-8">
                <span
                  className="font-display text-4xl font-bold"
                  style={{ color: plan.featured ? "#ffffff" : "#0F1F3D" }}
                >
                  {plan.price} kr
                </span>
                {plan.period && (
                  <span style={{ color: plan.featured ? "rgba(255,255,255,0.4)" : "#9ca3af" }} className="text-sm">
                    {plan.period}
                  </span>
                )}
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: plan.featured ? "#C9A84C" : "#0F1F3D" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: plan.featured ? "rgba(255,255,255,0.8)" : "#374151" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
                {plan.excluded.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 opacity-35">
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <div
                        className="w-3 h-px"
                        style={{ background: plan.featured ? "#fff" : "#9ca3af" }}
                      />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: plan.featured ? "#fff" : "#6b7280" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="block w-full text-center py-3 font-semibold text-sm transition-opacity hover:opacity-90"
                style={{
                  borderRadius: "8px",
                  background: plan.featured ? "#C9A84C" : "#0F1F3D",
                  color: plan.featured ? "#0F1F3D" : "#ffffff",
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Er kontraktene juridisk bindende?",
      a: "Ja. Kontraktene er utformet i henhold til husleieloven av 1999 og er juridisk bindende når begge parter har underskrevet.",
    },
    {
      q: "Hva er maksimumsbeløpet for depositum?",
      a: "Ifølge husleieloven § 3-5 kan depositumet ikke overstige 6 månedlige leiebetalinger. Avtalio validerer dette automatisk og viser advarsel om beløpet overskrides.",
    },
    {
      q: "Hva er lovpålagt oppsigelsestid?",
      a: "For løpende leieforhold er minimum oppsigelsestid 1 måned for leietaker og 3 måneder for utleier (§ 9-6). Avtalio bruker disse minimumskravene som standard.",
    },
    {
      q: "Kan jeg redigere kontrakten etter den er generert?",
      a: "Ja. Du kan gå tilbake til skjemaet, justere informasjonen og generere en ny versjon av kontrakten.",
    },
    {
      q: "Er dataene mine trygge?",
      a: "All data lagres i Supabase med kryptering i transit og hvile. Vi deler aldri din informasjon med tredjeparter.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-4xl font-bold text-center mb-12" style={{ color: "#0F1F3D" }}>
          Vanlige spørsmål
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="border border-gray-100 group"
              style={{ borderRadius: "8px" }}
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-semibold text-sm" style={{ color: "#0F1F3D" }}>
                {faq.q}
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20" style={{ background: "#F8F7F4" }}>
      <div
        className="max-w-3xl mx-auto mx-6 md:mx-auto px-6 py-16 text-center"
        style={{ background: "#0F1F3D", borderRadius: "8px" }}
      >
        <h2 className="font-display text-3xl font-bold text-white mb-4">
          Klar til å lage din første kontrakt?
        </h2>
        <p className="text-blue-100/60 mb-8">
          Gratis å starte. Ingen kredittkort nødvendig.
        </p>
        <Link
          href="/auth?mode=register"
          className="inline-flex items-center gap-2 font-semibold px-8 py-4 transition-opacity hover:opacity-90"
          style={{ background: "#C9A84C", color: "#0F1F3D", borderRadius: "8px" }}
        >
          Lag kontrakt gratis
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-display font-bold text-lg" style={{ color: "#0F1F3D" }}>
            Avtalio
          </span>
          <p className="text-gray-400 text-xs mt-0.5">
            Juridisk korrekte leiekontrakter for Norge
          </p>
        </div>
        <div className="flex gap-8 text-sm text-gray-400">
          <Link href="/priser" className="hover:text-gray-700">Priser</Link>
          <Link href="/auth" className="hover:text-gray-700">Logg inn</Link>
          <Link href="/personvern" className="hover:text-gray-700">Personvern</Link>
          <Link href="/vilkar" className="hover:text-gray-700">Vilkår</Link>
        </div>
        <p className="text-gray-300 text-xs">
          © {new Date().getFullYear()} Avtalio
        </p>
      </div>
    </footer>
  );
}
