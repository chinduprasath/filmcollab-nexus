import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Settings, 
  Key, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X,
  Camera,
  Globe,
  Building,
  Award,
  Users,
  BarChart3
} from "lucide-react";
import { useState } from "react";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Mock admin data
  const adminData = {
    id: "ADM001",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@filmcollab.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    department: "Platform Management",
    location: "San Francisco, CA",
    joinDate: "2023-01-15",
    lastActive: "2024-01-15 14:30:00",
    avatar: "",
    permissions: [
      "User Management",
      "Content Moderation", 
      "Analytics Access",
      "System Configuration",
      "Security Management",
      "Database Access"
    ],
    stats: {
      totalUsers: 15420,
      moderatedPosts: 8934,
      resolvedReports: 1247,
      systemUptime: "99.9%"
    },
    recentActivity: [
      {
        id: 1,
        action: "Approved user registration",
        target: "john.doe@email.com",
        timestamp: "2024-01-15 14:25:00",
        type: "approval"
      },
      {
        id: 2,
        action: "Flagged inappropriate content",
        target: "Post #12345",
        timestamp: "2024-01-15 13:45:00",
        type: "moderation"
      },
      {
        id: 3,
        action: "Updated system settings",
        target: "Email notifications",
        timestamp: "2024-01-15 12:30:00",
        type: "configuration"
      },
      {
        id: 4,
        action: "Generated analytics report",
        target: "Monthly user growth",
        timestamp: "2024-01-15 11:15:00",
        type: "analytics"
      }
    ]
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "security", label: "Security", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "moderation":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "configuration":
        return <Settings className="h-4 w-4 text-blue-500" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-sm text-gray-600">Manage your admin account and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Shield className="h-3 w-3 mr-1" />
              {adminData.role}
            </Badge>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={adminData.avatar} alt={adminData.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl">
                    {adminData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{adminData.fullName}</h2>
                    <p className="text-gray-600">{adminData.role} • {adminData.department}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {adminData.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {adminData.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(adminData.joinDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      Last active: {new Date(adminData.lastActive).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={adminData.fullName}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={adminData.email}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={adminData.phone}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={adminData.location}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Admin Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Total Users</span>
                    </div>
                    <span className="font-semibold">{adminData.stats.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Moderated Posts</span>
                    </div>
                    <span className="font-semibold">{adminData.stats.moderatedPosts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">Resolved Reports</span>
                    </div>
                    <span className="font-semibold">{adminData.stats.resolvedReports.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600">System Uptime</span>
                    </div>
                    <span className="font-semibold text-green-600">{adminData.stats.systemUptime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {adminData.permissions.map((permission, index) => (
                    <Badge key={index} variant="secondary" className="justify-start p-3">
                      <Shield className="h-3 w-3 mr-2" />
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "activity" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Enabled
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Login Notifications</p>
                      <p className="text-xs text-gray-500">Get notified of new logins</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Enabled
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Session Timeout</p>
                      <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      30 minutes
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-gray-500">Receive updates via email</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Enabled
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">System Alerts</p>
                      <p className="text-xs text-gray-500">Critical system notifications</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Enabled
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Weekly Reports</p>
                      <p className="text-xs text-gray-500">Platform performance summaries</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Enabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Timezone</p>
                      <p className="text-xs text-gray-500">Pacific Standard Time (PST)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Language</p>
                      <p className="text-xs text-gray-500">English (US)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Date Format</p>
                      <p className="text-xs text-gray-500">MM/DD/YYYY</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
