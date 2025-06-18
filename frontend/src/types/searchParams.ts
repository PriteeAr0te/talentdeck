export interface SearchParams {
  q?: string;
  category?: string;
  availableforwork?: boolean;
  sortBy: 'createdAt' | 'username';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}