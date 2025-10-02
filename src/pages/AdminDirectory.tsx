import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Eye, 
  Trash2,
  Image,
  Video,
  FileText,
  Music,
  Search,
  Tags,
  User,
  Check,
  Download,
  Share2,
  Star,
  Heart
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminDirectory() {
  // Available tags for directory items
  const availableTags = [
    { value: "featured", label: "Featured", color: "purple" },
    { value: "trending", label: "Trending", color: "orange" },
    { value: "popular", label: "Popular", color: "green" },
    { value: "portfolio", label: "Portfolio", color: "blue" },
    { value: "private", label: "Private", color: "red" },
    { value: "public", label: "Public", color: "yellow" }
  ];

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingTags, setEditingTags] = useState<{ id: number; tags: string[] } | null>(null);

  // Mock directory data
  const directoryItems = [
    {
      id: 1,
      title: "Behind the Scenes",
      description: "Film production set photos",
      type: "Image",
      size: "2.4 MB",
      date: "2024-03-15",
      creator: {
        id: 1,
        name: "Michael Chen",
        username: "michael",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
        category: "Direction & Production"
      },
      stats: {
        downloads: 245,
        views: 1200,
        likes: 89
      },
      tags: ["Featured", "Portfolio", "Public"]
    },
    {
      id: 2,
      title: "Project Showreel",
      description: "Latest film projects compilation",
      type: "Video",
      size: "15.7 MB",
      date: "2024-03-14",
      creator: {
        id: 2,
        name: "Leo Martinez",
        username: "leo",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=leo",
        category: "Cinematography & Camera"
      },
      stats: {
        downloads: 128,
        views: 3400,
        likes: 156
      },
      tags: ["Trending", "Popular"]
    }
  ];

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Image":
        return "secondary";
      case "Video":
        return "secondary";
      case "Document":
        return "secondary";
      case "Audio":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Image":
        return Image;
      case "Video":
        return Video;
      case "Document":
        return FileText;
      case "Audio":
        return Music;
      default:
        return FileText;
    }
  };

  const handleViewItem = (itemId: number) => {
    console.log("View item:", itemId);
    // Implement view item functionality
  };

  const handleDeleteItem = (itemId: number) => {
    console.log("Delete item:", itemId);
    // Implement delete item functionality
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleEditTags = (itemId: number, currentTags: string[]) => {
    setEditingTags({ id: itemId, tags: currentTags });
  };

  const handleSaveItemTags = (itemId: number) => {
    // Here you would typically make an API call to update the item's tags
    const itemToUpdate = directoryItems.find(i => i.id === itemId);
    if (itemToUpdate && editingTags) {
      itemToUpdate.tags = editingTags.tags;
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

  const getTagBadgeStyle = (tag: string) => {
    const tagConfig = availableTags.find(t => t.label === tag);
    if (!tagConfig) return {};

    return {
      purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
      orange: "bg-orange-50 text-orange-700 hover:bg-orange-100",
      green: "bg-green-50 text-green-700 hover:bg-green-100",
      blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      red: "bg-red-50 text-red-700 hover:bg-red-100",
      yellow: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
    }[tagConfig.color];
  };

  // Filter directory items based on search and filters
  const filteredItems = directoryItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout pageTitle="Directory Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Directory Management</h1>
          <p className="text-muted-foreground mt-1">Manage uploaded media and content</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Uploaded Content</CardTitle>
            <p className="text-muted-foreground">Review and manage user uploads</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title, description or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Type:</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Directory Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Posted By</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">#{item.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-sm text-muted-foreground truncate max-w-xs">{item.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(item.type)} className="flex items-center gap-1 w-fit">
                            <TypeIcon className="h-3 w-3" />
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{item.creator.name}</span>
                              <span className="text-xs text-muted-foreground">@{item.creator.username}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>{formatNumber(item.stats.downloads)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{formatNumber(item.stats.views)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{formatNumber(item.stats.likes)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-2 flex-1">
                              {item.tags.map((tag, index) => (
                                <Badge 
                                  key={index}
                                  variant="secondary" 
                                  className={getTagBadgeStyle(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Popover 
                              open={editingTags?.id === item.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  handleEditTags(item.id, item.tags);
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
                                            className={getTagBadgeStyle(tag.label)}
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
                                      onClick={() => handleSaveItemTags(item.id)}
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
                              onClick={() => handleViewItem(item.id)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <span>Showing {directoryItems.length} items</span>
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select className="w-16 h-8 px-2 border rounded text-sm">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
