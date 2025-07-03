"use client";

import { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
// import { useInView } from "framer-motion/hooks";
import { Filter, GalleryVertical, BookmarkCheck } from "lucide-react";

const features = [
    {
        icon: Filter,
        title: "Smart Filtering",
        description:
            "Find exactly the talent you need using skills, tags, location, and categories.",
    },
    {
        icon: GalleryVertical,
        title: "Showcase Portfolios",
        description:
            "Each profile highlights bio, projects, and achievements with visuals.",
    },
    {
        icon: BookmarkCheck,
        title: "Save & Share Profiles",
        description:
            "Bookmark top profiles or share them instantly with your team.",
    },
];

const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4 },
    }),
};

import { easeOut } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export default function FeaturesSection() {
    const ref = useRef(null);
    const controls = useAnimation();
    const inView = useInView(ref, { amount: 0.5 });
    const hasAnimated = useRef(false);

    if (inView && !hasAnimated.current) {
        controls.start("visible");
        hasAnimated.current = true;
    }

    const splitText = (text: string) =>
        text.split(" ").map((word, i) => (
            <motion.span
                key={i}
                className="inline-block mr-2"
                variants={wordVariants}
                custom={i}
                initial="hidden"
                animate={controls}
            >
                {word}
            </motion.span>
        ));

    return (
        <section
            ref={ref}
            className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-background border-t border-border"
        >
            <div className="max-w-5xl mx-auto text-center mb-12">
                <motion.h2
                    className="text-3xl md:text-4xl xl:text-5xl font-bold text-foreground mb-4 leading-tight flex flex-wrap justify-center gap-x-2"
                    initial="hidden"
                    animate={controls}
                    transition={{ delay: 1.3, duration: 0.6 }}
                >
                    {splitText("What Makes TalentDeck Special?")}
                </motion.h2>

                <motion.p
                    className="text-foreground text-base md:text-lg"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
                >
                    Designed for recruiters & creators. Explore how we help you connect.
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                initial="hidden"
                animate={controls}
                variants={{
                    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
                }}
            >
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={index}
                            className="p-6 rounded-xl bg-background-secondary border border-border shadow-sm hover:shadow-lg transition-transform hover:scale-[1.03] group"
                            variants={cardVariants}
                        >
                            <div className="flex items-center justify-center mb-4">
                                <Icon className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground text-center mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-md text-muted-foreground text-center">
                                {feature.description}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
