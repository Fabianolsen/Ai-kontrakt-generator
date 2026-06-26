// ── Form data shape (matches JSON sent to Claude API) ────────────────────────

export type BoligType   = "leilighet" | "hybel" | "enebolig" | "rekkehus";
export type LeieType    = "lopende"   | "tidsbegrenset";
export type KjæledyrType = "ja"       | "nei"   | "etter_avtale";
export type Plan        = "gratis"    | "basis"  | "pro";

export interface Utleier {
  navn: string;
  adresse: string;
  epost: string;
  telefon: string;
  er_firma: boolean;
  orgnr?: string;
}

export interface Leietaker {
  navn: string;
  adresse: string;
  epost: string;
  telefon: string;
}

export interface Bolig {
  adresse: string;
  type: BoligType;
  antall_rom: number;
  mobler: boolean;
  inkl_strom: boolean;
  inkl_internett: boolean;
  inkl_parkering: boolean;
}

export interface Vilkar {
  maned_leie: number;
  forfall_dag: number;
  depositum: number;
  depositum_kontonr: string;
  startdato: string;
  leie_type: LeieType;
  sluttdato?: string;
  oppsigelsestid_leietaker: number;
  oppsigelsestid_utleier: number;
}

export interface Tillegg {
  kjaledyr: KjæledyrType;
  royking_tillatt: boolean;
  internett_betaler: string;
  tilleggsvilkar?: string;
}

/** Nested form_data stored in the `contracts.form_data` jsonb column */
export interface FormData {
  utleier:  Utleier;
  leietaker: Leietaker;
  bolig:    Bolig;
  vilkar:   Vilkar;
  tillegg:  Tillegg;
}

// ── Database row types ────────────────────────────────────────────────────────

export interface Contract {
  id: string;
  user_id: string;
  status: "utkast" | "generert" | "signert";
  form_data: FormData;
  generated_text: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  user_id: string;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  valid_until: string | null;
}
