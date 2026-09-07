import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const { userId } = await auth();

    /**
     * Auth Check
     */

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * Existing Subscription Check
     */

    const {
      data: subscription,
    } = await supabase
      .from("subscriptions")
      .select("stripe_status")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (
      subscription?.stripe_status ===
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "You already have an active subscription",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Create Checkout Session
     */

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        client_reference_id:
          userId,

        metadata: {
          clerkUserId: userId,
        },

        line_items: [
          {
            price:
              process.env
                .STRIPE_PRICE_PRO_MONTHLY!,
            quantity: 1,
          },
        ],

        success_url:
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,

        cancel_url:
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "STRIPE_CHECKOUT_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create checkout session",
      },
      {
        status: 500,
      }
    );
  }
}