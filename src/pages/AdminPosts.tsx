import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Eye, 
  Flag, 
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

export default function AdminPosts() {
  // Mock posts data
  const posts = [
    {
      id: 1,
      username: "michael",
      content: "Just finished an amazing film project!",
      type: "Text",
      date: "2024-03-15",
      status: "Published"
    },
    {
      id: 2,
      username: "leo",
      content: "Behind the scenes photo",
      type: "Image",
      date: "2024-03-14",
      status: "Pending"
    },
    {
      id: 3,
      username: "amelia",
      content: "Check out this video",
      type: "Video",
      date: "2024-03-13",
      status: "Flagged"
    }
  ];

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Text":
        return "secondary";
      case "Image":
        return "secondary";
      case "Video":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Published":
        return "secondary";
      case "Pending":
        return "secondary";
      case "Flagged":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Published":
        return CheckCircle;
      case "Pending":
        return Clock;
      case "Flagged":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const handleViewPost = (postId: number) => {
    console.log("View post:", postId);
    // Implement view post functionality
  };

  const handleApprovePost = (postId: number) => {
    console.log("Approve post:", postId);
    // Implement approve post functionality
  };

  const handleFlagPost = (postId: number) => {
    console.log("Flag post:", postId);
    // Implement flag post functionality
  };

  const handleDeletePost = (postId: number) => {
    console.log("Delete post:", postId);
    // Implement delete post functionality
  };

  return (
    <AdminLayout pageTitle="Posts Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts Management</h1>
          <p className="text-muted-foreground mt-1">Moderate user posts and content</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Posts</CardTitle>
            <p className="text-muted-foreground">Review and moderate user-generated content</p>
          </CardHeader>
          <CardContent>
            {/* Posts Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => {
                    const StatusIcon = getStatusIcon(post.status);
                    return (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">#{post.id}</TableCell>
                        <TableCell className="font-medium">{post.username}</TableCell>
                        <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(post.type)}>
                            {post.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(post.status)} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPost(post.id)}
                              className="h-8 px-3"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            
                            {post.status === "Pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprovePost(post.id)}
                                className="h-8 px-3"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            
                            {post.status !== "Flagged" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFlagPost(post.id)}
                                className="h-8 px-3"
                              >
                                <Flag className="h-4 w-4 mr-1" />
                                Flag
                              </Button>
                            )}
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
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
              <span>Showing {posts.length} posts</span>
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
