import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Hymora",
  description:
    "Learn about Hymora's refund policy for subscriptions and billing.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#07050B]">
      <section className="mx-auto w-full max-w-5xl px-6 py-20">

        <span className="text-sm font-medium uppercase tracking-[0.18em] text-[#A78BFA]">
          Legal
        </span>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          Refund Policy
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#9F9FB5]">
          This Refund Policy explains when refunds may be available for Hymora
          subscriptions and how billing issues are handled.
        </p>

      </section>
    </main>
  );
}