"use client";

import React, { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  AtSign,
  Hash,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Search,
  Filter,
  Clock,
  Flame,
  Users,
} from "lucide-react";

type MediaType = "none" | "image" | "video";

interface PostComment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies?: PostComment[];
}

interface PostItem {
  id: string;
  user: string;
  avatar: string;
  timestamp: string;
  content: string;
  hashtags?: string[];
  mediaType?: MediaType;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  saved?: boolean;
  network?: boolean;
  commentsThread?: PostComment[];
}

const samplePosts: PostItem[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    avatar: "SJ",
    timestamp: "2h",
    content: "Wrapped the final cut today! Huge thanks to the amazing crew. #postproduction #editing",
    hashtags: ["postproduction", "editing"],
    mediaType: "image",
    mediaUrl: "/placeholder/800x450.png",
    likes: 128,
    comments: 14,
    shares: 7,
    saved: false,
    network: true,
    commentsThread: [
      {
        id: "c1",
        user: "Michael Chen",
        avatar: "MC",
        content: "Congrats! The color looks fantastic.",
        timestamp: "1h",
        replies: [
          {
            id: "c1r1",
            user: "Sarah Johnson",
            avatar: "SJ",
            content: "Thanks Michael! Grading took a while but worth it.",
            timestamp: "55m",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    user: "Raj Patel",
    avatar: "RP",
    timestamp: "6h",
    content: "Casting call for our short film in Mumbai next week. DM if interested! #casting #shortfilm",
    hashtags: ["casting", "shortfilm"],
    mediaType: "none",
    likes: 64,
    comments: 9,
    shares: 3,
    saved: true,
    network: false,
  },
  {
    id: "3",
    user: "Amelia Brown",
    avatar: "AB",
    timestamp: "1d",
    content: "How we lit the rooftop scene using only practicals. Breakdown video below.",
    mediaType: "video",
    mediaUrl: "/placeholder/800x450.mp4",
    likes: 210,
    comments: 32,
    shares: 18,
    saved: false,
    network: true,
  },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<PostItem[]>(samplePosts);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "popular" | "network">("recent");
  const [composerText, setComposerText] = useState("");
  const [composerMediaType, setComposerMediaType] = useState<MediaType>("none");
  const [composerMediaUrl, setComposerMediaUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "published" | "saved">("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    let list = [...posts];
    // Tab filters
    if (activeTab === "trending") {
      list = list.filter((p) => p.likes + p.comments + p.shares >= 50);
    } else if (activeTab === "published") {
      list = list.filter((p) => p.network); // demo: treat network flag as "published by me/team"
    } else if (activeTab === "saved") {
      list = list.filter((p) => p.saved);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.content.toLowerCase().includes(q) || (p.hashtags || []).some((h) => `#${h}`.toLowerCase().includes(q))
      );
    }
    if (sort === "popular") {
      list.sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares));
    } else if (sort === "network") {
      list = list.filter((p) => p.network);
    } else {
      // recent: assume array order is recent first in this demo
    }
    return list;
  }, [posts, query, sort]);

  const canPost = composerText.trim().length > 0 || (composerMediaType !== "none" && composerMediaUrl.trim().length > 0);

  function handlePost() {
    if (!canPost) return;
    const newPost: PostItem = {
      id: String(Date.now()),
      user: "You",
      avatar: "YY",
      timestamp: "Just now",
      content: composerText,
      mediaType: composerMediaType,
      mediaUrl: composerMediaUrl || undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      saved: false,
      network: true,
      hashtags: (composerText.match(/#[\w-]+/g) || []).map((t) => t.replace('#', '')),
    };
    setPosts([newPost, ...posts]);
    setComposerText("");
    setComposerMediaType("none");
    setComposerMediaUrl("");
  }

  function toggleLike(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  }

  function toggleSave(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)));
  }

  return (
    <AppLayout>
      <div className="space-y-4 bg-gray-50 min-h-screen p-4 -m-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Posts</h1>
              <p className="text-gray-600 text-sm">
                Share updates, work-in-progress, and ideas with the community
              </p>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search posts or #hashtags"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 h-9 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 text-sm"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="px-2 py-1 border border-gray-300 rounded-lg text-xs bg-white focus:border-purple-500 focus:ring-purple-500 h-8"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="network">My Network</option>
              </select>
              <Button 
                onClick={() => setShowCreate(true)}
                className="h-9 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
              >
                Create Post
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200 px-4">
            {[
              { id: "all", label: "All Posts" },
              { id: "trending", label: "Trending Posts" },
              { id: "published", label: "Published Posts" },
              { id: "saved", label: "Saved Posts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 border-b-2 font-medium transition-colors text-sm ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold mb-1 text-gray-900">No posts yet</h3>
              <p className="text-gray-600 text-sm">Start by creating one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((post) => (
                <Card key={post.id} className="overflow-hidden border-gray-200 rounded-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-semibold text-xs">
                          {post.avatar}
                        </div>
                        <div>
                          <CardTitle className="text-sm text-gray-900">{post.user}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" /> {post.timestamp}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    {post.mediaType === "image" && post.mediaUrl && (
                      <div className="rounded-md overflow-hidden border border-gray-200">
                        <img src={post.mediaUrl} alt="post media" className="w-full object-cover" />
                      </div>
                    )}
                    {post.mediaType === "video" && post.mediaUrl && (
                      <div className="rounded-md overflow-hidden border border-gray-200">
                        <video src={post.mediaUrl} controls className="w-full" />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                      <div className="flex items-center gap-3 text-xs">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700" onClick={() => toggleLike(post.id)}>
                          <Heart className="w-3 h-3" /> Like
                        </button>
                        <a href="#" className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                          <MessageCircle className="w-3 h-3" /> Comment
                        </a>
                        <a href="#" className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                          <Share2 className="w-3 h-3" /> Share
                        </a>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700" onClick={() => toggleSave(post.id)}>
                          <Bookmark className={`w-3 h-3 ${post.saved ? 'fill-current text-purple-600' : ''}`} /> Save
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>

                  {/* Comments */}
                  {post.commentsThread && post.commentsThread.length > 0 && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">View comments</summary>
                      <div className="mt-2 space-y-2">
                        {post.commentsThread.map((c) => (
                          <div key={c.id} className="pl-0">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-semibold">
                                {c.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-medium">{c.user} <span className="ml-1 text-[10px] text-muted-foreground">{c.timestamp}</span></div>
                                <div className="text-xs">{c.content}</div>
                              </div>
                            </div>
                            {c.replies && c.replies.length > 0 && (
                              <div className="mt-1 pl-4 space-y-1">
                                {c.replies.map((r) => (
                                  <div key={r.id} className="flex items-start gap-1">
                                    <div className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[9px] font-semibold">
                                      {r.avatar}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-xs font-medium">{r.user} <span className="ml-1 text-[10px] text-muted-foreground">{r.timestamp}</span></div>
                                      <div className="text-xs">{r.content}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        {/* Reply box (static demo) */}
                        <div className="flex items-center gap-1">
                          <Input placeholder="Write a comment..." className="h-7 text-xs" />
                          <Button size="sm" variant="outline" className="h-7 text-xs">Reply</Button>
                        </div>
                      </div>
                    </details>
                  )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Create Post Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Create Post</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)} className="text-gray-600 hover:text-gray-900 text-xs">Cancel</Button>
                </div>
                <div className="space-y-2">
                  <textarea
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    placeholder="Write something... Use #hashtags and @mentions"
                    className="w-full min-h-[80px] border border-gray-300 rounded-lg bg-white px-2 py-1 text-xs resize-y focus:border-purple-500 focus:ring-purple-500"
                  />
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => setComposerMediaType("image")} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-7 text-xs">
                      <ImageIcon className="w-3 h-3 mr-1" /> Image URL
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setComposerMediaType("video")} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-7 text-xs">
                      <VideoIcon className="w-3 h-3 mr-1" /> Video URL
                    </Button>
                  </div>
                  {composerMediaType !== "none" && (
                    <Input
                      placeholder={composerMediaType === "image" ? "Paste image URL" : "Paste video URL"}
                      value={composerMediaUrl}
                      onChange={(e) => setComposerMediaUrl(e.target.value)}
                      className="border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 h-8 text-xs"
                    />
                  )}
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button variant="outline" onClick={() => { setComposerMediaType("none"); setComposerMediaUrl(""); setComposerText(""); setShowCreate(false); }} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 text-xs">Cancel</Button>
                  <Button disabled={!canPost} onClick={() => { handlePost(); setShowCreate(false); }} className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">Post</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


