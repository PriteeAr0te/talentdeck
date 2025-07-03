"use client";

import { useEffect, useState } from "react";
import { ProfileType } from "@/types/profile";
import API from "@/lib/api";
import ProfileCard from "@/components/ui/ProfileCard";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BookmarkedProfilesPage() {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await API.get("/profile/bookmarks");
        setProfiles(res.data.data || []);
        console.log("first", res.data.data);
      } catch (err) {
        console.error("Failed to load bookmarks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <section className="min-h-screen w-full px-4 sm:px-6 lg:px-12 py-10 bg-background text-foreground">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Bookmarked Talents
        </motion.h1>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading bookmarks...</p>
        ) : profiles.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              You haven’t bookmarked any profiles yet.
            </p>
            <Link
              href="/talents"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 bg-primary text-btn hover:bg-secondary transition shadow hover:text-foreground"
            >
              Browse Talents
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {profiles.map((profile) => (
              <motion.div
                key={profile._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <ProfileCard key={profile._id} profile={profile} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
