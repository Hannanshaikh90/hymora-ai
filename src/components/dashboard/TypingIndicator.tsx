"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: dot * 0.15,
            }}
            className="w-2 h-2 rounded-full bg-white/50"
          />
        ))}
      </div>
    </div>
  );
}