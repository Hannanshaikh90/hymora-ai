import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full rounded-3xl border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-xl p-10 text-center">
        <div className="mb-6 text-6xl">
          🎉
        </div>

        <h1 className="text-5xl font-bold mb-4">
          Payment Successful
        </h1>

        <p className="text-zinc-300 text-lg mb-8">
          Welcome to Nexus AI Pro.
          Your subscription has been activated successfully.
        </p>

        <div className="space-y-4 text-left bg-black/30 rounded-2xl p-6 mb-8">
          <div>✅ Unlimited Chats</div>
          <div>✅ GPT-4 Level Models</div>
          <div>✅ Faster Responses</div>
          <div>✅ AI Tools Access</div>
          <div>✅ Priority Features</div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 font-semibold text-black"
        >
          Go To Nexus AI
        </Link>
      </div>
    </main>
  );
}