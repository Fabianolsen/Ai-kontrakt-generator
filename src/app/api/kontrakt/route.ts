import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { KontraktData } from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Du er en norsk juridisk ekspert spesialisert på husleierett. Din oppgave er å generere profesjonelle, juridisk korrekte leiekontrakter basert på norsk husleielov av 1999.

VIKTIGE REGLER:
- Kontrakten skal alltid overholde husleieloven av 1999 (lov om husleieavtaler)
- Depositumet kan ikke overstige 6 månedlige leiebetalinger (§ 3-5)
- For løpende leieforhold: minimum 1 måneds oppsigelsestid for leietaker, 3 måneder for utleier (§ 9-6)
- For tidsbegrensede leieforhold under 3 år: leietaker har oppsigelsesvern (§ 9-2)
- Leien kan ikke kreves betalt mer enn 1 måned i forveien (§ 3-2)
- Depositum skal stå på særskilt konto i leietakers navn (§ 3-5)

FORMAT:
- Skriv kontrakten på norsk bokmål
- Bruk profesjonelt, juridisk språk
- Inkluder alle relevante paragrafer
- Strukturer med tydelige overskrifter og paragrafer
- Inkluder signaturfelt for begge parter på slutten
- IKKE inkluder noe utenom selve kontraktteksten

STRUKTUR:
1. Overskrift: LEIEKONTRAKT
2. Parter (§ 1)
3. Leieobjektet (§ 2)
4. Leietid (§ 3)
5. Leie og betaling (§ 4)
6. Depositum (§ 5)
7. Leietakers bruk av leieobjektet (§ 6)
8. Vedlikehold (§ 7)
9. Oppsigelse (§ 8)
10. Tilleggsvilkår (§ 9) — kun hvis angitt
11. Underskrifter`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const data: KontraktData = await req.json();

  const boligTypeMap = {
    leilighet: "leilighet",
    hybel: "hybel",
    enebolig: "enebolig",
    rekkehus: "rekkehus",
  };

  const kjaledyrMap = {
    ja: "tillatt",
    nei: "ikke tillatt",
    etter_avtale: "etter særskilt avtale",
  };

  const inkluderinger = [
    data.inkluderer_strom && "strøm",
    data.inkluderer_internett && "internett",
    data.inkluderer_parkering && "parkering",
  ].filter(Boolean);

  const userPrompt = `Generer en leiekontrakt med følgende informasjon:

UTLEIER:
- Navn: ${data.utleier_navn}
- Adresse: ${data.utleier_adresse}
- E-post: ${data.utleier_epost}
- Telefon: ${data.utleier_telefon}
${data.utleier_er_firma ? `- Firma med organisasjonsnummer: ${data.utleier_orgnr}` : "- Privatperson"}

LEIETAKER:
- Navn: ${data.leietaker_navn}
- Adresse: ${data.leietaker_adresse}
- E-post: ${data.leietaker_epost}
- Telefon: ${data.leietaker_telefon}

LEIEOBJEKT:
- Adresse: ${data.bolig_adresse}
- Type: ${boligTypeMap[data.bolig_type]}
- Antall rom: ${data.bolig_antall_rom}
- Møblert: ${data.bolig_mobler ? "ja" : "nei"}
${inkluderinger.length > 0 ? `- Inkludert i leien: ${inkluderinger.join(", ")}` : "- Ingen ekstra inkluderinger i leien"}

LEIEVILKÅR:
- Månedlig leie: ${data.maned_leie.toLocaleString("nb-NO")} kr
- Forfallsdato: ${data.forfall_dag}. i måneden
- Depositum: ${data.depositum.toLocaleString("nb-NO")} kr
- Depositumkonto: ${data.depositum_kontonr || "Oppgis separat"}
- Startdato: ${new Date(data.startdato).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}
- Leieforhold: ${data.leie_type === "lopende" ? `Løpende, uten sluttdato` : `Tidsbegrenset til ${new Date(data.sluttdato!).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}`}
${data.leie_type === "lopende" ? `- Oppsigelsestid leietaker: ${data.oppsigelsestid_leietaker} måned(er)\n- Oppsigelsestid utleier: ${data.oppsigelsestid_utleier} måneder` : ""}

TILLEGGSVILKÅR:
- Kjæledyr: ${kjaledyrMap[data.kjaledyr]}
- Røyking innendørs: ${data.royking_tillatt ? "tillatt" : "ikke tillatt"}
- Internettbetaler: ${data.internett_betaler}
${data.tilleggsvilkar ? `- Særskilte vilkår: ${data.tilleggsvilkar}` : ""}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: userPrompt }],
    system: SYSTEM_PROMPT,
  });

  const innhold = message.content[0].type === "text" ? message.content[0].text : "";

  const { data: kontrakt, error } = await supabase
    .from("kontrakter")
    .insert({
      user_id: user.id,
      data,
      innhold,
      status: "generert",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: kontrakt.id });
}
