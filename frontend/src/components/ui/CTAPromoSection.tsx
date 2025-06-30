"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CallToActionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({ target: ref });
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.6]);

  return (
    <section
      ref={ref}
      className="relative w-full px-4 sm:px-6 lg:px-12 py-20 border-t border-border bg-gradient-to-br from-background via-background-secondary to-background"
    >
      {/* Scroll-reactive background pulse */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/20 via-accent/10 to-background blur-2xl"
      />

      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl xl:text-5xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Join Us Early. Shape What Comes Next.
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          TalentDeck is just getting started. Be part of our early journey and shape what’s next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            href="/login"
            className="relative inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-btn hover:text-foreground bg-primary hover:bg-secondary shadow-lg transition-all duration-300 ease-out group overflow-hidden"
          >
            <span className="relative z-10">🔥 Be an Early Builder</span>
            <span className="absolute inset-0 w-full h-full bg-accent opacity-0 group-hover:opacity-10 transition duration-300" />
          </Link>

          <p className="text-muted-foreground mt-4">
            Be one of the first 100 shaping TalentDeck.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
