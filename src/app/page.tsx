import Link from "next/link";
import { CheckCircle, Shield, Zap, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold text-navy-800">
          Avtalio
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/priser" className="text-navy-600 hover:text-navy-900 text-sm font-medium">
            Priser
          </Link>
          <Link href="/auth" className="text-navy-600 hover:text-navy-900 text-sm font-medium">
            Logg inn
          </Link>
          <Link
            href="/auth?mode=register"
            className="bg-navy-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors"
          >
            Kom i gang gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-24 bg-gradient-to-b from-navy-950 to-navy-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
          <Shield className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-gold-400 text-xs font-medium">Basert på husleieloven av 1999</span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Lag en juridisk korrekt{" "}
          <span className="text-gold-400">leiekontrakt</span>{" "}
          på 2 minutter
        </h1>
        <p className="text-navy-200 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          AI-drevet plattform som genererer profesjonelle leiekontrakter tilpasset norsk lov.
          For privatpersoner og småbedrifter.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth?mode=register"
            className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Lag din første kontrakt gratis
          </Link>
          <Link
            href="#slik-fungerer-det"
            className="border border-navy-400 text-navy-200 hover:border-navy-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Se hvordan det fungerer
          </Link>
        </div>
        <p className="text-navy-400 text-sm mt-6">Ingen kredittkort nødvendig · 1 gratis kontrakt</p>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Juridisk korrekt",
      description:
        "Alle kontrakter er basert på husleieloven av 1999 og oppdateres ved lovendringer.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Rask",
      description:
        "Fyll ut skjemaet på 2 minutter. AI-en genererer en komplett kontrakt øyeblikkelig.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Trygg",
      description:
        "Kontraktene dine lagres sikkert og er tilgjengelige når du trenger dem.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy-800 text-gold-400 mb-4">
                {f.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-navy-900 mb-3">{f.title}</h3>
              <p className="text-navy-500 leading-relaxed">{f.description}</p>
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
      number: "01",
      title: "Fyll ut skjemaet",
      description:
        "Angi informasjon om utleier, leietaker, boligen og leievilkårene i vårt enkle steg-for-steg skjema.",
    },
    {
      number: "02",
      title: "AI genererer kontrakten",
      description:
        "Vår AI analyserer informasjonen og genererer en komplett, juridisk korrekt leiekontrakt tilpasset norsk lov.",
    },
    {
      number: "03",
      title: "Last ned og del",
      description:
        "Last ned kontrakten som PDF, send den til leietaker på e-post og arkiver den trygt i dashbordet ditt.",
    },
  ];

  return (
    <section id="slik-fungerer-det" className="py-20 bg-navy-950">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Slik fungerer det</h2>
          <p className="text-navy-300 text-lg">Tre enkle steg til en ferdig kontrakt</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-navy-700 -translate-x-8 z-0" />
              )}
              <div className="relative z-10">
                <div className="font-display text-5xl font-bold text-gold-500/30 mb-4">{step.number}</div>
                <h3 className="font-semibold text-white text-xl mb-3">{step.title}</h3>
                <p className="text-navy-300 leading-relaxed">{step.description}</p>
              </div>
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
      description: "Prøv tjenesten",
      features: ["1 kontrakt", "PDF-nedlasting", "Grunnleggende vilkår"],
      cta: "Kom i gang",
      href: "/auth?mode=register",
      highlight: false,
    },
    {
      name: "Basis",
      price: "99",
      description: "For privatpersoner",
      features: [
        "Ubegrenset kontrakter",
        "PDF-nedlasting",
        "Kontraktarkiv",
        "E-postutsendelse",
      ],
      cta: "Velg Basis",
      href: "/auth?mode=register&plan=basis",
      highlight: true,
    },
    {
      name: "Pro",
      price: "249",
      description: "For småbedrifter",
      features: [
        "Alt i Basis",
        "Prioritert support",
        "Tilpassede vilkår",
        "Fremtidige funksjoner",
      ],
      cta: "Velg Pro",
      href: "/auth?mode=register&plan=pro",
      highlight: false,
    },
  ];

  return (
    <section id="priser" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-navy-900 mb-4">Enkle priser</h2>
          <p className="text-navy-500 text-lg">Ingen skjulte kostnader</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border-2 ${
                plan.highlight
                  ? "border-gold-500 bg-navy-950 text-white"
                  : "border-gray-100 bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Mest populær
                </div>
              )}
              <div className="mb-6">
                <div className={`font-display text-2xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-navy-900"}`}>
                  {plan.name}
                </div>
                <div className={`text-sm mb-4 ${plan.highlight ? "text-navy-300" : "text-navy-500"}`}>
                  {plan.description}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`font-display text-4xl font-bold ${plan.highlight ? "text-white" : "text-navy-900"}`}>
                    {plan.price} kr
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-sm text-navy-400">/mnd</span>
                  )}
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-gold-400" : "text-navy-600"}`} />
                    <span className={`text-sm ${plan.highlight ? "text-navy-200" : "text-navy-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
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
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Er kontraktene juridisk bindende?",
      a: "Ja. Kontraktene er utformet i henhold til husleieloven av 1999 og er juridisk bindende når begge parter har signert.",
    },
    {
      q: "Hva er maksimumsbeløpet for depositum?",
      a: "Ifølge husleieloven § 3-5 kan depositumet ikke overstige 6 månedlige leiebetalinger. Avtalio varsler deg automatisk hvis du legger inn et for høyt beløp.",
    },
    {
      q: "Hva er oppsigelsestiden etter husleieloven?",
      a: "For løpende leieforhold er minimum oppsigelsestid 1 måned for leietaker og 3 måneder for utleier. For tidsbegrensede leieforhold kan partene ikke si opp kontrakten i leieperioden.",
    },
    {
      q: "Kan jeg redigere kontrakten etter den er generert?",
      a: "Ja, du kan gå tilbake og endre informasjonen og generere en ny versjon av kontrakten.",
    },
    {
      q: "Er dataene mine trygge?",
      a: "Vi benytter Supabase for sikker lagring av data, og all kommunikasjon er kryptert med TLS.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-navy-900 mb-4">
            Ofte stilte spørsmål
          </h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-navy-900 mb-2">{faq.q}</h3>
              <p className="text-navy-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-950 py-12 border-t border-navy-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-display text-2xl font-bold text-white mb-1">Avtalio</div>
            <p className="text-navy-400 text-sm">Juridisk korrekte leiekontrakter for Norge</p>
          </div>
          <div className="flex gap-8 text-sm text-navy-400">
            <Link href="/priser" className="hover:text-white transition-colors">Priser</Link>
            <Link href="/auth" className="hover:text-white transition-colors">Logg inn</Link>
            <Link href="/personvern" className="hover:text-white transition-colors">Personvern</Link>
            <Link href="/vilkar" className="hover:text-white transition-colors">Vilkår</Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-navy-800 text-center text-navy-500 text-sm">
          © {new Date().getFullYear()} Avtalio. Basert på husleieloven av 1999.
        </div>
      </div>
    </footer>
  );
}
