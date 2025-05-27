
export type FormValues = {
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
    availableforwork: boolean;
    isVisible: boolean;
    portfolioLinks: {
      label: string;
      url: string;
    }[];
    socialLinks: {
      label: string;
      url: string;
      isVisible: boolean;
    }[];
    profilePicture: File | string;
    projectImages: (File | string)[];
  };
  