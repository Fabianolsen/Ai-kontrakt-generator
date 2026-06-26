import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const stripe = getStripe();

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const PLAN_BY_PRICE: Record<string, string> = {
  [process.env.STRIPE_PRICE_BASIS ?? ""]: "basis",
  [process.env.STRIPE_PRICE_PRO   ?? ""]: "pro",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Ugyldig webhook-signatur" }, { status: 400 });
  }

  const supabase = getAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId  = session.metadata?.user_id;
      const plan    = session.metadata?.plan;
      if (userId && plan) {
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          plan,
          stripe_customer_id:     session.customer as string,
          stripe_subscription_id: session.subscription as string,
        });
      }
      break;
    }

    case "invoice.paid": {
      const invoice   = event.data.object as Stripe.Invoice;
      // In the Dahlia API the subscription field lives on the parent object
      // The Dahlia API moved subscription id into invoice.parent
      const parent = invoice.parent as unknown as Record<string, unknown> | null;
      const subId: string | null =
        (parent?.subscription as string | null) ??
        ((invoice as unknown as Record<string, unknown>).subscription as string | null);

      if (subId) {
        const sub     = await stripe.subscriptions.retrieve(subId);
        const priceId = sub.items.data[0]?.price.id;
        const plan    = PLAN_BY_PRICE[priceId] ?? "basis";
        const userId  = sub.metadata?.user_id;
        if (userId) {
          // current_period_end lives on billing_cycle_anchor_config in newer APIs;
          // fall back to reading it from items
          const periodEnd: number | undefined =
            (sub as unknown as Record<string, unknown>).current_period_end as number | undefined;
          await supabase.from("subscriptions").upsert({
            user_id: userId,
            plan,
            stripe_subscription_id: sub.id,
            valid_until: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub    = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id;
      if (userId) {
        await supabase
          .from("subscriptions")
          .update({ plan: "gratis", stripe_subscription_id: null, valid_until: null })
          .eq("user_id", userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
