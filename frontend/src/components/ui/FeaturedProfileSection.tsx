"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ProfileType } from "@/types/profile";
import API from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedProfilesSection() {
    const [profiles, setProfiles] = useState<ProfileType[]>([]);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) controls.start("visible");
    }, [isInView]);

    useEffect(() => {
        const fetchFeaturedProfiles = async () => {
            try {
                const res = await API.get("/profile", {
                    params: { limit: 4, sortBy: "createdAt", sortOrder: "desc" },
                });
                setProfiles(res.data.data);
            } catch (error) {
                console.error("Error fetching featured profiles", error);
            }
        };
        fetchFeaturedProfiles();
    }, []);

    const titleWords = "Meet Our Featured Talents".split(" ");

    return (
        <section
            ref={ref}
            className="w-full px-4 sm:px-6 lg:px-12 py-20 bg-background-secondary border-t border-border"
        >
            <div className="max-w-5xl mx-auto text-center mb-12">
                <motion.h2
                    className="text-3xl md:text-4xl xl:text-5xl font-bold text-foreground mb-6 flex flex-wrap justify-center gap-2 leading-tight"
                >
                    {titleWords.map((word, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={controls}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                            className="inline-block"
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                    className="text-muted-foreground text-base md:text-lg"
                >
                    Explore profiles from rising stars across design, development, and more.
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto justify-center"
                initial="hidden"
                animate={controls}
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.2,
                            delayChildren: 1.2,
                        },
                    },
                }}
            >
                {profiles.map((profile, index) => (
                    <motion.div
                        key={index}
                        className="bg-background shadow-md border border-border rounded-xl p-4 hover:shadow-xl hover:scale-[1.02] transition-all group"
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Link href={`/talent/${profile.username}`}>
                            <div className="flex flex-col items-center text-center gap-3">
                                <Image
                                    src={profile.profilePicture || "/default-avatar.png"}
                                    alt={profile.username}
                                    width={80}
                                    height={80}
                                    className="rounded-full w-20 h-20 object-cover"
                                />
                                <h3 className="text-xl font-semibold text-foreground">
                                    {profile.username}
                                </h3>
                                <p className="text-sm text-muted-foreground">{profile.category}</p>
                                <p className="text-xs text-muted-foreground line-clamp-3">
                                    {profile.headline}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            <div className="text-center w-full flex justify-center items-center mt-12">
                <Link href="/talents" className="hidden relative h-11 sm:flex items-center justify-center rounded-md w-40 overflow-hidden border border-foreground/50 text-foreground shadow-md transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-md before:bg-primary before:duration-300 before:ease-out hover:text-white hover:shadow-primary/50 hover:before:h-40 hover:before:w-40 hover:before:opacity-80">
                    <span className="relative z-10">Explore All Talents</span>
                </Link>
            </div>
        </section>
    );
}
