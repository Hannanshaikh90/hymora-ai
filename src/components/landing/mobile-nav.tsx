"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#E5E5F0] transition hover:bg-white/10 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          open
            ? "pointer-events-auto bg-black/60 opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 flex h-full w-[290px] flex-col border-l border-white/10 bg-[#05030A] transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/icon.png"
                alt="Hymora"
                width={36}
                height={36}
                priority
                className="h-9 w-9 rounded-xl"
              />

              <span className="font-semibold text-white">
                Hymora
              </span>
            </div>

            <button
              onClick={closeMenu}
              className="rounded-lg p-2 text-[#8B8BA3] transition hover:bg-white/5 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col px-5 py-6">
            <a
              href="#why-hymora"
              onClick={closeMenu}
              className="py-3 text-[#8B8BA3] transition hover:text-white"
            >
              Why Hymora
            </a>

            <a
              href="#features"
              onClick={closeMenu}
              className="py-3 text-[#8B8BA3] transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#pricing"
              onClick={closeMenu}
              className="py-3 text-[#8B8BA3] transition hover:text-white"
            >
              Pricing
            </a>

            <div className="mt-auto space-y-3 pt-8">
              <Link
                href="/sign-in"
                onClick={closeMenu}
                className="block rounded-xl border border-white/10 py-3 text-center text-white transition hover:bg-white/5"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={closeMenu}
                className="block rounded-xl bg-[#7C3AED] py-3 text-center font-medium text-white transition hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}