import SidebarLayout from "@/components/layout/SidebarLayout";
import TalentFilterPanel from "@/components/ui/TalentFilterPanel";
import TalentResults from "@/components/ui/TalentResults";
import { SearchParams } from "@/types/searchParams";
import { useState } from "react";


export default function TalentSearchPage() {
  const [filters, setFilters] = useState<SearchParams>({
    q: '',
    category: '',
    availableforwork: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    skills: [],
    tags: [],
    page: 1,
    limit: 10,
  });

  return (
    <SidebarLayout
      sidebar={<TalentFilterPanel filters={filters} setFilters={setFilters} />}
    >
      <TalentResults filters={filters} setFilters={setFilters} />
    </SidebarLayout>
  );
}
