"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
    const { isProfileCreated } = useAuth();
    return (
        <section className="relative isolate overflow-hidden bg-background py-24 sm:py-32 xl:py-40">

            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 flex items-center justify-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="dark:h-[480px] h-[550px] w-[600px] rounded-full bg-gradient-to-br from-primary/50 dark:from-primary/20 via-accent/30 to-secondary/20 blur-3xl opacity-80 dark:opacity-30"
                />
            </div>

            <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                <motion.h1
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
                >
                    Shine in the Spotlight
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className="mt-6 text-lg leading-8 text-muted-foreground"
                >
                    Discover and showcase amazing talent from around the world.
                    Whether you&apos;re hiring or getting hired, TalentDeck puts you in the spotlight.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-10 flex items-center justify-center gap-x-6"
                >
                    <Link href="/talents" className={cn("relative h-11 flex items-center justify-center rounded-md w-40 overflow-hidden border border-foreground/50 text-foreground shadow-md transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-md before:bg-primary before:duration-300 before:ease-out hover:text-white hover:shadow-primary/50 hover:before:h-40 hover:before:w-40 hover:before:opacity-80")}>
                        <span className="relative z-10">Browse Talents</span>
                    </Link>
                    <Link
                        href={isProfileCreated ? "/profile/view" : "/profile/create"}
                        className="text-sm 2xl:text-base font-medium px-4 py-2.5 rounded-md text-foreground hover:text-foreground bg-btn-secondary hover:bg-secondary transition cursor-pointer"
                    >
                        {isProfileCreated ? "My Profile" : "Create Profile"}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
