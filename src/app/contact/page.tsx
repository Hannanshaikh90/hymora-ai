import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Hymora",
  description:
    "Get in touch with the Hymora team for support, billing, partnerships, or general questions.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#07050B]">
      <section className="mx-auto flex w-full max-w-5xl flex-col px-6 py-20">

        <span className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#A78BFA]">
          Contact
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          Get in Touch
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-[#9F9FB5]">
          Whether you have a question about Hymora, billing, partnerships,
          feedback, or need technical support, we're here to help.
        </p>

            <div className="mt-14 grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl border border-white/[0.06] bg-[#0D0B14] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A78BFA]">
            Support
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            Need Help?
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#9F9FB5]">
            For technical issues, account questions, or product guidance,
            our team is here to help.
          </p>

          <p className="mt-6 text-sm text-white">
            support@hymora.ai
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0D0B14] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A78BFA]">
            Billing
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            Subscription Questions
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#9F9FB5]">
            Need help with invoices, payments, upgrades, or your subscription?
            Contact our billing team.
          </p>

          <p className="mt-6 text-sm text-white">
            billing@hymora.ai
          </p>
        </div>

            </div>

      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-[#0D0B14] p-8">

        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A78BFA]">
          Contact Form
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Send us a message
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#9F9FB5]">
          We'd love to hear from you. Whether you have feedback, a feature
          request, or need help, send us a message and we'll get back to you
          as soon as possible.
        </p>

        <form className="mt-8 space-y-5">

          <div className="grid gap-5 md:grid-cols-2">

            <input
              type="text"
              placeholder="Your Name"
              className="rounded-xl border border-white/[0.08] bg-[#09080E] px-4 py-3 text-white outline-none transition focus:border-[#7C3AED]"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="rounded-xl border border-white/[0.08] bg-[#09080E] px-4 py-3 text-white outline-none transition focus:border-[#7C3AED]"
            />

          </div>

          <input
            type="text"
            placeholder="Subject"
            className="w-full rounded-xl border border-white/[0.08] bg-[#09080E] px-4 py-3 text-white outline-none transition focus:border-[#7C3AED]"
          />

          <textarea
            rows={6}
            placeholder="Tell us how we can help..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#09080E] px-4 py-3 text-white outline-none transition focus:border-[#7C3AED]"
          />

          <button
            type="button"
            className="rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8B5CF6]"
          >
            Send Message
          </button>

        </form>

            </div>

      <div className="mt-10 grid gap-6 md:grid-cols-4">

        <div className="rounded-xl border border-white/[0.06] bg-[#0D0B14] p-5">
          <p className="text-xs uppercase tracking-[0.1em] text-[#A78BFA]">
            Response
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            Within 24 Hours
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0D0B14] p-5">
          <p className="text-xs uppercase tracking-[0.1em] text-[#A78BFA]">
            Availability
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            Monday – Friday
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0D0B14] p-5">
          <p className="text-xs uppercase tracking-[0.1em] text-[#A78BFA]">
            Location
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            Pakistan
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0D0B14] p-5">
          <p className="text-xs uppercase tracking-[0.1em] text-[#A78BFA]">
            Status
          </p>
          <p className="mt-3 text-lg font-semibold text-[#22C55E]">
            Online
          </p>
        </div>

      </div>

      </section>
    </main>
  );
}