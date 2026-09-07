import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get(
    "stripe-signature"
  ) as string;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

    console.log(
      "✅ WEBHOOK RECEIVED:",
      event.type
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.log(
          "CHECKOUT_SESSION",
          session.id
        );

        const customerId =
          session.customer as string;

        const subscriptionId =
          session.subscription as string;

        const subscription =
          await stripe.subscriptions.retrieve(
            subscriptionId
          );

        const result =
          await supabase
            .from("subscriptions")
            .upsert({
              clerk_user_id:
                session.client_reference_id!,

              stripe_customer_id:
                customerId,

              stripe_subscription_id:
                subscription.id,

              stripe_price_id:
                subscription.items.data[0]
                  .price.id,

              stripe_current_period_end:
                subscription.items.data[0]
                  .current_period_end,

              stripe_status:
                subscription.status,
            });

        console.log(
          "SUBSCRIPTION_INSERT_RESULT",
          result
        );

        console.log(
          "✅ Subscription saved"
        );

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const result =
          await supabase
            .from("subscriptions")
            .update({
              stripe_price_id:
                subscription.items.data[0]
                  .price.id,

              stripe_current_period_end:
                subscription.items.data[0]
                  .current_period_end,

              stripe_status:
                subscription.status,
            })
            .eq(
              "stripe_subscription_id",
              subscription.id
            );

        console.log(
          "SUBSCRIPTION_UPDATE_RESULT",
          result
        );

        console.log(
          "✅ Subscription updated"
        );

        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const result =
          await supabase
            .from("subscriptions")
            .update({
              stripe_status:
                "canceled",
            })
            .eq(
              "stripe_subscription_id",
              subscription.id
            );

        console.log(
          "SUBSCRIPTION_DELETE_RESULT",
          result
        );

        console.log(
          "❌ Subscription cancelled"
        );

        break;
      }

      default:
        console.log(
          "Unhandled event:",
          event.type
        );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "❌ WEBHOOK ERROR:",
      error
    );

    return new NextResponse(
      "Webhook Error",
      {
        status: 400,
      }
    );
  }
}