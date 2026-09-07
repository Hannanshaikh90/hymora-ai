"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowRight,
  MessageSquare,
  ImageIcon,
  VideoIcon,
  Music,
  Code2,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface ToolCardProps {
  label: string;
  description: string;
  icon: string;
  href: string;
  iconColor: string;
  iconBg: string;
}

export const ToolCard = ({
  label,
  description,
  icon,
  href,
  iconColor,
  iconBg,
}: ToolCardProps) => {
  const icons = {
    message: MessageSquare,
    image: ImageIcon,
    video: VideoIcon,
    music: Music,
    code: Code2,
  };

  const Icon = icons[icon as keyof typeof icons];

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 12,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={href}
        className="group relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] p-5 transition-all duration-200 overflow-hidden"
      >
        {/* Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent" />

        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl",
              iconBg
            )}
          >
            <Icon
              className={cn("w-4 h-4", iconColor)}
              strokeWidth={1.75}
            />
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all duration-200 mt-0.5" />
        </div>

        <div className="space-y-1">
          <h3 className="text-[13px] font-semibold text-white/90 tracking-tight">
            {label}
          </h3>

          <p className="text-[12px] text-white/35 leading-relaxed">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};