"use client";

import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "motion/react";
import { AddFileDialog } from "@/components/directory/AddFileDialog";
import {
  Search,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Music,
  Heart,
  Share2,
  Calendar,
  Eye,
  Play,
  Clock,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  ZoomIn,
  ZoomOut,
  BookOpen,
  AlignLeft,
  Moon,
  Sun,
  X,
  Volume2,
  Filter,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

type DirType = "images" | "videos" | "documents" | "audios";

interface BaseItem {
  id: string;
  title: string;
  username: string; // YYYY-MM-DD
  uploadDate: string; // YYYY-MM-DD
  likes: number;
  likedByUser?: boolean;
  tags?: string[];
  description?: string;
}

interface ImageItem extends BaseItem {
  type: "images";
  thumbnailUrl: string;
}

interface VideoItem extends BaseItem {
  type: "videos";
  thumbnailUrl: string;
  coverUrl?: string;
  videoUrl: string;
}

interface DocumentItem extends BaseItem {
  type: "documents";
  fileUrl: string;
  ext: string;
  pages: string[];
  outline: string[];
}

interface AudioItem extends BaseItem {
  type: "audios";
  audioUrl: string;
}

type DirItem = ImageItem | VideoItem | DocumentItem | AudioItem;

const initialItems: DirItem[] = [
  { 
    id: "i1", 
    type: "images", 
    title: "Behind the Scenes - Studio Shoot", 
    username: "Sarah Johnson",
    uploadDate: "2024-12-10", 
    likes: 42, 
    likedByUser: true,
    tags: ["production", "studio", "bts"], 
    thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=640&q=80",
    description: "Camera operator lining up a cinematic tracking shot on stage 4."
  },
  { 
    id: "i2", 
    type: "images", 
    title: "Mountain Pass Location Scout", 
    username: "Alex Rodriguez",
    uploadDate: "2024-12-05", 
    likes: 29, 
    likedByUser: false,
    tags: ["outdoors", "scouting", "cinematic"],
    thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=640&q=80",
    description: "Golden hour wide lens scouting for the upcoming adventure sequence."
  },
  { 
    id: "i3", 
    type: "images", 
    title: "Moody Lighting Reference Sheet", 
    username: "Amelia Chen",
    uploadDate: "2024-12-09", 
    likes: 56, 
    likedByUser: false,
    tags: ["lighting", "moodboard", "color"],
    thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=640&q=80",
    description: "High contrast neon and low-key shadow configurations for retro thriller scene."
  },
  { 
    id: "i4", 
    type: "images", 
    title: "Cyberpunk Alley Matte Painting", 
    username: "Raj Patel",
    uploadDate: "2024-12-11", 
    likes: 88, 
    likedByUser: false,
    tags: ["vfx", "concept", "cyberpunk"],
    thumbnailUrl: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=640&q=80",
    description: "Detailed matte painting background for sequence 12."
  },
  { 
    id: "i5", 
    type: "images", 
    title: "Vintage Retro Costume Board", 
    username: "Sonya Vance",
    uploadDate: "2024-12-03", 
    likes: 19, 
    likedByUser: false,
    tags: ["costume", "retro", "wardrobe"],
    thumbnailUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=640&q=80",
    description: "Inspiration lookbook for characters in the mid-70s setting."
  },
  { 
    id: "v1", 
    type: "videos", 
    title: "Action Sequence Lighting Breakdown", 
    username: "Marcus Thompson",
    uploadDate: "2024-12-08", 
    likes: 134, 
    likedByUser: false,
    tags: ["gimmicks", "tutorial", "lighting"],
    thumbnailUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=640&q=80", 
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-showing-a-video-41719-large.mp4",
    description: "A 3D breakdown of the active multi-cam light rig utilized in the warehouse chase."
  },
  { 
    id: "v2", 
    type: "videos", 
    title: "Color Grading Reel - Autumn Look", 
    username: "Priya Sharma",
    uploadDate: "2024-12-02", 
    likes: 95, 
    likedByUser: true,
    tags: ["grading", "autumn", "davinci"],
    thumbnailUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=640&q=80", 
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-color-grading-a-cinematic-forest-shot-43180-large.mp4",
    description: "Before & after color transformation showcase from flat log footage."
  },
  { 
    id: "v3", 
    type: "videos", 
    title: "Behind-The-Lens Camera Movement Rig", 
    username: "Devon Miller",
    uploadDate: "2024-12-12", 
    likes: 112, 
    likedByUser: false,
    tags: ["camera", "gimbal", "rigging"],
    thumbnailUrl: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=640&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-professional-video-camera-on-a-stabilizer-41618-large.mp4",
    description: "Slow motion gimbal tracks demonstrating stabilization over rough terrain."
  },
  { 
    id: "d1", 
    type: "documents", 
    title: "Short Film - Final Script (Draft 4)", 
    username: "Marcus Vance",
    uploadDate: "2024-11-30", 
    likes: 67, 
    likedByUser: false,
    tags: ["script", "drama", "writing"],
    fileUrl: "#", 
    ext: "pdf",
    description: "Final locked shooting script for the sci-fi project 'Midnight Circuit'.",
    outline: ["1. SCENE 1: The Terminal", "2. SCENE 2: Decryption Protocol", "3. SCENE 3: Street Escape", "4. SCENE 4: Safe House Static"],
    pages: [
      `SCENE 1: THE TERMINAL - NIGHT

EXT. ROOFTOP TERMINAL - NIGHT

Rain lashes against the neon panels of the communications array. A lone figure, KAI (20s), shivering in a synthetic high-collar duster, slides a glowing optical drive into the junction port.

KAI
Come on... bypass the hub... just three more seconds.

A red warning light flashes. A mechanical hum starts up in the ventilation stack.

KAI (CONT'D)
No, no, no! Don't lock me out. Not tonight.

An electronic voice echoes from the transceiver.

TRANSCEIVER VOICE
Security compromise detected. Perimeter sweep initiated.`,

      `SCENE 2: DECRYPTION PROTOCOL - CONTINUOUS

INT. SYSTEM CORE - NIGHT

The holographic matrix flickers with amber warning codes. Kai frantically taps a handheld deck connected via wire to the main terminal.

KAI
If I can spoof the gateway, I can grab the telemetry and clear the record before the drones arrive.

A visual overlay lights up his eyes. The decryption progress bar crawls from 88% to 92%.

KAI (CONT'D)
Almost there... almost there...

Behind him, a heavy pneumatic seal slides open with a hiss.`,

      `SCENE 3: STREET ESCAPE - NIGHT

EXT. ALLEYWAY LEVEL 4 - LATER

Kai drops from the ladder, splashing into oily water. Neon reflections bounce off the wet brick. Footsteps echo from above.

KAI
(into comms)
I have the file. But they are on the grid. Block the bridge!

OPERATOR (O.S.)
Bridges are locked. You have to go through the underground ducts.

Kai hesitates, looking down the dark pipe, then bolts as a searchlight sweep illuminates the alley.`,

      `SCENE 4: SAFE HOUSE STATIC - LATER

INT. ABANDONED LOFT - NIGHT

Kai collapses against the metal framing of a rusty server rack. The handheld deck is plugged in, feeding a green status line to a broken monitor.

KAI
It's done. The entire registry is scrubbed. We're invisible.

He closes his eyes. Outside, the storm rages on, thunder rolling across the iron sky.

FADE OUT.`
    ]
  },
  { 
    id: "d2", 
    type: "documents", 
    title: "Production Schedule & Cast List", 
    username: "Sarah Johnson",
    uploadDate: "2024-12-06", 
    likes: 45, 
    likedByUser: false,
    tags: ["schedule", "planning", "cast"],
    fileUrl: "#", 
    ext: "docx",
    description: "Day-by-day shoot mapping and emergency contact protocols.",
    outline: ["1. Crew Call Times", "2. Scene Allocation", "3. Principal Cast", "4. Emergency Protocols"],
    pages: [
      `PRODUCTION DAY 1 - SHOOT SCHEDULE

DATE: JULY 6, 2026
LOCATION: Stage 4 - Cyberpunk Alley Set

07:00 AM - Crew Call & Equipment Setup
08:00 AM - Actor Call (Kai, Operator) / Wardrobe & Makeup
09:15 AM - Block & Light Scene 1 (Rooftop Terminal)
10:30 AM - Shoot Scene 1 (A-Cam & B-Cam synced)
01:00 PM - Lunch Break (Catering on set)
02:00 PM - Move to Stage 2 (System Core Set)
02:30 PM - Block & Light Scene 2 (Decryption)
06:00 PM - Wrap Day 1 / Daily rushes backing up`,

      `PRINCIPAL CAST LIST & CONTACTS

CHARACTER: KAI
Actor: Devon Miller
Phone: +1 (555) 019-3284
Email: devon.m@talentagency.com

CHARACTER: OPERATOR (VOICE)
Actor: Sonya Vance
Phone: +1 (555) 014-9982
Email: sonya.vance@voicepool.com

DIRECTOR: Marcus Vance
Phone: +1 (555) 012-4400
PRODUCER: Sarah Johnson
Phone: +1 (555) 017-8833`
    ]
  },
  { 
    id: "d3", 
    type: "documents", 
    title: "Cinematography Shot List & Lighting Map", 
    username: "Amelia Chen",
    uploadDate: "2024-12-07", 
    likes: 72, 
    likedByUser: true,
    tags: ["cinematography", "lighting", "shots"],
    fileUrl: "#", 
    ext: "pdf",
    description: "Camera positions, lens selections, and light fixture arrangements.",
    outline: ["1. Lens Packages", "2. Setup 1-A details", "3. Lighting Configuration"],
    pages: [
      `CINEMATOGRAPHY CONFIGURATIONS

LENS PACKAGE:
- Arri Signature Primes (18mm, 35mm, 50mm, 85mm T1.8)
- 35mm will be the workhorse for mid-wide master shots.
- 85mm reserved for dramatic extreme close-ups of Kai's eye screen.

CAMERA RIG:
- RED V-Raptor on DJI Ronin 2 Stabilizer
- Flowcine Black Arm mounted on tracking vehicle for alleyway chases.`,

      `SETUP 1-A: ROOFTOP TERMINAL

SHOT LIST:
- Shot 1: Wide (Est.) - 18mm, tracking down-to-up revealing Kai.
- Shot 2: Mid Shot - 35mm, eye level. Following hand movement to the port.
- Shot 3: Tight Close-up - 85mm. Rain splashing on the synthetic duster.

LIGHTING DESIGN:
- Key: 1x Nanlite Pavotube II (cyan tint) overhead.
- Fill: Ambient neon purple panel bounce from left side.
- Rim: 2K tungsten fresnel behind Kai for rain silhouette.`
    ]
  },
  { 
    id: "a1", 
    type: "audios", 
    title: "Theme Track - Retro Ambient (Demo)", 
    username: "Raj Patel",
    uploadDate: "2024-12-01", 
    likes: 154, 
    likedByUser: false,
    tags: ["synth", "music", "ost"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "Analog synthesizer theme meant for the main menu background loop."
  },
  { 
    id: "a2", 
    type: "audios", 
    title: "Foley Pack - Ambient Rain & City Noise", 
    username: "Sonya Vance",
    uploadDate: "2024-12-04", 
    likes: 68, 
    likedByUser: false,
    tags: ["foley", "audio", "sfx"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description: "Clean stereo recording of rainfall on asphalt with distant thunder rumbles."
  },
  { 
    id: "a3", 
    type: "audios", 
    title: "Drone Cyber Synth Sweep SFX", 
    username: "Marcus Thompson",
    uploadDate: "2024-12-10", 
    likes: 41, 
    likedByUser: false,
    tags: ["ambient", "drone", "scifi"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description: "Low-frequency futuristic sweep for tension builds during hacking scenes."
  }
];

export default function DirectoryPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<DirType>("images");
  const [items, setItems] = useState<DirItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "likes" | "date">("recent");
  const [dateFilter, setDateFilter] = useState<"all" | "7d" | "30d">("all");
  const [viewingLiked, setViewingLiked] = useState<boolean>(false);
  const [likedFilter, setLikedFilter] = useState<"all" | DirType>("all");
  
  // Filter sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMinLikes, setFilterMinLikes] = useState<string>("");
  const [filterMaxLikes, setFilterMaxLikes] = useState<string>("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Modals / Read mode states
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [docPageNum, setDocPageNum] = useState<number>(0);
  const [docZoom, setDocZoom] = useState<number>(100);
  const [readerTheme, setReaderTheme] = useState<"sepia" | "light" | "night">("sepia");

  // Pagination states (Requirement 5: Display 12 per page)
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Add Files state
  const [showAddFileDialog, setShowAddFileDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.id) setCurrentUserId(user.id);
    });
  }, []);

  useEffect(() => {
    const typeMap: Record<string, string> = {
      'images': 'image',
      'videos': 'video',
      'audios': 'audio',
      'documents': 'document'
    };
    const fileType = typeMap[activeTab];
    if (fileType) {
      supabase.from("directory_categories")
        .select("name")
        .eq("file_type", fileType)
        .then(({ data, error }) => {
          if (!error && data) {
            const parsed = data
              .map((d: any) => d.name.split(',').map((s: string) => s.trim()))
              .flat()
              .filter(Boolean);
            setAvailableCategories(Array.from(new Set(parsed)) as string[]);
          }
        });
    }
  }, [activeTab]);

  // Toggle Like Handler (Requirement 4: Remove views, instead add likes)
  const handleLikeToggle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card clicks
    
    const itemToUpdate = items.find(i => i.id === id);
    if (!itemToUpdate) return;
    
    const liked = !itemToUpdate.likedByUser;
    const newLikesCount = liked ? itemToUpdate.likes + 1 : Math.max(0, itemToUpdate.likes - 1);

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (liked) {
            toast.success(`Liked "${item.title}"`);
          }
          return {
            ...item,
            likedByUser: liked,
            likes: newLikesCount,
          };
        }
        return item;
      })
    );

    // Sync with database
    try {
      const { data, error } = await supabase
        .from('directory_files')
        .select('stats')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      const currentStats = data?.stats as any || { views: 0, likes: 0, downloads: 0 };
      const updatedStats = {
        ...currentStats,
        likes: newLikesCount
      };

      await supabase
        .from('directory_files')
        .update({ stats: updatedStats })
        .eq('id', id);
    } catch (err) {
      console.error("Failed to sync like status", err);
    }
  };

  const handleShare = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = new URL(window.location.href);
    url.searchParams.set("item", id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url.toString());
    }
    toast.success(`Link for "${title}" copied to clipboard!`);
  };

  const filtered = useMemo(() => {
    const now = new Date();
    const cutoffDays = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : 10000;
    
    // Choose base items based on whether we are viewing liked items
    const baseItems = viewingLiked ? items.filter((it) => it.likedByUser) : items;

    // Filter by type
    const byTab = baseItems.filter((it) => {
      if (viewingLiked) {
        return likedFilter === "all" ? true : it.type === likedFilter;
      } else {
        return it.type === activeTab;
      }
    });

    const byDate = byTab.filter((it) => {
      if (viewingLiked || dateFilter === "all") return true;
      const d = new Date(it.uploadDate);
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= cutoffDays;
    });

    const byCategoryAndLikes = byDate.filter((it) => {
      if (filterCategory !== "all" && !(it.tags || []).some(t => t.toLowerCase() === filterCategory.toLowerCase())) return false;
      if (filterMinLikes && it.likes < parseInt(filterMinLikes)) return false;
      if (filterMaxLikes && it.likes > parseInt(filterMaxLikes)) return false;
      return true;
    });

    const byQuery = byCategoryAndLikes.filter((it) => {
      const q = query.toLowerCase();
      return (
        it.title.toLowerCase().includes(q) ||
        (it.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });

    const sorted = [...byQuery].sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "date") return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      return b.id.localeCompare(a.id);
    });

    return sorted;
  }, [items, activeTab, query, sortBy, dateFilter, viewingLiked, likedFilter, filterCategory, filterMinLikes, filterMaxLikes]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetPaging() {
    setPage(1);
  }

  function handleTabChange(tab: DirType) {
    setActiveTab(tab);
    resetPaging();
  }

  // Handle Document Click (Requirement 3: Go inside and show in read mode)
  const handleOpenDocument = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setDocPageNum(0);
    setDocZoom(100);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setSelectedDoc(null);
    if (searchParams.has("item")) {
      setSearchParams(prev => {
        prev.delete("item");
        return prev;
      }, { replace: true });
    }
  };

  // React Query for caching directory files so it loads instantly when navigating back
  const { data: fetchedItems, isLoading: isQueryLoading } = useQuery({
    queryKey: ['directory_files'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      if (userId) setCurrentUserId(userId);

      const { data, error } = await supabase
        .from("directory_files")
        .select(`
          *,
          profiles:user_id (id, full_name, username)
        `)
        .order("created_at", { ascending: false });

      if (error && error.code !== '42P01') throw error;
      if (!data) return [];

      return data.map((item: any) => {
        const typeMap: Record<string, DirType> = {
          'image': 'images',
          'video': 'videos',
          'audio': 'audios',
          'document': 'documents'
        };
        
        const stats = item.stats as any || { likes: 0, views: 0, downloads: 0 };
        
        return {
          id: item.id,
          userId: item.profiles?.id || item.user_id,
          title: item.title,
          type: typeMap[item.file_type] || 'documents',
          username: item.profiles?.username || item.profiles?.full_name || 'unknown',
          uploadDate: new Date(item.created_at).toISOString().split('T')[0],
          likes: stats.likes || 0,
          likedByUser: false,
          tags: item.tags || [],
          description: undefined,
          coverUrl: (stats as any)?.coverUrl,
          thumbnailUrl: (stats as any)?.coverUrl || item.file_url,
          videoUrl: item.file_type === 'video' ? item.file_url : undefined,
          audioUrl: item.file_type === 'audio' ? item.file_url : undefined,
          fileUrl: item.file_url,
          outline: item.file_type === 'document' ? ['Document Preview'] : undefined,
          pages: item.file_type === 'document' ? [item.description || 'No content available for preview.'] : undefined
        } as DirItem;
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  useEffect(() => {
    if (fetchedItems) {
      setItems(fetchedItems);
      setLoading(false);
    }
  }, [fetchedItems]);

  useEffect(() => {
    const itemId = searchParams.get("item");
    if (itemId && items.length > 0) {
      const it = items.find(i => i.id === itemId);
      if (it) {
        if (it.type === "images" && selectedImage?.id !== it.id) setSelectedImage(it as ImageItem);
        else if (it.type === "videos" && selectedVideo?.id !== it.id) setSelectedVideo(it as VideoItem);
        else if (it.type === "documents" && selectedDoc?.id !== it.id) handleOpenDocument(it as DocumentItem);
      }
    }
  }, [searchParams, items]);

  return (
    <AppLayout>
      <div className="space-y-6 bg-yellow-50/50 dark:bg-background text-gray-900 dark:text-white min-h-screen p-4 -m-4 transition-colors duration-200">
        
        {/* Header - Upload button removed (Requirement 2) */}
        <div className="bg-white dark:bg-background p-6 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                {viewingLiked ? (
                  <>
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                    <span>Liked Assets Library</span>
                  </>
                ) : (
                  "Asset Directory"
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {viewingLiked 
                  ? "Browse all the creative files and media references you have favorited." 
                  : "Explore creative reference media, conceptual breakdowns, documents, scripts, and foley."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search assets..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); resetPaging(); }}
                  className="pl-9 h-9 border-gray-300 dark:border-yellow-900/40 rounded-lg focus:border-yellow-500 focus:ring-yellow-500 bg-white dark:bg-background text-gray-900 dark:text-white text-sm w-full"
                />
              </div>

              {/* Dropdown filter for category when viewing liked */}
              {viewingLiked && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Filter:</span>
                  <select
                    value={likedFilter}
                    onChange={(e) => { setLikedFilter(e.target.value as "all" | DirType); resetPaging(); }}
                    className="px-3 py-1 border border-gray-300 dark:border-yellow-900/40 rounded-lg text-xs bg-white dark:bg-background text-gray-900 dark:text-white focus:border-yellow-500 focus:ring-yellow-500 h-9 font-medium"
                  >
                    <option value="all">All Liked</option>
                    <option value="images">Images</option>
                    <option value="videos">Videos</option>
                    <option value="documents">Documents</option>
                    <option value="audios">Audios</option>
                  </select>
                </div>
              )}

              {/* View Liked Button */}
              <Button
                variant={viewingLiked ? "default" : "outline"}
                onClick={() => {
                  setViewingLiked(!viewingLiked);
                  resetPaging();
                }}
                className={`h-9 font-bold text-xs gap-1.5 transition-all duration-200 shrink-0 ${
                  viewingLiked 
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-sm" 
                    : "border-gray-300 dark:border-yellow-900/40 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 bg-white dark:bg-background"
                }`}
              >
                <Heart className={`w-4 h-4 ${viewingLiked ? "fill-current" : ""}`} />
                {viewingLiked ? "Back to All" : "View Liked"}
              </Button>
            </div>
          </div>
        </div>
        {/* Tabs - Only displayed if not viewing liked items */}
        {!viewingLiked && (
          <div className="bg-white dark:bg-background rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40 overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 px-4 scrollbar-none overflow-x-auto">
              <div className="flex">
                {[
                  { id: "images", label: "Images", icon: ImageIcon },
                  { id: "videos", label: "Videos", icon: VideoIcon },
                  { id: "documents", label: "Documents", icon: FileText },
                  { id: "audios", label: "Audios", icon: Music },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as DirType)}
                    className={`px-5 py-4 border-b-2 font-medium transition-all flex items-center gap-2 text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-yellow-600 text-yellow-600 dark:text-yellow-400 dark:border-yellow-500"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center ml-4 my-2 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setSidebarOpen(true)}
                  className="mr-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 font-bold h-9 text-xs shadow-sm"
                >
                  <Filter className="w-3.5 h-3.5 mr-1.5" /> Filter
                </Button>
                <Button
                  onClick={() => setShowAddFileDialog(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold h-9 text-xs px-4 shadow-sm transition-colors"
                >
                  Add Files
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Grid Area */}
        <div className="min-h-[400px]">
          {pageItems.length === 0 ? (
            <div className="bg-white dark:bg-background rounded-lg border border-yellow-100 dark:border-yellow-900/40 p-12 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">No assets found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                {viewingLiked 
                  ? "You haven't liked any assets in this category yet. Click the heart icon on any asset to add it here!"
                  : "No items match your query or category filter. Try clearing your filters or changing search query."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pageItems.map((it) => (
                <Card 
                  key={it.id} 
                  className="group overflow-hidden bg-white dark:bg-background border border-gray-200 dark:border-gray-850 hover:border-yellow-500 dark:hover:border-yellow-500 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 relative cursor-pointer"
                  onClick={() => {
                    setSearchParams(prev => {
                      prev.set("item", it.id);
                      return prev;
                    });
                  }}
                >
                  {/* Media container */}
                  <div className="relative w-full h-[180px] overflow-hidden bg-gray-50 dark:bg-background flex flex-col justify-center">
                    
                    {/* Top Right Corner Controls (Requirement 2: Share and Likes overlay) */}
                    <div 
                      className="absolute top-3 right-3 z-20 flex items-center gap-2" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Share Button */}
                      <button 
                        onClick={(e) => handleShare(it.id, it.title, e)}
                        className="p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white hover:text-yellow-400 transition-colors duration-200 shadow-sm"
                        title="Share link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Likes Interactive Button */}
                      <button 
                        onClick={(e) => handleLikeToggle(it.id, e)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/85 text-white transition-colors duration-200 shadow-sm"
                      >
                        <Heart 
                          className={`w-3.5 h-3.5 transition-all transform hover:scale-125 ${
                            it.likedByUser 
                              ? "fill-red-500 text-red-500 scale-110" 
                              : "text-gray-200 hover:text-red-400"
                          }`} 
                        />
                        <span className="text-xs font-bold text-gray-100">{it.likes}</span>
                      </button>
                    </div>

                    {/* Image format (Requirement 1: Just image + bottom overlay) */}
                    {it.type === "images" && (
                      <img 
                        src={(it as ImageItem).thumbnailUrl} 
                        alt={it.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}

                    {/* Video format (Requirement 1: Just video thumbnail with interactive play overlay) */}
                    {it.type === "videos" && (
                      <div className="w-full h-full relative">
                        {(it as any).coverUrl ? (
                          <img src={(it as any).coverUrl} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full relative pointer-events-none">
                            <ReactPlayer 
                              url={(it as VideoItem).videoUrl} 
                              width="100%" 
                              height="100%"
                              light={true}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-yellow-500/90 dark:bg-yellow-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Document format (Requirement 1: Visual thumb with no download icon!) */}
                    {it.type === "documents" && (
                      <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-50/70 to-orange-50/70 dark:from-yellow-950/25 dark:to-orange-950/15 overflow-hidden">
                        {(it as any).coverUrl ? (
                          <img 
                            src={(it as any).coverUrl} 
                            alt={it.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                          />
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform duration-300">
                              <FileText className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-extrabold text-yellow-700 dark:text-yellow-400 uppercase tracking-widest bg-yellow-100/50 dark:bg-yellow-950/40 px-3 py-1 rounded-full border border-yellow-200/40 dark:border-yellow-900/30 mb-1 z-10">
                              {(it as DocumentItem).ext} Document
                            </span>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 text-center max-w-[160px] truncate z-10">
                              Click to enter reader
                            </span>
                          </>
                        )}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Audio format (Requirement 1: Custom sleek card with player controls in media frame) */}
                    {it.type === "audios" && (
                      <div className="w-full h-full relative flex flex-col justify-between p-5 bg-gradient-to-br from-yellow-50/80 to-amber-50/60 dark:from-yellow-950/30 dark:to-amber-950/15 overflow-hidden">
                        {(it as any).coverUrl && (
                          <img 
                            src={(it as any).coverUrl} 
                            alt={it.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
                          />
                        )}
                        <div className="flex items-center gap-3 z-10">
                          <div className="w-12 h-12 rounded-xl bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shadow-sm backdrop-blur-md">
                            <Music className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-black text-yellow-700 dark:text-yellow-400 tracking-widest drop-shadow-sm">
                              Audio Sequence
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-700 dark:text-gray-300 font-medium">
                              <Volume2 className="w-3.5 h-3.5" /> Direct Play
                            </div>
                          </div>
                        </div>

                        {/* Interactive Waveform Audio bar inside card */}
                        <div className="py-2 z-10" onClick={(e) => e.stopPropagation()}>
                          <audio 
                            src={(it as AudioItem).audioUrl} 
                            controls 
                            className="w-full h-8 accent-yellow-500 dark:accent-yellow-600 rounded opacity-90 hover:opacity-100 transition-opacity" 
                          />
                        </div>

                        <div className="text-[10px] text-gray-600 dark:text-gray-300 italic text-center font-medium z-10">
                          Shared reference loop
                        </div>
                      </div>
                    )}

                    {/* Elegant overlay on the bottom (Requirement 2: Name, username . category, date at right end) */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-4 flex flex-col justify-end text-white select-none">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm tracking-tight text-white line-clamp-1 truncate pr-2">
                          {it.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-300 mt-1">
                        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                          <span 
                            className="font-semibold text-yellow-400 truncate hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if ((it as any).userId) {
                                navigate(`/profile/${(it as any).userId}`);
                              } else {
                                navigate(`/profile?u=${encodeURIComponent(it.username)}`);
                              }
                            }}
                          >
                            {it.username}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-400 shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{it.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Section (Requirement 5: 12 per page) */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-background p-4 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40 flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Showing page <b>{page}</b> of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1} 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:!text-yellow-600 dark:hover:!text-yellow-400 hover:!bg-yellow-50 dark:hover:!bg-yellow-950/20 h-8 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              
              {/* Individual page numbers */}
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 p-0 text-xs font-semibold ${
                    page === pageNum
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                      : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:!text-yellow-600 dark:hover:!text-yellow-400"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}

              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= totalPages} 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:!text-yellow-600 dark:hover:!text-yellow-400 hover:!bg-yellow-50 dark:hover:!bg-yellow-950/20 h-8 text-xs font-semibold"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Overlay Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-pointer"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest block">Image Reference</span>
                  <h3 className="text-sm font-semibold text-white">{selectedImage.title}</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Image Content */}
              <div className="w-full bg-black relative flex items-center justify-center p-4">
                <img 
                  src={selectedImage.thumbnailUrl} 
                  alt={selectedImage.title} 
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>

              {/* Footer stats */}
              <div className="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>{selectedImage.likes} likes</span>
                  </div>
                  <span>Uploaded: {selectedImage.uploadDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(selectedImage.tags || []).map((tag, i) => (
                    <span key={i} className="text-[10px] text-gray-500">#{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Player Overlay Modal (Requirement 2) */}
      <AnimatePresence>
        {selectedVideo && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest block">Cinematic Reference</span>
                  <h3 className="text-sm font-semibold text-white">{selectedVideo.title}</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Video Player */}
              <div className="aspect-[16/9] w-full bg-black relative flex items-center justify-center">
                <ReactPlayer 
                  url={selectedVideo.videoUrl} 
                  controls 
                  playing
                  width="100%"
                  height="100%"
                  className="react-player-wrapper max-h-[70vh]"
                  style={{ maxHeight: '70vh' }}
                />
              </div>

              {/* Footer stats */}
              <div className="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>{selectedVideo.likes} likes</span>
                  </div>
                  <span>Uploaded: {selectedVideo.uploadDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(selectedVideo.tags || []).map((tag, i) => (
                    <span key={i} className="text-[10px] text-gray-500">#{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Reader Overlay Modal (Requirement 3: Show Document in read mode) */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full max-w-6xl h-[90vh] bg-white dark:bg-background rounded-2xl border border-gray-200 dark:border-gray-850 shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              
              {/* Left Sidebar - Outline & Document Specs */}
              <div className="w-full md:w-64 bg-gray-50 dark:bg-background border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between shrink-0">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-widest font-black">Reader Hub</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                      {selectedDoc.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Draft version of production asset.
                    </p>
                  </div>

                  {/* Table of contents / Outline */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Document Outline</span>
                    <div className="space-y-1">
                      {selectedDoc.outline.map((o, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDocPageNum(idx)}
                          className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition-colors truncate block ${
                            docPageNum === idx
                              ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Theme Selector inside sidebar */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Page Style</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "sepia", label: "Sepia", bg: "bg-amber-50 text-amber-900 border-amber-200" },
                      { id: "light", label: "Paper", bg: "bg-white text-gray-900 border-gray-200" },
                      { id: "night", label: "Night", bg: "bg-gray-950 text-gray-100 border-gray-800" },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setReaderTheme(theme.id as "sepia" | "light" | "night")}
                        className={`text-[11px] py-1 px-1.5 rounded border text-center transition-all ${theme.bg} ${
                          readerTheme === theme.id ? "ring-2 ring-yellow-500 font-bold" : "opacity-75 hover:opacity-100"
                        }`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Reading Canvas */}
              <div className="flex-1 flex flex-col justify-between overflow-hidden bg-gray-100 dark:bg-background">
                
                {/* Top Control Bar */}
                <div className="h-14 px-6 bg-white dark:bg-background border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={docZoom <= 60} 
                        onClick={() => setDocZoom(z => Math.max(60, z - 10))}
                        className="w-8 h-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 min-w-[40px] text-center">
                        {docZoom}%
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={docZoom >= 160} 
                        onClick={() => setDocZoom(z => Math.min(160, z + 10))}
                        className="w-8 h-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Page Status indicator */}
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Document Viewer
                  </span>

                  <Button
                    onClick={closeModal}
                    className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold text-xs h-8 px-3"
                  >
                    Close Reader
                  </Button>
                </div>

                {/* Interactive Paper Page */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center h-full">
                  <div 
                    style={{ fontSize: `${(docZoom / 100) * 0.875}rem` }}
                    className={`w-full max-w-4xl min-h-[500px] h-full rounded-xl shadow-lg border overflow-hidden transition-all duration-300 ${
                      readerTheme === "sepia" 
                        ? "bg-amber-50/90 text-amber-900 border-amber-200/60" 
                        : readerTheme === "night"
                        ? "bg-gray-950 text-gray-100 border-gray-800"
                        : "bg-white text-gray-900 border-gray-200"
                    }`}
                  >
                    <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent((selectedDoc as DocumentItem).fileUrl || (selectedDoc as DocumentItem).url || "")}&embedded=true`} className="w-full h-full bg-white" title="Document Preview" />
                  </div>
                </div>

                {/* Document Viewer */}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AddFileDialog 
        open={showAddFileDialog} 
        onOpenChange={setShowAddFileDialog} 
        userId={currentUserId}
        onUploadSuccess={() => {
          // Re-fetch items on success without reloading
          queryClient.invalidateQueries({ queryKey: ['directory_files'] });
        }} 
      />

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white sm:max-w-md w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Filter className="w-5 h-5 text-yellow-500" />
              Filters & Sort
            </SheetTitle>
          </SheetHeader>
          <div className="mt-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Category</Label>
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); resetPaging(); }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Likes Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filterMinLikes}
                  onChange={(e) => { setFilterMinLikes(e.target.value); resetPaging(); }}
                  className="bg-background border-input"
                />
                <span className="text-sm text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filterMaxLikes}
                  onChange={(e) => { setFilterMaxLikes(e.target.value); resetPaging(); }}
                  className="bg-background border-input"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Sort By</Label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as "recent" | "likes" | "date"); resetPaging(); }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
              >
                <option value="recent">Recent</option>
                <option value="likes">Most Liked</option>
                <option value="date">Upload Date</option>
              </select>
            </div>

            <Button 
              onClick={() => {
                setFilterCategory("all");
                setFilterMinLikes("");
                setFilterMaxLikes("");
                setSortBy("recent");
                resetPaging();
              }}
              variant="outline" 
              className="w-full mt-4"
            >
              Clear Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
