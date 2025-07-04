export interface ProfileType {
  _id: string;
  userId: string;
  username: string;
  headline?: string;
  category: "Graphic Designer" | "UI/UX Designer" | "Software Developer" | "Content Creator" | "Video Editor" | "Other";
  location: {
    city: string;
    state: string;
    country: string;
  };
  bio?: string;
  skills: string[];
  tags?: string[];
  availableforwork?: boolean;
  isVisible?: boolean;
  portfolioLinks?: {
    label: string;
    url: string;
  }[];
  socialLinks?: {
    label: string;
    url: string;
    isVisible?: boolean;
  }[];
  profilePicture?: string;
  projectImages?: string[];
  likes?: Array<string | { _id: string }>;
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
}
