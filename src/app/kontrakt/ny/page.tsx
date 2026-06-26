"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { KontraktData } from "@/lib/types";

const TOTAL_STEPS = 6;

const initialData: KontraktData = {
  utleier_navn: "",
  utleier_adresse: "",
  utleier_epost: "",
  utleier_telefon: "",
  utleier_er_firma: false,
  utleier_orgnr: "",
  leietaker_navn: "",
  leietaker_adresse: "",
  leietaker_epost: "",
  leietaker_telefon: "",
  bolig_adresse: "",
  bolig_type: "leilighet",
  bolig_antall_rom: 2,
  bolig_mobler: false,
  inkluderer_strom: false,
  inkluderer_internett: false,
  inkluderer_parkering: false,
  maned_leie: 0,
  forfall_dag: 1,
  depositum: 0,
  depositum_kontonr: "",
  startdato: "",
  leie_type: "lopende",
  sluttdato: "",
  oppsigelsestid_leietaker: 1,
  oppsigelsestid_utleier: 3,
  kjaledyr: "nei",
  royking_tillatt: false,
  internett_betaler: "leietaker",
  tilleggsvilkar: "",
};

export default function NyKontraktPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<KontraktData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof KontraktData, value: unknown) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  }

  function prevStep() {
    if (step > 1) setStep((s) => s - 1);
  }

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

  const depositumMax = data.maned_leie * 6;
  const depositumOverskredet = data.depositum > depositumMax && data.maned_leie > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="text-navy-500 hover:text-navy-900">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="font-display text-xl font-bold text-navy-800">Ny leiekontrakt</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-navy-400 mb-2">
            <span>Steg {step} av {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-navy-800 rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {["Utleier", "Leietaker", "Boligen", "Vilkår", "Tillegg", "Gjennomgang"].map((label, i) => (
              <span
                key={label}
                className={`text-xs ${i + 1 <= step ? "text-navy-800 font-medium" : "text-navy-300"}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          {step === 1 && <Steg1 data={data} update={update} />}
          {step === 2 && <Steg2 data={data} update={update} />}
          {step === 3 && <Steg3 data={data} update={update} />}
          {step === 4 && <Steg4 data={data} update={update} depositumOverskredet={depositumOverskredet} depositumMax={depositumMax} />}
          {step === 5 && <Steg5 data={data} update={update} />}
          {step === 6 && <Steg6 data={data} />}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 text-navy-500 hover:text-navy-900 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Tilbake
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Neste
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading || depositumOverskredet}
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Genererer...
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

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-navy-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, required }: {
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
      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors ${checked ? "bg-navy-800" : "bg-gray-200"} relative`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </div>
      <span className="text-sm text-navy-700">{label}</span>
    </label>
  );
}

function Steg1({ data, update }: { data: KontraktData; update: (f: keyof KontraktData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Utleier</h2>
        <p className="text-navy-400 text-sm">Informasjon om den som leier ut boligen</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Fullt navn *">
          <Input value={data.utleier_navn} onChange={(v) => update("utleier_navn", v)} placeholder="Ola Nordmann" required />
        </Field>
        <Field label="Telefonnummer">
          <Input value={data.utleier_telefon} onChange={(v) => update("utleier_telefon", v)} placeholder="+47 000 00 000" type="tel" />
        </Field>
      </div>
      <Field label="Adresse *">
        <Input value={data.utleier_adresse} onChange={(v) => update("utleier_adresse", v)} placeholder="Storgata 1, 0155 Oslo" required />
      </Field>
      <Field label="E-post *">
        <Input value={data.utleier_epost} onChange={(v) => update("utleier_epost", v)} placeholder="ola@eksempel.no" type="email" required />
      </Field>
      <Toggle
        checked={data.utleier_er_firma}
        onChange={(v) => update("utleier_er_firma", v)}
        label="Utleier er et firma"
      />
      {data.utleier_er_firma && (
        <Field label="Organisasjonsnummer">
          <Input value={data.utleier_orgnr || ""} onChange={(v) => update("utleier_orgnr", v)} placeholder="123 456 789" />
        </Field>
      )}
    </div>
  );
}

function Steg2({ data, update }: { data: KontraktData; update: (f: keyof KontraktData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Leietaker</h2>
        <p className="text-navy-400 text-sm">Informasjon om den som skal leie boligen</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Fullt navn *">
          <Input value={data.leietaker_navn} onChange={(v) => update("leietaker_navn", v)} placeholder="Kari Nordmann" required />
        </Field>
        <Field label="Telefonnummer">
          <Input value={data.leietaker_telefon} onChange={(v) => update("leietaker_telefon", v)} placeholder="+47 000 00 000" type="tel" />
        </Field>
      </div>
      <Field label="Nåværende adresse">
        <Input value={data.leietaker_adresse} onChange={(v) => update("leietaker_adresse", v)} placeholder="Lille gate 2, 0156 Oslo" />
      </Field>
      <Field label="E-post *">
        <Input value={data.leietaker_epost} onChange={(v) => update("leietaker_epost", v)} placeholder="kari@eksempel.no" type="email" required />
      </Field>
    </div>
  );
}

function Steg3({ data, update }: { data: KontraktData; update: (f: keyof KontraktData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Boligen</h2>
        <p className="text-navy-400 text-sm">Informasjon om utleieobjektet</p>
      </div>
      <Field label="Adresse til utleieobjektet *">
        <Input value={data.bolig_adresse} onChange={(v) => update("bolig_adresse", v)} placeholder="Leilighetsgata 5B, 0157 Oslo" required />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Type bolig">
          <Select
            value={data.bolig_type}
            onChange={(v) => update("bolig_type", v)}
            options={[
              { value: "leilighet", label: "Leilighet" },
              { value: "hybel", label: "Hybel" },
              { value: "enebolig", label: "Enebolig" },
              { value: "rekkehus", label: "Rekkehus" },
            ]}
          />
        </Field>
        <Field label="Antall rom">
          <Input value={data.bolig_antall_rom} onChange={(v) => update("bolig_antall_rom", parseInt(v) || 1)} type="number" />
        </Field>
      </div>
      <div className="space-y-3">
        <Toggle checked={data.bolig_mobler} onChange={(v) => update("bolig_mobler", v)} label="Møblert" />
        <Toggle checked={data.inkluderer_strom} onChange={(v) => update("inkluderer_strom", v)} label="Inkluderer strøm" />
        <Toggle checked={data.inkluderer_internett} onChange={(v) => update("inkluderer_internett", v)} label="Inkluderer internett" />
        <Toggle checked={data.inkluderer_parkering} onChange={(v) => update("inkluderer_parkering", v)} label="Inkluderer parkering" />
      </div>
    </div>
  );
}

function Steg4({
  data, update, depositumOverskredet, depositumMax
}: {
  data: KontraktData;
  update: (f: keyof KontraktData, v: unknown) => void;
  depositumOverskredet: boolean;
  depositumMax: number;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Leievilkår</h2>
        <p className="text-navy-400 text-sm">Økonomi og tidsperiode</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Månedlig leie (NOK) *">
          <Input value={data.maned_leie || ""} onChange={(v) => update("maned_leie", parseFloat(v) || 0)} type="number" placeholder="12000" required />
        </Field>
        <Field label="Forfallsdato (dag i måneden)">
          <Input value={data.forfall_dag} onChange={(v) => update("forfall_dag", parseInt(v) || 1)} type="number" />
        </Field>
      </div>
      <div>
        <Field label="Depositum (NOK)" hint={`Maks tillatt: ${depositumMax > 0 ? depositumMax.toLocaleString("nb-NO") + " kr (6x månedleie)" : "avhenger av månedleie"}`}>
          <Input value={data.depositum || ""} onChange={(v) => update("depositum", parseFloat(v) || 0)} type="number" placeholder="0" />
        </Field>
        {depositumOverskredet && (
          <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 text-sm">
            ⚠️ Ifølge husleieloven § 3-5 kan depositumet ikke overstige 6 månedlige leiebetalinger ({depositumMax.toLocaleString("nb-NO")} kr).
          </div>
        )}
      </div>
      <Field label="Depositumkonto (kontonummer)">
        <Input value={data.depositum_kontonr} onChange={(v) => update("depositum_kontonr", v)} placeholder="1234.56.78901" />
      </Field>
      <Field label="Startdato for leieforholdet *">
        <Input value={data.startdato} onChange={(v) => update("startdato", v)} type="date" required />
      </Field>
      <Field label="Type leieforhold">
        <Select
          value={data.leie_type}
          onChange={(v) => update("leie_type", v)}
          options={[
            { value: "lopende", label: "Løpende (ingen sluttdato)" },
            { value: "tidsbegrenset", label: "Tidsbegrenset" },
          ]}
        />
      </Field>
      {data.leie_type === "tidsbegrenset" && (
        <Field label="Sluttdato">
          <Input value={data.sluttdato || ""} onChange={(v) => update("sluttdato", v)} type="date" />
        </Field>
      )}
      {data.leie_type === "lopende" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Oppsigelsestid for leietaker (måneder)" hint="Minimum 1 måned etter husleieloven">
            <Input value={data.oppsigelsestid_leietaker} onChange={(v) => update("oppsigelsestid_leietaker", parseInt(v) || 1)} type="number" />
          </Field>
          <Field label="Oppsigelsestid for utleier (måneder)" hint="Minimum 3 måneder etter husleieloven">
            <Input value={data.oppsigelsestid_utleier} onChange={(v) => update("oppsigelsestid_utleier", parseInt(v) || 3)} type="number" />
          </Field>
        </div>
      )}
    </div>
  );
}

function Steg5({ data, update }: { data: KontraktData; update: (f: keyof KontraktData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Tilleggsvilkår</h2>
        <p className="text-navy-400 text-sm">Spesifikke regler og avtaler</p>
      </div>
      <Field label="Kjæledyr">
        <Select
          value={data.kjaledyr}
          onChange={(v) => update("kjaledyr", v)}
          options={[
            { value: "nei", label: "Ikke tillatt" },
            { value: "ja", label: "Tillatt" },
            { value: "etter_avtale", label: "Etter avtale" },
          ]}
        />
      </Field>
      <Toggle checked={data.royking_tillatt} onChange={(v) => update("royking_tillatt", v)} label="Røyking innendørs er tillatt" />
      <Field label="Hvem betaler internett?">
        <Select
          value={data.internett_betaler}
          onChange={(v) => update("internett_betaler", v)}
          options={[
            { value: "leietaker", label: "Leietaker" },
            { value: "utleier", label: "Utleier" },
            { value: "delt", label: "Delt kostnad" },
          ]}
        />
      </Field>
      <Field label="Spesielle vilkår eller tilleggsavtaler">
        <textarea
          value={data.tilleggsvilkar || ""}
          onChange={(e) => update("tilleggsvilkar", e.target.value)}
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
          placeholder="Eventuelle særskilte avtaler mellom partene..."
        />
      </Field>
    </div>
  );
}

function Steg6({ data }: { data: KontraktData }) {
  const rows = [
    ["Utleier", data.utleier_navn + (data.utleier_er_firma ? ` (Org.nr: ${data.utleier_orgnr})` : "")],
    ["Leietaker", data.leietaker_navn],
    ["Adresse", data.bolig_adresse],
    ["Type", data.bolig_type],
    ["Månedlig leie", `${data.maned_leie.toLocaleString("nb-NO")} kr`],
    ["Depositum", `${data.depositum.toLocaleString("nb-NO")} kr`],
    ["Startdato", data.startdato ? new Date(data.startdato).toLocaleDateString("nb-NO") : "—"],
    ["Leieforhold", data.leie_type === "lopende" ? "Løpende" : `Tidsbegrenset til ${data.sluttdato ? new Date(data.sluttdato).toLocaleDateString("nb-NO") : "—"}`],
    ["Kjæledyr", { nei: "Ikke tillatt", ja: "Tillatt", etter_avtale: "Etter avtale" }[data.kjaledyr]],
    ["Røyking", data.royking_tillatt ? "Tillatt" : "Ikke tillatt"],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Gjennomgang</h2>
        <p className="text-navy-400 text-sm">Kontroller informasjonen før du genererer kontrakten</p>
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map(([label, value]) => (
          <div key={label} className="py-3 flex justify-between">
            <span className="text-sm text-navy-500">{label}</span>
            <span className="text-sm font-medium text-navy-900">{value}</span>
          </div>
        ))}
      </div>
      {data.tilleggsvilkar && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-xs font-medium text-navy-500 uppercase tracking-wider mb-2">Tilleggsvilkår</div>
          <p className="text-sm text-navy-700">{data.tilleggsvilkar}</p>
        </div>
      )}
    </div>
  );
}
