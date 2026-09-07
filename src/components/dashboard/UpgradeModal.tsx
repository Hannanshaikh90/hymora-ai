"use client";

import {
  Crown,
  Sparkles,
  X,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

interface UpgradeModalProps {
  open: boolean;

  onClose: () => void;

  onUpgrade: () => void;
}

export function UpgradeModal({
  open,
  onClose,
  onUpgrade,
}: UpgradeModalProps) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="
            fixed
            inset-0
            z-[100]

            flex
            items-center
            justify-center

            bg-black/70
            backdrop-blur-md

            p-4
          "
        >

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              relative

              w-full
              max-w-md

              overflow-hidden

              rounded-3xl

              border
              border-white/[0.08]

              bg-[#0B0B0F]

              shadow-2xl
              shadow-violet-500/10
            "
          >

            {/* Glow */}
            <div
              className="
                absolute
                inset-0

                bg-gradient-to-br
                from-violet-500/[0.08]
                via-transparent
                to-fuchsia-500/[0.08]
              "
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="
                absolute
                right-4
                top-4

                z-10

                flex
                items-center
                justify-center

                w-9
                h-9

                rounded-xl

                border
                border-white/[0.08]

                bg-white/[0.04]

                text-white/60

                hover:text-white

                transition-all
              "
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="relative p-8">

              {/* Icon */}
              <div
                className="
                  mb-6

                  flex
                  items-center
                  justify-center

                  w-16
                  h-16

                  rounded-3xl

                  bg-gradient-to-br
                  from-yellow-400
                  to-orange-500

                  shadow-lg
                  shadow-yellow-500/20
                "
              >
                <Crown
                  className="
                    w-8
                    h-8

                    text-white
                  "
                />
              </div>

              {/* Heading */}
              <h2
                className="
                  text-3xl
                  font-semibold
                  text-white
                "
              >
                Upgrade to Pro
              </h2>

              {/* Description */}
              <p
                className="
                  mt-3

                  text-sm
                  leading-7

                  text-white/60
                "
              >
                You’ve reached your
                free daily limit.
                Unlock unlimited AI
                access and premium
                features with Nexus
                AI Pro.
              </p>

              {/* Features */}
              <div
                className="
                  mt-8
                  space-y-4
                "
              >

                {[
                  "Unlimited AI messages",
                  "Faster AI responses",
                  "Premium AI models",
                  "Priority access",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-center

                        w-8
                        h-8

                        rounded-xl

                        bg-violet-500/10
                      "
                    >
                      <Sparkles
                        className="
                          w-4
                          h-4

                          text-violet-400
                        "
                      />
                    </div>

                    <span
                      className="
                        text-sm
                        text-white/80
                      "
                    >
                      {feature}
                    </span>

                  </div>
                ))}

              </div>

              {/* Upgrade Button */}
              <button
                onClick={onUpgrade}
                className="
                  mt-8

                  w-full

                  rounded-2xl

                  bg-gradient-to-r
                  from-violet-500
                  to-fuchsia-500

                  px-5
                  py-4

                  text-sm
                  font-medium
                  text-white

                  shadow-lg
                  shadow-violet-500/20

                  transition-all

                  hover:scale-[1.02]
                  active:scale-[0.98]
                "
              >
                Upgrade Now
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}