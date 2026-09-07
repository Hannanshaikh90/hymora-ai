"use client";

import { useEffect, useState } from "react";
import {
  Crown,
  CheckCircle2,
  X,
} from "lucide-react";

type UpgradeType =
  | "workspace"
  | "pdf"
  | "chat"
  | "search";

export function UpgradeModal() {
  const [open, setOpen] =
    useState(false);

  const [type, setType] =
    useState<UpgradeType>(
      "workspace"
    );

  useEffect(() => {
    function handleOpen(
      event: Event
    ) {
      const customEvent =
        event as CustomEvent<{
          type: UpgradeType;
        }>;

      console.log(
        "UPGRADE TYPE:",
        customEvent.detail?.type
      );

      console.log(
        "UPGRADE MODAL TYPE:",
        customEvent.detail?.type
      );

      setType(
        customEvent.detail?.type ??
        "workspace"
      );

      setOpen(true);
    }

    window.addEventListener(
      "open-upgrade-modal",
      handleOpen
    );

    return () => {
      window.removeEventListener(
        "open-upgrade-modal",
        handleOpen
      );
    };
  }, []);

  useEffect(() => {
    function onKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, []);

  if (!open) return null;

  return (
    <div
      onClick={() =>
        setOpen(false)
      }
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-5"
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#7C3AED]/30 bg-[#0B0911] shadow-[0_0_60px_rgba(124,58,237,.25)]"
      >
        <button
          onClick={() =>
            setOpen(false)
          }
          className="absolute right-5 top-5 rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-white/10 p-8">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7C3AED]/15">
            <Crown className="h-8 w-8 text-[#A78BFA]" />
          </div>

          <h2 className="mt-5 text-center text-3xl font-bold text-white">
            Unlock Hymora Pro
          </h2>

          <p className="mt-3 text-center text-sm leading-7 text-[#A1A1B5]">
            You've reached your{" "}
            <span className="font-semibold text-white">
              {type}
            </span>{" "}
            limit.
            Upgrade to continue without restrictions.
          </p>
        </div>

        <div className="space-y-4 p-8">

          {[
            "Unlimited Workspaces",
            "Unlimited AI Chats",
            "Unlimited PDF Uploads",
            "Unlimited AI Searches",
            "Full AI Memory",
            "Priority Updates",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5 text-green-400" />

              <span className="text-sm text-white">
                {item}
              </span>
            </div>
          ))}

          <div className="mt-8 rounded-2xl border border-[#7C3AED]/20 bg-[#12101B] p-5 text-center">

            <p className="text-sm text-[#A1A1B5]">
              Start today for
            </p>

            <p className="mt-2 text-4xl font-bold text-white">
              $9
            </p>

            <p className="text-sm text-[#A1A1B5]">
              per month
            </p>

          </div>

          <button
            onClick={() => {
              window.location.href =
                "/dashboard/billing";
            }}
            className="mt-6 w-full rounded-xl bg-[#7C3AED] py-3 text-sm font-semibold text-white transition hover:bg-[#8B5CF6]"
          >
            Upgrade to Pro
          </button>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="w-full text-sm text-[#A1A1B5] hover:text-white"
          >
            Maybe Later
          </button>

        </div>
      </div>
    </div>
  );
}