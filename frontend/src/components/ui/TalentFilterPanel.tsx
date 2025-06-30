"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import FilterDropdownComponent from "@/components/ui/FilterDropdownComponent";
import { SearchParams } from "@/types/searchParams";
import LocationSelectorFilter from "./LocationSelectorFilter";
import { useDebouncedSearch } from "@/hooks/useDebouncedCallback";

interface TalentFilterPanelProps {
    filters: SearchParams;
    setFilters: React.Dispatch<React.SetStateAction<SearchParams>>;
}

const categories = [
    "Graphic Designer",
    "UI/UX Designer",
    "Software Developer",
    "Content Creator",
    "Video Editor",
    "Other",
];

const sortOptions = [
    "Newest First",
    "Oldest First",
    "Name (A-Z)",
    "Name (Z-A)"
];

const sortMap: Record<string, { sortBy: "createdAt" | "username"; sortOrder: "asc" | "desc" }> = {
    "Newest First": { sortBy: "createdAt", sortOrder: "desc" },
    "Oldest First": { sortBy: "createdAt", sortOrder: "asc" },
    "Name (A-Z)": { sortBy: "username", sortOrder: "asc" },
    "Name (Z-A)": { sortBy: "username", sortOrder: "desc" },
};

export default function TalentFilterPanel({ filters, setFilters }: TalentFilterPanelProps) {
    const [skillsOptions, setSkillsOptions] = useState<string[]>([]);
    const [tagsOptions, setTagsOptions] = useState<string[]>([]);
    const [q, setQ] = useState(filters.q || '');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [skillsRes, tagsRes] = await Promise.all([
                    API.get("/profile/skills"),
                    API.get("/profile/tags"),
                ]);
                setSkillsOptions(skillsRes.data);
                setTagsOptions(tagsRes.data);
            } catch (err) {
                console.error("Failed to fetch skills/tags", err);
            }
        };

        fetchOptions();
    }, []);

    useDebouncedSearch(q, 500, (val) => {
        setFilters((prev) => {
            if (prev.q === val) return prev;
            return { ...prev, q: val };
        });
    });

    return (
        <div className="space-y-6">
            <input
                type="search"
                placeholder="Search talents..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="px-4 py-2 border border-br-primary rounded-md w-full focus:outline-0 focus:border-primary focus:dark:border-[#A57FC0]"
            />

            <FilterDropdownComponent
                label="Category"
                value={filters.category || ""}
                options={["All Categories", ...categories]}
                onChange={(val) =>
                    setFilters((prev) => ({
                        ...prev,
                        category: val === "All Categories" ? "" : val,
                    }))
                }
            />

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="available"
                    checked={filters.availableforwork ?? false}
                    onChange={() =>
                        setFilters((prev) => ({
                            ...prev,
                            availableforwork: !prev.availableforwork,
                        }))
                    }
                    className="form-checkbox h-4 w-4 text-primary"
                />
                <label htmlFor="available" className="text-sm">
                    Available for work
                </label>
            </div>

            <FilterDropdownComponent
                label="Select Sort Options"
                options={[...sortOptions]}
                value={
                    Object.entries(sortMap).find(
                        ([, v]) =>
                            v.sortBy === filters.sortBy && v.sortOrder === filters.sortOrder
                    )?.[0] || ""
                }
                onChange={(label) => {
                    const selected = sortMap[label];
                    if (selected) {
                        setFilters((prev) => ({
                            ...prev,
                            sortBy: selected.sortBy,
                            sortOrder: selected.sortOrder,
                        }));
                    } else {
                        setFilters((prev) => {
                            const { ...rest } = prev;
                            return rest;
                        });
                    }
                }}
            />


            <MultiSelectDropdown
                label="Skills"
                options={skillsOptions}
                selected={filters.skills || []}
                onChange={(skills) => setFilters((prev) => ({ ...prev, skills }))}
            />

            <MultiSelectDropdown
                label="Tags"
                options={tagsOptions}
                selected={filters.tags || []}
                onChange={(tags) => setFilters((prev) => ({ ...prev, tags }))}
            />

            <LocationSelectorFilter
                location={{
                    country: filters["location.country"] || "",
                    state: filters["location.state"] || "",
                    city: filters["location.city"] || "",
                }}
                onChange={(loc) =>
                    setFilters((prev) => ({
                        ...prev,
                        "location.country": loc.country,
                        "location.state": loc.state,
                        "location.city": loc.city,
                    }))
                }
            />
        </div>
    );
}
