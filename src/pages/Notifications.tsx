import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
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
  EyeOff,
  Database,
  Sparkles
} from 'lucide-react';

const formatRelativeTime = (dateString: string) => {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'Just now';
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
};

const Notifications = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profile?.id) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Notifications table query failed", error);
        } else {
          setNotifications(data || []);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let subscription: any;
    if (profile?.id) {
      subscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`
        }, () => {
          fetchNotifications();
        })
        .subscribe();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [profile?.id]);

  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'job', label: 'Jobs' },
    { value: 'connection', label: 'Connections' },
    { value: 'project', label: 'Projects' },
    { value: 'event', label: 'Events' },
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
      high: { color: 'bg-red-150 text-red-800 dark:bg-red-950/40 dark:text-red-300', label: 'High' },
      medium: { color: 'bg-yellow-150 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300', label: 'Medium' },
      low: { color: 'bg-green-150 text-green-800 dark:bg-green-950/40 dark:text-green-300', label: 'Low' }
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
      profile: Eye,
      system: AlertTriangle
    };
    return typeConfig[type as keyof typeof typeConfig] || Bell;
  };

  const handleMarkAsRead = async (notificationId: string | number) => {    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n));
      toast({
        title: "Notification marked as read",
        description: "The notification has been marked as read.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notification as read.",
      });
    }
  };

  const handleMarkAllAsRead = async () => {    if (!profile?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('user_id', profile.id)
        .eq('status', 'unread');

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
      toast({
        title: "All notifications marked as read",
        description: "All unread notifications have been marked as read.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all notifications as read.",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string | number) => {    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast({
        title: "Notification deleted",
        description: "The notification has been deleted.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification.",
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = filteredNotifications.filter(n => n.status === 'unread').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Bell className="w-3 h-3 mr-1" />
              {notifications.length} Total
            </Badge>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
                className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
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
                <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
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
                  notification.status === 'unread' ? 'border-l-4 border-l-yellow-500 bg-yellow-50/30' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.status === 'unread' 
                        ? 'bg-yellow-100 text-yellow-600' 
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
                              {notification.created_at ? formatRelativeTime(notification.created_at) : (notification.time || "Recently")}
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
                              className="text-yellow-600 hover:text-yellow-700"
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                            onClick={() => {
                              if (notification.action_url) {
                                navigate(notification.action_url);
                              } else {
                                if (notification.type === 'job') navigate('/jobs');
                                else if (notification.type === 'connection') navigate('/connections');
                                else if (notification.type === 'project') navigate('/projects');
                              }
                            }}
                          >
                            {notification.action || (notification.type === 'connection' ? 'View Requests' : 'View Detail')}
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
                  className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
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
                    <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Connection requests</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Project updates</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Event reminders</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">Configure</Button>
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
                    <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Email notifications</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">SMS notifications</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">Configure</Button>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
              <Button variant="outline" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
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
