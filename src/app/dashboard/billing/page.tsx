"use client";

import {
  ArrowUpRight,
  Brain,
  Check,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  HardDrive,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type PlanTier = "free" | "pro" | "business";
type InvoiceStatus = "paid" | "pending" | "failed";

interface UsageStat {
  label: string;
  used: number;
  limit: number;
  unit: string;
  icon: React.ReactNode;
}

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: PlanTier;
  name: string;
  price: number;
  billing: string;
  description: string;
  features: PlanFeature[];
  featured?: boolean;
  badge?: string;
}

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: InvoiceStatus;
}

interface BillingResponse {
  success: boolean;

  subscription: {
    plan: string;
    status: string;
    renewsAt: number | null;
    stripePriceId: string | null;
  };

  invoices: {
    id: string;
    amount: number;
    status: string;
    date: string;
    invoiceUrl: string | null;
  }[];

  usage: {
    chatsUsed: number;
    chatsLimit: number | string;

    pdfsUsed: number;
    pdfsLimit: number | string;

    searchesUsed: number;
    searchesLimit: number | string;

    knowledgeFiles: number;
  };
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    billing: "forever",
    description: "Perfect for getting started with Hymora.",
    features: [
      {
        text: "20 AI messages / day",
        included: true,
      },
      {
        text: "3 PDF uploads",
        included: true,
      },
      {
        text: "5 AI searches",
        included: true,
      },
      {
        text: "1 Workspace",
        included: true,
      },
      {
        text: "AI Memory",
        included: true,
      },
      {
        text: "Priority support",
        included: false,
      },
      {
        text: "Team collaboration",
        included: false,
      },
    ],
  },

  {
    id: "pro",
    name: "Pro",
    price: 9,
    billing: "per month",
    description: "Unlimited AI workspace for serious builders.",
    featured: true,
    badge: "Most Popular",
    features: [
      {
        text: "Unlimited AI messages",
        included: true,
      },
      {
        text: "Unlimited PDF uploads",
        included: true,
      },
      {
        text: "Unlimited AI searches",
        included: true,
      },
      {
        text: "Unlimited Workspaces",
        included: true,
      },
      {
        text: "Persistent AI Memory",
        included: true,
      },
      {
        text: "Priority support",
        included: true,
      },
      {
        text: "Early access to new features",
        included: true,
      },
    ],
  },
];


// ─── Helper Components ───────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-purple-500">
        {children}
      </span>
      <div className="flex-1 h-px bg-purple-500/20" />
    </div>
  );
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config: Record<InvoiceStatus, { label: string; className: string }> = {
    paid: {
      label: "Paid",
      className:
        "bg-[#639922]/12 text-[#7dbf2e] border border-[#639922]/30",
    },
    pending: {
      label: "Pending",
      className:
        "bg-[#BA7517]/12 text-[#d48d2a] border border-[#BA7517]/30",
    },
    failed: {
      label: "Failed",
      className:
        "bg-[#E24B4A]/12 text-[#e86261] border border-[#E24B4A]/30",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${className}`}
    >
      {label}
    </span>
  );
}

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100);
  const isHigh = pct >= 80;
  const isMid = pct >= 60 && pct < 80;

  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: isHigh
            ? "#E24B4A"
            : isMid
              ? "#BA7517"
              : "#7C3AED",
        }}
      />
    </div>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────

function BillingHero({
  billing,
  onUpgrade,
}: {
  billing: BillingResponse | null;
  onUpgrade: () => void;
}) {
  const plan =
    billing?.subscription?.plan ??
    "free";

  const status =
    billing?.subscription?.status ??
    "inactive";

  const renewsAt =
    billing?.subscription?.renewsAt;

  const formattedRenewDate =
    renewsAt
      ? new Date(
        renewsAt * 1000
      ).toLocaleDateString()
      : "N/A";
  return (
    <div
      className="relative rounded-2xl border border-white/[0.07] p-6 overflow-hidden"
      style={{ background: "#0D0B14" }}
    >
      {/* Glow */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "#7C3AED",
          filter: "blur(90px)",
          opacity: 0.18,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, #7C3AED, #A78BFA, transparent)",
        }}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Plan icon */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(124,58,237,0.2)" }}>
            <Zap size={18} className="text-purple-400" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-purple-400">
                Active Plan
              </span>
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border"
                style={{
                  background: "rgba(124,58,237,0.12)",
                  borderColor: "rgba(91,33,182,0.5)",
                  color: "#A78BFA",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse"
                />
                {status}
              </span>
            </div>
            <h1 className="text-2xl font-medium text-[#E5E5F0] tracking-tight">
              {plan === "pro"
                ? "Hymora Pro"
                : "Hymora Free"}
            </h1>
            <p className="text-[13px] text-[#5A5A72] mt-1">
              Next renewal{" "}
              <span className="text-[#8B8BA3]">
                {formattedRenewDate}
              </span> ·{" "}
              <span className="text-[#8B8BA3]">
                {plan === "pro" ? "$9.00 / month" : "Free plan"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:flex-shrink-0">
          {plan === "pro" && (
  <button
    className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg border transition-colors"
    style={{
      background: "transparent",
      borderColor:
        "rgba(91,33,182,0.5)",
      color: "#A78BFA",
    }}
  >
    <RefreshCw size={13} />
    Manage Billing
  </button>
)}
          {plan === "pro" ? (
            <button
              disabled
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg border"
              style={{
                borderColor:
                  "rgba(124,58,237,0.3)",
                color: "#8B8BA3",
                background:
                  "rgba(124,58,237,0.08)",
                cursor: "default",
              }}
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={onUpgrade}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
              style={{
                background: "#7C3AED",
                color: "#fff",
              }}
            >
              <ArrowUpRight size={13} />
              Upgrade
            </button>
          )}
        </div>
      </div>

     {plan !== "pro" && (
  <div className="mt-6 rounded-2xl border border-[#7C3AED]/20 bg-[#12101B] p-5">

  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A78BFA]">
    Why upgrade to Pro?
  </p>

  <div className="mt-4 grid gap-3 sm:grid-cols-2">

    {[
      "Unlimited Workspaces",
      "Unlimited AI Chats",
      "Unlimited PDF Uploads",
      "Unlimited AI Searches",
    ].map((feature) => (
      <div
        key={feature}
        className="flex items-center gap-2"
      >
        <Check
          size={15}
          className="text-[#7C3AED]"
        />

        <span className="text-sm text-[#D7D7E5]">
          {feature}
        </span>
      </div>
    ))}

  </div>

</div>
)}
    </div>
  );
}


function UsageOverview({
  billing,
}: {
  billing: BillingResponse | null;
}) {
  const usageStats = [
    {
      label: "AI Messages",
      used:
        billing?.usage?.chatsUsed ?? 0,
      limit:
        billing?.usage?.chatsLimit ===
          "Unlimited"
          ? 999999
          : Number(
            billing?.usage
              ?.chatsLimit ?? 0
          ),
      displayLimit:
        billing?.usage?.chatsLimit,
      unit: "msgs",
      icon: (
        <MessageSquare size={14} />
      ),
    },

  {
  label: "Knowledge Files",
  used:
    billing?.usage
      ?.knowledgeFiles ?? 0,
  limit:
    billing?.usage?.pdfsLimit ===
    "Unlimited"
      ? 999999
      : Number(
          billing?.usage?.pdfsLimit ?? 0
        ),
  displayLimit:
    billing?.usage?.pdfsLimit,
  unit: "files",
  icon: (
    <FileText size={14} />
  ),
},

    {
      label: "Searches",
      used:
        billing?.usage
          ?.searchesUsed ?? 0,
      limit:
        billing?.usage
          ?.searchesLimit ===
          "Unlimited"
          ? 999999
          : Number(
            billing?.usage
              ?.searchesLimit ?? 0
          ),
      displayLimit:
        billing?.usage
          ?.searchesLimit,
      unit: "searches",
      icon: (
        <Brain size={14} />
      ),
    },

    {
      label: "PDF Uploads",
      used:
        billing?.usage?.pdfsUsed ??
        0,
      limit:
        billing?.usage?.pdfsLimit ===
          "Unlimited"
          ? 999999
          : Number(
            billing?.usage
              ?.pdfsLimit ?? 0
          ),
      displayLimit:
        billing?.usage?.pdfsLimit,
      unit: "pdfs",
      icon: (
        <HardDrive size={14} />
      ),
    },
  ];


  return (
    <div>
      <SectionLabel>Usage Overview</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {usageStats.map((stat) => {
          const pct = Math.min((stat.used / stat.limit) * 100, 100);
          const displayUsed =
            stat.unit === "GB"
              ? `${stat.used} GB`
              : stat.used.toLocaleString();
          const displayLimit =
            stat.displayLimit ??
            stat.limit.toLocaleString();

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] p-4"
              style={{ background: "#0D0B14" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{
                      background: "rgba(124,58,237,0.15)",
                      color: "#A78BFA",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <span className="text-[12px] text-[#8B8BA3]">
                    {stat.label}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#5A5A72]">
                  {Math.round(pct)}%
                </span>
              </div>

              <div className="mb-2">
                <span className="text-[20px] font-medium text-[#E5E5F0] tracking-tight">
                  {displayUsed}
                </span>
                <span className="text-[12px] text-[#5A5A72] ml-1">
                  / {displayLimit}
                </span>
              </div>

              <UsageBar used={stat.used} limit={stat.limit} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlanComparison({
  billing,
}: {
  billing: BillingResponse | null;
}) {
  const router = useRouter();

  const currentPlan =
    billing?.subscription?.plan ?? "free";

  const handleUpgrade = async () => {
    try {
      const response = await fetch(
        "/api/stripe/checkout",
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (data?.url) {
        window.location.assign(
          data.url
        );
      }
    } catch (error) {
      console.error(
        "CHECKOUT_ERROR",
        error
      );
    }
  };
  return (
    <div>
      <SectionLabel>Plans</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-xl border overflow-hidden"
            style={{
              background: plan.featured ? "#0D0B14" : "#0A0812",
              borderColor: plan.featured
                ? "rgba(124,58,237,0.4)"
                : "rgba(255,255,255,0.06)",
            }}
          >
            {/* Featured top accent */}
            {plan.featured && (
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, #7C3AED, #A78BFA, transparent)",
                }}
              />
            )}

            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#5A5A72]">
                    {plan.name}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-[26px] font-medium text-[#E5E5F0] tracking-tight">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-[12px] text-[#5A5A72]">
                        /{" "}
                        {plan.billing === "per month" ? "mo" : plan.billing}
                      </span>
                    )}
                  </div>
                </div>
                {currentPlan === plan.id && (
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full border"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      borderColor: "rgba(91,33,182,0.4)",
                      color: "#A78BFA",
                    }}
                  >
                    Current Plan
                  </span>
                )}
              </div>

              <p className="text-[12px] text-[#5A5A72] mb-4 leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {plan.features.map((feat) => (
                  <li
                    key={feat.text}
                    className="flex items-center gap-2.5 text-[12px]"
                  >
                    {feat.included ? (
                      <Check
                        size={13}
                        className="flex-shrink-0 text-purple-500"
                      />
                    ) : (
                      <span className="w-[13px] h-[13px] flex-shrink-0 flex items-center justify-center">
                        <span
                          className="w-3 h-px block"
                          style={{ background: "#2A2840" }}
                        />
                      </span>
                    )}
                    <span
                      style={{
                        color: feat.included ? "#8B8BA3" : "#3A3852",
                      }}
                    >
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {currentPlan === plan.id ? (
                <button
                  disabled
                  className="w-full text-[13px] font-medium py-2 rounded-lg border text-center"
                  style={{
                    borderColor: "rgba(124,58,237,0.3)",
                    color: "#5A5A72",
                    background: "transparent",
                    cursor: "default",
                  }}
                >
                  Current Plan
                </button>
              ) : plan.id === "free" ? (
                <button
                  disabled
                  className="w-full text-[13px] font-medium py-2 rounded-lg text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#3A3852",
                    cursor: "default",
                  }}
                >
                  Downgrade
                </button>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        "/api/stripe/checkout",
                        {
                          method: "POST",
                        }
                      );

                      const data =
                        await response.json();

                      if (data.url) {
                        window.location.assign(
                          data.url
                        );
                      }
                    } catch (error) {
                      console.error(
                        "CHECKOUT_ERROR",
                        error
                      );
                    }
                  }}
                  className="w-full text-[13px] font-medium py-2 rounded-lg text-center flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ background: "#7C3AED", color: "#fff" }}
                >
                  Upgrade to Pro
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentMethod({
  billing,
}: {
  billing: BillingResponse | null;
}) {
  const isPro =
    billing?.subscription?.plan === "pro";

  return (
    <div>
      <SectionLabel>Payment Method</SectionLabel>

      <div
        className="rounded-xl border border-white/[0.06] p-5"
        style={{ background: "#0D0B14" }}
      >
        {isPro ? (
          <>
            <div className="flex items-center gap-3">
              <CreditCard
                size={18}
                className="text-[#A78BFA]"
              />

              <div>
                <p className="text-sm text-white">
                  Payment method managed securely by Stripe
                </p>

                <p className="mt-1 text-xs text-[#8B8BA3]">
                  Update your card details anytime from the Billing Portal.
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#8B8BA3]">
            No payment method is associated with your Free plan.
          </p>
        )}
      </div>
    </div>
  );
}


function InvoiceHistory({
  invoices,
}: {
  invoices: BillingResponse["invoices"];
}) {
  return (
    <div>
      <SectionLabel>Invoice History</SectionLabel>

      <div
        className="overflow-hidden rounded-xl border border-white/[0.06]"
        style={{ background: "#0D0B14" }}
      >
        {/* Empty State */}
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <p className="text-sm font-medium text-[#E5E5F0]">
              No invoices yet
            </p>

            <p className="mt-2 max-w-sm text-xs leading-6 text-[#6B6B85]">
              Your billing invoices will appear here once you upgrade to a paid
              plan.
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div
              className="grid grid-cols-12 gap-4 border-b px-5 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#5A5A72]"
              style={{
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <span className="col-span-2">Date</span>

              <span className="col-span-5">
                Description
              </span>

              <span className="col-span-2 hidden sm:block">
                Invoice
              </span>

              <span className="col-span-2">
                Amount
              </span>

              <span className="col-span-1 text-right">
                Status
              </span>
            </div>

            {/* Rows */}
            {invoices.map((inv, index) => (
              <div
                key={inv.id}
                className="group grid grid-cols-12 items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                style={{
                  borderBottom:
                    index < invoices.length - 1
                      ? "0.5px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <span className="col-span-2 text-[12px] text-[#5A5A72]">
                  {inv.date}
                </span>

                <span className="col-span-5 text-[13px] text-[#8B8BA3]">
                  Subscription
                </span>

                <span className="col-span-2 hidden text-[12px] font-mono text-[#5A5A72] sm:block">
                  {inv.id}
                </span>

                <span className="col-span-2 text-[13px] font-medium text-[#E5E5F0]">
                  ${Number(inv.amount).toFixed(2)}
                </span>

                <div className="col-span-1 flex items-center justify-end gap-2">
                  <StatusBadge
                    status={
                      inv.status === "paid"
                        ? "paid"
                        : inv.status === "open"
                          ? "pending"
                          : inv.status === "draft"
                            ? "pending"
                            : inv.status === "void"
                              ? "failed"
                              : inv.status === "uncollectible"
                                ? "failed"
                                : "failed"
                    }
                  />

                  {inv.invoiceUrl && (
                    <a
                      href={inv.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="opacity-0 transition-opacity group-hover:opacity-100 text-[#5A5A72] hover:text-[#A78BFA]"
                    >
                      <Download size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [billing, setBilling] =
    useState<BillingResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const handleUpgrade = async () => {
    try {
      console.log(
        "STARTING_CHECKOUT"
      );

      const response =
        await fetch(
          "/api/stripe/checkout",
          {
            method: "POST",
          }
        );

      console.log(
        "RESPONSE_STATUS",
        response.status
      );

      const data =
        await response.json();

      console.log(
        "CHECKOUT_DATA",
        data
      );

      if (data.url) {
        window.location.assign(
          data.url
        );
      }
    } catch (error) {
      console.error(
        "CHECKOUT_ERROR",
        error
      );
    }
  };

  useEffect(() => {
    const loadBilling =
      async () => {
        try {
          const response =
            await fetch(
              "/api/billing"
            );

          const data =
            await response.json();

          setBilling(data);
        } catch (error) {
          console.error(
            "BILLING_LOAD_ERROR",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    loadBilling();
  }, []);
  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading your billing information...
      </div>
    );
  }



  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#05030A" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Page header */}
        <div>
          <h1 className="text-[22px] font-medium text-[#E5E5F0] tracking-tight">
            Billing
          </h1>
          <p className="text-[13px] text-[#5A5A72] mt-1">
            Manage your subscription, usage, invoices and payment details.
          </p>
        </div>

        {/* 1. Hero */}
        <BillingHero
          billing={billing}
          onUpgrade={handleUpgrade}
        />

        {/* 2. Usage */}
        <UsageOverview billing={billing} />

        {/* 3 + 4. Plans */}
        <PlanComparison billing={billing} />

        {/* 5. Payment */}
        <PaymentMethod billing={billing} />

        {/* 6. Invoices */}
        <InvoiceHistory
          invoices={billing?.invoices ?? []}
        />

        {/* Usage Analytics will be enabled when real historical analytics are available. */}

        {/* Footer */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t text-[12px] text-[#5A5A72]"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <span>Need help? Contact support@hymora.ai</span>
          <div className="flex items-center gap-4">
          <span className="text-[#5A5A72]">
  Terms
</span>

<span className="text-[#5A5A72]">
  Privacy
</span>

<span className="text-[#5A5A72]">
  Cookies
</span>
          </div>
        </div>
      </div>
    </div>
  );
}