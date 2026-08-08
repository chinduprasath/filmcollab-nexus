export interface Applicant {
  id: string;
  castingCallId: string;
  userId: string;
  name: string;
  profilePhoto: string;
  profession: string;
  experience: string;
  location: string;
  languages: string[];
  skills: string[];
  portfolioUrl?: string;
  appliedDate: string;
  status: "Interested" | "Confirmed" | "Rejected";
  matchScore: number;
}

export interface CastingCall {
  id: string;
  creatorId: string; // To check if current user is the owner
  title: string;
  projectName: string;
  productionHouse: string;
  castingDirector: string;
  contactPerson: string;
  email: string;
  phone?: string;
  poster: string;
  category: string;
  roleName: string;
  roleDescription: string;
  gender: "Male" | "Female" | "Transgender" | "Any";
  ageRange: [number, number];
  height?: string;
  languages: string[];
  experience: "Fresher" | "Experienced" | "Any";
  compensation: "Paid" | "Unpaid" | "Revenue Share";
  location: string; // e.g. "Hyderabad, Telangana"
  shootDates: string;
  auditionDates: string;
  auditionVenue: string;
  vacancies: number;
  maxApplications?: number;
  datePosted: string;
  lastDateToApply: string;
  projectDescription: string;
  requirements: string[];
  whatToBring: string[];
  notes?: string;
  attachments?: { name: string; url: string; size: string }[];
  status: "Open" | "Closing Soon" | "Applications Full" | "Closed" | "Cancelled";
  verified: boolean;
  savedBy: string[]; // array of userIds who saved it
  googleMapsLink?: string;
  scriptAttachmentUrl?: string;
}

export const CATEGORIES = [
  "Movie",
  "Short Film",
  "Web Series",
  "TV Serial",
  "Advertisement",
  "Music Video",
  "OTT",
  "Documentary",
  "Corporate Shoot",
  "Fashion Shoot",
];

export const INITIAL_CASTING_CALLS: CastingCall[] = [
  {
    id: "cc_1",
    creatorId: "user_1",
    title: "Lead Hero Required for Telugu Feature Film",
    projectName: "Sankranthi Alludu",
    productionHouse: "Geetha Arts",
    castingDirector: "Srikanth",
    contactPerson: "Rahul",
    email: "casting@geethaarts.com",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80",
    category: "Movie",
    roleName: "Hero (Protagonist)",
    roleDescription: "Looking for an energetic male lead who can perform action sequences and has good comedic timing. Must be fluent in Telugu.",
    gender: "Male",
    ageRange: [22, 30],
    height: "5'9\" and above",
    languages: ["Telugu", "English"],
    experience: "Experienced",
    compensation: "Paid",
    location: "Hyderabad, Telangana",
    shootDates: "Oct 2026 - Jan 2027",
    auditionDates: "Aug 15 - Aug 20, 2026",
    auditionVenue: "Geetha Arts Studio, Jubilee Hills, Hyderabad",
    vacancies: 1,
    maxApplications: 500,
    datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastDateToApply: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    projectDescription: "A high-budget family entertainer set against the backdrop of a village festival. Expect grand sets, emotional drama, and foot-tapping music.",
    requirements: [
      "Must have acted in at least 1 feature film or 2 prominent web series.",
      "Professional portfolio with a 2-minute showreel.",
      "Ability to ride a motorcycle."
    ],
    whatToBring: [
      "Printed composite card",
      "Valid ID proof"
    ],
    attachments: [
      { name: "Audition_Script_Scene1.pdf", url: "#", size: "1.2 MB" },
      { name: "Character_Lookbook.pdf", url: "#", size: "4.5 MB" }
    ],
    status: "Open",
    verified: true,
    savedBy: []
  },
  {
    id: "cc_2",
    creatorId: "user_2",
    title: "Female Lead for Urban Rom-Com Short",
    projectName: "Coffee & Heartbreaks",
    productionHouse: "Indie Frames",
    castingDirector: "Neha Sharma",
    contactPerson: "Neha Sharma",
    email: "hello@indieframes.in",
    poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    category: "Short Film",
    roleName: "Ananya",
    roleDescription: "A quirky, independent coffee shop owner navigating modern dating in Mumbai.",
    gender: "Female",
    ageRange: [20, 26],
    languages: ["Hindi", "English"],
    experience: "Any",
    compensation: "Revenue Share",
    location: "Mumbai, Maharashtra",
    shootDates: "September 10-15, 2026",
    auditionDates: "August 10, 2026",
    auditionVenue: "Virtual Auditions via Zoom",
    vacancies: 1,
    datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastDateToApply: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    projectDescription: "An award-winning director's new short film exploring the nuances of Gen-Z relationships.",
    requirements: [
      "Expressive face and natural acting style.",
      "Fluency in Hindi and English.",
      "Self-recorded monologue audition required."
    ],
    whatToBring: [],
    status: "Closing Soon",
    verified: false,
    savedBy: []
  },
  {
    id: "cc_3",
    creatorId: "user_3",
    title: "Background Actors for Period Drama",
    projectName: "Empire's Fall",
    productionHouse: "Royal Studios",
    castingDirector: "Vikram Singh",
    contactPerson: "Amit",
    email: "extras@royalstudios.com",
    poster: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80",
    category: "Movie",
    roleName: "Villagers / Soldiers",
    roleDescription: "Looking for people with rustic looks to play villagers and soldiers in a 18th-century period drama.",
    gender: "Any",
    ageRange: [18, 60],
    languages: ["Hindi", "Tamil"],
    experience: "Fresher",
    compensation: "Paid",
    location: "Chennai, Tamil Nadu",
    shootDates: "Nov 2026",
    auditionDates: "Walk-in all August",
    auditionVenue: "AVM Studios, Chennai",
    vacancies: 100,
    datePosted: new Date().toISOString(),
    lastDateToApply: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    projectDescription: "A massive pan-India historical epic depicting the fall of a mighty empire.",
    requirements: [
      "No modern haircuts or colored hair.",
      "Willingness to shoot long hours outdoors."
    ],
    whatToBring: ["Recent full-length photo"],
    status: "Open",
    verified: true,
    savedBy: []
  }
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: "app_1",
    castingCallId: "cc_1",
    userId: "user_99",
    name: "Vijay Devarakonda (Lookalike)",
    profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    profession: "Actor",
    experience: "3 Years",
    location: "Hyderabad, Telangana",
    languages: ["Telugu", "Hindi"],
    skills: ["Action", "Dance", "Riding"],
    portfolioUrl: "https://youtube.com/showreel",
    appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Interested",
    matchScore: 95
  },
  {
    id: "app_2",
    castingCallId: "cc_1",
    userId: "user_88",
    name: "Ravi Kumar",
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    profession: "Theater Artist",
    experience: "5 Years",
    location: "Vizag, Andhra Pradesh",
    languages: ["Telugu"],
    skills: ["Method Acting", "Martial Arts"],
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Interested",
    matchScore: 82
  }
];
