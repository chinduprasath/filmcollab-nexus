"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Camera,
  Mic,
  PenTool,
  Scissors,
  Music,
  Palette,
  Building2,
  Award,
  Star,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Eye,
  Plus,
  Settings,
  Bell,
  UserCheck,
  UserX,
  UserPlus,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Trophy,
  FileText,
  Image as ImageIcon,
  Video,
  FileText as FileIcon,
  Music as MusicIcon,
} from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  location: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  role: string;
  company?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  joinedDate: string;
  verified: boolean;
  online: boolean;
  stats: {
    connections: number;
    projects: number;
    posts: number;
    followers: number;
  };
  skills: string[];
  experience: Experience[];
  education: Education[];
  achievements: Achievement[];
  recentActivity: Activity[];
  portfolio: PortfolioItem[];
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "award" | "certification" | "publication" | "recognition";
}

interface Activity {
  id: string;
  type: "post" | "project" | "connection" | "achievement";
  title: string;
  description: string;
  date: string;
  icon: React.ComponentType<any>;
}

interface PortfolioItem {
  id: string;
  title: string;
  type: "image" | "video" | "document" | "audio";
  thumbnail: string;
  description: string;
  date: string;
  views: number;
  likes: number;
}

const mockProfileData: ProfileData = {
  id: "1",
  name: "Sarah Johnson",
  username: "sarahj_filmmaker",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "Los Angeles, CA",
  bio: "Independent filmmaker and producer with over 8 years of experience in documentary and narrative filmmaking. Passionate about telling stories that matter and creating meaningful connections in the film industry.",
  avatar: "/api/placeholder/150/150",
  coverImage: "/api/placeholder/1200/400",
  role: "Independent Filmmaker & Producer",
  company: "Johnson Productions",
  website: "https://sarahjohnsonfilms.com",
  linkedin: "https://linkedin.com/in/sarahjohnson",
  twitter: "https://twitter.com/sarahj_films",
  instagram: "https://instagram.com/sarahj_films",
  youtube: "https://youtube.com/sarahjohnsonfilms",
  joinedDate: "2020-03-15",
  verified: true,
  online: true,
  stats: {
    connections: 1247,
    projects: 23,
    posts: 156,
    followers: 2840,
  },
  skills: [
    "Directing",
    "Producing",
    "Screenwriting",
    "Documentary Filmmaking",
    "Post-Production",
    "Project Management",
    "Crowdfunding",
    "Film Distribution",
  ],
  experience: [
    {
      id: "1",
      title: "Independent Filmmaker & Producer",
      company: "Johnson Productions",
      location: "Los Angeles, CA",
      startDate: "2020-01",
      current: true,
      description: "Creating and producing independent films, documentaries, and short films. Managing all aspects of production from development to distribution.",
    },
    {
      id: "2",
      title: "Associate Producer",
      company: "Creative Studios",
      location: "Los Angeles, CA",
      startDate: "2018-06",
      endDate: "2019-12",
      current: false,
      description: "Assisted in production of feature films and documentaries. Managed post-production workflows and coordinated with various departments.",
    },
    {
      id: "3",
      title: "Production Assistant",
      company: "Metro Pictures",
      location: "New York, NY",
      startDate: "2016-08",
      endDate: "2018-05",
      current: false,
      description: "Supported production teams on various film and television projects. Gained hands-on experience in all aspects of film production.",
    },
  ],
  education: [
    {
      id: "1",
      degree: "Master of Fine Arts in Film Production",
      school: "University of Southern California",
      location: "Los Angeles, CA",
      startDate: "2014-09",
      endDate: "2016-05",
      current: false,
      description: "Specialized in documentary filmmaking and post-production techniques.",
    },
    {
      id: "2",
      degree: "Bachelor of Arts in Communications",
      school: "New York University",
      location: "New York, NY",
      startDate: "2010-09",
      endDate: "2014-05",
      current: false,
    },
  ],
  achievements: [
    {
      id: "1",
      title: "Best Documentary Short",
      description: "Sundance Film Festival 2023",
      date: "2023-01",
      type: "award",
    },
    {
      id: "2",
      title: "Film Independent Fellow",
      description: "Selected for prestigious filmmaker fellowship program",
      date: "2022-06",
      type: "recognition",
    },
    {
      id: "3",
      title: "Adobe Certified Expert",
      description: "Premiere Pro and After Effects",
      date: "2021-03",
      type: "certification",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "project",
      title: "Uploaded new project",
      description: "Behind the Scenes: Documentary Production",
      date: "2 hours ago",
      icon: Camera,
    },
    {
      id: "2",
      type: "connection",
      title: "Connected with",
      description: "Michael Chen - Cinematographer",
      date: "1 day ago",
      icon: Users,
    },
    {
      id: "3",
      type: "post",
      title: "Shared a post",
      description: "Tips for independent filmmakers",
      date: "3 days ago",
      icon: MessageSquare,
    },
  ],
  portfolio: [
    {
      id: "1",
      title: "Behind the Scenes Documentary",
      type: "video",
      thumbnail: "/api/placeholder/300/200",
      description: "A behind-the-scenes look at independent film production",
      date: "2024-12-10",
      views: 1240,
      likes: 89,
    },
    {
      id: "2",
      title: "Film Festival Poster",
      type: "image",
      thumbnail: "/api/placeholder/300/200",
      description: "Poster design for upcoming film festival",
      date: "2024-12-08",
      views: 567,
      likes: 34,
    },
    {
      id: "3",
      title: "Script Draft v3",
      type: "document",
      thumbnail: "/api/placeholder/300/200",
      description: "Latest draft of feature film script",
      date: "2024-12-05",
      views: 234,
      likes: 12,
    },
  ],
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>(mockProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const roleIcons = {
    "Director": Camera,
    "Producer": Building2,
    "Cinematographer": Camera,
    "Editor": Scissors,
    "Writer": PenTool,
    "Composer": Music,
    "Designer": Palette,
    "Sound Designer": Mic,
  };

  const getRoleIcon = (role: string) => {
    const roleKey = Object.keys(roleIcons).find(key => 
      role.toLowerCase().includes(key.toLowerCase())
    );
    return roleKey ? roleIcons[roleKey as keyof typeof roleIcons] : Camera;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <AppLayout>
      <div className="space-y-4 bg-gray-50 min-h-screen p-4 -m-4">
        {/* Cover Photo and Basic Info */}
        <Card className="relative overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600 relative">
            {profile.coverImage && (
              <img 
                src={profile.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-4 left-4 flex items-center gap-2 text-white/80">
              <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center">
                <span className="text-xs">🏔️</span>
              </div>
              <span className="text-sm font-medium">Cover</span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white/90 hover:bg-white"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                <Edit className="w-4 h-4 mr-1" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end gap-4 flex-1">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg flex-shrink-0">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    {profile.verified && (
                      <UserCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    )}
                    {profile.online && (
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-1">@{profile.username}</p>
                  <p className="text-gray-700 text-sm mb-2">{profile.role}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      Joined {formatDate(profile.joinedDate)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Connect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-purple-600 mb-1">
                {profile.stats.connections.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Connections</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-purple-600 mb-1">
                {profile.stats.projects}
              </div>
              <div className="text-xs text-gray-600">Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-purple-600 mb-1">
                {profile.stats.posts}
              </div>
              <div className="text-xs text-gray-600">Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-purple-600 mb-1">
                {profile.stats.followers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Followers</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
                <TabsTrigger value="portfolio" className="text-xs">Portfolio</TabsTrigger>
                <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Bio */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.portfolio.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.type === "video" && <Video className="w-5 h-5 text-gray-500" />}
                            {item.type === "image" && <ImageIcon className="w-5 h-5 text-gray-500" />}
                            {item.type === "document" && <FileIcon className="w-5 h-5 text-gray-500" />}
                            {item.type === "audio" && <MusicIcon className="w-5 h-5 text-gray-500" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.views} views
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                {/* Experience */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.experience.map((exp) => (
                        <div key={exp.id} className="flex gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{exp.title}</h4>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                            <p className="text-xs text-gray-500">{exp.location}</p>
                            <p className="text-xs text-gray-500">
                              {formatDateShort(exp.startDate)} - {exp.current ? "Present" : formatDateShort(exp.endDate!)}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.education.map((edu) => (
                        <div key={edu.id} className="flex gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.school}</p>
                            <p className="text-xs text-gray-500">{edu.location}</p>
                            <p className="text-xs text-gray-500">
                              {formatDateShort(edu.startDate)} - {edu.current ? "Present" : formatDateShort(edu.endDate!)}
                            </p>
                            {edu.description && (
                              <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.achievements.map((achievement) => (
                        <div key={achievement.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Trophy className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{achievement.title}</h4>
                            <p className="text-xs text-gray-600">{achievement.description}</p>
                            <p className="text-xs text-gray-500">{formatDateShort(achievement.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.portfolio.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="h-32 bg-gray-200 flex items-center justify-center">
                            {item.type === "video" && <Video className="w-8 h-8 text-gray-500" />}
                            {item.type === "image" && <ImageIcon className="w-8 h-8 text-gray-500" />}
                            {item.type === "document" && <FileIcon className="w-8 h-8 text-gray-500" />}
                            {item.type === "audio" && <MusicIcon className="w-8 h-8 text-gray-500" />}
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{formatDate(item.date)}</span>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {item.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {item.likes}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <activity.icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">{activity.title}</h4>
                            <p className="text-xs text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{profile.location}</span>
                </div>
                {profile.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a href={profile.website} className="text-blue-600 hover:underline text-sm">
                      {profile.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.linkedin && (
                  <a href={profile.linkedin} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                {profile.instagram && (
                  <a href={profile.instagram} className="flex items-center gap-2 text-sm text-pink-600 hover:underline">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
                {profile.youtube && (
                  <a href={profile.youtube} className="flex items-center gap-2 text-sm text-red-600 hover:underline">
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
