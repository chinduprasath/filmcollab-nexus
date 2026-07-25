import { Company } from "../types/studios";

export const CATEGORIES = [
  "Production Houses",
  "Film Studios",
  "Casting Agencies",
  "Talent Management Agencies",
  "Post Production Studios",
  "Editing Studios",
  "DI Studios",
  "VFX Studios",
  "Animation Studios",
  "CGI Studios",
  "Recording Studios",
  "Music Production Companies",
  "Dubbing Studios",
  "Sound Design Studios",
  "Camera Rental Companies",
  "Lighting Rental Companies",
  "Equipment Rental Companies",
  "Drone Service Providers",
  "Photography Studios",
  "Acting Schools",
  "Dance Academies",
  "Film Institutes",
  "Advertising Agencies",
  "OTT Production Companies",
  "Film Distribution Companies",
  "Event Production Companies",
  "Public Relations Agencies",
  "Marketing Agencies",
  "Costume Rental Companies",
  "Makeup Studios",
  "Set Design Companies",
  "Location Management Companies",
  "Film Finance Companies"
];

export const SERVICES = [
  "Film Production",
  "Line Production",
  "Casting",
  "Editing",
  "Color Grading",
  "DI",
  "VFX",
  "CGI",
  "Animation",
  "Motion Graphics",
  "Photography",
  "Videography",
  "Music Production",
  "Recording",
  "Dubbing",
  "Sound Mixing",
  "Camera Rental",
  "Lighting Rental",
  "Drone Rental",
  "Equipment Rental",
  "Costume Rental",
  "Makeup Services",
  "Set Construction",
  "Art Direction",
  "Film Marketing",
  "Public Relations",
  "Distribution",
  "OTT Production",
  "Film Financing",
  "Location Scouting"
];

export const STATES = [
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
  "Kerala",
  "Karnataka",
  "Delhi",
  "West Bengal"
];

export const CITIES = [
  "Mumbai",
  "Chennai",
  "Hyderabad",
  "Kochi",
  "Bangalore",
  "Delhi",
  "Kolkata"
];

export const LANGUAGES = [
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "English",
  "Bengali"
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: "c1",
    name: "Yash Raj Films & Casting",
    logo: "YRF",
    coverImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    category: "Casting Agencies",
    description: "Yash Raj Films (YRF) is one of India's oldest and most prestigious film production and casting agencies. Over the last five decades, YRF has been at the forefront of shaping Indian cinema, discovering legendary talent, and crafting blockbuster musical romances and action spectacles.",
    establishedYear: 1970,
    founder: "Yash Chopra",
    services: ["Casting", "Film Production", "Talent Management", "Distribution", "Film Marketing"],
    languages: ["Hindi", "English"],
    email: "casting@yrf.com",
    phone: "+91 22 3061 9500",
    website: "https://www.yashrajfilms.com",
    socials: {
      instagram: "https://instagram.com/yrf",
      facebook: "https://facebook.com/yrf",
      twitter: "https://twitter.com/yrf",
      linkedin: "https://linkedin.com/company/yash-raj-films"
    },
    address: "Yash Raj Films, Shah Industrial Estate, Off Veera Desai Road, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    mapsLocation: "https://maps.google.com/?q=Yash+Raj+Films+Mumbai",
    workingHours: "10:00 AM - 06:30 PM (Mon-Sat)",
    verified: true,
    hiringNow: true,
    openAuditions: true,
    internshipsAvailable: true,
    acceptingFreshers: true,
    employeeCount: 450,
    projectsCompleted: 120,
    followersCount: 12500,
    rating: 4.8,
    reviewsCount: 34,
    featured: true,
    trending: true,
    recentlyAdded: false,
    gallery: [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518133680790-398573042988?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80"
    ],
    projects: [
      { id: "p1_1", title: "Pathaan", year: "2023", role: "Co-production & Main Casting", description: "High-octane spy thriller featuring Shah Rukh Khan, Deepika Padukone, and John Abraham." },
      { id: "p1_2", title: "War", year: "2019", role: "Production & Casting", description: "Action thriller starring Hrithik Roshan and Tiger Shroff in global locations." }
    ],
    team: [
      { id: "t1_1", name: "Shanoo Sharma", role: "Head of Casting" },
      { id: "t1_2", name: "Aditya Chopra", role: "Chairman & Producer" }
    ],
    reviews: [
      { id: "r1_1", author: "Karan Johar", rating: 5, comment: "Undoubtedly the gold standard of Indian casting. Professional, rigorous, and highly organized.", date: "2024-05-12" },
      { id: "r1_2", author: "Aman Verma", rating: 4, comment: "Gave my first screen test here. Extremely professional environment, though waiting times can be long.", date: "2024-06-01" }
    ],
    jobs: [
      { id: "j1_1", companyId: "c1", companyName: "Yash Raj Films & Casting", position: "Assistant Casting Director", experience: "2-3 Years", location: "Mumbai", salary: "₹50,000 - ₹75,000 / month", description: "Looking for an experienced Assistant Casting Director to manage screen tests, coordinate with talent, and maintain a database of actors." }
    ],
    auditions: [
      { id: "au1_1", companyId: "c1", companyName: "Yash Raj Films & Casting", role: "Female Lead (Upcoming Action Drama)", ageRange: "18-25", gender: "Female", language: "Hindi (Fluent)", location: "Mumbai Studio", description: "Auditioning for the lead role in a major upcoming action-thriller. Strong emotional range and basic athletic ability required." }
    ],
    internships: [
      { id: "in1_1", companyId: "c1", companyName: "Yash Raj Films & Casting", role: "Casting Intern", duration: "6 Months", type: "Paid", location: "Mumbai", description: "Learn casting processes, log audition videos, greet actors, and help organize casting schedules." }
    ]
  },
  {
    id: "c2",
    name: "Red Chillies VFX",
    logo: "RC",
    coverImage: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1200&q=80",
    category: "VFX Studios",
    description: "Red Chillies VFX is a state-of-the-art post-production and visual effects company based in Mumbai. Founded by Shah Rukh Khan and Gauri Khan, the studio specializes in photorealistic visual effects, pre-visualization, CGI, and color grading for Indian and international projects.",
    establishedYear: 2006,
    founder: "Shah Rukh Khan",
    services: ["VFX", "CGI", "Color Grading", "DI", "Animation", "Motion Graphics"],
    languages: ["English", "Hindi"],
    email: "careers@redchilliesvfx.com",
    phone: "+91 22 6669 9000",
    website: "https://www.redchilliesvfx.com",
    socials: {
      instagram: "https://instagram.com/redchilliesvfx",
      facebook: "https://facebook.com/redchilliesvfx",
      twitter: "https://twitter.com/redchilliesvfx"
    },
    address: "Plot No. 612, Junction of Rama Krishna Mission Road & Linking Road, Santacruz West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    verified: true,
    hiringNow: true,
    openAuditions: false,
    internshipsAvailable: true,
    acceptingFreshers: true,
    employeeCount: 300,
    projectsCompleted: 85,
    followersCount: 8900,
    rating: 4.9,
    reviewsCount: 18,
    featured: true,
    trending: true,
    recentlyAdded: false,
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
    ],
    projects: [
      { id: "p2_1", title: "Jawan", year: "2023", role: "VFX & DI Color Grading", description: "Comprehensive visual effects execution including face-replacement, action set extensions, and advanced color grading." },
      { id: "p2_2", title: "Zero", year: "2018", role: "Lead VFX Studio", description: "Groundbreaking dwarfism-simulation VFX that created a globally recognized technical benchmark." }
    ],
    team: [
      { id: "t2_1", name: "Keitan Yadav", role: "COO & VFX Producer" },
      { id: "t2_2", name: "Haresh Hingorani", role: "Chief Creative Officer" }
    ],
    reviews: [
      { id: "r2_1", author: "Sanjay Leela Bhansali", rating: 5, comment: "The technical prowess this studio brings to the table is unmatched in Asia. Highly recommended.", date: "2023-11-20" }
    ],
    jobs: [
      { id: "j2_1", companyId: "c2", companyName: "Red Chillies VFX", position: "Senior Nuke Compositor", experience: "5+ Years", location: "Mumbai / Hybrid", salary: "₹1,20,000 - ₹1,80,000 / month", description: "Seeking a senior compositor with extensive experience in Nuke, photorealistic integration, matte paint compositing, and cg lighting setups." }
    ],
    auditions: [],
    internships: [
      { id: "in2_1", companyId: "c2", companyName: "Red Chillies VFX", role: "VFX Rotoscopy Intern", duration: "3 Months", type: "Paid", location: "Mumbai", description: "Rotoscopy internship using Silhouette/Nuke. Gain hands-on exposure to live film production pipelines." }
    ]
  },
  {
    id: "c3",
    name: "Madras Talkies",
    logo: "MT",
    coverImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
    category: "Production Houses",
    description: "Madras Talkies is a premier Indian entertainment company established in Chennai. Led by acclaimed director Mani Ratnam and G. Srinivasan, Madras Talkies is known for creating intellectually engaging, visually poetic, and socially relevant cinema, including historical epics and modern dramas.",
    establishedYear: 1995,
    founder: "Mani Ratnam",
    services: ["Film Production", "Line Production", "Distribution", "OTT Production", "Location Scouting"],
    languages: ["Tamil", "Telugu", "Malayalam", "Hindi"],
    email: "info@madrastalkies.com",
    phone: "+91 44 2461 4621",
    website: "https://www.madrastalkies.com",
    socials: {
      twitter: "https://twitter.com/madrastalkies_",
      instagram: "https://instagram.com/madrastalkies"
    },
    address: "Flat A, No. 15, Cenotaph Road, 2nd Lane, Teynampet",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    verified: true,
    hiringNow: false,
    openAuditions: true,
    internshipsAvailable: false,
    acceptingFreshers: false,
    employeeCount: 45,
    projectsCompleted: 24,
    followersCount: 15400,
    rating: 4.9,
    reviewsCount: 12,
    featured: true,
    trending: false,
    recentlyAdded: false,
    gallery: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80"
    ],
    projects: [
      { id: "p3_1", title: "Ponniyin Selvan: Part 1 & 2", year: "2022-2023", role: "Main Producer", description: "Magnificent historical epic based on Kalki's classic novel, starring Vikram, Aishwarya Rai, and Karthi." },
      { id: "p3_2", title: "Guru", year: "2007", role: "Co-production", description: "Acclaimed biopic drama starring Abhishek Bachchan and Aishwarya Rai." }
    ],
    team: [
      { id: "t3_1", name: "Mani Ratnam", role: "Managing Director & Filmmaker" },
      { id: "t3_2", name: "Suhasini Maniratnam", role: "Co-producer & Writer" }
    ],
    reviews: [
      { id: "r3_1", author: "Rajeev Masand", rating: 5, comment: "Mani Ratnam's production house consistently sets the bar for cinematic poetry and artistic freedom.", date: "2024-01-15" }
    ],
    jobs: [],
    auditions: [
      { id: "au3_1", companyId: "c3", companyName: "Madras Talkies", role: "Male Supporting Actor (Aged 35-50)", ageRange: "35-50", gender: "Male", language: "Tamil (Fluent)", location: "Chennai Office", description: "Casting a pivotal supporting character for a realistic family drama. Must speak fluent Chennai Tamil. Previous theater experience is highly preferred." }
    ],
    internships: []
  },
  {
    id: "c4",
    name: "Suresh Productions",
    logo: "SP",
    coverImage: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=1200&q=80",
    category: "Film Studios",
    description: "Suresh Productions is one of India's largest integrated production houses, based in Hyderabad. Established by Dr. D. Ramanaidu, the studio offers sound stages, camera rentals, lighting packages, editing suites, and state-of-the-art preview theaters alongside extensive distribution networks.",
    establishedYear: 1964,
    founder: "Dr. D. Ramanaidu",
    services: ["Film Production", "Camera Rental", "Lighting Rental", "Post Production", "Distribution", "Equipment Rental"],
    languages: ["Telugu", "English"],
    email: "studio@sureshproductions.com",
    phone: "+91 40 2335 2411",
    website: "https://www.sureshproductions.com",
    socials: {
      instagram: "https://instagram.com/sureshproductions",
      facebook: "https://facebook.com/sureshproductions"
    },
    address: "Suresh Productions, Film Nagar, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    verified: true,
    hiringNow: true,
    openAuditions: false,
    internshipsAvailable: true,
    acceptingFreshers: true,
    employeeCount: 180,
    projectsCompleted: 150,
    followersCount: 6500,
    rating: 4.7,
    reviewsCount: 15,
    featured: false,
    trending: true,
    recentlyAdded: false,
    gallery: [
      "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=600&q=80"
    ],
    projects: [
      { id: "p4_1", title: "Drushyam", year: "2014", role: "Production & Distribution", description: "Highly successful family suspense drama starring Venkatesh." },
      { id: "p4_2", title: "Narappa", year: "2021", role: "Production", description: "Raw rustic action drama co-produced with V Creations." }
    ],
    team: [
      { id: "t4_1", name: "Suresh Babu Daggubati", role: "Managing Director" },
      { id: "t4_2", name: "Rana Daggubati", role: "Producer & Actor Liaison" }
    ],
    reviews: [
      { id: "r4_1", author: "Prasad Rao", rating: 5, comment: "The best equipment rental catalog and film shooting stages in South India. Incredible crew.", date: "2024-03-10" }
    ],
    jobs: [
      { id: "j4_1", companyId: "c4", companyName: "Suresh Productions", position: "Equipment Rental Supervisor", experience: "1-2 Years", location: "Hyderabad", salary: "₹35,000 - ₹45,000 / month", description: "Managing scheduling and maintenance of camera equipment, cinema lenses, and stabilizer rigs." }
    ],
    auditions: [],
    internships: [
      { id: "in4_1", companyId: "c4", companyName: "Suresh Productions", role: "Studio Management Intern", duration: "6 Months", type: "Paid", location: "Hyderabad", description: "Assisting in stage schedules, gear inventory checkups, and coordinating shooting client needs on-premises." }
    ]
  },
  {
    id: "c5",
    name: "Kochi Post House",
    logo: "KPH",
    coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    category: "Post Production Studios",
    description: "Kochi Post House is an independent, award-winning editing, dubbing, and sound mixing studio catering primarily to Malayalam cinema and independent Malayalam OTT projects. We focus on providing highly calibrated sound engineering, professional dubbing booths, and offline/online video editing.",
    establishedYear: 2018,
    founder: "Sreejith Menon",
    services: ["Editing", "Dubbing", "Sound Mixing", "DI", "Recording"],
    languages: ["Malayalam", "Tamil", "English"],
    email: "kochiposthouse@gmail.com",
    phone: "+91 484 233 4567",
    website: "https://kochiposthouse.example.com",
    socials: {
      instagram: "https://instagram.com/kochiposthouse"
    },
    address: "G-24, Ground Floor, Panampilly Nagar",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    verified: false,
    hiringNow: true,
    openAuditions: false,
    internshipsAvailable: true,
    acceptingFreshers: true,
    employeeCount: 15,
    projectsCompleted: 35,
    followersCount: 1200,
    rating: 4.5,
    reviewsCount: 8,
    featured: false,
    trending: false,
    recentlyAdded: true,
    gallery: [],
    projects: [
      { id: "p5_1", title: "Kumbalangi Nights (Sound Polish)", year: "2019", role: "Dubbing & Audio Polish", description: "Conducted auxiliary dubbing tracks and foley additions for specific local theater distributions." }
    ],
    team: [
      { id: "t5_1", name: "Sreejith Menon", role: "Lead Audio Engineer & Founder" }
    ],
    reviews: [
      { id: "r5_1", author: "Rajeev K.", rating: 4.5, comment: "Incredible acoustic isolation in the dubbing booth. Very cost-effective and friendly technicians.", date: "2024-04-02" }
    ],
    jobs: [
      { id: "j5_1", companyId: "c5", companyName: "Kochi Post House", position: "Assistant Sound Editor", experience: "0-1 Years (Fresher Welcome)", location: "Kochi", salary: "₹18,000 - ₹25,000 / month", description: "Assisting our sound engineer with dialogue cleanup, foley logging, and syncing dubbing tracks inside Pro Tools." }
    ],
    auditions: [],
    internships: [
      { id: "in5_1", companyId: "c5", companyName: "Kochi Post House", role: "Video Editing Assistant", duration: "3 Months", type: "Unpaid", location: "Kochi", description: "Work alongside our chief editor on Malayalam indie short films, organizing raw footages, multicam sync, and rendering drafts." }
    ]
  }
];
