import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  FREE_LIMITS,
  PRO_LIMITS,
} from "@/config/usage";

import { stripe } from "@/lib/stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * Subscription
     */

    const {
      data: subscription,
    } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    const isPro =
      subscription?.stripe_status ===
      "active";

    /**
     * Usage
     */

    const {
      data: usage,
    } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    /**
     * Knowledge Files
     */

    const { data: userProjects } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", userId);

    const projectIds =
      userProjects?.map((project) => project.id) ?? [];

    let knowledgeFiles = 0;

    if (projectIds.length > 0) {
      const { count } = await supabase
        .from("project_files")
        .select("*", {
          count: "exact",
          head: true,
        })
        .in("project_id", projectIds);

      knowledgeFiles = count ?? 0;
    }

    let invoices: {
      id: string;
      amount: number;
      status: string;
      date: string;
      invoiceUrl: string | null;
    }[] = [];

    if (subscription?.stripe_customer_id) {
      try {
        const stripeInvoices =
          await stripe.invoices.list({
            customer:
              subscription.stripe_customer_id,
            limit: 20,
          });

        invoices =
          stripeInvoices.data.map(
            (invoice) => ({
              id: invoice.number ?? invoice.id,

              amount:
                invoice.amount_paid / 100,

              status:
                String(invoice.status ?? "open"),

              date: new Date(
                invoice.created * 1000
              ).toLocaleDateString(),

              invoiceUrl:
                invoice.hosted_invoice_url ?? null,
            })
          );
      } catch (error) {
        console.error(
          "STRIPE_INVOICE_ERROR",
          error
        );
      }
    }

    const limits = isPro
      ? PRO_LIMITS
      : FREE_LIMITS;

    return NextResponse.json({
      success: true,

      subscription: {
        plan: isPro
          ? "pro"
          : "free",

        status:
          subscription?.stripe_status ??
          "inactive",

        renewsAt:
          subscription?.stripe_current_period_end ??
          null,

        stripePriceId:
          subscription?.stripe_price_id ??
          null,
      },

      invoices,

    usage: {
        chatsUsed:
          usage?.chat_count ?? 0,

        chatsLimit: isPro
          ? "Unlimited"
          : limits.chats,

        pdfsUsed:
          usage?.pdf_count ?? 0,

        pdfsLimit: isPro
          ? "Unlimited"
          : limits.pdfs,

        searchesUsed:
          usage?.search_count ?? 0,

        searchesLimit: isPro
          ? "Unlimited"
          : limits.searches,

        knowledgeFiles:
          knowledgeFiles ?? 0,
      },
    });
  } catch (error) {
    console.error(
      "BILLING_API_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load billing data",
      },
      {
        status: 500,
      }
    );
  }
}