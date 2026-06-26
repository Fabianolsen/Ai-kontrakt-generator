export type BoligType = "leilighet" | "hybel" | "enebolig" | "rekkehus";
export type LeieType = "lopende" | "tidsbegrenset";
export type KjæledyrType = "ja" | "nei" | "etter_avtale";

export interface KontraktData {
  // Steg 1: Utleier
  utleier_navn: string;
  utleier_adresse: string;
  utleier_epost: string;
  utleier_telefon: string;
  utleier_er_firma: boolean;
  utleier_orgnr?: string;

  // Steg 2: Leietaker
  leietaker_navn: string;
  leietaker_adresse: string;
  leietaker_epost: string;
  leietaker_telefon: string;

  // Steg 3: Boligen
  bolig_adresse: string;
  bolig_type: BoligType;
  bolig_antall_rom: number;
  bolig_mobler: boolean;
  inkluderer_strom: boolean;
  inkluderer_internett: boolean;
  inkluderer_parkering: boolean;

  // Steg 4: Leievilkår
  maned_leie: number;
  forfall_dag: number;
  depositum: number;
  depositum_kontonr: string;
  startdato: string;
  leie_type: LeieType;
  sluttdato?: string;
  oppsigelsestid_leietaker: number;
  oppsigelsestid_utleier: number;

  // Steg 5: Tilleggsvilkår
  kjaledyr: KjæledyrType;
  royking_tillatt: boolean;
  internett_betaler: string;
  tilleggsvilkar?: string;
}

export interface Kontrakt {
  id: string;
  user_id: string;
  data: KontraktData;
  innhold: string;
  status: "utkast" | "generert" | "signert";
  created_at: string;
  updated_at: string;
}
