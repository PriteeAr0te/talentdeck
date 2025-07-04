"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Star, MessageSquareQuote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        name: "Ravi Malhotra",
        title: "Tech Recruiter at DevCraft",
        avatar: "/avatars/ravi.jpg",
        quote:
            "TalentDeck made our hiring 5x faster. The filtering tools are a game changer.",
        rating: 5,
    },
    {
        name: "Aisha Khan",
        title: "UI/UX Designer",
        avatar: "/avatars/aisha.jpg",
        quote:
            "I landed my dream job in just 3 weeks! The profile tools are fantastic and easy to use.",
        rating: 4,
    },
    {
        name: "Rohit Shetty",
        title: "Product Manager at Bravex",
        avatar: "/avatars/rohit.jpg",
        quote:
            "We hired two amazing developers through TalentDeck. Seamless experience.",
        rating: 5,
    },
];

export default function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) controls.start("visible");
    }, [isInView]);

    return (
        <section
            ref={ref}
            className="w-full px-4 sm:px-6 lg:px-12 py-20 bg-background-footer border-t border-border text-foreground"
        >
            <div className="max-w-5xl mx-auto text-center mb-16">
                <motion.h2
                    className="text-3xl md:text-4xl xl:text-5xl font-bold mb-4"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.8 }}
                >
                    Hear from Our Users
                </motion.h2>
                <motion.p
                    className="text-muted-foreground text-base md:text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Real stories from recruiters and creators who&apos;ve found success through TalentDeck.
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                initial="hidden"
                animate={controls}
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.2,
                            delayChildren: 0.8,
                        },
                    },
                }}
            >
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        className="rounded-2xl bg-background bg-opacity-10 backdrop-blur-md p-6 shadow-lg border border-border hover:shadow-2xl transition-all group"
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src={t.avatar}
                                alt={t.name}
                                width={48}
                                height={48}
                                className="rounded-full w-12 h-12 object-cover border border-border"
                            />
                            <div>
                                <h4 className="text-lg font-semibold text-foreground">{t.name}</h4>
                                <p className="text-sm text-muted-foreground">{t.title}</p>
                            </div>
                        </div>
                        <p className="text-md text-foreground italic relative pl-8">
                            <MessageSquareQuote className="absolute left-0 top-1 text-primary w-5 h-5" />
                            {t.quote}
                        </p>
                        <div className="mt-4 flex gap-1">
                            {Array.from({ length: t.rating }, (_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
