import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Bell,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminNotifications() {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "user",
      title: "New user registration",
      message: "5 new users registered today",
      time: "10 minutes ago",
      isUnread: true,
      icon: Users,
      color: "text-yellow-600"
    },
    {
      id: 2,
      type: "content",
      title: "Content flagged",
      message: "A post has been reported by users",
      time: "30 minutes ago",
      isUnread: true,
      icon: AlertTriangle,
      color: "text-yellow-600"
    },
    {
      id: 3,
      type: "system",
      title: "System backup completed",
      message: "Daily backup finished successfully",
      time: "2 hours ago",
      isUnread: false,
      icon: CheckCircle2,
      color: "text-green-600"
    }
  ];

  // Filter notifications based on search and type
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout pageTitle="Notifications">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">View and manage your notifications</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
            onClick={() => console.log("Mark all as read")}
          >
            Mark all read
          </Button>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                All Notifications
              </CardTitle>
              <div className="flex items-center gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const NotificationIcon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                      notification.isUnread
                        ? "bg-yellow-50/50 border-yellow-100"
                        : "bg-white border-gray-200",
                      "hover:border-yellow-200"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-full",
                      notification.isUnread ? "bg-yellow-100" : "bg-gray-100"
                    )}>
                      <NotificationIcon className={cn(
                        "h-5 w-5",
                        notification.isUnread ? "text-yellow-600" : "text-gray-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                            {notification.title}
                            {notification.isUnread && (
                              <span className="h-2 w-2 rounded-full bg-yellow-500" />
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
