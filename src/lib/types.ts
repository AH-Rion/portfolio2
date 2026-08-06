export interface SiteContent {
  key: string;
  data: Record<string, unknown>;
  updated_at?: string;
}

export interface HeroContent {
  name: string;
  tagline: string;
  roles: string[];
  profile_image_url: string;
}

export interface AboutContent {
  bio: string;
  about_image_url: string;
  highlights: string[];
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface FooterContent {
  text: string;
  socials: SocialLink[];
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  sort_order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at?: string;
}

export interface Experience {
  id: string;
  title: string;
  organization: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
  created_at?: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string | null;
  issue_date: string | null;
  skills: string[];
  credential_id: string | null;
  certificate_url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}
