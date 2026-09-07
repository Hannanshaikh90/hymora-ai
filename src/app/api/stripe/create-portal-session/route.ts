import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const { userId } = await auth();

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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: subscription,
      error,
    } = await supabase
      .from("subscriptions")
      .select(`
        stripe_customer_id,
        stripe_status
      `)
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "SUBSCRIPTION_LOOKUP_ERROR",
        error
      );

      return NextResponse.json(
        {
          error: "Subscription not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!subscription) {
      return NextResponse.json(
        {
          error: "Subscription not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      subscription.stripe_status !==
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "No active subscription found",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !subscription.stripe_customer_id
    ) {
      return NextResponse.json(
        {
          error:
            "Stripe customer not found",
        },
        {
          status: 404,
        }
      );
    }

    const portalSession =
      await stripe.billingPortal.sessions.create({
        customer:
          subscription.stripe_customer_id,

        return_url:
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error(
      "BILLING_PORTAL_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create billing portal",
      },
      {
        status: 500,
      }
    );
  }
}