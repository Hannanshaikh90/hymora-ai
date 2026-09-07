"use client";

import { useState } from "react";

interface PricingClientProps {
  proUser: boolean;
}

export default function PricingClient({
  proUser,
}: PricingClientProps) {
  const [loading, setLoading] =
    useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/stripe/checkout",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(
        "CHECKOUT_ERROR",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <h1 className="text-5xl font-bold text-center mb-4">
          Nexus AI Pricing
        </h1>

        <p className="text-zinc-400 text-center mb-12">
          Upgrade to unlock premium AI features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col">
            <h2 className="text-2xl font-semibold mb-2">
              Free
            </h2>

            <p className="text-zinc-400 mb-6">
              Basic AI access for casual usage.
            </p>

            <div className="text-4xl font-bold mb-6">
              $0
            </div>

            <ul className="space-y-3 text-zinc-300 mb-8 flex-1">
              <li>✓ Limited Chats</li>
              <li>✓ Basic AI Model</li>
              <li>✓ Community Access</li>
            </ul>

            <button className="w-full rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition p-4 font-medium">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-xl p-8 flex flex-col">
            <h2 className="text-2xl font-semibold mb-2">
              Pro
            </h2>

            <p className="text-zinc-300 mb-6">
              Advanced AI tools for power users.
            </p>

            <div className="text-4xl font-bold mb-6">
              $20
              <span className="text-lg text-zinc-400">
                /month
              </span>
            </div>

            <ul className="space-y-3 text-zinc-200 mb-8 flex-1">
              <li>✓ Unlimited Chats</li>
              <li>✓ GPT-4 Level Models</li>
              <li>✓ Faster Responses</li>
              <li>✓ AI Tools Access</li>
              <li>✓ Priority Features</li>
            </ul>

            {proUser ? (
              <button className="w-full rounded-2xl bg-emerald-500 text-black p-4 font-semibold">
                ✅ You Are Pro
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 transition p-4 font-semibold text-black flex items-center justify-center gap-2"
              >
                <span>👑</span>

                <span>
                  {loading
                    ? "Redirecting..."
                    : "Upgrade to Pro"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}