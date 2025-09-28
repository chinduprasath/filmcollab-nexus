import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  Users,
  Briefcase,
  Calendar,
  AlertTriangle,
  Check,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react';

const Notifications = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      title: "New job posted",
      description: "Senior Director position at Netflix Studios",
      type: "job",
      status: "unread",
      time: "5 minutes ago",
      timestamp: "2024-01-15T10:30:00Z",
      priority: "high",
      icon: Briefcase,
      action: "View Job"
    },
    {
      id: 2,
      title: "Connection request",
      description: "John Smith wants to connect with you",
      type: "connection",
      status: "unread",
      time: "1 hour ago",
      timestamp: "2024-01-15T09:30:00Z",
      priority: "medium",
      icon: Users,
      action: "View Profile"
    },
    {
      id: 3,
      title: "Project update",
      description: "Your project 'Indie Film' has a new comment from Sarah Johnson",
      type: "project",
      status: "read",
      time: "2 hours ago",
      timestamp: "2024-01-15T08:30:00Z",
      priority: "low",
      icon: MessageSquare,
      action: "View Project"
    },
    {
      id: 4,
      title: "Event reminder",
      description: "Film Festival Workshop starts in 2 hours",
      type: "event",
      status: "read",
      time: "3 hours ago",
      timestamp: "2024-01-15T07:30:00Z",
      priority: "high",
      icon: Calendar,
      action: "View Event"
    },
    {
      id: 5,
      title: "System maintenance",
      description: "Scheduled maintenance will occur tonight from 2-4 AM PST",
      type: "system",
      status: "read",
      time: "1 day ago",
      timestamp: "2024-01-14T10:30:00Z",
      priority: "medium",
      icon: AlertTriangle,
      action: "Learn More"
    },
    {
      id: 6,
      title: "Profile view",
      description: "Mike Chen viewed your profile",
      type: "profile",
      status: "read",
      time: "2 days ago",
      timestamp: "2024-01-13T15:30:00Z",
      priority: "low",
      icon: Eye,
      action: "View Profile"
    },
    {
      id: 7,
      title: "Job application update",
      description: "Your application for 'Video Editor' position has been reviewed",
      type: "job",
      status: "read",
      time: "3 days ago",
      timestamp: "2024-01-12T14:30:00Z",
      priority: "high",
      icon: Briefcase,
      action: "View Application"
    },
    {
      id: 8,
      title: "New message",
      description: "You have a new message from Alex Rodriguez",
      type: "message",
      status: "read",
      time: "4 days ago",
      timestamp: "2024-01-11T16:30:00Z",
      priority: "medium",
      icon: MessageSquare,
      action: "View Message"
    }
  ];

  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'job', label: 'Jobs' },
    { value: 'connection', label: 'Connections' },
    { value: 'project', label: 'Projects' },
    { value: 'event', label: 'Events' },
    { value: 'message', label: 'Messages' },
    { value: 'profile', label: 'Profile' },
    { value: 'system', label: 'System' }
  ];

  const notificationStatuses = [
    { value: 'all', label: 'All Status' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' }
  ];

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 text-red-800', label: 'High' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      low: { color: 'bg-green-100 text-green-800', label: 'Low' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = {
      job: Briefcase,
      connection: Users,
      project: MessageSquare,
      event: Calendar,
      message: MessageSquare,
      profile: Eye,
      system: AlertTriangle
    };
    return typeConfig[type as keyof typeof typeConfig] || Bell;
  };

  const handleMarkAsRead = (notificationId: number) => {
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    toast({
      title: "All notifications marked as read",
      description: "All unread notifications have been marked as read.",
    });
  };

  const handleDeleteNotification = (notificationId: number) => {
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted.",
    });
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = mockNotifications.filter(n => n.status === 'unread').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Bell className="w-3 h-3 mr-1" />
              {mockNotifications.length} Total
            </Badge>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const IconComponent = getTypeIcon(notification.type);
            return (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-shadow ${
                  notification.status === 'unread' ? 'border-l-4 border-l-purple-500 bg-purple-50/30' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.status === 'unread' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${
                            notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </div>
                            {getPriorityBadge(notification.priority)}
                            {notification.status === 'unread' && (
                              <Badge variant="secondary" className="text-xs">
                                Unread
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {notification.status === 'unread' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You\'re all caught up! No new notifications.'
                }
              </p>
              {(searchQuery || filterType !== 'all' || filterStatus !== 'all') && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterStatus('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Job notifications</span>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Connection requests</span>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Project updates</span>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Event reminders</span>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Push notifications</span>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Email notifications</span>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">SMS notifications</span>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
              <Button variant="outline">
                Go to Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Notifications;
