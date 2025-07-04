import Seo from "@/components/layout/Seo";
import SidebarLayout from "@/components/layout/SidebarLayout";
import TalentFilterPanel from "@/components/ui/TalentFilterPanel";
import TalentResults from "@/components/ui/TalentResults";
import { SearchParams } from "@/types/searchParams";
import { useState } from "react";


export default function TalentSearchPage() {
  const [filters, setFilters] = useState<SearchParams>({
    q: '',
    category: '',
    availableforwork: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    skills: [],
    tags: [],
    page: 1,
    limit: 10,
  });

  return (
    <>
      <Seo
        title="Explore Talents – Discover Creators & Developers on TalentDeck"
        description="Browse through verified profiles of designers, developers, and creators. Filter by skills, category, and availability to find top talent instantly."
        url="https://talentdeck-next.netlify.app/talents"
      />
      <SidebarLayout
        sidebar={<TalentFilterPanel filters={filters} setFilters={setFilters} />}
      >
        <TalentResults filters={filters} setFilters={setFilters} />
      </SidebarLayout>
    </>
  );
}
