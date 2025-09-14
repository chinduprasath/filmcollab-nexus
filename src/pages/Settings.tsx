import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  Palette,
  Key,
  Trash2,
  Download,
  Upload,
  Globe,
  Lock,
  EyeOff,
  Check,
  X,
  Camera,
  Save,
  AlertTriangle,
  Info
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);

  // Account Settings State
  const [accountData, setAccountData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    username: 'sarahj_filmmaker',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    bio: 'Independent filmmaker and producer passionate about storytelling through visual media. Always looking for creative collaborations.',
    location: 'Los Angeles, CA',
    website: 'https://sarahjohnsonfilms.com',
    birthday: '1990-05-15',
    gender: 'female',
    profession: 'Independent Filmmaker & Producer',
    company: 'SJ Productions',
    experience: '8+ years'
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showBirthday: false,
    allowMessages: 'everyone',
    allowConnectionRequests: 'everyone',
    showOnlineStatus: true,
    allowProfileViews: true,
    allowSearchEngines: false
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newMessages: true,
    connectionRequests: true,
    projectInvites: true,
    jobAlerts: true,
    industryNews: false,
    marketingEmails: false,
    weeklyDigest: true,
    eventReminders: true,
    deadlineAlerts: true
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    fontSize: 'medium',
    compactMode: false,
    showAvatars: true,
    showTimestamps: true,
    showReadReceipts: true
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordLastChanged: '2024-01-15',
    activeSessions: 2,
    trustedDevices: 3
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountChange = (field: string, value: string) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAppearanceChange = (field: string, value: string | boolean) => {
    setAppearanceSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean | string) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your account settings and preferences</p>
          </div>
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Account Secure
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/api/placeholder/80/80" alt="Profile" />
                    <AvatarFallback className="text-lg">SJ</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={accountData.firstName}
                      onChange={(e) => handleAccountChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={accountData.lastName}
                      onChange={(e) => handleAccountChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={accountData.username}
                      onChange={(e) => handleAccountChange('username', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountData.email}
                      onChange={(e) => handleAccountChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={accountData.bio}
                    onChange={(e) => handleAccountChange('bio', e.target.value)}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={accountData.phone}
                      onChange={(e) => handleAccountChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={accountData.location}
                      onChange={(e) => handleAccountChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={accountData.website}
                      onChange={(e) => handleAccountChange('website', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={accountData.birthday}
                      onChange={(e) => handleAccountChange('birthday', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={accountData.profession}
                      onChange={(e) => handleAccountChange('profession', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={accountData.company}
                      onChange={(e) => handleAccountChange('company', e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSave('Account')} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy & Visibility
                </CardTitle>
                <CardDescription>
                  Control who can see your information and how you appear to others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-gray-500">Who can view your profile</p>
                    </div>
                    <Select 
                      value={privacySettings.profileVisibility} 
                      onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="connections">Connections Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Email Address</Label>
                          <p className="text-sm text-gray-500">Display email on your profile</p>
                        </div>
                        <Switch
                          checked={privacySettings.showEmail}
                          onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Phone Number</Label>
                          <p className="text-sm text-gray-500">Display phone on your profile</p>
                        </div>
                        <Switch
                          checked={privacySettings.showPhone}
                          onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Location</Label>
                          <p className="text-sm text-gray-500">Display location on your profile</p>
                        </div>
                        <Switch
                          checked={privacySettings.showLocation}
                          onCheckedChange={(checked) => handlePrivacyChange('showLocation', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Birthday</Label>
                          <p className="text-sm text-gray-500">Display birthday on your profile</p>
                        </div>
                        <Switch
                          checked={privacySettings.showBirthday}
                          onCheckedChange={(checked) => handlePrivacyChange('showBirthday', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Communication</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Allow Messages From</Label>
                          <p className="text-sm text-gray-500">Who can send you messages</p>
                        </div>
                        <Select 
                          value={privacySettings.allowMessages} 
                          onValueChange={(value) => handlePrivacyChange('allowMessages', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="none">No One</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Allow Connection Requests</Label>
                          <p className="text-sm text-gray-500">Who can send connection requests</p>
                        </div>
                        <Select 
                          value={privacySettings.allowConnectionRequests} 
                          onValueChange={(value) => handlePrivacyChange('allowConnectionRequests', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="none">No One</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Activity & Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Online Status</Label>
                          <p className="text-sm text-gray-500">Let others see when you're online</p>
                        </div>
                        <Switch
                          checked={privacySettings.showOnlineStatus}
                          onCheckedChange={(checked) => handlePrivacyChange('showOnlineStatus', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Allow Profile Views</Label>
                          <p className="text-sm text-gray-500">Let others see when you view their profile</p>
                        </div>
                        <Switch
                          checked={privacySettings.allowProfileViews}
                          onCheckedChange={(checked) => handlePrivacyChange('allowProfileViews', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Allow Search Engines</Label>
                          <p className="text-sm text-gray-500">Allow search engines to index your profile</p>
                        </div>
                        <Switch
                          checked={privacySettings.allowSearchEngines}
                          onCheckedChange={(checked) => handlePrivacyChange('allowSearchEngines', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSave('Privacy')} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Privacy Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Channels</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Activity Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>New Messages</Label>
                          <p className="text-sm text-gray-500">Get notified about new messages</p>
                        </div>
                        <Switch
                          checked={notificationSettings.newMessages}
                          onCheckedChange={(checked) => handleNotificationChange('newMessages', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Connection Requests</Label>
                          <p className="text-sm text-gray-500">Get notified about connection requests</p>
                        </div>
                        <Switch
                          checked={notificationSettings.connectionRequests}
                          onCheckedChange={(checked) => handleNotificationChange('connectionRequests', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Project Invites</Label>
                          <p className="text-sm text-gray-500">Get notified about project invitations</p>
                        </div>
                        <Switch
                          checked={notificationSettings.projectInvites}
                          onCheckedChange={(checked) => handleNotificationChange('projectInvites', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Job Alerts</Label>
                          <p className="text-sm text-gray-500">Get notified about relevant job opportunities</p>
                        </div>
                        <Switch
                          checked={notificationSettings.jobAlerts}
                          onCheckedChange={(checked) => handleNotificationChange('jobAlerts', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Content & Updates</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Industry News</Label>
                          <p className="text-sm text-gray-500">Get notified about industry news and updates</p>
                        </div>
                        <Switch
                          checked={notificationSettings.industryNews}
                          onCheckedChange={(checked) => handleNotificationChange('industryNews', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Marketing Emails</Label>
                          <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                        </div>
                        <Switch
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Weekly Digest</Label>
                          <p className="text-sm text-gray-500">Receive weekly summary of activity</p>
                        </div>
                        <Switch
                          checked={notificationSettings.weeklyDigest}
                          onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Event Reminders</Label>
                          <p className="text-sm text-gray-500">Get reminded about upcoming events</p>
                        </div>
                        <Switch
                          checked={notificationSettings.eventReminders}
                          onCheckedChange={(checked) => handleNotificationChange('eventReminders', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Deadline Alerts</Label>
                          <p className="text-sm text-gray-500">Get notified about project deadlines</p>
                        </div>
                        <Switch
                          checked={notificationSettings.deadlineAlerts}
                          onCheckedChange={(checked) => handleNotificationChange('deadlineAlerts', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSave('Notification')} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance & Display
                </CardTitle>
                <CardDescription>
                  Customize how the interface looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select 
                        value={appearanceSettings.theme} 
                        onValueChange={(value) => handleAppearanceChange('theme', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select 
                        value={appearanceSettings.language} 
                        onValueChange={(value) => handleAppearanceChange('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select 
                        value={appearanceSettings.timezone} 
                        onValueChange={(value) => handleAppearanceChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select 
                        value={appearanceSettings.dateFormat} 
                        onValueChange={(value) => handleAppearanceChange('dateFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Time Format</Label>
                      <Select 
                        value={appearanceSettings.timeFormat} 
                        onValueChange={(value) => handleAppearanceChange('timeFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select 
                        value={appearanceSettings.fontSize} 
                        onValueChange={(value) => handleAppearanceChange('fontSize', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Display Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-gray-500">Use more compact spacing throughout the interface</p>
                        </div>
                        <Switch
                          checked={appearanceSettings.compactMode}
                          onCheckedChange={(checked) => handleAppearanceChange('compactMode', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Avatars</Label>
                          <p className="text-sm text-gray-500">Display user avatars in lists and comments</p>
                        </div>
                        <Switch
                          checked={appearanceSettings.showAvatars}
                          onCheckedChange={(checked) => handleAppearanceChange('showAvatars', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Timestamps</Label>
                          <p className="text-sm text-gray-500">Display timestamps on posts and messages</p>
                        </div>
                        <Switch
                          checked={appearanceSettings.showTimestamps}
                          onCheckedChange={(checked) => handleAppearanceChange('showTimestamps', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Read Receipts</Label>
                          <p className="text-sm text-gray-500">Show when messages have been read</p>
                        </div>
                        <Switch
                          checked={appearanceSettings.showReadReceipts}
                          onCheckedChange={(checked) => handleAppearanceChange('showReadReceipts', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSave('Appearance')} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Appearance Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Security & Authentication
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {/* Password Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-gray-500">
                          Last changed: {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={securitySettings.twoFactorAuth ? "default" : "secondary"}>
                          {securitySettings.twoFactorAuth ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={securitySettings.twoFactorAuth}
                          onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                        />
                      </div>
                    </div>
                    {securitySettings.twoFactorAuth && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2 text-green-800">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Two-factor authentication is active</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Login Alerts */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Login Alerts</Label>
                        <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                      </div>
                      <Switch
                        checked={securitySettings.loginAlerts}
                        onCheckedChange={(checked) => handleSecurityChange('loginAlerts', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Session Management */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Session Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Session Timeout</Label>
                          <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                        </div>
                        <Select 
                          value={securitySettings.sessionTimeout} 
                          onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                            <SelectItem value="480">8 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Active Sessions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Active Sessions</h4>
                        <p className="text-sm text-gray-500">
                          {securitySettings.activeSessions} active session(s)
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View All Sessions
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Trusted Devices */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Trusted Devices</h4>
                        <p className="text-sm text-gray-500">
                          {securitySettings.trustedDevices} trusted device(s)
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage Devices
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Data Export & Deletion */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Data Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Download className="w-5 h-5 text-blue-500" />
                          <h5 className="font-medium">Export Data</h5>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          Download a copy of your account data
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Request Export
                        </Button>
                      </div>
                      <div className="p-4 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Trash2 className="w-5 h-5 text-red-500" />
                          <h5 className="font-medium">Delete Account</h5>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          Permanently delete your account and all data
                        </p>
                        <Button variant="destructive" size="sm" className="w-full">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSave('Security')} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
