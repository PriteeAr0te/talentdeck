"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Spotlight({
  className,
  fill = "white",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 1 }}
      className={cn(
        "absolute pointer-events-none z-0 aspect-square w-[60vw] rounded-full opacity-20 blur-[100px]",
        className
      )}
      style={{
        background: fill,
      }}
    />
  );
}
