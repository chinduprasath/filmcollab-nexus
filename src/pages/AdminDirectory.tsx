import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Eye, 
  Trash2,
  Image,
  Video,
  FileText,
  Music
} from "lucide-react";
import { useState } from "react";

export default function AdminDirectory() {
  // Mock directory data
  const directoryItems = [
    {
      id: 1,
      owner: "michael",
      type: "Image",
      size: "2.4 MB",
      date: "2024-03-15"
    },
    {
      id: 2,
      owner: "leo",
      type: "Video",
      size: "15.7 MB",
      date: "2024-03-14"
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
          <CardContent>
            {/* Directory Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {directoryItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">#{item.id}</TableCell>
                        <TableCell className="font-medium">{item.owner}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(item.type)} className="flex items-center gap-1 w-fit">
                            <TypeIcon className="h-3 w-3" />
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewItem(item.id)}
                              className="h-8 px-3"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="h-8 px-3"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
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
