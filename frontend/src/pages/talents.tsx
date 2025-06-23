import { useEffect, useState } from 'react';
import { ProfileType } from '@/types/profile';
import Image from 'next/image';
import Link from 'next/link';
import API from '@/lib/api';
import { SearchParams } from '@/types/searchParams';
import FilterDropdownComponent from '@/components/ui/FilterDropdownComponent';

const categories = [
  'Graphic Designer',
  'UI/UX Designer',
  'Software Developer',
  'Content Creator',
  'Video Editor',
  'Other',
];

export type SortOption = {
  label: string;
  sortBy: 'createdAt' | 'username';
  sortOrder: 'asc' | 'desc';
};

const sortOptions: SortOption[] = [
  { label: 'Newest', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Oldest', sortBy: 'createdAt', sortOrder: 'asc' },
  { label: 'A - Z', sortBy: 'username', sortOrder: 'asc' },
  { label: 'Z - A', sortBy: 'username', sortOrder: 'desc' },
];

export default function SearchPage() {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(false);
  const [sort, setSort] = useState<SortOption>(sortOptions[0]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const params: SearchParams = {
          q,
          page,
          limit: 10,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
        };

        if (category) params.category = category;
        if (available) params.availableforwork = true;

        const res = await API.get('/profile', { params });
        setProfiles(res.data.data);
        setTotalPages(res.data.meta.pages);
      } catch (error) {
        console.error('Failed to fetch profiles', error);
      }
    };
    fetchProfiles();
  }, [q, category, available, sort, page]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white py-6 px-4 sm:p-6 md:px-10 lg:px-20 2xl:px-28">
      <div className="flex flex-col md:flex-row md:items-start flex-wrap md:justify-end gap-4 mb-6 xl:justify-between">
        <input
          type="search"
          placeholder="Search Talents..."
          className="px-4 py-2 border rounded-md w-full md:w-1/3 focus:outline-0 focus:border-primary focus:dark:border-[#A57FC0]"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <FilterDropdownComponent
            label=""
            width="fit"
            value={category || ""}
            options={["All Categories", ...categories]}
            placeholder="Select Category"
            onChange={(val) =>
              setCategory(val === "All Categories" ? "" : val)
            }
          />

          <FilterDropdownComponent
            label=""
            width="fit"
            placeholder="Sort By"
            value={sort.label}
            options={sortOptions.map(opt => opt.label)}
            onChange={(label: string) => {
              const selected = sortOptions.find((s) => s.label === label);
              if (selected) setSort(selected);
            }}
          />

          <label className="inline-flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={available}
              onChange={() => setAvailable((prev) => !prev)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            Available for work
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {profiles?.length > 0 ?
          profiles.map((profile) => (
            <Link key={profile._id} href={`/talent/${profile.username}`}>
              <div className="border rounded-lg p-4 hover:shadow-lg transition bg-white dark:bg-gray-900 h-full">
                <div className=''>
                  <Image
                    src={profile.profilePicture || '/default-avatar.png'}
                    alt={profile.username}
                    width={64}
                    height={64}
                    style={{ width: 'auto', maxHeight: '64px', minWidth:'64px', objectFit: 'cover' }}
                    className="rounded-full mb-2"
                  />
                </div>
                <h3 className="font-semibold">{profile.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.headline}</p>
                <p className="text-xs mt-1">{profile.category}</p>
              </div>
            </Link>
          )) : (
            <div className='py-8 text-center w-full'>
              <h2 className='text-gray-900 dark:text-white text-3xl font-semibold text-center'>Profile Not Found</h2>
            </div>
          )}
      </div>

      <div className="flex justify-center gap-3 mt-10">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-md ${page === i + 1 ? 'bg-[#250040] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
