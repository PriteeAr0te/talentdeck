"use client";

import FilterDropdownComponent from "@/components/ui/FilterDropdownComponent";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { SearchParams } from "@/types/searchParams";
import LocationSelectorFilter from "./LocationSelectorFilter";

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

const mockSkills = ["React", "Node", "TypeScript", "MongoDB", "Figma"];
const mockTags = ["freelancer", "remote", "available", "experienced"];

export default function TalentFilterPanel({ filters, setFilters }: TalentFilterPanelProps) {
    return (
        <div className="space-y-6">
            <div>
                <input
                    type="search"
                    placeholder="Search talents..."
                    value={filters.q || ""}
                    className="px-4 py-2 border rounded-md w-full focus:outline-0 focus:border-primary focus:dark:border-[#A57FC0]"
                    onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
                />
            </div>

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
                    checked={filters.availableforwork || true}
                    onChange={() =>
                        setFilters((prev) => ({
                            ...prev,
                            availableforwork: !prev.availableforwork,
                        }))
                    }
                    className="form-checkbox h-4 w-4 text-violet-600"
                />
                <label htmlFor="available" className="text-sm">
                    Available for work
                </label>
            </div>

            <MultiSelectDropdown
                label="Skills"
                options={mockSkills}
                selected={filters.skills || []}
                onChange={(skills) =>
                    setFilters((prev) => ({ ...prev, skills }))
                }
            />

            <MultiSelectDropdown
                label="Tags"
                options={mockTags}
                selected={filters.tags || []}
                onChange={(tags) =>
                    setFilters((prev) => ({ ...prev, tags }))
                }
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