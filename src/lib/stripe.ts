import Stripe from "stripe";

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-06-24.dahlia",
  });
}

export const PRICE_IDS = {
  basis: process.env.STRIPE_PRICE_BASIS ?? "",
  pro:   process.env.STRIPE_PRICE_PRO   ?? "",
} as const;

export type PaidPlan = keyof typeof PRICE_IDS;
