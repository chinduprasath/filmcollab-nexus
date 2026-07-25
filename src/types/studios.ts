export interface Project {
  id: string;
  title: string;
  year: string;
  role: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface JobPosting {
  id: string;
  companyId: string;
  companyName: string;
  position: string;
  experience: string;
  location: string;
  salary?: string;
  description: string;
}

export interface AuditionPosting {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  ageRange: string;
  gender: string;
  language: string;
  location: string;
  description: string;
}

export interface InternshipPosting {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  duration: string;
  type: "Paid" | "Unpaid";
  location: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  category: string;
  description: string;
  establishedYear: number;
  founder: string;
  services: string[];
  languages: string[];
  email: string;
  phone: string;
  website: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  address: string;
  city: string;
  state: string;
  country: string;
  mapsLocation?: string;
  workingHours?: string;
  verified: boolean;
  hiringNow: boolean;
  openAuditions: boolean;
  internshipsAvailable: boolean;
  acceptingFreshers: boolean;
  openForCollaboration?: boolean;
  employeeCount: number;
  projectsCompleted: number;
  followersCount: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  trending: boolean;
  recentlyAdded: boolean;
  gallery: string[];
  projects: Project[];
  team: TeamMember[];
  reviews: Review[];
  jobs: JobPosting[];
  auditions: AuditionPosting[];
  internships: InternshipPosting[];
  events?: CompanyEvent[];
  courses?: CompanyCourse[];
  userId?: string; // If registered by a user
  gstNumber?: string;
}

export interface CompanyEvent {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isOnline: boolean;
  attendees: number;
  price: string;
}

export interface CompanyCourse {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  price: string;
  enrolled: number;
  level: string;
  category: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  type: "job" | "audition" | "internship";
  companyId: string;
  companyName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  experienceYears: string;
  coverLetter: string;
  resumeUrl?: string;
  demoReelUrl?: string;
  status: "Pending" | "Reviewed" | "Shortlisted" | "Rejected";
  date: string;
}
