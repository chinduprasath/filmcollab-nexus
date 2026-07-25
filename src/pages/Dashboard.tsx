import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Briefcase,
  Heart, 
  Users, 
  FolderOpen, 
  TrendingUp,
  Calendar,
  Image
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [connectionsCount, setConnectionsCount] = React.useState("0");
  const [profileLikesCount, setProfileLikesCount] = React.useState("0");
  const [projectsCount, setProjectsCount] = React.useState("0");
  const [jobsAppliedCount, setJobsAppliedCount] = React.useState("0");

  React.useEffect(() => {
    if (!loading && isAdmin && isAdmin()) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [loading, isAdmin, navigate]);

  React.useEffect(() => {
    const profileDbId = profile?.id;
    const currentUserId = user?.id || profile?.user_id || profileDbId;

    if (profileDbId) {
      // Connections
      supabase
        .from("connections")
        .select("id", { count: 'exact', head: true })
        .eq("status", "accepted")
        .or(`user_id.eq.${profileDbId},connected_user_id.eq.${profileDbId}`)
        .then(({ count, error }) => {
          if (!error && count !== null) {
            setConnectionsCount(count.toString());
          }
        });

      // Profile Likes
      supabase
        .from("user_likes")
        .select("id", { count: 'exact', head: true })
        .eq("liked_user_id", profileDbId)
        .then(({ count, error }) => {
          if (!error && count !== null) {
            setProfileLikesCount(count.toString());
          } else if ((profile as any)?.likes_count !== undefined) {
            setProfileLikesCount(((profile as any).likes_count || 0).toString());
          }
        });
    }

    if (currentUserId) {
      // Projects
      Promise.all([
        supabase.from("projects").select("id").eq("created_by", currentUserId),
        supabase.from("project_members").select("project_id").eq("user_id", currentUserId)
      ]).then(([createdRes, joinedRes]) => {
        const pSet = new Set<string>();
        if (createdRes.data) createdRes.data.forEach((p: any) => pSet.add(p.id));
        if (joinedRes.data) joinedRes.data.forEach((p: any) => p.project_id && pSet.add(p.project_id));
        setProjectsCount(pSet.size.toString());
      }).catch(() => {});

      // Jobs Applied
      let localAppliedCount = 0;
      try {
        const stored = localStorage.getItem(`applied_jobs_${currentUserId}`);
        if (stored) {
          const arr = JSON.parse(stored);
          if (Array.isArray(arr)) localAppliedCount = arr.length;
        }
      } catch (e) {
        console.error(e);
      }

      supabase
        .from("job_applications")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", currentUserId)
        .then(({ count, error }) => {
          if (!error && count !== null && count > 0) {
            setJobsAppliedCount(Math.max(count, localAppliedCount).toString());
          } else {
            setJobsAppliedCount(localAppliedCount.toString());
          }
        }).catch(() => {
          setJobsAppliedCount(localAppliedCount.toString());
        });
    }
  }, [profile, user]);

  const stats = [
    {
      title: "Profile Likes",
      value: profileLikesCount,
      icon: Heart,
      description: "Total profile likes",
      color: "text-yellow-600"
    },
    {
      title: "Connections",
      value: connectionsCount,
      icon: Users,
      description: "Network size",
      color: "text-yellow-600"
    },
    {
      title: "Projects",
      value: projectsCount,
      icon: FolderOpen,
      description: "Created & joined",
      color: "text-yellow-600"
    },
    {
      title: "Jobs Applied",
      value: jobsAppliedCount,
      icon: Briefcase,
      description: "Total jobs applied",
      color: "text-yellow-600"
    }
  ];

  const quickActions = [
    {
      title: "Post a Job",
      description: "Share new opportunities",
      icon: Briefcase,
      href: "/jobs",
      color: "bg-yellow-500"
    },
    {
      title: "Start Project",
      description: "Create a new collaboration",
      icon: FolderOpen,
      href: "/projects",
      color: "bg-yellow-600"
    },
    {
      title: "Find Connections",
      description: "Discover new professionals",
      icon: Users,
      href: "/discover",
      color: "bg-yellow-500"
    },
    {
      title: "Directory",
      description: "Explore portfolio & files",
      icon: Image,
      href: "/directory",
      color: "bg-yellow-600"
    }
  ];

  const events = [
    {
      type: "ongoing",
      title: "Film Festival Workshop",
      description: "Cinematography Masterclass",
      time: "Ongoing",
      location: "Los Angeles Convention Center",
      status: "Live Now"
    },
    {
      type: "upcoming",
      title: "Industry Networking Event",
      description: "Meet fellow filmmakers and producers",
      time: "Tomorrow, 6:00 PM",
      location: "Hollywood Studios",
      status: "Upcoming"
    },
    {
      type: "upcoming",
      title: "Script Writing Workshop",
      description: "Learn advanced storytelling techniques",
      time: "Jan 20, 2:00 PM",
      location: "Online Event",
      status: "Upcoming"
    },
    {
      type: "ongoing",
      title: "Post-Production Meetup",
      description: "Share your latest projects",
      time: "Ongoing",
      location: "Virtual Meeting",
      status: "Live Now"
    }
  ];

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.first_name || profile?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's what's happening in your film industry network today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="hover:shadow-soft transition-shadow border-yellow-200 dark:border-gray-700 bg-white dark:bg-background"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color} dark:text-yellow-400`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="border-yellow-200 dark:border-gray-700 bg-white dark:bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Get started with these popular actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-auto p-4 justify-start text-left hover:bg-yellow-50 dark:hover:bg-gray-700/50"
                    onClick={() => navigate(action.href)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${action.color} dark:bg-yellow-500/20 text-white`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{action.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="border-yellow-200 dark:border-gray-700 bg-white dark:bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                Ongoing & Upcoming Events
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Stay updated with current and upcoming industry events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => navigate("/industry-hub")}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      event.type === 'ongoing' 
                        ? 'bg-yellow-500 dark:bg-yellow-400' 
                        : 'bg-yellow-400 dark:bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.type === 'ongoing' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300' 
                            : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {event.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {event.location} • {event.time}
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