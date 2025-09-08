import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  FileText, 
  BarChart3, 
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const adminStats = [
    {
      title: "Total Users",
      value: "1,247",
      icon: Users,
      description: "+12% from last month",
      color: "text-blue-600"
    },
    {
      title: "Active Jobs",
      value: "89",
      icon: FileText,
      description: "15 posted today",
      color: "text-green-600"
    },
    {
      title: "Reports",
      value: "23",
      icon: BarChart3,
      description: "5 pending review",
      color: "text-orange-600"
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: Shield,
      description: "All systems operational",
      color: "text-green-600"
    }
  ];

  const quickActions = [
    {
      title: "User Management",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin-dashboard/users",
      color: "bg-blue-500"
    },
    {
      title: "Content Reports",
      description: "Review flagged content",
      icon: AlertTriangle,
      href: "/admin-dashboard/reports",
      color: "bg-orange-500"
    },
    {
      title: "System Settings",
      description: "Configure system parameters",
      icon: Shield,
      href: "/admin-dashboard/settings",
      color: "bg-purple-500"
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      icon: BarChart3,
      href: "/admin-dashboard/analytics",
      color: "bg-green-500"
    }
  ];

  const recentActivity = [
    {
      type: "user",
      title: "New user registration",
      description: "John Doe joined the platform",
      time: "5 minutes ago",
      status: "success"
    },
    {
      type: "report",
      title: "Content flagged",
      description: "Post reported by multiple users",
      time: "15 minutes ago",
      status: "warning"
    },
    {
      type: "system",
      title: "Backup completed",
      description: "Daily system backup finished",
      time: "1 hour ago",
      status: "success"
    },
    {
      type: "security",
      title: "Failed login attempts",
      description: "Multiple failed attempts detected",
      time: "2 hours ago",
      status: "error"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <AdminLayout pageTitle="Admin Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.first_name || profile?.full_name || 'Admin'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's your system overview and recent activity.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-destructive/20 text-destructive hover:bg-destructive/5">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-destructive to-orange-500 text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              System Status
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-soft transition-shadow border-border/50">
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
                <TrendingUp className="h-5 w-5 text-destructive" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-auto p-4 justify-start text-left hover:bg-destructive/5"
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
                <Clock className="h-5 w-5 text-destructive" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest system events and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const StatusIcon = getStatusIcon(activity.status);
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-destructive/5 transition-colors">
                      <StatusIcon className={`h-4 w-4 mt-1 ${getStatusColor(activity.status)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {activity.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              System Status
            </CardTitle>
            <CardDescription>
              Current system health and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">124ms</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">1,247</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}