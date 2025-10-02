import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  FileText, 
  FolderOpen, 
  Briefcase, 
  MessageCircle, 
  UserCheck,
  Download,
  BarChart3,
  LineChart as LineChartIcon,
  Image,
  Eye,
  Heart,
  Share2,
  UserPlus,
  Target,
  Zap,
  PieChart,
  Calendar,
  CalendarDays,
  CalendarRange
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

// User categories data
const CHART_COLORS = {
  yellow: {
    primary: '#eab308', // yellow-500
    secondary: '#facc15', // yellow-400
    tertiary: '#fbbf24', // yellow-400/yellow-500 mix
    light: '#fef9c3', // yellow-100
    dark: '#ca8a04', // yellow-600
  }
};

const CHART_STYLES = {
  lineChart: {
    totalUsers: CHART_COLORS.yellow.primary,
    newUsers: CHART_COLORS.yellow.secondary,
    activeUsers: CHART_COLORS.yellow.tertiary,
  },
  pieChart: [
    CHART_COLORS.yellow.primary,
    CHART_COLORS.yellow.secondary,
    CHART_COLORS.yellow.tertiary,
    CHART_COLORS.yellow.dark,
    '#fcd34d', // yellow-300
    '#fde047', // yellow-300/yellow-400 mix
    '#facc15', // yellow-400
    '#eab308', // yellow-500
  ]
};

// Generate mock data for projects analytics
const generateProjectsData = () => {
  const now = new Date();
  const dailyData = [];
  const monthlyData = [];
  const yearlyData = [];

  // Generate daily data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      projects: Math.floor(Math.random() * 30) + 10,
      uniqueUsers: Math.floor(Math.random() * 20) + 5
    });
  }

  // Generate monthly data for last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    monthlyData.push({
      date: date.toISOString().slice(0, 7),
      projects: Math.floor(Math.random() * 500) + 200,
      uniqueUsers: Math.floor(Math.random() * 300) + 100
    });
  }

  // Generate yearly data for last 5 years
  for (let i = 4; i >= 0; i--) {
    const date = new Date(now);
    date.setFullYear(date.getFullYear() - i);
    yearlyData.push({
      date: date.getFullYear().toString(),
      projects: Math.floor(Math.random() * 5000) + 2000,
      uniqueUsers: Math.floor(Math.random() * 2000) + 1000
    });
  }

  return { dailyData, monthlyData, yearlyData };
};

// Generate mock data for jobs analytics
const generateJobsData = () => {
  const now = new Date();
  const dailyData = [];
  const monthlyData = [];
  const yearlyData = [];

  // Generate daily data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      jobs: Math.floor(Math.random() * 20) + 5,
      uniqueUsers: Math.floor(Math.random() * 15) + 3
    });
  }

  // Generate monthly data for last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    monthlyData.push({
      date: date.toISOString().slice(0, 7),
      jobs: Math.floor(Math.random() * 300) + 100,
      uniqueUsers: Math.floor(Math.random() * 200) + 50
    });
  }

  // Generate yearly data for last 5 years
  for (let i = 4; i >= 0; i--) {
    const date = new Date(now);
    date.setFullYear(date.getFullYear() - i);
    yearlyData.push({
      date: date.getFullYear().toString(),
      jobs: Math.floor(Math.random() * 3000) + 1000,
      uniqueUsers: Math.floor(Math.random() * 1500) + 500
    });
  }

  return { dailyData, monthlyData, yearlyData };
};

// Generate mock data for directory analytics
const generateDirectoryData = () => {
  const now = new Date();
  const dailyData = [];
  const monthlyData = [];
  const yearlyData = [];

  // Generate daily data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      images: Math.floor(Math.random() * 100) + 50,
      videos: Math.floor(Math.random() * 50) + 20,
      audios: Math.floor(Math.random() * 30) + 10,
      documents: Math.floor(Math.random() * 40) + 15
    });
  }

  // Generate monthly data for last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    monthlyData.push({
      date: date.toISOString().slice(0, 7),
      images: Math.floor(Math.random() * 3000) + 1500,
      videos: Math.floor(Math.random() * 1500) + 600,
      audios: Math.floor(Math.random() * 900) + 300,
      documents: Math.floor(Math.random() * 1200) + 450
    });
  }

  // Generate yearly data for last 5 years
  for (let i = 4; i >= 0; i--) {
    const date = new Date(now);
    date.setFullYear(date.getFullYear() - i);
    yearlyData.push({
      date: date.getFullYear().toString(),
      images: Math.floor(Math.random() * 30000) + 15000,
      videos: Math.floor(Math.random() * 15000) + 6000,
      audios: Math.floor(Math.random() * 9000) + 3000,
      documents: Math.floor(Math.random() * 12000) + 4500
    });
  }

  const totalFiles = {
    images: monthlyData.reduce((acc, curr) => acc + curr.images, 0),
    videos: monthlyData.reduce((acc, curr) => acc + curr.videos, 0),
    audios: monthlyData.reduce((acc, curr) => acc + curr.audios, 0),
    documents: monthlyData.reduce((acc, curr) => acc + curr.documents, 0)
  };

  return { dailyData, monthlyData, yearlyData, totalFiles };
};

// Generate mock data for community analytics
const generateCommunityData = () => {
  const now = new Date();
  const dailyData = [];
  const monthlyData = [];
  const yearlyData = [];

  // Generate daily data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      communities: Math.floor(Math.random() * 15) + 5,
      uniqueUsers: Math.floor(Math.random() * 10) + 3
    });
  }

  // Generate monthly data for last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    monthlyData.push({
      date: date.toISOString().slice(0, 7),
      communities: Math.floor(Math.random() * 200) + 50,
      uniqueUsers: Math.floor(Math.random() * 150) + 30
    });
  }

  // Generate yearly data for last 5 years
  for (let i = 4; i >= 0; i--) {
    const date = new Date(now);
    date.setFullYear(date.getFullYear() - i);
    yearlyData.push({
      date: date.getFullYear().toString(),
      communities: Math.floor(Math.random() * 2000) + 500,
      uniqueUsers: Math.floor(Math.random() * 1500) + 300
    });
  }

  return { dailyData, monthlyData, yearlyData };
};

// Generate mock data for posts analytics
const generatePostsData = () => {
  const now = new Date();
  const dailyData = [];
  const monthlyData = [];
  const yearlyData = [];

  // Generate daily data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      posts: Math.floor(Math.random() * 50) + 20,
      uniqueUsers: Math.floor(Math.random() * 30) + 10
    });
  }

  // Generate monthly data for last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    monthlyData.push({
      date: date.toISOString().slice(0, 7),
      posts: Math.floor(Math.random() * 1000) + 500,
      uniqueUsers: Math.floor(Math.random() * 500) + 200
    });
  }

  // Generate yearly data for last 5 years
  for (let i = 4; i >= 0; i--) {
    const date = new Date(now);
    date.setFullYear(date.getFullYear() - i);
    yearlyData.push({
      date: date.getFullYear().toString(),
      posts: Math.floor(Math.random() * 10000) + 5000,
      uniqueUsers: Math.floor(Math.random() * 5000) + 2000
    });
  }

  return { dailyData, monthlyData, yearlyData };
};

const postsAnalyticsData = generatePostsData();
const projectsAnalyticsData = generateProjectsData();
const jobsAnalyticsData = generateJobsData();
const directoryAnalyticsData = generateDirectoryData();
const communityAnalyticsData = generateCommunityData();

const userRolesData = [
    { name: "Direction & Production", value: 15, details: [
      { name: "Director", value: 4 },
      { name: "Assistant Director", value: 3 },
      { name: "Producer", value: 2 },
      { name: "Executive Producer", value: 1 },
      { name: "Line Producer", value: 2 },
      { name: "Production Manager", value: 2 },
      { name: "Production Assistant", value: 1 }
    ]},
    { name: "Cinematography & Camera", value: 12, details: [
      { name: "Cinematographer", value: 3 },
      { name: "Assistant Cameraman", value: 2 },
      { name: "Camera Operator", value: 2 },
      { name: "Steadicam Operator", value: 1 },
      { name: "Drone Operator", value: 1 },
      { name: "Gaffer", value: 2 },
      { name: "Lighting Technician", value: 1 }
    ]},
    { name: "Actors & Performers", value: 20, details: [
      { name: "Lead Actor/Actress", value: 5 },
      { name: "Supporting Actor/Actress", value: 6 },
      { name: "Child Artist", value: 2 },
      { name: "Theatre Artist", value: 3 },
      { name: "Voice Over Artist", value: 2 },
      { name: "Dancer", value: 1 },
      { name: "Stunt Artist", value: 1 }
    ]},
    { name: "Writing & Creative", value: 10, details: [
      { name: "Script Writer", value: 3 },
      { name: "Screenplay Writer", value: 2 },
      { name: "Dialogue Writer", value: 2 },
      { name: "Lyricist", value: 1 },
      { name: "Storyboard Artist", value: 2 }
    ]},
    { name: "Music & Sound", value: 8, details: [
      { name: "Music Director", value: 1 },
      { name: "Background Score Composer", value: 1 },
      { name: "Singer", value: 2 },
      { name: "Instrumentalist", value: 1 },
      { name: "Sound Engineer", value: 1 },
      { name: "Foley Artist", value: 1 },
      { name: "Dubbing Artist", value: 1 }
    ]},
    { name: "Art & Design", value: 12, details: [
      { name: "Art Director", value: 2 },
      { name: "Set Designer", value: 2 },
      { name: "Costume Designer", value: 2 },
      { name: "Stylist", value: 1 },
      { name: "Makeup Artist", value: 2 },
      { name: "Hair Stylist", value: 1 },
      { name: "Graphic Designer", value: 1 },
      { name: "Poster Designer", value: 1 }
    ]},
    { name: "Editing & Post Production", value: 15, details: [
      { name: "Video Editor", value: 4 },
      { name: "VFX Artist", value: 3 },
      { name: "Motion Graphics Designer", value: 3 },
      { name: "Colorist", value: 2 },
      { name: "DI Supervisor", value: 1 },
      { name: "Sound Editor", value: 2 }
    ]},
    { name: "Marketing & Distribution", value: 8, details: [
      { name: "Digital Marketer", value: 3 },
      { name: "PR", value: 2 },
      { name: "Social Media Manager", value: 2 },
      { name: "Film Distributor", value: 1 }
    ]    }
];

export default function AdminAnalytics() {
  // Time period state for posts analytics
  const [postsTimeView, setPostsTimeView] = useState('monthly'); // daily, monthly, yearly
  const [postsDateRange, setPostsDateRange] = useState('30d'); // 7d, 30d, 6m, 1y

  // Time period state for projects analytics
  const [projectsTimeView, setProjectsTimeView] = useState('monthly');
  const [projectsDateRange, setProjectsDateRange] = useState('30d');

  // Time period state for jobs analytics
  const [jobsTimeView, setJobsTimeView] = useState('monthly');
  const [jobsDateRange, setJobsDateRange] = useState('30d');

  // Time period state for directory analytics
  const [directoryTimeView, setDirectoryTimeView] = useState('monthly');
  const [directoryDateRange, setDirectoryDateRange] = useState('30d');

  // Time period state for community analytics
  const [communityTimeView, setCommunityTimeView] = useState('monthly');
  const [communityDateRange, setCommunityDateRange] = useState('30d');

  // Get posts data based on current view
  const getPostsData = () => {
    switch (postsTimeView) {
      case 'daily':
        return postsAnalyticsData.dailyData;
      case 'monthly':
        return postsAnalyticsData.monthlyData;
      case 'yearly':
        return postsAnalyticsData.yearlyData;
      default:
        return postsAnalyticsData.monthlyData;
    }
  };

  // Get projects data based on current view
  const getProjectsData = () => {
    switch (projectsTimeView) {
      case 'daily':
        return projectsAnalyticsData.dailyData;
      case 'monthly':
        return projectsAnalyticsData.monthlyData;
      case 'yearly':
        return projectsAnalyticsData.yearlyData;
      default:
        return projectsAnalyticsData.monthlyData;
    }
  };

  // Get jobs data based on current view
  const getJobsData = () => {
    switch (jobsTimeView) {
      case 'daily':
        return jobsAnalyticsData.dailyData;
      case 'monthly':
        return jobsAnalyticsData.monthlyData;
      case 'yearly':
        return jobsAnalyticsData.yearlyData;
      default:
        return jobsAnalyticsData.monthlyData;
    }
  };

  // Get directory data based on current view
  const getDirectoryData = () => {
    switch (directoryTimeView) {
      case 'daily':
        return directoryAnalyticsData.dailyData;
      case 'monthly':
        return directoryAnalyticsData.monthlyData;
      case 'yearly':
        return directoryAnalyticsData.yearlyData;
      default:
        return directoryAnalyticsData.monthlyData;
    }
  };

  // Get community data based on current view
  const getCommunityData = () => {
    switch (communityTimeView) {
      case 'daily':
        return communityAnalyticsData.dailyData;
      case 'monthly':
        return communityAnalyticsData.monthlyData;
      case 'yearly':
        return communityAnalyticsData.yearlyData;
      default:
        return communityAnalyticsData.monthlyData;
    }
  };

  // Platform-specific analytics data
  const platformData = {
    users: {
      metrics: [
        { title: "Total Users", value: "15,420", change: "+12.5%", icon: Users, color: "text-yellow-600" },
        { title: "New Users (30d)", value: "1,284", change: "+8.3%", icon: UserPlus, color: "text-yellow-600" },
        { title: "Active Users", value: "8,932", change: "+15.2%", icon: Activity, color: "text-yellow-600" },
        { title: "User Retention", value: "78.5%", change: "+2.1%", icon: Target, color: "text-yellow-600" }
      ],
      chartData: [
        { month: 'Jan', total: 1200, new: 120, active: 800 },
        { month: 'Feb', total: 1450, new: 150, active: 950 },
        { month: 'Mar', total: 1680, new: 180, active: 1100 },
        { month: 'Apr', total: 1920, new: 200, active: 1250 },
        { month: 'May', total: 2150, new: 250, active: 1400 },
        { month: 'Jun', total: 2380, new: 300, active: 1550 },
        { month: 'Jul', total: 2610, new: 280, active: 1700 },
        { month: 'Aug', total: 2840, new: 320, active: 1850 },
        { month: 'Sep', total: 3070, new: 350, active: 2000 },
        { month: 'Oct', total: 3300, new: 400, active: 2150 },
        { month: 'Nov', total: 3530, new: 380, active: 2300 },
        { month: 'Dec', total: 3760, new: 450, active: 2450 }
      ]
    },
    posts: {
      metrics: [
        { title: "Total Posts", value: "24,508", change: "+18.7%", icon: FileText, color: "text-indigo-600" },
        { title: "Posts (30d)", value: "2,847", change: "+22.1%", icon: FileText, color: "text-yellow-600" },
        { title: "Post Engagement", value: "4.2k", change: "+31.5%", icon: Heart, color: "text-yellow-600" },
        { title: "Content Views", value: "156.7k", change: "+25.8%", icon: Eye, color: "text-teal-600" }
      ],
      chartData: [
        { month: 'Jan', total: 1800, new: 180, views: 12000 },
        { month: 'Feb', total: 2100, new: 210, views: 14000 },
        { month: 'Mar', total: 2400, new: 240, views: 16000 },
        { month: 'Apr', total: 2700, new: 270, views: 18000 },
        { month: 'May', total: 3000, new: 300, views: 20000 },
        { month: 'Jun', total: 3300, new: 330, views: 22000 },
        { month: 'Jul', total: 3600, new: 360, views: 24000 },
        { month: 'Aug', total: 3900, new: 390, views: 26000 },
        { month: 'Sep', total: 4200, new: 420, views: 28000 },
        { month: 'Oct', total: 4500, new: 450, views: 30000 },
        { month: 'Nov', total: 4800, new: 480, views: 32000 },
        { month: 'Dec', total: 5100, new: 510, views: 34000 }
      ]
    },
    projects: {
      metrics: [
        { title: "Total Projects", value: "3,247", change: "+14.2%", icon: FolderOpen, color: "text-yellow-600" },
        { title: "Active Projects", value: "1,892", change: "+9.8%", icon: Zap, color: "text-yellow-600" },
        { title: "Completed", value: "1,355", change: "+16.3%", icon: Target, color: "text-yellow-600" },
        { title: "Project Views", value: "89.3k", change: "+19.4%", icon: Eye, color: "text-yellow-600" }
      ],
      chartData: [
        { month: 'Jan', total: 240, active: 180, completed: 60, views: 5000 },
        { month: 'Feb', total: 280, active: 210, completed: 70, views: 6000 },
        { month: 'Mar', total: 320, active: 240, completed: 80, views: 7000 },
        { month: 'Apr', total: 360, active: 270, completed: 90, views: 8000 },
        { month: 'May', total: 400, active: 300, completed: 100, views: 9000 },
        { month: 'Jun', total: 440, active: 330, completed: 110, views: 10000 },
        { month: 'Jul', total: 480, active: 360, completed: 120, views: 11000 },
        { month: 'Aug', total: 520, active: 390, completed: 130, views: 12000 },
        { month: 'Sep', total: 560, active: 420, completed: 140, views: 13000 },
        { month: 'Oct', total: 600, active: 450, completed: 150, views: 14000 },
        { month: 'Nov', total: 640, active: 480, completed: 160, views: 15000 },
        { month: 'Dec', total: 680, active: 510, completed: 170, views: 16000 }
      ]
    },
    jobs: {
      metrics: [
        { title: "Total Jobs", value: "1,247", change: "+21.3%", icon: Briefcase, color: "text-yellow-600" },
        { title: "Active Jobs", value: "456", change: "+12.7%", icon: Briefcase, color: "text-yellow-600" },
        { title: "Applications", value: "8,932", change: "+28.9%", icon: UserCheck, color: "text-yellow-600" },
        { title: "Job Views", value: "67.4k", change: "+33.1%", icon: Eye, color: "text-yellow-600" }
      ],
      chartData: [
        { month: 'Jan', total: 89, active: 65, applications: 450, views: 3000 },
        { month: 'Feb', total: 95, active: 70, applications: 500, views: 3500 },
        { month: 'Mar', total: 102, active: 75, applications: 550, views: 4000 },
        { month: 'Apr', total: 108, active: 80, applications: 600, views: 4500 },
        { month: 'May', total: 115, active: 85, applications: 650, views: 5000 },
        { month: 'Jun', total: 122, active: 90, applications: 700, views: 5500 },
        { month: 'Jul', total: 128, active: 95, applications: 750, views: 6000 },
        { month: 'Aug', total: 135, active: 100, applications: 800, views: 6500 },
        { month: 'Sep', total: 142, active: 105, applications: 850, views: 7000 },
        { month: 'Oct', total: 148, active: 110, applications: 900, views: 7500 },
        { month: 'Nov', total: 155, active: 115, applications: 950, views: 8000 },
        { month: 'Dec', total: 162, active: 120, applications: 1000, views: 8500 }
      ]
    },
    directory: {
      metrics: [
        { title: "Total Files", value: "45,678", change: "+17.6%", icon: Image, color: "text-pink-600" },
        { title: "Images", value: "32,456", change: "+15.2%", icon: Image, color: "text-yellow-600" },
        { title: "Videos", value: "8,234", change: "+24.7%", icon: FileText, color: "text-yellow-600" },
        { title: "Downloads", value: "234.5k", change: "+29.3%", icon: Download, color: "text-yellow-600" }
      ],
      chartData: [
        { month: 'Jan', total: 3200, images: 2400, videos: 600, downloads: 15000 },
        { month: 'Feb', total: 3600, images: 2700, videos: 700, downloads: 17000 },
        { month: 'Mar', total: 4000, images: 3000, videos: 800, downloads: 19000 },
        { month: 'Apr', total: 4400, images: 3300, videos: 900, downloads: 21000 },
        { month: 'May', total: 4800, images: 3600, videos: 1000, downloads: 23000 },
        { month: 'Jun', total: 5200, images: 3900, videos: 1100, downloads: 25000 },
        { month: 'Jul', total: 5600, images: 4200, videos: 1200, downloads: 27000 },
        { month: 'Aug', total: 6000, images: 4500, videos: 1300, downloads: 29000 },
        { month: 'Sep', total: 6400, images: 4800, videos: 1400, downloads: 31000 },
        { month: 'Oct', total: 6800, images: 5100, videos: 1500, downloads: 33000 },
        { month: 'Nov', total: 7200, images: 5400, videos: 1600, downloads: 35000 },
        { month: 'Dec', total: 7600, images: 5700, videos: 1700, downloads: 37000 }
      ]
    },
    community: {
      metrics: [
        { title: "Messages", value: "124,508", change: "+35.2%", icon: MessageCircle, color: "text-teal-600" },
        { title: "Connections", value: "18,347", change: "+22.8%", icon: UserCheck, color: "text-yellow-600" },
        { title: "Groups", value: "892", change: "+11.4%", icon: Users, color: "text-indigo-600" },
        { title: "Shares", value: "45,678", change: "+41.7%", icon: Share2, color: "text-yellow-600" }
      ],
      chartData: [
        { month: 'Jan', messages: 8000, connections: 1200, groups: 60, shares: 3000 },
        { month: 'Feb', messages: 9000, connections: 1350, groups: 65, shares: 3400 },
        { month: 'Mar', messages: 10000, connections: 1500, groups: 70, shares: 3800 },
        { month: 'Apr', messages: 11000, connections: 1650, groups: 75, shares: 4200 },
        { month: 'May', messages: 12000, connections: 1800, groups: 80, shares: 4600 },
        { month: 'Jun', messages: 13000, connections: 1950, groups: 85, shares: 5000 },
        { month: 'Jul', messages: 14000, connections: 2100, groups: 90, shares: 5400 },
        { month: 'Aug', messages: 15000, connections: 2250, groups: 95, shares: 5800 },
        { month: 'Sep', messages: 16000, connections: 2400, groups: 100, shares: 6200 },
        { month: 'Oct', messages: 17000, connections: 2550, groups: 105, shares: 6600 },
        { month: 'Nov', messages: 18000, connections: 2700, groups: 110, shares: 7000 },
        { month: 'Dec', messages: 19000, connections: 2850, groups: 115, shares: 7400 }
      ]
    }
  };

  return (
    <AdminLayout pageTitle="Analytics">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Platform analytics and performance metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select defaultValue="30">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Platform Analytics Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Directory</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Analytics */}
          <TabsContent value="users" className="space-y-6">
            {/* Users Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformData.users.metrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* User Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
            <Card>
              <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <LineChartIcon className="h-5 w-5 text-yellow-600" />
                        User Growth
                      </h3>
                <p className="text-sm text-muted-foreground">Total, new, and active users by month</p>
                    </div>
                  </div>
              </CardHeader>
              <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={platformData.users.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                          }}
                          itemStyle={{ color: '#374151' }}
                          labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                        />
                        <Legend 
                          verticalAlign="top"
                          height={36}
                          iconType="circle"
                          formatter={(value) => (
                            <span style={{ color: '#374151', fontSize: '0.875rem' }}>{value}</span>
                          )}
                        />
                        <Line
                          type="monotone"
                          dataKey="total"
                          name="Total Users"
                          stroke={CHART_STYLES.lineChart.totalUsers}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: CHART_STYLES.lineChart.totalUsers }}
                        />
                        <Line
                          type="monotone"
                          dataKey="new"
                          name="New Users"
                          stroke={CHART_STYLES.lineChart.newUsers}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: CHART_STYLES.lineChart.newUsers }}
                        />
                        <Line
                          type="monotone"
                          dataKey="active"
                          name="Active Users"
                          stroke={CHART_STYLES.lineChart.activeUsers}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: CHART_STYLES.lineChart.activeUsers }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                        </div>
                </CardContent>
              </Card>

              {/* User Roles Distribution */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-yellow-600" />
                        User Roles Distribution
                      </h3>
                      <p className="text-sm text-muted-foreground">Distribution across professional roles</p>
                      </div>
                </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={userRolesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {userRolesData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CHART_STYLES.pieChart[index % CHART_STYLES.pieChart.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                          }}
                          itemStyle={{ color: '#374151' }}
                          formatter={(value, name) => [
                            `${value}%`,
                            name,
                            `(${userRolesData.find(r => r.name === name)?.details.length || 0} sub-roles)`
                          ]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Posts Analytics */}
          <TabsContent value="posts" className="space-y-6">
            {/* Posts Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformData.posts.metrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Posts Analytics Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Posts Graph */}
            <Card>
              <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-yellow-600" />
                        Total Posts
                      </h3>
                      <p className="text-sm text-muted-foreground">Number of posts over time</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={postsTimeView} onValueChange={setPostsTimeView}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Daily
                            </span>
                          </SelectItem>
                          <SelectItem value="monthly">
                            <span className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              Monthly
                            </span>
                          </SelectItem>
                          <SelectItem value="yearly">
                            <span className="flex items-center gap-2">
                              <CalendarRange className="h-4 w-4" />
                              Yearly
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={postsDateRange} onValueChange={setPostsDateRange}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="6m">Last 6 months</SelectItem>
                          <SelectItem value="1y">Last 1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
              </CardHeader>
              <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getPostsData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                          }}
                          itemStyle={{ color: '#374151' }}
                          labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                          formatter={(value) => [value.toLocaleString(), 'Posts']}
                        />
                        <Line
                          type="monotone"
                          dataKey="posts"
                          name="Total Posts"
                          stroke={CHART_STYLES.lineChart.totalUsers}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: CHART_STYLES.lineChart.totalUsers }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                        </div>
                </CardContent>
              </Card>

              {/* Users Posting Graph */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Users className="h-5 w-5 text-yellow-600" />
                        Users Posting
                      </h3>
                      <p className="text-sm text-muted-foreground">Unique users creating posts</p>
                      </div>
                </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getPostsData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                          }}
                          itemStyle={{ color: '#374151' }}
                          labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                          formatter={(value) => [value.toLocaleString(), 'Users']}
                        />
                        <Bar
                          dataKey="uniqueUsers"
                          name="Unique Users"
                          fill={CHART_STYLES.lineChart.activeUsers}
                          radius={[4, 4, 0, 0]}
                        />
                        <Line
                          type="monotone"
                          dataKey="uniqueUsers"
                          name="Trend"
                          stroke={CHART_STYLES.lineChart.totalUsers}
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Projects Analytics */}
          <TabsContent value="projects" className="space-y-6">
            {/* Projects Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformData.projects.metrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

             {/* Projects Analytics Graphs */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Total Projects Graph */}
            <Card>
              <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium flex items-center gap-2">
                         <BarChart3 className="h-5 w-5 text-yellow-600" />
                         Total Projects
                       </h3>
                       <p className="text-sm text-muted-foreground">Number of projects over time</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <Select value={projectsTimeView} onValueChange={setProjectsTimeView}>
                         <SelectTrigger className="w-[120px]">
                           <SelectValue placeholder="View" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="daily">
                             <span className="flex items-center gap-2">
                               <Calendar className="h-4 w-4" />
                               Daily
                             </span>
                           </SelectItem>
                           <SelectItem value="monthly">
                             <span className="flex items-center gap-2">
                               <CalendarDays className="h-4 w-4" />
                               Monthly
                             </span>
                           </SelectItem>
                           <SelectItem value="yearly">
                             <span className="flex items-center gap-2">
                               <CalendarRange className="h-4 w-4" />
                               Yearly
                             </span>
                           </SelectItem>
                         </SelectContent>
                       </Select>
                       <Select value={projectsDateRange} onValueChange={setProjectsDateRange}>
                         <SelectTrigger className="w-[140px]">
                           <SelectValue placeholder="Date Range" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="7d">Last 7 days</SelectItem>
                           <SelectItem value="30d">Last 30 days</SelectItem>
                           <SelectItem value="6m">Last 6 months</SelectItem>
                           <SelectItem value="1y">Last 1 year</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
              </CardHeader>
              <CardContent>
                   <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={getProjectsData()}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="date" 
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                         />
                         <YAxis
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => value.toLocaleString()}
                         />
                         <Tooltip
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '0.5rem',
                             boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                           }}
                           itemStyle={{ color: '#374151' }}
                           labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                           formatter={(value) => [value.toLocaleString(), 'Projects']}
                         />
                         <Line
                           type="monotone"
                           dataKey="projects"
                           name="Total Projects"
                           stroke={CHART_STYLES.lineChart.totalUsers}
                           strokeWidth={2}
                           dot={false}
                           activeDot={{ r: 4, fill: CHART_STYLES.lineChart.totalUsers }}
                         />
                       </LineChart>
                     </ResponsiveContainer>
                        </div>
                 </CardContent>
               </Card>

               {/* Project Creators Graph */}
               <Card>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium flex items-center gap-2">
                         <Users className="h-5 w-5 text-yellow-600" />
                         Project Creators
                       </h3>
                       <p className="text-sm text-muted-foreground">Users creating projects</p>
                      </div>
                </div>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={getProjectsData()}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="date" 
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                         />
                         <YAxis
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => value.toLocaleString()}
                         />
                         <Tooltip
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '0.5rem',
                             boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                           }}
                           itemStyle={{ color: '#374151' }}
                           labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                           formatter={(value) => [value.toLocaleString(), 'Creators']}
                         />
                         <Bar
                           dataKey="uniqueUsers"
                           name="Unique Users"
                           fill={CHART_STYLES.lineChart.activeUsers}
                           radius={[4, 4, 0, 0]}
                         />
                       </BarChart>
                     </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
             </div>
          </TabsContent>

          {/* Jobs Analytics */}
          <TabsContent value="jobs" className="space-y-6">
            {/* Jobs Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformData.jobs.metrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

             {/* Jobs Analytics Graphs */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Total Jobs Graph */}
            <Card>
              <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium flex items-center gap-2">
                         <BarChart3 className="h-5 w-5 text-yellow-600" />
                         Total Jobs
                       </h3>
                       <p className="text-sm text-muted-foreground">Number of jobs over time</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <Select value={jobsTimeView} onValueChange={setJobsTimeView}>
                         <SelectTrigger className="w-[120px]">
                           <SelectValue placeholder="View" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="daily">
                             <span className="flex items-center gap-2">
                               <Calendar className="h-4 w-4" />
                               Daily
                             </span>
                           </SelectItem>
                           <SelectItem value="monthly">
                             <span className="flex items-center gap-2">
                               <CalendarDays className="h-4 w-4" />
                               Monthly
                             </span>
                           </SelectItem>
                           <SelectItem value="yearly">
                             <span className="flex items-center gap-2">
                               <CalendarRange className="h-4 w-4" />
                               Yearly
                             </span>
                           </SelectItem>
                         </SelectContent>
                       </Select>
                       <Select value={jobsDateRange} onValueChange={setJobsDateRange}>
                         <SelectTrigger className="w-[140px]">
                           <SelectValue placeholder="Date Range" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="7d">Last 7 days</SelectItem>
                           <SelectItem value="30d">Last 30 days</SelectItem>
                           <SelectItem value="6m">Last 6 months</SelectItem>
                           <SelectItem value="1y">Last 1 year</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
              </CardHeader>
              <CardContent>
                   <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={getJobsData()}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="date" 
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                         />
                         <YAxis
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => value.toLocaleString()}
                         />
                         <Tooltip
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '0.5rem',
                             boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                           }}
                           itemStyle={{ color: '#374151' }}
                           labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                           formatter={(value) => [value.toLocaleString(), 'Jobs']}
                         />
                         <Line
                           type="monotone"
                           dataKey="jobs"
                           name="Total Jobs"
                           stroke={CHART_STYLES.lineChart.totalUsers}
                           strokeWidth={2}
                           dot={false}
                           activeDot={{ r: 4, fill: CHART_STYLES.lineChart.totalUsers }}
                         />
                       </LineChart>
                     </ResponsiveContainer>
                        </div>
                 </CardContent>
               </Card>

               {/* Job Creators Graph */}
               <Card>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium flex items-center gap-2">
                         <Users className="h-5 w-5 text-yellow-600" />
                         Job Creators
                       </h3>
                       <p className="text-sm text-muted-foreground">Users creating jobs</p>
                      </div>
                </div>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={getJobsData()}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="date" 
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                         />
                         <YAxis
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => value.toLocaleString()}
                         />
                         <Tooltip
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '0.5rem',
                             boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                           }}
                           itemStyle={{ color: '#374151' }}
                           labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                           formatter={(value) => [value.toLocaleString(), 'Creators']}
                         />
                         <Bar
                           dataKey="uniqueUsers"
                           name="Unique Users"
                           fill={CHART_STYLES.lineChart.activeUsers}
                           radius={[4, 4, 0, 0]}
                         />
                       </BarChart>
                     </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
             </div>
          </TabsContent>

          {/* Directory Analytics */}
          <TabsContent value="directory" className="space-y-6">
            {/* Directory Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformData.directory.metrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

             {/* Directory Analytics Graphs */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Total Media Files Graph */}
            <Card>
              <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium flex items-center gap-2">
                         <BarChart3 className="h-5 w-5 text-yellow-600" />
                         Total Media Files
                       </h3>
                       <p className="text-sm text-muted-foreground">Media files by type over time</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <Select value={directoryTimeView} onValueChange={setDirectoryTimeView}>
                         <SelectTrigger className="w-[120px]">
                           <SelectValue placeholder="View" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="daily">
                             <span className="flex items-center gap-2">
                               <Calendar className="h-4 w-4" />
                               Daily
                             </span>
                           </SelectItem>
                           <SelectItem value="monthly">
                             <span className="flex items-center gap-2">
                               <CalendarDays className="h-4 w-4" />
                               Monthly
                             </span>
                           </SelectItem>
                           <SelectItem value="yearly">
                             <span className="flex items-center gap-2">
                               <CalendarRange className="h-4 w-4" />
                               Yearly
                             </span>
                           </SelectItem>
                         </SelectContent>
                       </Select>
                       <Select value={directoryDateRange} onValueChange={setDirectoryDateRange}>
                         <SelectTrigger className="w-[140px]">
                           <SelectValue placeholder="Date Range" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="7d">Last 7 days</SelectItem>
                           <SelectItem value="30d">Last 30 days</SelectItem>
                           <SelectItem value="6m">Last 6 months</SelectItem>
                           <SelectItem value="1y">Last 1 year</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
              </CardHeader>
              <CardContent>
                   <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={getDirectoryData()}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="date" 
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                         />
                         <YAxis
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => value.toLocaleString()}
                         />
                         <Tooltip
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '0.5rem',
                             boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                           }}
                           itemStyle={{ color: '#374151' }}
                           labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                           formatter={(value) => [value.toLocaleString(), 'Files']}
                         />
                         <Legend 
                           verticalAlign="top"
                           height={36}
                           iconType="circle"
                           formatter={(value) => (
                             <span style={{ color: '#374151', fontSize: '0.875rem' }}>{value}</span>
                           )}
                         />
                         <Bar
                           dataKey="images"
                           name="Images"
                           stackId="a"
                           fill={CHART_STYLES.lineChart.totalUsers}
                           radius={[0, 0, 0, 0]}
                         />
                         <Bar
                           dataKey="videos"
                           name="Videos"
                           stackId="a"
                           fill={CHART_STYLES.lineChart.newUsers}
                           radius={[0, 0, 0, 0]}
                         />
                         <Bar
                           dataKey="audios"
                           name="Audios"
                           stackId="a"
                           fill={CHART_STYLES.lineChart.activeUsers}
                           radius={[0, 0, 0, 0]}
                         />
                         <Bar
                           dataKey="documents"
                           name="Documents"
                           stackId="a"
                           fill={CHART_COLORS.yellow.dark}
                           radius={[4, 4, 0, 0]}
                         />
                       </BarChart>
                     </ResponsiveContainer>
                        </div>
                 </CardContent>
               </Card>

               {/* File Type Distribution */}
               <Card>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium flex items-center gap-2">
                         <PieChart className="h-5 w-5 text-yellow-600" />
                         File Type Distribution
                       </h3>
                       <p className="text-sm text-muted-foreground">Distribution of media files by type</p>
                      </div>
                </div>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <RechartsPieChart>
                         <Pie
                           data={[
                             { name: 'Images', value: directoryAnalyticsData.totalFiles.images },
                             { name: 'Videos', value: directoryAnalyticsData.totalFiles.videos },
                             { name: 'Audios', value: directoryAnalyticsData.totalFiles.audios },
                             { name: 'Documents', value: directoryAnalyticsData.totalFiles.documents }
                           ]}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           outerRadius={150}
                           fill="#8884d8"
                           dataKey="value"
                           nameKey="name"
                           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                         >
                           {[
                             CHART_STYLES.lineChart.totalUsers,
                             CHART_STYLES.lineChart.newUsers,
                             CHART_STYLES.lineChart.activeUsers,
                             CHART_COLORS.yellow.dark
                           ].map((color, index) => (
                             <Cell key={`cell-${index}`} fill={color} />
                           ))}
                         </Pie>
                         <Tooltip
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '0.5rem',
                             boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                           }}
                           itemStyle={{ color: '#374151' }}
                           formatter={(value) => [value.toLocaleString(), 'Files']}
                         />
                       </RechartsPieChart>
                     </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
             </div>
          </TabsContent>

          {/* Community Analytics */}
          <TabsContent value="community" className="space-y-6">
            {/* Community Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformData.community.metrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

             {/* Community Analytics Graphs */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Total Communities Graph */}
            <Card>
              <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium flex items-center gap-2">
                         <BarChart3 className="h-5 w-5 text-yellow-600" />
                         Total Communities
                       </h3>
                       <p className="text-sm text-muted-foreground">Number of communities over time</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <Select value={communityTimeView} onValueChange={setCommunityTimeView}>
                         <SelectTrigger className="w-[120px]">
                           <SelectValue placeholder="View" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="daily">
                             <span className="flex items-center gap-2">
                               <Calendar className="h-4 w-4" />
                               Daily
                             </span>
                           </SelectItem>
                           <SelectItem value="monthly">
                             <span className="flex items-center gap-2">
                               <CalendarDays className="h-4 w-4" />
                               Monthly
                             </span>
                           </SelectItem>
                           <SelectItem value="yearly">
                             <span className="flex items-center gap-2">
                               <CalendarRange className="h-4 w-4" />
                               Yearly
                             </span>
                           </SelectItem>
                         </SelectContent>
                       </Select>
                       <Select value={communityDateRange} onValueChange={setCommunityDateRange}>
                         <SelectTrigger className="w-[140px]">
                           <SelectValue placeholder="Date Range" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="7d">Last 7 days</SelectItem>
                           <SelectItem value="30d">Last 30 days</SelectItem>
                           <SelectItem value="6m">Last 6 months</SelectItem>
                           <SelectItem value="1y">Last 1 year</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
              </CardHeader>
              <CardContent>
                   <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={getCommunityData()}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="date" 
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                         />
                         <YAxis
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => value.toLocaleString()}
                         />
                         <Tooltip
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '0.5rem',
                             boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                           }}
                           itemStyle={{ color: '#374151' }}
                           labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                           formatter={(value) => [value.toLocaleString(), 'Communities']}
                         />
                         <Line
                           type="monotone"
                           dataKey="communities"
                           name="Total Communities"
                           stroke={CHART_STYLES.lineChart.totalUsers}
                           strokeWidth={2}
                           dot={false}
                           activeDot={{ r: 4, fill: CHART_STYLES.lineChart.totalUsers }}
                         />
                       </LineChart>
                     </ResponsiveContainer>
                        </div>
                 </CardContent>
               </Card>

               {/* Community Creators Graph */}
               <Card>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium flex items-center gap-2">
                         <Users className="h-5 w-5 text-yellow-600" />
                         Community Creators
                       </h3>
                       <p className="text-sm text-muted-foreground">Users creating communities</p>
                      </div>
                </div>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={getCommunityData()}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="date" 
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                         />
                         <YAxis
                           stroke="#6b7280"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => value.toLocaleString()}
                         />
                         <Tooltip
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '0.5rem',
                             boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                           }}
                           itemStyle={{ color: '#374151' }}
                           labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                           formatter={(value) => [value.toLocaleString(), 'Creators']}
                         />
                         <Bar
                           dataKey="uniqueUsers"
                           name="Unique Users"
                           fill={CHART_STYLES.lineChart.activeUsers}
                           radius={[4, 4, 0, 0]}
                         />
                       </BarChart>
                     </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
