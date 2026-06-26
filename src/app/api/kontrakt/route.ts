import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { FormData } from "@/lib/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `Du er en norsk juridisk ekspert spesialisert på husleierett. Din oppgave er å generere profesjonelle, juridisk korrekte leiekontrakter basert på husleieloven av 1999 (lov om husleieavtaler).

JURIDISKE RAMMER DU MÅ OVERHOLDE:
- Depositumet kan ikke overstige 6 månedlige leiebetalinger (§ 3-5)
- Depositum skal stå på særskilt sperret konto i leietakers navn (§ 3-5)
- Leien kan ikke kreves betalt mer enn 1 måned i forveien (§ 3-2)
- Løpende leieforhold: minimum 1 måneds oppsigelsestid for leietaker (§ 9-6)
- Løpende leieforhold: minimum 3 måneders oppsigelsestid for utleier (§ 9-6)
- Tidsbegrenset leieforhold under 3 år: særskilte regler for opphør (§ 9-2)
- Utleier kan ikke ensidig endre leievilkår i løpet av leietiden

KRAV TIL OUTPUT:
- Skriv KUN kontraktteksten — ingen innledning, ingen forklaring utenfor selve kontrakten
- Norsk bokmål, profesjonelt juridisk språk
- Bruk §-nummerering for alle paragrafer
- Inkluder dato og underskriftsfelt for begge parter til slutt

OBLIGATORISK STRUKTUR:
§ 1  Parter
§ 2  Leieobjektet
§ 3  Leietid
§ 4  Leie og betaling
§ 5  Depositum
§ 6  Leietakers bruk av leieobjektet
§ 7  Vedlikehold og tilstand
§ 8  Oppsigelse
§ 9  Tilleggsvilkår  ← utelat hvis ingen tilleggsvilkår
§ 10 Tvister og verneting
Underskrifter`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });

  // Enforce contract limit for free plan
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  if (!sub || sub.plan === "gratis") {
    const { count } = await supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((count ?? 0) >= 1) {
      return NextResponse.json(
        { error: "Gratisplanen tillater kun 1 kontrakt. Oppgrader for ubegrenset tilgang." },
        { status: 403 }
      );
    }
  }

  const form: FormData = await req.json();
  const { utleier, leietaker, bolig, vilkar, tillegg } = form;

  const boligTypeLabel = { leilighet: "leilighet", hybel: "hybel", enebolig: "enebolig", rekkehus: "rekkehus" };
  const kjaledyrLabel  = { ja: "tillatt", nei: "ikke tillatt", etter_avtale: "etter særskilt skriftlig avtale" };

  const inkluderinger = [
    bolig.inkl_strom     && "strøm",
    bolig.inkl_internett && "internett",
    bolig.inkl_parkering && "parkering",
  ].filter(Boolean).join(", ") || "ingen";

  const userPrompt = `Generer en leiekontrakt med følgende data:

${JSON.stringify({
  utleier: {
    navn:    utleier.navn,
    adresse: utleier.adresse,
    epost:   utleier.epost,
    telefon: utleier.telefon,
    type:    utleier.er_firma ? `Firma (org.nr. ${utleier.orgnr})` : "Privatperson",
  },
  leietaker: {
    navn:    leietaker.navn,
    adresse: leietaker.adresse,
    epost:   leietaker.epost,
    telefon: leietaker.telefon,
  },
  bolig: {
    adresse:      bolig.adresse,
    type:         boligTypeLabel[bolig.type],
    antall_rom:   bolig.antall_rom,
    mobler:       bolig.mobler ? "møblert" : "umøblert",
    inkludert_i_leien: inkluderinger,
  },
  vilkar: {
    maned_leie:   `${vilkar.maned_leie.toLocaleString("nb-NO")} kr`,
    forfall:      `${vilkar.forfall_dag}. i måneden`,
    depositum:    `${vilkar.depositum.toLocaleString("nb-NO")} kr`,
    depositumkonto: vilkar.depositum_kontonr || "Oppgis separat",
    startdato:    new Date(vilkar.startdato).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" }),
    leie_type:    vilkar.leie_type === "lopende"
                    ? `Løpende (ingen sluttdato)`
                    : `Tidsbegrenset til ${vilkar.sluttdato ? new Date(vilkar.sluttdato).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" }) : "—"}`,
    oppsigelsestid_leietaker: vilkar.leie_type === "lopende" ? `${vilkar.oppsigelsestid_leietaker} måned(er)` : "N/A",
    oppsigelsestid_utleier:   vilkar.leie_type === "lopende" ? `${vilkar.oppsigelsestid_utleier} måneder` : "N/A",
  },
  tillegg: {
    kjaledyr:          kjaledyrLabel[tillegg.kjaledyr],
    royking_innendors: tillegg.royking_tillatt ? "tillatt" : "ikke tillatt",
    internett_betaler: tillegg.internett_betaler,
    tilleggsvilkar:    tillegg.tilleggsvilkar || null,
  },
}, null, 2)}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const generated_text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const { data: contract, error } = await supabase
    .from("contracts")
    .insert({
      user_id: user.id,
      form_data: form,
      generated_text,
      status: "generert",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: contract.id });
}
