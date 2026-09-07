import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Hymora",
  description:
    "Learn how Hymora collects, uses, stores, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07050B]">
      <section className="mx-auto w-full max-w-5xl px-6 py-20">

        <span className="text-sm font-medium uppercase tracking-[0.18em] text-[#A78BFA]">
          Legal
        </span>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          Privacy Policy
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#9F9FB5]">
          Your privacy matters to us. This Privacy Policy explains how Hymora
          collects, uses, stores, and protects your information while you use
          our AI workspace.
        </p>

            <div className="mt-14 space-y-10">

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Information We Collect
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            When you create an account or use Hymora, we may collect your
            account information, workspace data, uploaded files, knowledge,
            AI conversations, and usage information required to provide and
            improve the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            How We Use Your Information
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            We use your information to authenticate your account, provide AI
            responses, store your workspaces, process payments, improve
            product performance, and maintain the security of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Third-Party Services
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-[#9F9FB5]">
            <li>Clerk for authentication.</li>
            <li>Supabase for database and file storage.</li>
            <li>Stripe for subscription payments.</li>
          </ul>
        </section>

              <section>
          <h2 className="text-2xl font-semibold text-white">
            Data Security
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            We use industry-standard security practices to protect your account,
            uploaded content, and workspace data. While no online service can
            guarantee absolute security, we continuously work to safeguard your
            information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Data Retention
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            Your information is retained while your account remains active or as
            required to provide the Hymora service. You may request deletion of
            your account and associated data in accordance with applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Your Rights
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            Depending on your location, you may have the right to access,
            correct, update, export, or request deletion of your personal
            information. Contact us if you wish to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Changes to This Policy
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            We may update this Privacy Policy from time to time. When material
            changes are made, the updated version will be published on this
            page with a revised effective date.
          </p>
        </section>

      </div>

      </section>
    </main>
  );
}