"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import API from "@/lib/api";
import { Spotlight } from "@/components/ui/Spotlight";
import { Button } from "@/components/ui/ButtonNew";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

interface Profile {
  username: string;
  headline: string;
  profilePicture: string;
  category: string;
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { isProfileCreated, isLoggedIn } = useAuth();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Spotlight
          className="-top-20 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="relative z-10 py-28 px-6 md:px-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold"
          >
            Discover Top Talent, Instantly.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
          >
            TalentDeck helps creators, developers, and designers build stunning public profiles and get discovered.
          </motion.p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/talents">
              <Button variant="default" size="lg">Browse Talents</Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                if (!isLoggedIn) {
                  router.push('/auth/login');
                } else {
                  router.push(isProfileCreated ? '/profile/view' : '/profile/create');
                }
              }}
            >
              Create Your Profile
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Create Your Profile",
              desc: "Add your bio, skills, projects, and social links. Make it your own.",
            },
            {
              title: "Share Your Work",
              desc: "Your unique public URL makes it easy to showcase your talent.",
            },
            {
              title: "Get Discovered",
              desc: "Appear in search results and attract recruiters or collaborators.",
            },
          ].map((step, idx) => (
            <Card
              key={idx}
              className="hover:shadow-lg transition-shadow duration-300 dark:bg-[#0A0011]"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Talents */}
      <section className="py-20 px-6 md:px-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Featured Talents</h2>
          <Link href="/search">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <Card
              key={profile.username}
              className="hover:shadow-md transition-shadow duration-300 dark:bg-[#0A0011]"
            >
              <CardContent className="p-4 text-center">
                <Image
                  src={profile.profilePicture || "/default-profile.png"}
                  alt={profile.username}
                  priority
                  width={200}
                  height={200}
                  className="mx-auto rounded-full w-20 h-20 object-cover mb-4"
                />
                <h3 className="font-bold">{profile.username}</h3>
                <p className="text-sm text-muted-foreground mb-1">{profile.headline}</p>
                <p className="text-xs text-muted-foreground italic">{profile.category}</p>
                <Link
                  href={`/talent/${profile.username}`}
                  className="inline-block mt-3 text-primary hover:underline text-sm"
                >
                  View Profile
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-20 bg-muted dark:bg-[#0A0011] text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to share your talent with the world?</h2>
        <Link href={`${isProfileCreated ? '/profile/view' : '/profile/create'}`}>
          <Button size="lg">Create Your Profile</Button>
        </Link>
      </section>
    </div>
  );
}
