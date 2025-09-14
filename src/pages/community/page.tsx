"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Search,
  Filter,
  Users,
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  MapPin,
  Calendar,
  Clock,
  Star,
  UserPlus,
  Building2,
  Camera,
  Mic,
  PenTool,
  Scissors,
  Music,
  Palette,
  TrendingUp,
  Award,
  Globe,
  Hash,
  Bookmark,
  Eye,
  ThumbsUp,
  MessageCircle,
  Send,
  Image,
  Video,
  FileText,
  Plus,
  Settings,
  Bell,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink
} from "lucide-react";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("groups");
  const [searchQuery, setSearchQuery] = useState("");

  const communityStats = [
    { number: "50K+", label: "Active Members" },
    { number: "1.2K+", label: "Groups" },
    { number: "15K+", label: "Discussions" },
    { number: "500+", label: "Events This Month" }
  ];

  const featuredMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Independent Filmmaker",
      avatar: "SJ",
      location: "Los Angeles, CA",
      skills: ["Directing", "Screenwriting", "Producing"],
      projects: 12,
      connections: 847,
      verified: true,
      online: true
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Cinematographer",
      avatar: "MC",
      location: "New York, NY",
      skills: ["Cinematography", "Lighting", "Camera Operation"],
      projects: 28,
      connections: 1234,
      verified: true,
      online: false
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Production Designer",
      avatar: "ER",
      location: "Atlanta, GA",
      skills: ["Set Design", "Art Direction", "Props"],
      projects: 19,
      connections: 567,
      verified: true,
      online: true
    },
    {
      id: 4,
      name: "David Kim",
      role: "Sound Designer",
      avatar: "DK",
      location: "Vancouver, BC",
      skills: ["Sound Design", "Audio Mixing", "Foley"],
      projects: 34,
      connections: 892,
      verified: true,
      online: false
    }
  ];

  const trendingGroups = [
    {
      id: 1,
      name: "Independent Filmmakers Network",
      description: "A community for independent filmmakers to share resources, collaborate, and support each other.",
      members: 2847,
      posts: 156,
      category: "Filmmaking",
      tags: ["independent", "filmmaking", "collaboration"]
    },
    {
      id: 2,
      name: "Women in Film",
      description: "Empowering women in the film industry through networking, mentorship, and advocacy.",
      members: 1892,
      posts: 89,
      category: "Networking",
      tags: ["women", "empowerment", "mentorship"]
    },
    {
      id: 3,
      name: "Documentary Filmmakers",
      description: "Connect with documentary filmmakers, share stories, and discuss the art of non-fiction storytelling.",
      members: 1245,
      posts: 203,
      category: "Documentary",
      tags: ["documentary", "storytelling", "non-fiction"]
    },
    {
      id: 4,
      name: "Film Students & Alumni",
      description: "Network with fellow film students and alumni from top film schools around the world.",
      members: 3421,
      posts: 267,
      category: "Education",
      tags: ["students", "alumni", "education"]
    }
  ];

  const recentDiscussions = [
    {
      id: 1,
      title: "Best practices for remote collaboration on film projects",
      author: "Alex Thompson",
      avatar: "AT",
      replies: 23,
      views: 156,
      likes: 45,
      time: "2 hours ago",
      tags: ["collaboration", "remote-work", "tips"]
    },
    {
      id: 2,
      title: "How to pitch your documentary to streaming platforms",
      author: "Maria Garcia",
      avatar: "MG",
      replies: 18,
      views: 89,
      likes: 32,
      time: "5 hours ago",
      tags: ["documentary", "pitching", "streaming"]
    },
    {
      id: 3,
      title: "Equipment recommendations for low-budget productions",
      author: "James Wilson",
      avatar: "JW",
      replies: 31,
      views: 234,
      likes: 67,
      time: "1 day ago",
      tags: ["equipment", "budget", "recommendations"]
    },
    {
      id: 4,
      title: "Building a strong portfolio as a cinematographer",
      author: "Lisa Park",
      avatar: "LP",
      replies: 15,
      views: 123,
      likes: 28,
      time: "2 days ago",
      tags: ["portfolio", "cinematography", "career"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Virtual Film Festival Networking",
      date: "Dec 15, 2024",
      time: "7:00 PM EST",
      type: "Virtual",
      attendees: 156,
      category: "Networking"
    },
    {
      id: 2,
      title: "Documentary Filmmaking Workshop",
      date: "Dec 18, 2024",
      time: "2:00 PM PST",
      type: "In-Person",
      location: "Los Angeles, CA",
      attendees: 45,
      category: "Workshop"
    },
    {
      id: 3,
      title: "Screenwriting Masterclass",
      date: "Dec 20, 2024",
      time: "6:00 PM EST",
      type: "Virtual",
      attendees: 89,
      category: "Education"
    },
    {
      id: 4,
      title: "Film Industry Meetup",
      date: "Dec 22, 2024",
      time: "8:00 PM PST",
      type: "In-Person",
      location: "New York, NY",
      attendees: 67,
      category: "Networking"
    }
  ];

  const roleIcons = {
    "Director": Camera,
    "Cinematographer": Camera,
    "Producer": Building2,
    "Writer": PenTool,
    "Editor": Scissors,
    "Composer": Music,
    "Designer": Palette,
    "Sound Designer": Mic
  };

  return (
    <AppLayout>
      <div className="space-y-4 bg-gray-50 min-h-screen p-4 -m-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Community</h1>
              <p className="text-gray-600 text-sm">
                Connect with film professionals, join groups, and participate in discussions
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="h-9 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                <Plus className="w-4 h-4 mr-1" />
                Create Group
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {communityStats.map((stat, index) => (
            <Card key={index} className="bg-white rounded-lg shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-purple-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search members, groups, or discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 text-sm"
              />
            </div>
            <Button variant="outline" className="h-9 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200 px-4">
            <button
              onClick={() => setActiveTab("groups")}
              className={`px-4 py-3 border-b-2 font-medium transition-colors text-sm ${
                activeTab === "groups"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab("discussions")}
              className={`px-4 py-3 border-b-2 font-medium transition-colors text-sm ${
                activeTab === "discussions"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Discussions
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-3 border-b-2 font-medium transition-colors text-sm ${
                activeTab === "events"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Events
            </button>
          </div>
        </div>

        {/* Tab Content */}

        {activeTab === "groups" && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Trending Groups</h2>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs h-8">
                  Browse All Groups
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {trendingGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow border-gray-200 rounded-lg">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm text-gray-900">{group.name}</CardTitle>
                          <CardDescription className="mt-1 text-gray-600 text-xs">
                            {group.description}
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {group.members.toLocaleString()} members
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {group.posts} posts
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {group.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-7 text-xs">
                          Join Group
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-7 w-7 p-0">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Discussions</h2>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Start Discussion
                </Button>
              </div>

              <div className="space-y-3">
                {recentDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-lg transition-shadow border-gray-200 rounded-lg">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {discussion.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold hover:text-purple-600 cursor-pointer text-gray-900 text-sm">
                              {discussion.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>by {discussion.author}</span>
                              <span>•</span>
                              <span>{discussion.time}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {discussion.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{discussion.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{discussion.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{discussion.likes}</span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-6 w-6 p-0">
                            <Heart className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-6 w-6 p-0">
                            <Share2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-6 w-6 p-0">
                            <Bookmark className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Create Event
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow border-gray-200 rounded-lg">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm text-gray-900">{event.title}</CardTitle>
                          <CardDescription className="mt-1 text-gray-600 text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <Calendar className="w-3 h-3" />
                              <span>{event.date} at {event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              <span>{event.type}</span>
                              {event.location && (
                                <>
                                  <span>•</span>
                                  <span>{event.location}</span>
                                </>
                              )}
                            </div>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                          {event.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-1 mb-3">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">
                          {event.attendees} attending
                        </span>
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-7 text-xs">
                          Attend Event
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-7 w-7 p-0">
                          <Bookmark className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-7 w-7 p-0">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
