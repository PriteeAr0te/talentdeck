"use client";

import { useEffect, useState } from "react";
import { ProfileType } from "@/types/profile";
import API from "@/lib/api";
import ProfileCard from "./ProfileCard";
import { SearchParams } from "@/types/searchParams";
import Pagination from "./Pagination";

interface TalentResultsProps {
  filters: SearchParams;
  setFilters: React.Dispatch<React.SetStateAction<SearchParams>>;
}

export default function TalentResults({ filters, setFilters }: TalentResultsProps) {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const {
          category,
          skills,
          tags,
          ...rest
        } = filters;

        const paramsToSend: Record<string, unknown> = {
          ...rest,
          ...(category && category !== "All Categories" ? { category } : {}),
          ...(skills && Array.isArray(skills) ? { skills: skills.join(",") } : {}),
          ...(typeof skills === "string" ? { skills } : {}),
          ...(tags && Array.isArray(tags) ? { tags: tags.join(",") } : {}),
          ...(typeof tags === "string" ? { tags } : {}),
        };

        const res = await API.get("/profile", { params: paramsToSend });

        setProfiles(res.data.data);
        setTotalPages(res.data.meta.pages);
        setTotalProfiles(res.data.meta.total);
      } catch (err) {
        console.error("Fetch profiles failed", err);
      }
    };

    fetchProfiles();
  }, [filters]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <ProfileCard key={profile._id} profile={profile} />
          ))
        ) : (
          <p className="text-center col-span-full py-10 text-lg">
            No profiles found.
          </p>
        )}
      </div>

      {totalProfiles > 50 && (
        <Pagination data={filters} setData={setFilters} totalPages ={totalPages}/>
      )}
    </>
  );
}
