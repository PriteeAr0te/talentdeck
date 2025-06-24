export interface SearchParams {
  q?: string;
  category?: string;
  availableforwork?: boolean;
  skills?: string[];
  tags?: string[];  
  sortBy: 'createdAt' | 'username';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
  'location.country'?: string;
  'location.state'?: string;
  'location.city'?: string;
}
