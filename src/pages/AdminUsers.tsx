import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Download, 
  Eye, 
  X, 
  Trash2,
  MoreHorizontal,
  Edit2,
  Check,
  Tags
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Available tags for users
const availableTags = [
  { value: "verified", label: "Verified", color: "blue" },
  { value: "popular", label: "Popular", color: "green" },
  { value: "featured", label: "Featured", color: "purple" },
  { value: "trending", label: "Trending", color: "orange" },
  { value: "expert", label: "Expert", color: "indigo" },
  { value: "mentor", label: "Mentor", color: "pink" },
  { value: "influencer", label: "Influencer", color: "cyan" },
  { value: "rising-star", label: "Rising Star", color: "amber" }
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTags, setEditingTags] = useState<{ id: number; tags: string[] } | null>(null);

  // Mock user data
  const users = [
    {
      id: 1,
      username: "sarah",
      email: "sarah@example.com",
      category: "Direction & Production",
      status: "Active",
      joined: "2024-01-15",
      tags: ["Verified", "Popular", "Expert"]
    },
    {
      id: 2,
      username: "michael",
      email: "michael@example.com",
      category: "Cinematography & Camera",
      status: "Active",
      joined: "2024-02-04",
      tags: ["Verified", "Mentor"]
    },
    {
      id: 3,
      username: "amelia",
      email: "amelia@example.com",
      category: "Actors & Performers",
      status: "Suspended",
      joined: "2024-02-18",
      tags: ["Popular", "Rising Star"]
    },
    {
      id: 4,
      username: "leo",
      email: "leo@example.com",
      category: "Writing & Creative",
      status: "Active",
      joined: "2024-03-01",
      tags: ["Featured", "Influencer", "Trending"]
    }
  ];

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || user.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "default";
      case "User":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "secondary";
      case "Suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleViewUser = (userId: number) => {
    console.log("View user:", userId);
    // Implement view user functionality
  };

  const handleSuspendUser = (userId: number) => {
    console.log("Suspend user:", userId);
    // Implement suspend user functionality
  };

  const handleDeleteUser = (userId: number) => {
    console.log("Delete user:", userId);
    // Implement delete user functionality
  };

  const handleEditTags = (userId: number, currentTags: string[]) => {
    setEditingTags({ id: userId, tags: currentTags });
  };

  const handleSaveUserTags = (userId: number) => {
    // Here you would typically make an API call to update the user's tags
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate && editingTags) {
      userToUpdate.tags = editingTags.tags;
      setEditingTags(null);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (!editingTags) return;

    setEditingTags(current => {
      if (!current) return null;

      const newTags = current.tags.includes(tag)
        ? current.tags.filter(t => t !== tag)
        : [...current.tags, tag];

      return { ...current, tags: newTags };
    });
  };

  const getTagBadgeStyle = (tag: string): string => {
    const tagConfig = availableTags.find(t => t.label === tag);
    if (!tagConfig) return "";

    return ({
      blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      green: "bg-green-50 text-green-700 hover:bg-green-100",
      purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
      orange: "bg-orange-50 text-orange-700 hover:bg-orange-100",
      indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      pink: "bg-pink-50 text-pink-700 hover:bg-pink-100",
      cyan: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
      amber: "bg-amber-50 text-amber-700 hover:bg-amber-100"
    }[tagConfig.color] || "");
  };

  return (
    <AdminLayout pageTitle="Users Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-1">Manage registered user accounts</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Users</CardTitle>
            <p className="text-muted-foreground">Search, filter, and manage user accounts</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search username or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Category:</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="direction">Direction & Production</SelectItem>
                      <SelectItem value="cinematography">Cinematography & Camera</SelectItem>
                      <SelectItem value="actors">Actors & Performers</SelectItem>
                      <SelectItem value="writing">Writing & Creative</SelectItem>
                      <SelectItem value="music">Music & Sound</SelectItem>
                      <SelectItem value="art">Art & Design</SelectItem>
                      <SelectItem value="editing">Editing & Post Production</SelectItem>
                      <SelectItem value="marketing">Marketing & Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Status:</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                          {user.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joined}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap gap-2 flex-1">
                            {user.tags.map((tag, index) => (
                              <Badge 
                                key={index}
                                variant="secondary" 
                                className={getTagBadgeStyle(tag) || ""}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Popover 
                            open={editingTags?.id === user.id}
                            onOpenChange={(open) => {
                              if (open) {
                                handleEditTags(user.id, user.tags);
                              } else {
                                setEditingTags(null);
                              }
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-yellow-50"
                              >
                                <Tags className="h-4 w-4 text-yellow-600" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                              <Command>
                                <CommandInput placeholder="Search tags..." />
                                <CommandEmpty>No tags found.</CommandEmpty>
                                <CommandGroup>
                                  {availableTags.map((tag) => {
                                    const isSelected = editingTags?.tags.includes(tag.label);
                                    return (
                                      <CommandItem
                                        key={tag.value}
                                        onSelect={() => handleTagToggle(tag.label)}
                                        className="flex items-center gap-2"
                                      >
                                        <div className={cn(
                                          "flex h-4 w-4 items-center justify-center rounded border",
                                          isSelected ? "bg-yellow-500 border-yellow-500" : "border-gray-200"
                                        )}>
                                          {isSelected && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                        <Badge 
                                          variant="secondary"
                                          className={getTagBadgeStyle(tag.label) || ""}
                                        >
                                          {tag.label}
                                        </Badge>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                                <div className="border-t p-2">
                                  <Button
                                    size="sm"
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                    onClick={() => handleSaveUserTags(user.id)}
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(user.id)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {user.status !== "Suspended" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSuspendUser(user.id)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Showing {filteredUsers.length} of {users.length} users</span>
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
