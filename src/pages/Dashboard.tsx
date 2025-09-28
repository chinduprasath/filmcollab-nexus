import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Briefcase, 
  Users, 
  FolderOpen, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  Bell,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Active Jobs",
      value: "156",
      icon: Briefcase,
      description: "+12% from last month",
      color: "text-blue-600"
    },
    {
      title: "Connections",
      value: "89",
      icon: Users,
      description: "+5 new this week",
      color: "text-green-600"
    },
    {
      title: "Projects",
      value: "23",
      icon: FolderOpen,
      description: "3 in progress",
      color: "text-purple-600"
    },
    {
      title: "Messages",
      value: "12",
      icon: MessageCircle,
      description: "4 unread",
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Post a Job",
      description: "Share new opportunities",
      icon: Briefcase,
      href: "/jobs",
      color: "bg-blue-500"
    },
    {
      title: "Start Project",
      description: "Create a new collaboration",
      icon: FolderOpen,
      href: "/projects",
      color: "bg-purple-500"
    },
    {
      title: "Find Connections",
      description: "Discover new professionals",
      icon: Users,
      href: "/discover",
      color: "bg-green-500"
    },
    {
      title: "Join Community",
      description: "Engage in discussions",
      icon: MessageCircle,
      href: "/community",
      color: "bg-orange-500"
    }
  ];

  const recentActivity = [
    {
      type: "job",
      title: "New job posted: Senior Director",
      time: "2 hours ago",
      company: "Netflix Studios"
    },
    {
      type: "connection",
      title: "John Smith accepted your connection",
      time: "4 hours ago",
      company: "Warner Bros"
    },
    {
      type: "project",
      title: "Project 'Indie Film' needs a cinematographer",
      time: "6 hours ago",
      company: "Independent"
    },
    {
      type: "message",
      title: "New message from Sarah Johnson",
      time: "1 day ago",
      company: "Disney Studios"
    }
  ];

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.first_name || profile?.full_name || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening in your film industry network today.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Quick Post
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-soft transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with these popular actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-auto p-4 justify-start text-left hover:bg-secondary/50"
                    onClick={() => navigate(action.href)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Stay updated with the latest happenings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {activity.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {activity.company} • {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}