"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
// import { useRouter } from "next/navigation";
import { Search, Users, UserPlus, Clock, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Connection {
  id: string;
  name: string;
  role: string;
  location: string;
  connectedAt?: number;
  avatar: string; // initials
  avatar_url?: string;
  connection_id?: string;
}

interface PendingRequest {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  avatar_url?: string;
  direction: "received" | "sent";
  requestedAt: number;
  connection_id?: string;
}

interface Suggestion {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  avatar_url?: string;
  mutuals?: number;
}


type TabKey = "all" | "pending";
type SortKey = "recent" | "az" | "location";

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pendingView, setPendingView] = useState<"received" | "sent">("received");
  const [categories, setCategories] = useState<string[]>([
    "Producer", "Colorist", "Editor", "Cinematographer", "Sound Designer", "Composer", "VFX Artist", "Gaffer", "1st AC"
  ]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    if (!profile?.id) {
      // Guest session fallback
      const guestSession = localStorage.getItem("guest_session");
      if (guestSession) {
        const storedConns = localStorage.getItem("guest_connections");
        const storedPending = localStorage.getItem("guest_pending");
        if (storedConns) setConnections(JSON.parse(storedConns));
        else setConnections([]);

        if (storedPending) setPending(JSON.parse(storedPending));
        else setPending([]);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch connection records
      const { data: connData, error: connError } = await supabase
        .from("connections")
        .select("*")
        .or(`user_id.eq.${profile.id},connected_user_id.eq.${profile.id}`);

      if (connError) throw connError;

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const profileMap = new Map();
      profilesData?.forEach((p) => {
        profileMap.set(p.id, p);
      });

      const loadedConnections: Connection[] = [];
      const loadedPending: PendingRequest[] = [];

      connData?.forEach((c) => {
        const otherUserId = c.user_id === profile.id ? c.connected_user_id : c.user_id;
        const otherProfile = profileMap.get(otherUserId);
        
        if (!otherProfile) return;

        const initials = otherProfile.full_name
          ? otherProfile.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "U";

        if (c.status === "accepted") {
          loadedConnections.push({
            id: otherProfile.id,
            connection_id: c.id,
            name: otherProfile.full_name || "Anonymous",
            role: otherProfile.category || otherProfile.role || "Creator",
            location: otherProfile.location || "Unknown",
            connectedAt: c.created_at ? new Date(c.created_at).getTime() : Date.now(),
            avatar: initials,
            avatar_url: otherProfile.avatar_url || undefined,
          });
        } else if (c.status === "pending") {
          loadedPending.push({
            id: otherProfile.id,
            connection_id: c.id,
            name: otherProfile.full_name || "Anonymous",
            role: otherProfile.category || otherProfile.role || "Creator",
            location: otherProfile.location || "Unknown",
            avatar: initials,
            avatar_url: otherProfile.avatar_url || undefined,
            direction: c.user_id === profile.id ? "sent" : "received",
            requestedAt: c.created_at ? new Date(c.created_at).getTime() : Date.now(),
          });
        }
      });

      // Keep seed connections/pendings that don't conflict with database users
      const existingUserIds = new Set([
        ...loadedConnections.map((c) => c.id),
        ...loadedPending.map((p) => p.id),
      ]);

      
      

      setConnections(loadedConnections);
      setPending(loadedPending);

      // Generate smart suggestions excluding already connected / pending / self
      const extraSuggestions = profilesData?.filter((p) => {
        if (p.id === profile.id) return false;
        if (existingUserIds.has(p.id)) return false;
        const roleLower = (p.role || "").toLowerCase();
        if (roleLower === "admin") return false;
        return true;
      }).slice(0, 4).map((p) => {
        const initials = p.full_name
          ? p.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "U";
        return {
          id: p.id,
          name: p.full_name || "Anonymous",
          role: p.category || p.role || "Creator",
          location: p.location || "Unknown",
          avatar: initials,
          avatar_url: p.avatar_url || undefined,
          mutuals: Math.floor(Math.random() * 8) + 1,
        };
      }) || [];

      const existingSuggestionIds = new Set(extraSuggestions.map((s) => s.id));
      
      
      setSuggestions(extraSuggestions);

    } catch (err) {
      console.error("Error loading connections:", err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    const fetchDBCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .order("name", { ascending: true });
        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }
        if (data && data.length > 0) {
          const names = data.map((item) => item.name);
          setCategories(names);
        }
      } catch (err) {
        console.error("Error in fetchDBCategories:", err);
      }
    };
    fetchDBCategories();
  }, []);

  const filteredConnections = useMemo(() => {
    const q = search.toLowerCase();
    let items = connections.filter(
      (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
    if (selectedCategories.length > 0) {
      items = items.filter((c) => selectedCategories.includes(c.role));
    }
    if (sortBy === "recent") {
      items = items.sort((a, b) => (b.connectedAt ?? 0) - (a.connectedAt ?? 0));
    } else if (sortBy === "az") {
      items = items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "location") {
      items = items.sort((a, b) => a.location.localeCompare(b.location));
    }
    return items;
  }, [connections, search, sortBy, selectedCategories]);

  function handleOpenProfile(id: string) {
    navigate(`/profile/${id}`);
  }

  function handleMessage(id: string) {
    localStorage.setItem("active_chat_recipient_id", id);
    navigate("/messages");
  }

  async function handleRemove(id: string) {
    const conn = connections.find((c) => c.id === id);
    if (!conn) return;

    if (profile?.id) {
      try {
        const { error } = await supabase
          .from("connections")
          .delete()
          .or(`and(user_id.eq.${id},connected_user_id.eq.${profile.id}),and(user_id.eq.${profile.id},connected_user_id.eq.${id})`);

        if (error) throw error;
        toast({
          title: "Connection removed",
          description: `Removed connection with ${conn.name}.`,
        });
        fetchConnections();
      } catch (err) {
        console.error("Error removing connection:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove connection."
        });
      }
    } else {
      setConnections((prev) => prev.filter((c) => c.id !== id));
      const updatedConns = connections.filter((c) => c.id !== id);
      localStorage.setItem("guest_connections", JSON.stringify(updatedConns));
      toast({
        title: "Connection removed",
        description: `Removed connection with ${conn.name}.`,
      });
    }
  }

  async function handleAccept(requestId: string) {
    const req = pending.find((p) => p.id === requestId);
    if (!req) return;

    if (profile?.id) {
      try {
        const { error } = await supabase
          .from("connections")
          .update({ status: "accepted" })
          .or(`and(user_id.eq.${requestId},connected_user_id.eq.${profile.id}),and(user_id.eq.${profile.id},connected_user_id.eq.${requestId})`);

        if (error) throw error;
        toast({
          title: "Connection request accepted",
          description: `You are now connected with ${req.name}!`,
        });
        fetchConnections();
      } catch (err) {
        console.error("Error accepting request:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to accept connection request."
        });
      }
    } else {
      setPending((prev) => prev.filter((p) => p.id !== requestId));
      setConnections((prev) => [
        { id: req.id, name: req.name, role: req.role, location: req.location, avatar: req.avatar, connectedAt: Date.now() },
        ...prev,
      ]);
      const updatedPending = pending.filter((p) => p.id !== requestId);
      const updatedConns = [
        { id: req.id, name: req.name, role: req.role, location: req.location, avatar: req.avatar, connectedAt: Date.now() },
        ...connections,
      ];
      localStorage.setItem("guest_connections", JSON.stringify(updatedConns));
      localStorage.setItem("guest_pending", JSON.stringify(updatedPending));
      toast({
        title: "Connection request accepted",
        description: `You are now connected with ${req.name}!`,
      });
    }
  }

  async function handleDecline(requestId: string) {
    const req = pending.find((p) => p.id === requestId);
    if (!req) return;

    if (profile?.id) {
      try {
        const { error } = await supabase
          .from("connections")
          .delete()
          .or(`and(user_id.eq.${requestId},connected_user_id.eq.${profile.id}),and(user_id.eq.${profile.id},connected_user_id.eq.${requestId})`);

        if (error) throw error;
        toast({
          title: "Request declined",
          description: `Declined connection request from ${req.name}.`,
        });
        fetchConnections();
      } catch (err) {
        console.error("Error declining request:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to decline request."
        });
      }
    } else {
      setPending((prev) => prev.filter((p) => p.id !== requestId));
      const updatedPending = pending.filter((p) => p.id !== requestId);
      localStorage.setItem("guest_pending", JSON.stringify(updatedPending));
      toast({
        title: "Request declined",
        description: `Declined connection request from ${req.name}.`,
      });
    }
  }

  async function handleConnect(suggestionId: string) {
    const sug = suggestions.find((s) => s.id === suggestionId);
    if (!sug) return;

    if (profile?.id) {
      try {
        const { error } = await supabase
          .from("connections")
          .insert({
            user_id: profile.id,
            connected_user_id: suggestionId,
            status: "pending",
          });

        if (error) throw error;
        toast({
          title: "Request sent",
          description: `Connection request sent to ${sug.name}.`,
        });
        setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
        fetchConnections();
      } catch (err) {
        console.error("Error connecting:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send connection request."
        });
      }
    } else {
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
      setPending((prev) => [
        ...prev,
        { id: sug.id, name: sug.name, role: sug.role, location: sug.location, avatar: sug.avatar, direction: "sent", requestedAt: Date.now(), connection_id: "sent-" + sug.id },
      ]);
      const updatedPending = [
        ...pending,
        { id: sug.id, name: sug.name, role: sug.role, location: sug.location, avatar: sug.avatar, direction: "sent", requestedAt: Date.now(), connection_id: "sent-" + sug.id },
      ];
      localStorage.setItem("guest_pending", JSON.stringify(updatedPending));
      toast({
        title: "Request sent",
        description: `Connection request sent to ${sug.name}.`,
      });
    }
  }

  function handleDismissSuggestion(suggestionId: string) {
    const sug = suggestions.find((s) => s.id === suggestionId);
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    if (sug) {
      console.log("Not interested in " + sug.name);
    }
  }

  return (
    <AppLayout>
      <div className="space-y-4 bg-yellow-50/50 dark:bg-background text-gray-900 dark:text-white min-h-screen p-4 -m-4 transition-colors duration-200">
        {/* Header */}
        <div className="bg-white dark:bg-background p-4 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Connections</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Manage your professional network and discover new connections
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or profession"
                  className="pl-9 h-9 border-gray-300 dark:border-yellow-900/40 rounded-lg focus:border-yellow-500 focus:ring-yellow-500 bg-white dark:bg-background text-gray-900 dark:text-white text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-700 dark:text-gray-300">Sort</label>
                <select
                  className="px-2 py-1 border border-gray-300 dark:border-yellow-900/40 rounded-lg text-xs bg-white dark:bg-background text-gray-900 dark:text-white focus:border-yellow-500 focus:ring-yellow-500 h-8"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                >
                  <option value="recent">Recently Added</option>
                  <option value="az">A–Z</option>
                  <option value="location">Location</option>
                </select>
              </div>

              {/* Category Multiselect Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="border border-gray-300 dark:border-yellow-900/40 rounded-lg text-xs h-8 bg-white dark:bg-background text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 gap-1.5 flex items-center"
                >
                  <span>Category</span>
                  {selectedCategories.length > 0 && (
                    <span className="bg-yellow-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {selectedCategories.length}
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </Button>

                {categoryDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setCategoryDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-background border border-gray-200 dark:border-yellow-900/40 rounded-lg shadow-lg z-20 p-2 space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-2 py-1 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 mb-1">
                        Select Categories
                      </div>
                      {categories.map((cat) => {
                        const isChecked = selectedCategories.includes(cat);
                        return (
                          <label 
                            key={cat} 
                            className="flex items-center gap-2 px-2 py-1 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 rounded cursor-pointer text-xs select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedCategories(selectedCategories.filter(item => item !== cat));
                                } else {
                                  setSelectedCategories([...selectedCategories, cat]);
                                }
                              }}
                              className="accent-yellow-500 rounded border-gray-300"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{cat}</span>
                          </label>
                        );
                      })}
                      {selectedCategories.length > 0 && (
                        <div className="pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                          <button 
                            onClick={() => setSelectedCategories([])}
                            className="text-[10px] font-bold text-red-500 hover:text-red-600 px-2 py-0.5"
                          >
                            Clear All
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-background rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40">
          <div className="flex border-b border-gray-200 dark:border-gray-800 px-4">
            <button
              className={`px-4 py-3 border-b-2 font-medium transition-colors text-sm ${
                activeTab === "all" ? "border-yellow-600 text-yellow-600 dark:text-yellow-400 dark:border-yellow-500" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Connections
            </button>
            <button
              className={`px-4 py-3 border-b-2 font-medium transition-colors text-sm ${
                activeTab === "pending" ? "border-yellow-600 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Requests
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "all" && (
          <div className="bg-white dark:bg-background rounded-lg shadow-sm p-4 border border-yellow-100 dark:border-yellow-900/40">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Connections</h2>
            </div>
            {filteredConnections.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">
                You have no connections yet. Start connecting with others to grow your network.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredConnections.map((c) => (
                  <div key={c.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-background flex flex-col gap-2 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleOpenProfile(c.id)}>
                      <Avatar className="w-10 h-10 ring-2 ring-yellow-500/20">
                        {c.avatar_url && <AvatarImage src={c.avatar_url} alt={c.name} className="object-cover" />}
                        <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold text-sm">
                          {c.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate text-gray-900 dark:text-white text-sm">{c.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.role} • {c.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {c.connectedAt ? new Date(c.connectedAt).toLocaleDateString() : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleMessage(c.id)} className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:!text-yellow-600 dark:hover:!text-yellow-400 hover:!bg-yellow-50/50 dark:hover:!bg-yellow-950/20 hover:!border-yellow-300 dark:hover:!border-yellow-900/40 bg-white dark:bg-background transition-colors h-7 text-xs">Message</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemove(c.id)} className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white hover:text-white transition-colors h-7 text-xs">Remove</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "pending" && (
          <div className="bg-white dark:bg-background rounded-lg shadow-sm p-4 border border-yellow-100 dark:border-yellow-900/40">
            {/* Title & received/sent buttons in a single row */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Requests</h2>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50/50 dark:bg-background p-1 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                <button
                  onClick={() => setPendingView("received")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    pendingView === "received" 
                      ? "bg-yellow-500 text-white shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/10"
                  }`}
                >
                  Received
                </button>
                <button
                  onClick={() => setPendingView("sent")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    pendingView === "sent" 
                      ? "bg-yellow-500 text-white shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/10"
                  }`}
                >
                  Sent
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {pending
                  .filter((p) => p.direction === pendingView)
                  .filter((p) => selectedCategories.length === 0 || selectedCategories.includes(p.role))
                  .map((p) => (
                    <div key={p.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-background flex flex-col gap-2 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleOpenProfile(p.id)}>
                        <Avatar className="w-10 h-10 ring-2 ring-yellow-500/20">
                          {p.avatar_url && <AvatarImage src={p.avatar_url} alt={p.name} className="object-cover" />}
                          <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold text-sm">
                            {p.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate text-gray-900 dark:text-white text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.role} • {p.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Requested {new Date(p.requestedAt).toLocaleDateString()}</div>
                        {p.direction === "received" ? (
                          <div className="flex items-center gap-1">
                            <Button size="sm" onClick={() => handleAccept(p.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white dark:bg-yellow-600 dark:hover:bg-yellow-700 h-7 text-xs transition-colors shadow-sm font-semibold">Accept</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDecline(p.id)} className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:!text-yellow-600 dark:hover:!text-yellow-400 hover:!bg-yellow-50/50 dark:hover:!bg-yellow-950/20 hover:!border-yellow-300 dark:hover:!border-yellow-900/40 bg-white dark:bg-background transition-colors h-7 text-xs">Decline</Button>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-yellow-50/50 dark:bg-yellow-950/25 border border-yellow-200/40 dark:border-yellow-900/20 px-2 py-0.5 rounded-full">Awaiting response</div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {pending.filter((p) => p.direction === pendingView).filter((p) => selectedCategories.length === 0 || selectedCategories.includes(p.role)).length === 0 && (
                <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">No {pendingView} requests.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


