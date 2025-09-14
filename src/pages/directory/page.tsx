"use client";

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Music,
  Calendar,
  User as UserIcon,
  Download,
  Share2,
  Eye,
  Play,
} from "lucide-react";

type DirType = "images" | "videos" | "documents" | "audios";

interface BaseItem {
  id: string;
  title: string;
  username: string;
  uploadDate: string; // YYYY-MM-DD
  views: number;
  tags?: string[];
}

interface ImageItem extends BaseItem {
  type: "images";
  thumbnailUrl: string;
}

interface VideoItem extends BaseItem {
  type: "videos";
  thumbnailUrl: string;
  videoUrl: string;
}

interface DocumentItem extends BaseItem {
  type: "documents";
  fileUrl: string;
  ext: string;
}

interface AudioItem extends BaseItem {
  type: "audios";
  audioUrl: string;
}

type DirItem = ImageItem | VideoItem | DocumentItem | AudioItem;

const initialItems: DirItem[] = [
  { id: "i1", type: "images", title: "Behind the Scenes", username: "Sarah", uploadDate: "2024-12-10", views: 240, tags: ["bts"], thumbnailUrl: "/placeholder/640x360.png" },
  { id: "i2", type: "images", title: "Location Scout", username: "Raj", uploadDate: "2024-12-05", views: 180, thumbnailUrl: "/placeholder/640x360.png" },
  { id: "v1", type: "videos", title: "Lighting Breakdown", username: "Amelia", uploadDate: "2024-12-08", views: 520, thumbnailUrl: "/placeholder/640x360.png", videoUrl: "/placeholder/640x360.mp4" },
  { id: "d1", type: "documents", title: "Final Script.pdf", username: "Alex", uploadDate: "2024-11-30", views: 98, fileUrl: "/placeholder/script.pdf", ext: "pdf" },
  { id: "a1", type: "audios", title: "Theme Track (Demo)", username: "Priya", uploadDate: "2024-12-01", views: 305, audioUrl: "/placeholder/audio.mp3" },
];

export default function DirectoryPage() {
  const [activeTab, setActiveTab] = useState<DirType>("images");
  const [items, setItems] = useState<DirItem[]>(initialItems);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "viewed" | "date">("recent");
  const [dateFilter, setDateFilter] = useState<"all" | "7d" | "30d">("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [showUpload, setShowUpload] = useState(false);

  const filtered = useMemo(() => {
    const now = new Date();
    const cutoffDays = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : 10000;
    const byTab = items.filter((it) => it.type === activeTab);
    const byDate = byTab.filter((it) => {
      if (dateFilter === "all") return true;
      const d = new Date(it.uploadDate);
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= cutoffDays;
    });
    const byQuery = byDate.filter((it) => {
      const q = query.toLowerCase();
      return (
        it.title.toLowerCase().includes(q) ||
        it.username.toLowerCase().includes(q) ||
        (it.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
    const sorted = [...byQuery].sort((a, b) => {
      if (sortBy === "viewed") return b.views - a.views;
      if (sortBy === "date") return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      // recent: keep as-is (assuming items list roughly recent-first in this demo)
      return 0;
    });
    return sorted;
  }, [items, activeTab, query, sortBy, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetPaging() {
    setPage(1);
  }

  function handleTabChange(tab: DirType) {
    setActiveTab(tab);
    resetPaging();
  }

  // Upload modal state
  const [upType, setUpType] = useState<DirType>("images");
  const [upTitle, setUpTitle] = useState("");
  const [upDesc, setUpDesc] = useState("");
  const [upTags, setUpTags] = useState("");
  const [upUrl, setUpUrl] = useState("");

  const canUpload = upTitle.trim().length > 0 && upUrl.trim().length > 0;

  function handleUpload() {
    if (!canUpload) return;
    const base: BaseItem = {
      id: String(Date.now()),
      title: upTitle,
      username: "You",
      uploadDate: new Date().toISOString().slice(0, 10),
      views: 0,
      tags: upTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    let newItem: DirItem;
    if (upType === "images") {
      newItem = { ...(base as any), type: "images", thumbnailUrl: upUrl } as ImageItem;
    } else if (upType === "videos") {
      newItem = { ...(base as any), type: "videos", thumbnailUrl: "/placeholder/640x360.png", videoUrl: upUrl } as VideoItem;
    } else if (upType === "documents") {
      const ext = upUrl.split(".").pop() || "doc";
      newItem = { ...(base as any), type: "documents", fileUrl: upUrl, ext } as DocumentItem;
    } else {
      newItem = { ...(base as any), type: "audios", audioUrl: upUrl } as AudioItem;
    }
    setItems([newItem, ...items]);
    setShowUpload(false);
    setUpTitle("");
    setUpDesc("");
    setUpTags("");
    setUpUrl("");
    setUpType("images");
  }

  return (
    <AppLayout>
      <div className="space-y-4 bg-gray-50 min-h-screen p-4 -m-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Directory</h1>
              <p className="text-gray-600 text-sm">
                Browse and share images, videos, documents, and audio
              </p>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by title, username, or tags"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); resetPaging(); }}
                  className="pl-9 h-9 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 text-sm"
                />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value as any); resetPaging(); }}
                className="px-2 py-1 border border-gray-300 rounded-lg text-xs bg-white focus:border-purple-500 focus:ring-purple-500 h-8"
              >
                <option value="all">All Dates</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as any); resetPaging(); }}
                className="px-2 py-1 border border-gray-300 rounded-lg text-xs bg-white focus:border-purple-500 focus:ring-purple-500 h-8"
              >
                <option value="recent">Most Recent</option>
                <option value="viewed">Most Viewed</option>
                <option value="date">Upload Date</option>
              </select>
              <Button 
                onClick={() => setShowUpload(true)}
                className="h-9 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200 px-4">
            {[
              { id: "images", label: "Images", icon: ImageIcon },
              { id: "videos", label: "Videos", icon: VideoIcon },
              { id: "documents", label: "Documents", icon: FileText },
              { id: "audios", label: "Audios", icon: Music },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as DirType)}
                className={`px-4 py-3 border-b-2 font-medium transition-colors flex items-center gap-1 text-sm ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {pageItems.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold mb-1 text-gray-900">No items found in this category</h3>
              <p className="text-gray-600 text-sm">Be the first to upload!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pageItems.map((it) => (
                <Card key={it.id} className="hover:shadow-lg transition-shadow overflow-hidden border-gray-200 rounded-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm line-clamp-1 text-gray-900">{it.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {it.username}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {it.uploadDate}</span>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">{it.views} views</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {it.type === "images" && (
                      <div className="rounded-md overflow-hidden border border-gray-200">
                        <img src={(it as ImageItem).thumbnailUrl} alt={it.title} className="w-full object-cover" />
                      </div>
                    )}
                    {it.type === "videos" && (
                      <div className="rounded-md overflow-hidden border border-gray-200 relative">
                        <img src={(it as VideoItem).thumbnailUrl} alt={it.title} className="w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white drop-shadow" />
                        </div>
                      </div>
                    )}
                    {it.type === "documents" && (
                      <div className="rounded-md overflow-hidden border border-gray-200 flex items-center justify-center h-32">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    {it.type === "audios" && (
                      <div className="rounded-md overflow-hidden border border-gray-200 p-2">
                        <audio src={(it as AudioItem).audioUrl} controls className="w-full" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {(it.tags || []).slice(0, 3).map((t, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">#{t}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-7 px-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                          {it.type === "videos" ? <Play className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 text-xs">Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 text-xs">Next</Button>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Upload Content</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)} className="text-gray-600 hover:text-gray-900 text-xs">Close</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Title *</label>
                    <Input value={upTitle} onChange={(e) => setUpTitle(e.target.value)} placeholder="Enter title" className="border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Type *</label>
                    <select
                      value={upType}
                      onChange={(e) => setUpType(e.target.value as DirType)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs bg-white focus:border-purple-500 focus:ring-purple-500 h-8"
                    >
                      <option value="images">Image</option>
                      <option value="videos">Video</option>
                      <option value="documents">Document</option>
                      <option value="audios">Audio</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Description</label>
                  <textarea
                    value={upDesc}
                    onChange={(e) => setUpDesc(e.target.value)}
                    placeholder="Add a short description"
                    className="w-full min-h-[60px] border border-gray-300 rounded-lg bg-white px-2 py-1 text-xs resize-y focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Tags (comma separated)</label>
                    <Input value={upTags} onChange={(e) => setUpTags(e.target.value)} placeholder="e.g., bts, promo, soundtrack" className="border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">URL *</label>
                    <Input value={upUrl} onChange={(e) => setUpUrl(e.target.value)} placeholder="Paste file URL (image/video/doc/audio)" className="border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 h-8 text-xs" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button variant="outline" onClick={() => setShowUpload(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 text-xs">Cancel</Button>
                  <Button disabled={!canUpload} onClick={handleUpload} className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">Upload</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
