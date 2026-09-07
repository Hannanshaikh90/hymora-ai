import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Hymora",
  description:
    "Read the Terms of Service governing your use of the Hymora platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#07050B]">
      <section className="mx-auto w-full max-w-5xl px-6 py-20">

        <span className="text-sm font-medium uppercase tracking-[0.18em] text-[#A78BFA]">
          Legal
        </span>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          Terms of Service
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#9F9FB5]">
          These Terms of Service govern your access to and use of Hymora. By
          creating an account or using our platform, you agree to these terms.
        </p>

           <div className="mt-14 space-y-10">

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Acceptance of These Terms
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            By creating an account, accessing, or using Hymora, you agree to
            comply with these Terms of Service. If you do not agree, you should
            not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            User Accounts
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            You are responsible for maintaining the security of your account and
            for all activities that occur under your account. You must provide
            accurate information and keep your login credentials secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Acceptable Use
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-[#9F9FB5]">
            <li>Use Hymora only for lawful purposes.</li>
            <li>Do not attempt to gain unauthorized access to the platform.</li>
            <li>Do not upload malicious software or harmful content.</li>
            <li>Do not abuse, disrupt, or interfere with the service.</li>
          </ul>
        </section>

              <section>
          <h2 className="text-2xl font-semibold text-white">
            Billing & Subscriptions
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            Paid subscriptions are billed through our payment provider, Stripe.
            Subscription fees are charged according to the selected plan and
            renew automatically unless cancelled before the renewal date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            AI-Generated Content
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            Hymora uses artificial intelligence to assist with conversations,
            knowledge retrieval, and workspace management. AI-generated
            responses may contain inaccuracies and should be reviewed before
            being relied upon for important decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Account Suspension & Termination
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            We reserve the right to suspend or terminate accounts that violate
            these Terms, abuse the platform, or engage in unlawful activities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Limitation of Liability
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            To the fullest extent permitted by law, Hymora shall not be liable
            for indirect, incidental, special, or consequential damages arising
            from the use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Contact
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            If you have questions about these Terms, please contact the Hymora
            team through the Contact page.
          </p>
        </section>

      </div>

      </section>
    </main>
  );
}