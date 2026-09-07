import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Hymora",
  description:
    "Learn how Hymora uses cookies and similar technologies to provide a secure and reliable experience.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#07050B]">
      <section className="mx-auto w-full max-w-5xl px-6 py-20">

        <span className="text-sm font-medium uppercase tracking-[0.18em] text-[#A78BFA]">
          Legal
        </span>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          Cookie Policy
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#9F9FB5]">
          This Cookie Policy explains how Hymora uses cookies and similar
          technologies to keep your account secure, remember your preferences,
          and improve your experience.
        </p>

            <div className="mt-14 space-y-10">

        <section>
          <h2 className="text-2xl font-semibold text-white">
            What Are Cookies?
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            Cookies are small text files stored on your device that help
            websites remember information about your visit. They improve
            security, maintain your session, and provide a better browsing
            experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            How Hymora Uses Cookies
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            Hymora uses cookies only where necessary to authenticate users,
            maintain secure sessions, remember basic preferences, and provide
            access to your workspace.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Essential Cookies
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-[#9F9FB5]">
            <li>Authentication and secure sign-in.</li>
            <li>Session management.</li>
            <li>Workspace access.</li>
            <li>Basic application preferences.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            Managing Cookies
          </h2>

          <p className="mt-4 leading-8 text-[#9F9FB5]">
            Most browsers allow you to control or delete cookies through their
            settings. Disabling essential cookies may prevent certain parts of
            Hymora from functioning correctly.
          </p>
        </section>

      </div>

      </section>
    </main>
  );
}