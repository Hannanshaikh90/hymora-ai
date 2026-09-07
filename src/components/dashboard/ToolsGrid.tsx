"use client";

import { motion } from "framer-motion";

import { ToolCard } from "@/components/dashboard/ToolCard";
import { dashboardTools } from "@/constants/dashboard-tools";

export function ToolsGrid() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {dashboardTools.map((tool) => (
        <ToolCard key={tool.href} {...tool} />
      ))}
    </motion.div>
  );
}