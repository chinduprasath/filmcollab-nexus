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
  LineChart,
  Image,
  Eye,
  Heart,
  Share2,
  UserPlus,
  Target,
  Zap
} from "lucide-react";

export default function AdminAnalytics() {
  // Platform-specific analytics data
  const platformData = {
    users: {
      metrics: [
        { title: "Total Users", value: "15,420", change: "+12.5%", icon: Users, color: "text-blue-600" },
        { title: "New Users (30d)", value: "1,284", change: "+8.3%", icon: UserPlus, color: "text-green-600" },
        { title: "Active Users", value: "8,932", change: "+15.2%", icon: Activity, color: "text-purple-600" },
        { title: "User Retention", value: "78.5%", change: "+2.1%", icon: Target, color: "text-orange-600" }
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
        { title: "Posts (30d)", value: "2,847", change: "+22.1%", icon: FileText, color: "text-blue-500" },
        { title: "Post Engagement", value: "4.2k", change: "+31.5%", icon: Heart, color: "text-red-500" },
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
        { title: "Total Projects", value: "3,247", change: "+14.2%", icon: FolderOpen, color: "text-purple-600" },
        { title: "Active Projects", value: "1,892", change: "+9.8%", icon: Zap, color: "text-yellow-600" },
        { title: "Completed", value: "1,355", change: "+16.3%", icon: Target, color: "text-green-600" },
        { title: "Project Views", value: "89.3k", change: "+19.4%", icon: Eye, color: "text-blue-600" }
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
        { title: "Total Jobs", value: "1,247", change: "+21.3%", icon: Briefcase, color: "text-orange-600" },
        { title: "Active Jobs", value: "456", change: "+12.7%", icon: Briefcase, color: "text-green-600" },
        { title: "Applications", value: "8,932", change: "+28.9%", icon: UserCheck, color: "text-blue-600" },
        { title: "Job Views", value: "67.4k", change: "+33.1%", icon: Eye, color: "text-purple-600" }
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
        { title: "Images", value: "32,456", change: "+15.2%", icon: Image, color: "text-blue-500" },
        { title: "Videos", value: "8,234", change: "+24.7%", icon: FileText, color: "text-red-500" },
        { title: "Downloads", value: "234.5k", change: "+29.3%", icon: Download, color: "text-green-600" }
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
        { title: "Connections", value: "18,347", change: "+22.8%", icon: UserCheck, color: "text-purple-600" },
        { title: "Groups", value: "892", change: "+11.4%", icon: Users, color: "text-indigo-600" },
        { title: "Shares", value: "45,678", change: "+41.7%", icon: Share2, color: "text-orange-600" }
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
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Users Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  User Growth Over Time
                </CardTitle>
                <p className="text-sm text-muted-foreground">Total, new, and active users by month</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {platformData.users.chartData.map((data, index) => {
                    const maxValue = Math.max(...platformData.users.chartData.map(d => d.total));
                    const totalHeight = (data.total / maxValue) * 180;
                    const newHeight = (data.new / maxValue) * 180;
                    const activeHeight = (data.active / maxValue) * 180;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex flex-col gap-1 w-full h-48">
                          <div 
                            className="w-full bg-blue-600 rounded-t-sm transition-all duration-300 hover:bg-blue-700"
                            style={{ height: `${totalHeight}px` }}
                            title={`${data.month} Total: ${data.total}`}
                          />
                          <div 
                            className="w-full bg-green-600 transition-all duration-300 hover:bg-green-700"
                            style={{ height: `${newHeight}px` }}
                            title={`${data.month} New: ${data.new}`}
                          />
                          <div 
                            className="w-full bg-purple-600 rounded-b-sm transition-all duration-300 hover:bg-purple-700"
                            style={{ height: `${activeHeight}px` }}
                            title={`${data.month} Active: ${data.active}`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Total Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">New Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Active Users</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Posts Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-indigo-600" />
                  Posts Performance Over Time
                </CardTitle>
                <p className="text-sm text-muted-foreground">Total posts, new posts, and views by month</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {platformData.posts.chartData.map((data, index) => {
                    const maxValue = Math.max(...platformData.posts.chartData.map(d => d.total));
                    const totalHeight = (data.total / maxValue) * 180;
                    const newHeight = (data.new / maxValue) * 180;
                    const viewsHeight = (data.views / maxValue) * 180;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex flex-col gap-1 w-full h-48">
                          <div 
                            className="w-full bg-indigo-600 rounded-t-sm transition-all duration-300 hover:bg-indigo-700"
                            style={{ height: `${totalHeight}px` }}
                            title={`${data.month} Total: ${data.total}`}
                          />
                          <div 
                            className="w-full bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                            style={{ height: `${newHeight}px` }}
                            title={`${data.month} New: ${data.new}`}
                          />
                          <div 
                            className="w-full bg-teal-600 rounded-b-sm transition-all duration-300 hover:bg-teal-700"
                            style={{ height: `${viewsHeight}px` }}
                            title={`${data.month} Views: ${data.views.toLocaleString()}`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Total Posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs text-muted-foreground">New Posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Projects Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Projects Status Over Time
                </CardTitle>
                <p className="text-sm text-muted-foreground">Total, active, completed projects and views by month</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {platformData.projects.chartData.map((data, index) => {
                    const maxValue = Math.max(...platformData.projects.chartData.map(d => d.total));
                    const totalHeight = (data.total / maxValue) * 180;
                    const activeHeight = (data.active / maxValue) * 180;
                    const completedHeight = (data.completed / maxValue) * 180;
                    const viewsHeight = (data.views / maxValue) * 180;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex flex-col gap-1 w-full h-48">
                          <div 
                            className="w-full bg-purple-600 rounded-t-sm transition-all duration-300 hover:bg-purple-700"
                            style={{ height: `${totalHeight}px` }}
                            title={`${data.month} Total: ${data.total}`}
                          />
                          <div 
                            className="w-full bg-yellow-600 transition-all duration-300 hover:bg-yellow-700"
                            style={{ height: `${activeHeight}px` }}
                            title={`${data.month} Active: ${data.active}`}
                          />
                          <div 
                            className="w-full bg-green-600 transition-all duration-300 hover:bg-green-700"
                            style={{ height: `${completedHeight}px` }}
                            title={`${data.month} Completed: ${data.completed}`}
                          />
                          <div 
                            className="w-full bg-blue-600 rounded-b-sm transition-all duration-300 hover:bg-blue-700"
                            style={{ height: `${viewsHeight}px` }}
                            title={`${data.month} Views: ${data.views.toLocaleString()}`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Jobs Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-orange-600" />
                  Jobs Performance Over Time
                </CardTitle>
                <p className="text-sm text-muted-foreground">Total jobs, active jobs, applications, and views by month</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {platformData.jobs.chartData.map((data, index) => {
                    const maxValue = Math.max(...platformData.jobs.chartData.map(d => d.total));
                    const totalHeight = (data.total / maxValue) * 180;
                    const activeHeight = (data.active / maxValue) * 180;
                    const applicationsHeight = (data.applications / maxValue) * 180;
                    const viewsHeight = (data.views / maxValue) * 180;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex flex-col gap-1 w-full h-48">
                          <div 
                            className="w-full bg-orange-600 rounded-t-sm transition-all duration-300 hover:bg-orange-700"
                            style={{ height: `${totalHeight}px` }}
                            title={`${data.month} Total: ${data.total}`}
                          />
                          <div 
                            className="w-full bg-green-600 transition-all duration-300 hover:bg-green-700"
                            style={{ height: `${activeHeight}px` }}
                            title={`${data.month} Active: ${data.active}`}
                          />
                          <div 
                            className="w-full bg-blue-600 transition-all duration-300 hover:bg-blue-700"
                            style={{ height: `${applicationsHeight}px` }}
                            title={`${data.month} Applications: ${data.applications}`}
                          />
                          <div 
                            className="w-full bg-purple-600 rounded-b-sm transition-all duration-300 hover:bg-purple-700"
                            style={{ height: `${viewsHeight}px` }}
                            title={`${data.month} Views: ${data.views.toLocaleString()}`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Total Jobs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Applications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Directory Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-pink-600" />
                  Directory Content Over Time
                </CardTitle>
                <p className="text-sm text-muted-foreground">Total files, images, videos, and downloads by month</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {platformData.directory.chartData.map((data, index) => {
                    const maxValue = Math.max(...platformData.directory.chartData.map(d => d.total));
                    const totalHeight = (data.total / maxValue) * 180;
                    const imagesHeight = (data.images / maxValue) * 180;
                    const videosHeight = (data.videos / maxValue) * 180;
                    const downloadsHeight = (data.downloads / maxValue) * 180;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex flex-col gap-1 w-full h-48">
                          <div 
                            className="w-full bg-pink-600 rounded-t-sm transition-all duration-300 hover:bg-pink-700"
                            style={{ height: `${totalHeight}px` }}
                            title={`${data.month} Total: ${data.total.toLocaleString()}`}
                          />
                          <div 
                            className="w-full bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                            style={{ height: `${imagesHeight}px` }}
                            title={`${data.month} Images: ${data.images.toLocaleString()}`}
                          />
                          <div 
                            className="w-full bg-red-500 transition-all duration-300 hover:bg-red-600"
                            style={{ height: `${videosHeight}px` }}
                            title={`${data.month} Videos: ${data.videos.toLocaleString()}`}
                          />
                          <div 
                            className="w-full bg-green-600 rounded-b-sm transition-all duration-300 hover:bg-green-700"
                            style={{ height: `${downloadsHeight}px` }}
                            title={`${data.month} Downloads: ${data.downloads.toLocaleString()}`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Total Files</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs text-muted-foreground">Images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs text-muted-foreground">Videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Downloads</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-teal-600" />
                  Community Engagement Over Time
                </CardTitle>
                <p className="text-sm text-muted-foreground">Messages, connections, groups, and shares by month</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {platformData.community.chartData.map((data, index) => {
                    const maxValue = Math.max(...platformData.community.chartData.map(d => d.messages));
                    const messagesHeight = (data.messages / maxValue) * 180;
                    const connectionsHeight = (data.connections / maxValue) * 180;
                    const groupsHeight = (data.groups / maxValue) * 180;
                    const sharesHeight = (data.shares / maxValue) * 180;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex flex-col gap-1 w-full h-48">
                          <div 
                            className="w-full bg-teal-600 rounded-t-sm transition-all duration-300 hover:bg-teal-700"
                            style={{ height: `${messagesHeight}px` }}
                            title={`${data.month} Messages: ${data.messages.toLocaleString()}`}
                          />
                          <div 
                            className="w-full bg-purple-600 transition-all duration-300 hover:bg-purple-700"
                            style={{ height: `${connectionsHeight}px` }}
                            title={`${data.month} Connections: ${data.connections.toLocaleString()}`}
                          />
                          <div 
                            className="w-full bg-indigo-600 transition-all duration-300 hover:bg-indigo-700"
                            style={{ height: `${groupsHeight}px` }}
                            title={`${data.month} Groups: ${data.groups}`}
                          />
                          <div 
                            className="w-full bg-orange-600 rounded-b-sm transition-all duration-300 hover:bg-orange-700"
                            style={{ height: `${sharesHeight}px` }}
                            title={`${data.month} Shares: ${data.shares.toLocaleString()}`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Messages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Groups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-600 rounded"></div>
                    <span className="text-xs text-muted-foreground">Shares</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
