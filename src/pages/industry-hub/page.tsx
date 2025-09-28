import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  UserPlus, 
  Share2, 
  Bookmark, 
  Edit, 
  X,
  FileText
} from "lucide-react";

interface News {
  id: number;
  title: string;
  description: string;
  category: string;
  createdDate: string;
  createdBy: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  isOnline: boolean;
  attendees: number;
  price: string;
  createdBy: string;
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
  const [activeTab, setActiveTab] = useState("news");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState("news");
  const [showNewsDetail, setShowNewsDetail] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [createdFilter, setCreatedFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const sampleNews: News[] = [
    {
      id: 1,
      title: "New Film Technology Revolutionizes Production",
      description: "Latest advancements in film technology are changing how movies are made, offering new creative possibilities for filmmakers.",
      category: "Technology",
      createdDate: "2024-12-15",
      createdBy: "Tech News Team"
    },
    {
      id: 2,
      title: "Streaming Platforms Invest in Regional Content",
      description: "Major streaming platforms are increasing investments in regional language content to capture diverse audiences.",
      category: "Industry",
      createdDate: "2024-12-14",
      createdBy: "Industry Analyst"
    },
    {
      id: 3,
      title: "Virtual Production Takes Center Stage",
      description: "Virtual production techniques are becoming mainstream, offering cost-effective alternatives to traditional filming.",
      category: "Production",
      createdDate: "2024-12-13",
      createdBy: "Production Expert"
    },
    {
      id: 4,
      title: "AI Tools Transform Post-Production",
      description: "Artificial intelligence is revolutionizing post-production workflows, making editing faster and more efficient.",
      category: "Technology",
      createdDate: "2024-12-12",
      createdBy: "AI Specialist"
    }
  ];

  const sampleEvents: Event[] = [
    {
      id: 1,
      title: "Film Industry Networking Event",
      description: "Connect with industry professionals and explore collaboration opportunities in film production.",
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
              <div className="flex items-center gap-2">
                <Select value={selectedPostType} onValueChange={setSelectedPostType}>
                  <SelectTrigger className="w-32 h-9 border-gray-300 rounded-lg text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="courses">Courses</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreatePopup(true)}
                  className="h-9 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200 px-4">
            {[
              { id: "news", label: "Industry News & Insights", count: filteredNews.length },
              { id: "events", label: "Events", count: filteredEvents.length },
              { id: "courses", label: "Courses", count: filteredCourses.length },
              { id: "created", label: "Created", count: 0 }
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
                {tab.id !== "created" && (
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
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
                    <Card
                      key={news.id}
                      className="hover:shadow-lg transition-shadow border-gray-200 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSelectedNews(news);
                        setShowNewsDetail(true);
                      }}
                    >
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
                    <Button onClick={() => setShowCreatePopup(true)}>
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
                    <Card
                      key={event.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventDetail(true);
                      }}
                    >
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
                          <div className="pt-2">
                            <Button
                              size="sm"
                              className="w-full text-xs h-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle booking logic here
                              }}
                            >
                              Book Now
                            </Button>
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
                    <Button onClick={() => setShowCreatePopup(true)}>
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
                    <Card
                      key={course.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowCourseDetail(true);
                      }}
                    >
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
                    <Button onClick={() => setShowCreatePopup(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Course
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Created Tab */}
          {activeTab === "created" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Filter by:</label>
                  <Select value={createdFilter} onValueChange={setCreatedFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="courses">Courses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Date Range:</label>
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="w-40"
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="w-40"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Sample created content - you can replace this with actual data */}
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant="outline">News</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Sample News Article
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          Technology
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          2024-12-10
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant="default">Published</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <X className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant="secondary">Event</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Sample Event
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          Workshop
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          2024-12-09
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant="default">Active</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <X className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant="outline">Course</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Sample Course
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          Cinematography
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          2024-12-08
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant="default">Published</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <X className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Unified Create Popup */}
        {showCreatePopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">
                    Create {selectedPostType === "news" ? "News & Insights" : selectedPostType === "events" ? "Event" : "Course"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreatePopup(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Type Selector */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Post Type</label>
                  <Select value={selectedPostType} onValueChange={setSelectedPostType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="courses">Courses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Form Based on Post Type */}
                {selectedPostType === "news" && (
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
                      <Button variant="outline" onClick={() => setShowCreatePopup(false)} className="h-8 text-xs">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {selectedPostType === "events" && (
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
                      <Button variant="outline" onClick={() => setShowCreatePopup(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {selectedPostType === "courses" && (
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
                      <Button variant="outline" onClick={() => setShowCreatePopup(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* News Detail Popup */}
        {showNewsDetail && selectedNews && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                      {selectedNews.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{selectedNews.createdDate}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewsDetail(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedNews.title}</h1>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">{selectedNews.description}</p>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserPlus className="w-4 h-4" />
                      <span>By {selectedNews.createdBy}</span>
                      <Calendar className="w-4 h-4 ml-4" />
                      <span>Published on {selectedNews.createdDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Detail Popup */}
        {showEventDetail && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedEvent.isOnline ? "default" : "secondary"}>
                      {selectedEvent.isOnline ? "Online" : "In-Person"}
                    </Badge>
                    <Badge variant="outline">{selectedEvent.price}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowEventDetail(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h1>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.attendees} attending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">By {selectedEvent.createdBy}</span>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Detail Popup */}
        {showCourseDetail && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedCourse.level}</Badge>
                    <Badge variant="secondary">{selectedCourse.category}</Badge>
                    <Badge variant="outline" className="text-primary">{selectedCourse.price}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowCourseDetail(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedCourse.title}</h1>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCourse.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCourse.enrolled} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">By {selectedCourse.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Instructor: {selectedCourse.instructor}</span>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{selectedCourse.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Register Now
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}