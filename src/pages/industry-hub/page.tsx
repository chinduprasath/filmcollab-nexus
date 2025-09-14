"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Search, Filter, MapPin, Calendar, Clock, Users, Heart, Share2, Plus, Eye, UserPlus, 
  ExternalLink, ChevronDown, ChevronUp, X, Film, Video, Music, Camera, Mic, Palette, 
  Scissors, Building2, Star, TrendingUp, CheckCircle, Play, Pause, Award, Target, Zap, 
  Bookmark, Edit, Monitor, Gamepad2, Headphones, Smartphone, Globe, Briefcase, 
  BarChart3, Users2, FileText, ArrowLeft, ChevronRight
} from "lucide-react";

interface News {
  id: number;
  title: string;
  description: string;
  createdDate: string;
  createdBy: string;
  image?: string;
  category: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  isOnline: boolean;
  createdBy: string;
  attendees: number;
  price: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  createdBy: string;
  price: string;
  enrolled: number;
  level: string;
  category: string;
}

export default function IndustryHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [showCreateNews, setShowCreateNews] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateCourse, setShowCreateCourse] = useState(false);

  const sampleNews: News[] = [
    { 
      id: 1, 
      title: "New AI Technology Revolutionizes Film Editing", 
      description: "Latest developments in AI-powered editing tools are transforming how filmmakers approach post-production workflows.", 
      createdDate: "2024-12-10", 
      createdBy: "Sarah Johnson",
      category: "Technology"
    },
    { 
      id: 2, 
      title: "Streaming Platforms Invest in Regional Content", 
      description: "Major streaming services announce increased investment in regional and diverse content creation.", 
      createdDate: "2024-12-09", 
      createdBy: "Michael Chen",
      category: "Industry"
    },
    { 
      id: 3, 
      title: "Virtual Production Gains Popularity in India", 
      description: "Indian filmmakers are increasingly adopting virtual production techniques for cost-effective filmmaking.", 
      createdDate: "2024-12-08", 
      createdBy: "David Kim",
      category: "Production"
    },
    { 
      id: 4, 
      title: "Digital Marketing Trends in Film Industry", 
      description: "How social media and digital platforms are reshaping film promotion and audience engagement strategies.", 
      createdDate: "2024-12-07", 
      createdBy: "Priya Sharma",
      category: "Marketing"
    }
  ];

  const sampleEvents: Event[] = [
    { 
      id: 1, 
      title: "Film Industry Networking Meet", 
      description: "Join industry professionals for an evening of networking and collaboration opportunities.", 
      date: "2024-12-20", 
      location: "Mumbai, India", 
      isOnline: false, 
      createdBy: "Film Producers Guild",
      attendees: 45,
      price: "₹500"
    },
    { 
      id: 2, 
      title: "Digital Content Creation Workshop", 
      description: "Learn the latest techniques in digital content creation and social media marketing.", 
      date: "2024-12-25", 
      location: "Online", 
      isOnline: true, 
      createdBy: "Digital Creators Hub",
      attendees: 120,
      price: "₹1,000"
    },
    { 
      id: 3, 
      title: "VFX Masterclass", 
      description: "Advanced VFX techniques and industry insights from leading professionals.", 
      date: "2024-12-30", 
      location: "Bangalore, India", 
      isOnline: false, 
      createdBy: "VFX Society",
      attendees: 30,
      price: "₹2,500"
    },
    { 
      id: 4, 
      title: "Screenwriting Workshop", 
      description: "Master the art of storytelling and script development with industry experts.", 
      date: "2025-01-05", 
      location: "Delhi, India", 
      isOnline: false, 
      createdBy: "Screenwriters Association",
      attendees: 25,
      price: "₹3,000"
    }
  ];

  const sampleCourses: Course[] = [
    { 
      id: 1, 
      title: "Advanced Cinematography", 
      description: "Master the art of cinematography with hands-on training and industry insights.", 
      duration: "8 weeks", 
      instructor: "Rajesh Kumar", 
      createdBy: "Film Academy India",
      price: "₹15,000",
      enrolled: 85,
      level: "Advanced",
      category: "Cinematography"
    },
    { 
      id: 2, 
      title: "Screenwriting Fundamentals", 
      description: "Learn the basics of screenwriting and storytelling for film and television.", 
      duration: "6 weeks", 
      instructor: "Priya Sharma", 
      createdBy: "Creative Writing Institute",
      price: "₹8,000",
      enrolled: 120,
      level: "Beginner",
      category: "Writing"
    },
    { 
      id: 3, 
      title: "Digital Marketing for Filmmakers", 
      description: "Essential digital marketing strategies for promoting films and building audience.", 
      duration: "4 weeks", 
      instructor: "Amit Patel", 
      createdBy: "Digital Marketing Pro",
      price: "₹6,000",
      enrolled: 95,
      level: "Intermediate",
      category: "Marketing"
    },
    { 
      id: 4, 
      title: "Film Production Management", 
      description: "Comprehensive course on managing film productions from pre to post-production.", 
      duration: "10 weeks", 
      instructor: "Deepak Verma", 
      createdBy: "Production Management Institute",
      price: "₹20,000",
      enrolled: 45,
      level: "Advanced",
      category: "Production"
    }
  ];

  const filteredNews = sampleNews.filter(news =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = sampleEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = sampleCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-4 bg-gray-50 min-h-screen p-4 -m-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Industry Hub</h1>
            <p className="text-gray-600 text-sm">
              Stay updated with industry news, events, and educational opportunities
            </p>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateNews(true)}
              className="h-9 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create News
            </Button>
          </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200 px-4">
          {[
            { id: "news", label: "Industry News & Insights", count: filteredNews.length },
            { id: "events", label: "Events", count: filteredEvents.length },
            { id: "courses", label: "Courses", count: filteredCourses.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 border-b-2 font-medium transition-colors relative flex items-center text-sm ${
                activeTab === tab.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 min-h-[500px]">
          {/* Industry News & Insights Tab */}
          {activeTab === "news" && (
            <div className="space-y-4">
              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNews.map((news) => (
                    <Card key={news.id} className="hover:shadow-lg transition-shadow border-gray-200 rounded-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 rounded-md px-1.5 py-0.5 text-xs">
                            {news.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                          {news.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-600 line-clamp-3 mt-1">
                          {news.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{news.createdDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserPlus className="w-3 h-3" />
                            <span>By {news.createdBy}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No news found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try adjusting your search terms" : "Be the first to share industry insights and news"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setShowCreateNews(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First News
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={event.isOnline ? "default" : "secondary"}>
                            {event.isOnline ? "Online" : "In-Person"}
                          </Badge>
                          <Badge variant="outline">{event.price}</Badge>
                        </div>
                        <CardTitle className="text-base line-clamp-2">{event.title}</CardTitle>
                        <CardDescription className="text-xs line-clamp-3">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{event.attendees} attending</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <UserPlus className="w-3 h-3" />
                              <span>By {event.createdBy}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try adjusting your search terms" : "Be the first to create an industry event"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setShowCreateEvent(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Event
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{course.level}</Badge>
                          <Badge variant="secondary">{course.category}</Badge>
                        </div>
                        <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="text-xs line-clamp-3">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{course.enrolled} enrolled</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <UserPlus className="w-3 h-3" />
                              <span>By {course.createdBy}</span>
                            </div>
                            <span className="font-semibold text-primary text-xs">{course.price}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <UserPlus className="w-3 h-3" />
                            <span>Instructor: {course.instructor}</span>
                          </div>
                          <Button size="sm" className="w-full mt-2 text-xs h-8">
                            Register Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try adjusting your search terms" : "Be the first to create an industry course"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setShowCreateCourse(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Course
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create News Popup */}
        {showCreateNews && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Create News & Insights</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreateNews(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Title *</label>
                    <Input placeholder="Enter news title" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Category *</label>
                    <select className="w-full px-2 py-1 border border-border rounded-md text-xs bg-background h-8">
                      <option>Select Category</option>
                      <option>Technology</option>
                      <option>Industry</option>
                      <option>Production</option>
                      <option>Marketing</option>
                      <option>Events</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Description *</label>
                    <textarea 
                      className="w-full px-2 py-1 border border-border rounded-md text-xs bg-background min-h-[80px]"
                      placeholder="Enter news description..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 h-8 text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Create News
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateNews(false)} className="h-8 text-xs">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Event Popup */}
        {showCreateEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Create Event</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreateEvent(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Title *</label>
                    <Input placeholder="Enter event title" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date *</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price *</label>
                      <Input placeholder="e.g., ₹500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location *</label>
                    <Input placeholder="Enter location or 'Online'" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Type</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background">
                      <option>In-Person</option>
                      <option>Online</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description *</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background min-h-[100px]"
                      placeholder="Enter event description..."
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Course Popup */}
        {showCreateCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Create Course</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreateCourse(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Course Title *</label>
                    <Input placeholder="Enter course title" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration *</label>
                      <Input placeholder="e.g., 8 weeks" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price *</label>
                      <Input placeholder="e.g., ₹15,000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Level *</label>
                      <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background">
                        <option>Select Level</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category *</label>
                      <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background">
                        <option>Select Category</option>
                        <option>Cinematography</option>
                        <option>Writing</option>
                        <option>Marketing</option>
                        <option>Production</option>
                        <option>Editing</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instructor *</label>
                    <Input placeholder="Enter instructor name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description *</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background min-h-[100px]"
                      placeholder="Enter course description..."
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateCourse(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
