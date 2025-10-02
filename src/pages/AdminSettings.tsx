import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Shield, 
  Users, 
  Mail, 
  Bell, 
  Database, 
  Server, 
  Globe, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Zap,
  Wifi,
  WifiOff
} from "lucide-react";
import { useState } from "react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);

  // Mock settings data
  const settingsData = {
    general: {
      siteName: "FilmCollab Nexus",
      siteDescription: "The ultimate platform for film industry collaboration and networking",
      siteUrl: "https://filmcollab-nexus.com",
      adminEmail: "admin@filmcollab.com",
      supportEmail: "support@filmcollab.com",
      timezone: "America/Los_Angeles",
      language: "en-US",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h"
    },
    security: {
      twoFactorRequired: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
      sslEnabled: true,
      encryptionLevel: "AES-256"
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      userReports: true,
      securityAlerts: true,
      maintenanceAlerts: true,
      weeklyReports: true,
      dailyDigest: false,
      realTimeAlerts: true
    },
    content: {
      autoModeration: true,
      profanityFilter: true,
      spamDetection: true,
      imageModeration: true,
      videoModeration: false,
      maxFileSize: 50,
      allowedFileTypes: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "pdf", "doc", "docx"],
      contentRetention: 365,
      backupFrequency: "daily"
    },
    users: {
      allowRegistration: true,
      requireEmailVerification: true,
      requireAdminApproval: false,
      maxUsersPerIP: 5,
      userSessionTimeout: 60,
      allowProfilePictures: true,
      allowCustomAvatars: true,
      defaultUserRole: "USER",
      allowRoleChanges: true
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: "INFO",
      cacheEnabled: true,
      cacheTTL: 3600,
      databaseBackup: true,
      autoUpdates: true,
      performanceMonitoring: true,
      errorReporting: true
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "content", label: "Content", icon: FileText },
    { id: "users", label: "Users", icon: Users },
    { id: "system", label: "System", icon: Server }
  ];


  const recentLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:00",
      level: "INFO",
      message: "User registration completed successfully",
      user: "john.doe@email.com"
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:25:00",
      level: "WARNING",
      message: "High memory usage detected on server",
      user: "system"
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:20:00",
      level: "ERROR",
      message: "Failed to send email notification",
      user: "system"
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:15:00",
      level: "INFO",
      message: "Database backup completed successfully",
      user: "system"
    }
  ];


  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "INFO":
        return "bg-yellow-100 text-yellow-800";
      case "WARNING":
        return "bg-yellow-100 text-yellow-800";
      case "ERROR":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            <p className="text-sm text-gray-600">Configure platform settings and system preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Settings
            </Button>
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
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Settings
                </>
              )}
            </Button>
          </div>
        </div>


        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Site Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settingsData.general.siteName}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={settingsData.general.siteUrl}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settingsData.general.adminEmail}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settingsData.general.supportEmail}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settingsData.general.siteDescription}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select disabled={!isEditing}>
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder={settingsData.general.timezone} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="Europe/London">London Time</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select disabled={!isEditing}>
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder={settingsData.general.language} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select disabled={!isEditing}>
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder={settingsData.general.dateFormat} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={settingsData.security.twoFactorRequired}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settingsData.security.sessionTimeout}
                      disabled={!isEditing}
                      className={`w-20 ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <p className="text-xs text-gray-500">Before account lockout</p>
                    </div>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settingsData.security.maxLoginAttempts}
                      disabled={!isEditing}
                      className={`w-20 ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Password Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="passwordMinLength">Minimum Length</Label>
                      <p className="text-xs text-gray-500">Minimum password characters</p>
                    </div>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settingsData.security.passwordMinLength}
                      disabled={!isEditing}
                      className={`w-20 ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireSpecialChars">Special Characters</Label>
                      <p className="text-xs text-gray-500">Require special characters</p>
                    </div>
                    <Switch
                      id="requireSpecialChars"
                      checked={settingsData.security.requireSpecialChars}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireNumbers">Numbers</Label>
                      <p className="text-xs text-gray-500">Require numbers</p>
                    </div>
                    <Switch
                      id="requireNumbers"
                      checked={settingsData.security.requireNumbers}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireUppercase">Uppercase Letters</Label>
                      <p className="text-xs text-gray-500">Require uppercase letters</p>
                    </div>
                    <Switch
                      id="requireUppercase"
                      checked={settingsData.security.requireUppercase}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Network Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sslEnabled">SSL/TLS Encryption</Label>
                    <p className="text-xs text-gray-500">Enable HTTPS encryption</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settingsData.security.sslEnabled ? (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        <Lock className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        <Unlock className="h-3 w-3 mr-1" />
                        Disabled
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <Textarea
                    id="ipWhitelist"
                    value={settingsData.security.ipWhitelist.join('\n')}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={3}
                    placeholder="Enter IP addresses or CIDR blocks, one per line"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <div className="space-y-3">
                    {Object.entries(settingsData.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={key} className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <p className="text-xs text-gray-500">
                            {key === 'emailNotifications' && 'Send email notifications to admins'}
                            {key === 'systemAlerts' && 'Critical system alerts and warnings'}
                            {key === 'userReports' && 'User-generated reports and flags'}
                            {key === 'securityAlerts' && 'Security-related notifications'}
                            {key === 'maintenanceAlerts' && 'Scheduled maintenance notifications'}
                            {key === 'weeklyReports' && 'Weekly platform performance reports'}
                            {key === 'dailyDigest' && 'Daily activity summary'}
                            {key === 'realTimeAlerts' && 'Real-time critical alerts'}
                          </p>
                        </div>
                        <Switch
                          id={key}
                          checked={value}
                          disabled={!isEditing}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Moderation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoModeration">Auto Moderation</Label>
                      <p className="text-xs text-gray-500">Automatically moderate content</p>
                    </div>
                    <Switch
                      id="autoModeration"
                      checked={settingsData.content.autoModeration}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profanityFilter">Profanity Filter</Label>
                      <p className="text-xs text-gray-500">Filter inappropriate language</p>
                    </div>
                    <Switch
                      id="profanityFilter"
                      checked={settingsData.content.profanityFilter}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="spamDetection">Spam Detection</Label>
                      <p className="text-xs text-gray-500">Detect and filter spam content</p>
                    </div>
                    <Switch
                      id="spamDetection"
                      checked={settingsData.content.spamDetection}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="imageModeration">Image Moderation</Label>
                      <p className="text-xs text-gray-500">Moderate uploaded images</p>
                    </div>
                    <Switch
                      id="imageModeration"
                      checked={settingsData.content.imageModeration}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="h-5 w-5" />
                    File Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settingsData.content.maxFileSize}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                    <Input
                      id="allowedFileTypes"
                      value={settingsData.content.allowedFileTypes.join(', ')}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      placeholder="jpg, png, gif, mp4, pdf"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentRetention">Content Retention (days)</Label>
                    <Input
                      id="contentRetention"
                      type="number"
                      value={settingsData.content.contentRetention}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select disabled={!isEditing}>
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder={settingsData.content.backupFrequency} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Settings */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowRegistration">Allow Registration</Label>
                      <p className="text-xs text-gray-500">Allow new user registrations</p>
                    </div>
                    <Switch
                      id="allowRegistration"
                      checked={settingsData.users.allowRegistration}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireEmailVerification">Email Verification</Label>
                      <p className="text-xs text-gray-500">Require email verification</p>
                    </div>
                    <Switch
                      id="requireEmailVerification"
                      checked={settingsData.users.requireEmailVerification}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireAdminApproval">Admin Approval</Label>
                      <p className="text-xs text-gray-500">Require admin approval for new users</p>
                    </div>
                    <Switch
                      id="requireAdminApproval"
                      checked={settingsData.users.requireAdminApproval}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowProfilePictures">Profile Pictures</Label>
                      <p className="text-xs text-gray-500">Allow users to upload profile pictures</p>
                    </div>
                    <Switch
                      id="allowProfilePictures"
                      checked={settingsData.users.allowProfilePictures}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="maxUsersPerIP">Max Users per IP</Label>
                    <Input
                      id="maxUsersPerIP"
                      type="number"
                      value={settingsData.users.maxUsersPerIP}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userSessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="userSessionTimeout"
                      type="number"
                      value={settingsData.users.userSessionTimeout}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultUserRole">Default Role</Label>
                    <Select disabled={!isEditing}>
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder={settingsData.users.defaultUserRole} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="CREATOR">Creator</SelectItem>
                        <SelectItem value="PRODUCER">Producer</SelectItem>
                        <SelectItem value="DIRECTOR">Director</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-xs text-gray-500">Put site in maintenance mode</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settingsData.system.maintenanceMode}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="debugMode">Debug Mode</Label>
                      <p className="text-xs text-gray-500">Enable debug logging</p>
                    </div>
                    <Switch
                      id="debugMode"
                      checked={settingsData.system.debugMode}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cacheEnabled">Cache Enabled</Label>
                      <p className="text-xs text-gray-500">Enable system caching</p>
                    </div>
                    <Switch
                      id="cacheEnabled"
                      checked={settingsData.system.cacheEnabled}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoUpdates">Auto Updates</Label>
                      <p className="text-xs text-gray-500">Automatically update system</p>
                    </div>
                    <Switch
                      id="autoUpdates"
                      checked={settingsData.system.autoUpdates}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select disabled={!isEditing}>
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder={settingsData.system.logLevel} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEBUG">Debug</SelectItem>
                        <SelectItem value="INFO">Info</SelectItem>
                        <SelectItem value="WARNING">Warning</SelectItem>
                        <SelectItem value="ERROR">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cacheTTL">Cache TTL (seconds)</Label>
                    <Input
                      id="cacheTTL"
                      type="number"
                      value={settingsData.system.cacheTTL}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="databaseBackup">Database Backup</Label>
                      <p className="text-xs text-gray-500">Enable automatic backups</p>
                    </div>
                    <Switch
                      id="databaseBackup"
                      checked={settingsData.system.databaseBackup}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="performanceMonitoring">Performance Monitoring</Label>
                      <p className="text-xs text-gray-500">Monitor system performance</p>
                    </div>
                    <Switch
                      id="performanceMonitoring"
                      checked={settingsData.system.performanceMonitoring}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent System Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Badge className={getLogLevelColor(log.level)}>
                            {log.level}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 mt-1">{log.message}</p>
                        <p className="text-xs text-gray-500 mt-1">User: {log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
