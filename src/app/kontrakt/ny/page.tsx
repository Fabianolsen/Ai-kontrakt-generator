"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { FormData, Utleier, Leietaker, Bolig, Vilkar, Tillegg } from "@/lib/types";

const TOTAL_STEPS = 6;

const initUtleier: Utleier = {
  navn: "", adresse: "", epost: "", telefon: "", er_firma: false, orgnr: "",
};
const initLeietaker: Leietaker = {
  navn: "", adresse: "", epost: "", telefon: "",
};
const initBolig: Bolig = {
  adresse: "", type: "leilighet", antall_rom: 2, mobler: false,
  inkl_strom: false, inkl_internett: false, inkl_parkering: false,
};
const initVilkar: Vilkar = {
  maned_leie: 0, forfall_dag: 1, depositum: 0, depositum_kontonr: "",
  startdato: "", leie_type: "lopende", sluttdato: "",
  oppsigelsestid_leietaker: 1, oppsigelsestid_utleier: 3,
};
const initTillegg: Tillegg = {
  kjaledyr: "nei", royking_tillatt: false,
  internett_betaler: "leietaker", tilleggsvilkar: "",
};

const initialData: FormData = {
  utleier:   initUtleier,
  leietaker: initLeietaker,
  bolig:     initBolig,
  vilkar:    initVilkar,
  tillegg:   initTillegg,
};

export default function NyKontraktPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateUtleier(f: keyof Utleier, v: unknown) {
    setData((d) => ({ ...d, utleier: { ...d.utleier, [f]: v } }));
  }
  function updateLeietaker(f: keyof Leietaker, v: unknown) {
    setData((d) => ({ ...d, leietaker: { ...d.leietaker, [f]: v } }));
  }
  function updateBolig(f: keyof Bolig, v: unknown) {
    setData((d) => ({ ...d, bolig: { ...d.bolig, [f]: v } }));
  }
  function updateVilkar(f: keyof Vilkar, v: unknown) {
    setData((d) => ({ ...d, vilkar: { ...d.vilkar, [f]: v } }));
  }
  function updateTillegg(f: keyof Tillegg, v: unknown) {
    setData((d) => ({ ...d, tillegg: { ...d.tillegg, [f]: v } }));
  }

  const depositumMax = data.vilkar.maned_leie * 6;
  const depositumOverskredet =
    data.vilkar.depositum > depositumMax && data.vilkar.maned_leie > 0;

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/kontrakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Noe gikk galt");
      }
      const { id } = await res.json();
      router.push(`/kontrakt/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
      setLoading(false);
    }
  }

  const stepLabels = ["Utleier", "Leietaker", "Boligen", "Vilkår", "Tillegg", "Gjennomgang"];

  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="font-display font-bold text-lg" style={{ color: "#0F1F3D" }}>
            Ny leiekontrakt
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Steg {step} av {TOTAL_STEPS} — {stepLabels[step - 1]}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200" style={{ borderRadius: "8px" }}>
            <div
              className="h-1.5 transition-all duration-300"
              style={{
                width: `${(step / TOTAL_STEPS) * 100}%`,
                background: "#0F1F3D",
                borderRadius: "8px",
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {stepLabels.map((label, i) => (
              <span
                key={label}
                className="text-xs"
                style={{ color: i + 1 <= step ? "#0F1F3D" : "#d1d5db", fontWeight: i + 1 === step ? 600 : 400 }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 p-8 shadow-sm" style={{ borderRadius: "8px" }}>
          {step === 1 && <StepUtleier data={data.utleier} update={updateUtleier} />}
          {step === 2 && <StepLeietaker data={data.leietaker} update={updateLeietaker} />}
          {step === 3 && <StepBolig data={data.bolig} update={updateBolig} />}
          {step === 4 && (
            <StepVilkar
              data={data.vilkar}
              update={updateVilkar}
              depositumOverskredet={depositumOverskredet}
              depositumMax={depositumMax}
            />
          )}
          {step === 5 && <StepTillegg data={data.tillegg} update={updateTillegg} />}
          {step === 6 && <StepGjennomgang data={data} />}

          {error && (
            <div
              className="mt-6 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm"
              style={{ borderRadius: "8px" }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Tilbake
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 text-white transition-opacity hover:opacity-90"
                style={{ background: "#0F1F3D", borderRadius: "8px" }}
              >
                Neste
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading || depositumOverskredet}
                className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#C9A84C", color: "#0F1F3D", borderRadius: "8px" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Genererer…
                  </>
                ) : (
                  "Generer kontrakt"
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-bold mb-1" style={{ color: "#0F1F3D" }}>{title}</h2>
      <p className="text-gray-400 text-sm">{sub}</p>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0";
const inputStyle = { borderRadius: "8px" };

function TextInput({
  value, onChange, type = "text", placeholder, required,
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={inputClass}
      style={inputStyle}
    />
  );
}

function SelectInput({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} style={inputStyle}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Toggle({
  checked, onChange, label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-10 h-5.5 flex-shrink-0 transition-colors"
        style={{
          width: 40, height: 22,
          background: checked ? "#0F1F3D" : "#e5e7eb",
          borderRadius: 11,
        }}
      >
        <span
          className="absolute top-0.5 transition-transform"
          style={{
            width: 18, height: 18,
            background: "#fff",
            borderRadius: "50%",
            left: 2,
            transform: checked ? "translateX(18px)" : "translateX(0)",
          }}
        />
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────

function StepUtleier({ data, update }: { data: Utleier; update: (f: keyof Utleier, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Utleier" sub="Informasjon om den som leier ut boligen" />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Fullt navn *">
          <TextInput value={data.navn} onChange={(v) => update("navn", v)} placeholder="Ola Nordmann" required />
        </Field>
        <Field label="Telefon">
          <TextInput value={data.telefon} onChange={(v) => update("telefon", v)} type="tel" placeholder="+47 000 00 000" />
        </Field>
      </div>
      <Field label="Adresse *">
        <TextInput value={data.adresse} onChange={(v) => update("adresse", v)} placeholder="Storgata 1, 0155 Oslo" required />
      </Field>
      <Field label="E-post *">
        <TextInput value={data.epost} onChange={(v) => update("epost", v)} type="email" placeholder="ola@eksempel.no" required />
      </Field>
      <Toggle checked={data.er_firma} onChange={(v) => update("er_firma", v)} label="Utleier er registrert som firma" />
      {data.er_firma && (
        <Field label="Organisasjonsnummer">
          <TextInput value={data.orgnr ?? ""} onChange={(v) => update("orgnr", v)} placeholder="123 456 789" />
        </Field>
      )}
    </div>
  );
}

function StepLeietaker({ data, update }: { data: Leietaker; update: (f: keyof Leietaker, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Leietaker" sub="Informasjon om den som skal leie boligen" />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Fullt navn *">
          <TextInput value={data.navn} onChange={(v) => update("navn", v)} placeholder="Kari Nordmann" required />
        </Field>
        <Field label="Telefon">
          <TextInput value={data.telefon} onChange={(v) => update("telefon", v)} type="tel" placeholder="+47 000 00 000" />
        </Field>
      </div>
      <Field label="Nåværende adresse">
        <TextInput value={data.adresse} onChange={(v) => update("adresse", v)} placeholder="Lille gate 2, 0156 Oslo" />
      </Field>
      <Field label="E-post *">
        <TextInput value={data.epost} onChange={(v) => update("epost", v)} type="email" placeholder="kari@eksempel.no" required />
      </Field>
    </div>
  );
}

function StepBolig({ data, update }: { data: Bolig; update: (f: keyof Bolig, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Boligen" sub="Informasjon om utleieobjektet" />
      <Field label="Adresse *">
        <TextInput value={data.adresse} onChange={(v) => update("adresse", v)} placeholder="Leilighetsgata 5B, 0157 Oslo" required />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Type bolig">
          <SelectInput
            value={data.type}
            onChange={(v) => update("type", v)}
            options={[
              { value: "leilighet", label: "Leilighet" },
              { value: "hybel",     label: "Hybel" },
              { value: "enebolig",  label: "Enebolig" },
              { value: "rekkehus",  label: "Rekkehus" },
            ]}
          />
        </Field>
        <Field label="Antall rom">
          <TextInput value={data.antall_rom} onChange={(v) => update("antall_rom", parseInt(v) || 1)} type="number" />
        </Field>
      </div>
      <div className="space-y-3 pt-1">
        <Toggle checked={data.mobler}         onChange={(v) => update("mobler", v)}         label="Møblert" />
        <Toggle checked={data.inkl_strom}     onChange={(v) => update("inkl_strom", v)}     label="Strøm inkludert i leien" />
        <Toggle checked={data.inkl_internett} onChange={(v) => update("inkl_internett", v)} label="Internett inkludert i leien" />
        <Toggle checked={data.inkl_parkering} onChange={(v) => update("inkl_parkering", v)} label="Parkering inkludert i leien" />
      </div>
    </div>
  );
}

function StepVilkar({
  data, update, depositumOverskredet, depositumMax,
}: {
  data: Vilkar;
  update: (f: keyof Vilkar, v: unknown) => void;
  depositumOverskredet: boolean;
  depositumMax: number;
}) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Leievilkår" sub="Økonomi og tidsperiode" />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Månedlig leie (kr) *">
          <TextInput
            value={data.maned_leie || ""}
            onChange={(v) => update("maned_leie", parseFloat(v) || 0)}
            type="number"
            placeholder="12 000"
            required
          />
        </Field>
        <Field label="Forfallsdag (1–28)">
          <TextInput
            value={data.forfall_dag}
            onChange={(v) => update("forfall_dag", Math.min(28, Math.max(1, parseInt(v) || 1)))}
            type="number"
          />
        </Field>
      </div>

      <Field
        label="Depositum (kr)"
        hint={depositumMax > 0 ? `Maks tillatt: ${depositumMax.toLocaleString("nb-NO")} kr (6 × månedleie, jf. husleieloven § 3-5)` : undefined}
      >
        <TextInput
          value={data.depositum || ""}
          onChange={(v) => update("depositum", parseFloat(v) || 0)}
          type="number"
          placeholder="0"
        />
      </Field>

      {depositumOverskredet && (
        <div
          className="flex items-start gap-3 px-4 py-3 border text-sm"
          style={{ background: "#fffbeb", borderColor: "#fcd34d", borderRadius: "8px", color: "#92400e" }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Depositum overskrider grensen på{" "}
            <strong>{depositumMax.toLocaleString("nb-NO")} kr</strong> som fastsatt i
            husleieloven § 3-5. Reduser beløpet for å fortsette.
          </span>
        </div>
      )}

      <Field label="Depositumkonto (kontonummer)">
        <TextInput value={data.depositum_kontonr} onChange={(v) => update("depositum_kontonr", v)} placeholder="1234.56.78901" />
      </Field>

      <Field label="Startdato *">
        <TextInput value={data.startdato} onChange={(v) => update("startdato", v)} type="date" required />
      </Field>

      <Field label="Type leieforhold">
        <SelectInput
          value={data.leie_type}
          onChange={(v) => update("leie_type", v)}
          options={[
            { value: "lopende",        label: "Løpende (ingen bestemt sluttdato)" },
            { value: "tidsbegrenset",  label: "Tidsbegrenset" },
          ]}
        />
      </Field>

      {data.leie_type === "tidsbegrenset" && (
        <Field label="Sluttdato">
          <TextInput value={data.sluttdato ?? ""} onChange={(v) => update("sluttdato", v)} type="date" />
        </Field>
      )}

      {data.leie_type === "lopende" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Oppsigelsestid — leietaker (mnd)" hint="Min. 1 måned (§ 9-6)">
            <TextInput
              value={data.oppsigelsestid_leietaker}
              onChange={(v) => update("oppsigelsestid_leietaker", Math.max(1, parseInt(v) || 1))}
              type="number"
            />
          </Field>
          <Field label="Oppsigelsestid — utleier (mnd)" hint="Min. 3 måneder (§ 9-6)">
            <TextInput
              value={data.oppsigelsestid_utleier}
              onChange={(v) => update("oppsigelsestid_utleier", Math.max(3, parseInt(v) || 3))}
              type="number"
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function StepTillegg({ data, update }: { data: Tillegg; update: (f: keyof Tillegg, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Tilleggsvilkår" sub="Spesifikke regler og avtaler" />
      <Field label="Kjæledyr">
        <SelectInput
          value={data.kjaledyr}
          onChange={(v) => update("kjaledyr", v)}
          options={[
            { value: "nei",          label: "Ikke tillatt" },
            { value: "ja",           label: "Tillatt" },
            { value: "etter_avtale", label: "Etter særskilt avtale" },
          ]}
        />
      </Field>
      <Toggle checked={data.royking_tillatt} onChange={(v) => update("royking_tillatt", v)} label="Røyking innendørs er tillatt" />
      <Field label="Hvem betaler internett?">
        <SelectInput
          value={data.internett_betaler}
          onChange={(v) => update("internett_betaler", v)}
          options={[
            { value: "leietaker", label: "Leietaker" },
            { value: "utleier",   label: "Utleier" },
            { value: "delt",      label: "Delt kostnad" },
          ]}
        />
      </Field>
      <Field label="Særskilte vilkår eller tilleggsavtaler">
        <textarea
          value={data.tilleggsvilkar ?? ""}
          onChange={(e) => update("tilleggsvilkar", e.target.value)}
          rows={4}
          className={inputClass + " resize-none"}
          style={inputStyle}
          placeholder="Eventuelle avtaler som ikke dekkes av standardvilkårene…"
        />
      </Field>
    </div>
  );
}

function StepGjennomgang({ data }: { data: FormData }) {
  const rows: [string, string][] = [
    ["Utleier",       data.utleier.navn + (data.utleier.er_firma ? ` (${data.utleier.orgnr})` : "")],
    ["Leietaker",     data.leietaker.navn],
    ["Adresse",       data.bolig.adresse],
    ["Type bolig",    data.bolig.type],
    ["Månedlig leie", `${data.vilkar.maned_leie.toLocaleString("nb-NO")} kr`],
    ["Depositum",     `${data.vilkar.depositum.toLocaleString("nb-NO")} kr`],
    ["Startdato",     data.vilkar.startdato ? new Date(data.vilkar.startdato).toLocaleDateString("nb-NO") : "—"],
    ["Leieforhold",   data.vilkar.leie_type === "lopende"
      ? "Løpende"
      : `Tidsbegrenset til ${data.vilkar.sluttdato ? new Date(data.vilkar.sluttdato).toLocaleDateString("nb-NO") : "—"}`],
    ["Kjæledyr",      { nei: "Ikke tillatt", ja: "Tillatt", etter_avtale: "Etter avtale" }[data.tillegg.kjaledyr]],
    ["Røyking",       data.tillegg.royking_tillatt ? "Tillatt" : "Ikke tillatt"],
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Gjennomgang" sub="Kontroller informasjonen før du genererer" />
      <div className="divide-y divide-gray-50">
        {rows.map(([label, value]) => (
          <div key={label} className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-sm font-medium" style={{ color: "#0F1F3D" }}>{value}</span>
          </div>
        ))}
      </div>
      {data.tillegg.tilleggsvilkar && (
        <div className="p-4 bg-gray-50" style={{ borderRadius: "8px" }}>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Tilleggsvilkår
          </div>
          <p className="text-sm text-gray-600">{data.tillegg.tilleggsvilkar}</p>
        </div>
      )}
      <p className="text-xs text-gray-400 pt-2">
        Ved å klikke &quot;Generer kontrakt&quot; godtar du at kontrakten genereres med informasjonen ovenfor.
      </p>
    </div>
  );
}
