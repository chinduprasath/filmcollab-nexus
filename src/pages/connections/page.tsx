"use client";

import React, { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
import { Search, Users, UserPlus, Clock } from "lucide-react";

interface Connection {
  id: string;
  name: string;
  role: string;
  location: string;
  connectedAt?: number;
  avatar: string; // initials
}

interface PendingRequest {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  direction: "received" | "sent";
  requestedAt: number;
}

interface Suggestion {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  mutuals?: number;
}

const seedConnections: Connection[] = [
  { id: "1", name: "Sarah Johnson", role: "Producer", location: "Los Angeles, CA", connectedAt: Date.now() - 1000 * 60 * 60 * 24 * 10, avatar: "SJ" },
  { id: "2", name: "Michael Chen", role: "Colorist", location: "Vancouver, BC", connectedAt: Date.now() - 1000 * 60 * 60 * 24 * 20, avatar: "MC" },
  { id: "3", name: "Amelia Brown", role: "Editor", location: "London, UK", connectedAt: Date.now() - 1000 * 60 * 60 * 24 * 35, avatar: "AB" },
  { id: "4", name: "Leo Park", role: "Cinematographer", location: "Seoul, KR", connectedAt: Date.now() - 1000 * 60 * 60 * 24 * 50, avatar: "LP" },
];

const seedPending: PendingRequest[] = [
  { id: "p1", name: "Nina Rossi", role: "Sound Designer", location: "Rome, IT", avatar: "NR", direction: "received", requestedAt: Date.now() - 1000 * 60 * 60 * 48 },
  { id: "p2", name: "David Kim", role: "Composer", location: "New York, NY", avatar: "DK", direction: "sent", requestedAt: Date.now() - 1000 * 60 * 60 * 12 },
];

const seedSuggestions: Suggestion[] = [
  { id: "s1", name: "Priya Singh", role: "VFX Artist", location: "Mumbai, IN", avatar: "PS", mutuals: 6 },
  { id: "s2", name: "Owen Wright", role: "Gaffer", location: "Sydney, AU", avatar: "OW", mutuals: 2 },
  { id: "s3", name: "Hiro Tanaka", role: "1st AC", location: "Tokyo, JP", avatar: "HT", mutuals: 4 },
];

type TabKey = "all" | "pending" | "suggested";
type SortKey = "recent" | "az" | "location";

export default function ConnectionsPage() {
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [connections, setConnections] = useState<Connection[]>(seedConnections);
  const [pending, setPending] = useState<PendingRequest[]>(seedPending);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(seedSuggestions);
  const [pendingView, setPendingView] = useState<"received" | "sent">("received");

  const filteredConnections = useMemo(() => {
    const q = search.toLowerCase();
    let items = connections.filter(
      (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
    if (sortBy === "recent") {
      items = items.sort((a, b) => (b.connectedAt ?? 0) - (a.connectedAt ?? 0));
    } else if (sortBy === "az") {
      items = items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "location") {
      items = items.sort((a, b) => a.location.localeCompare(b.location));
    }
    return items;
  }, [connections, search, sortBy]);

  function handleOpenProfile(id: string) {
    // router.push(`/directory?user=${id}`);
    console.log("Open profile:", id);
  }

  function handleMessage(id: string) {
    // router.push("/messages");
    console.log("Message user:", id);
  }

  function handleRemove(id: string) {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    // toast.success("Connection removed");
    console.log("Connection removed");
  }

  function handleAccept(requestId: string) {
    const req = pending.find((p) => p.id === requestId);
    if (!req) return;
    setPending((prev) => prev.filter((p) => p.id !== requestId));
    setConnections((prev) => [
      { id: req.id, name: req.name, role: req.role, location: req.location, avatar: req.avatar, connectedAt: Date.now() },
      ...prev,
    ]);
    // toast.success(`Connected with ${req.name}`);
    console.log(`Connected with ${req.name}`);
  }

  function handleDecline(requestId: string) {
    const req = pending.find((p) => p.id === requestId);
    setPending((prev) => prev.filter((p) => p.id !== requestId));
    if (req) {
      // toast("Not interested in " + req.name);
      console.log("Not interested in " + req.name);
    }
  }

  function handleConnect(suggestionId: string) {
    const sug = suggestions.find((s) => s.id === suggestionId);
    if (!sug) return;
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    setPending((prev) => [
      ...prev,
      { id: "sent-" + sug.id, name: sug.name, role: sug.role, location: sug.location, avatar: sug.avatar, direction: "sent", requestedAt: Date.now() },
    ]);
    // toast.success("Request sent");
    console.log("Request sent");
  }

  function handleDismissSuggestion(suggestionId: string) {
    const sug = suggestions.find((s) => s.id === suggestionId);
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    if (sug) {
      // toast("Not interested in " + sug.name);
      console.log("Not interested in " + sug.name);
    }
  }

  return (
    <AppLayout>
      <div className="space-y-4 bg-yellow-50/50 dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen p-4 -m-4 transition-colors duration-200">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40">
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
                  className="pl-9 h-9 border-gray-300 dark:border-yellow-900/40 rounded-lg focus:border-yellow-500 focus:ring-yellow-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-700 dark:text-gray-300">Sort</label>
                <select
                  className="px-2 py-1 border border-gray-300 dark:border-yellow-900/40 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-yellow-500 focus:ring-yellow-500 h-8"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                >
                  <option value="recent">Recently Added</option>
                  <option value="az">A–Z</option>
                  <option value="location">Location</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40">
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
            <button
              className={`px-4 py-3 border-b-2 font-medium transition-colors text-sm ${
                activeTab === "suggested" ? "border-yellow-600 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("suggested")}
            >
              Suggested
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "all" && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border border-yellow-100 dark:border-yellow-900/40">
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
                  <div key={c.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-950 flex flex-col gap-2 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleOpenProfile(c.id)}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white flex items-center justify-center font-semibold text-sm">
                        {c.avatar}
                      </div>
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
                        <Button size="sm" variant="outline" onClick={() => handleMessage(c.id)} className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:!text-yellow-600 dark:hover:!text-yellow-400 hover:!bg-yellow-50/50 dark:hover:!bg-yellow-950/20 hover:!border-yellow-300 dark:hover:!border-yellow-900/40 bg-white dark:bg-gray-900 transition-colors h-7 text-xs">Message</Button>
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
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border border-yellow-100 dark:border-yellow-900/40">
            {/* Title & received/sent buttons in a single row */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Requests</h2>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50/50 dark:bg-gray-950 p-1 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
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
                  .map((p) => (
                    <div key={p.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-950 flex flex-col gap-2 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white flex items-center justify-center font-semibold text-sm">
                          {p.avatar}
                        </div>
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
                            <Button size="sm" variant="outline" onClick={() => handleDecline(p.id)} className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:!text-yellow-600 dark:hover:!text-yellow-400 hover:!bg-yellow-50/50 dark:hover:!bg-yellow-950/20 hover:!border-yellow-300 dark:hover:!border-yellow-900/40 bg-white dark:bg-gray-900 transition-colors h-7 text-xs">Decline</Button>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-yellow-50/50 dark:bg-yellow-950/25 border border-yellow-200/40 dark:border-yellow-900/20 px-2 py-0.5 rounded-full">Awaiting response</div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {pending.filter((p) => p.direction === pendingView).length === 0 && (
                <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">No {pendingView} requests.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "suggested" && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border border-yellow-100 dark:border-yellow-900/40">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Suggested Connections</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {suggestions.map((s) => (
                <div key={s.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-white dark:bg-gray-950 flex flex-col gap-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white flex items-center justify-center font-semibold text-sm">
                      {s.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate text-gray-900 dark:text-white text-sm">{s.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.role} • {s.location}</div>
                      {typeof s.mutuals === "number" && (
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{s.mutuals} mutual connections</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" onClick={() => handleConnect(s.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white dark:bg-yellow-600 dark:hover:bg-yellow-700 h-7 text-xs transition-colors shadow-sm font-semibold">Connect</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDismissSuggestion(s.id)} className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:!text-yellow-600 dark:hover:!text-yellow-400 hover:!bg-yellow-50/50 dark:hover:!bg-yellow-950/20 hover:!border-yellow-300 dark:hover:!border-yellow-900/40 bg-white dark:bg-gray-900 transition-colors h-7 text-xs">Not Interested</Button>
                  </div>
                </div>
              ))}
            </div>

            {suggestions.length === 0 && (
              <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">No suggestions at the moment.</div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}


