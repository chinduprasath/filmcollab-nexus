import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Eye, 
  Trash2,
  CheckCircle,
  X,
  Clock,
  Play
} from "lucide-react";
import { useState } from "react";

export default function AdminProjects() {
  // Mock projects data
  const projects = [
    {
      id: 1,
      owner: "michael",
      title: "Indie Film Production",
      description: "Looking for crew members",
      date: "2024-03-10",
      status: "Active"
    },
    {
      id: 2,
      owner: "leo",
      title: "Documentary Series",
      description: "Environmental awareness project",
      date: "2024-03-08",
      status: "Pending"
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "secondary";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return Play;
      case "Pending":
        return Clock;
      case "Rejected":
        return X;
      default:
        return Clock;
    }
  };

  const handleViewProject = (projectId: number) => {
    console.log("View project:", projectId);
    // Implement view project functionality
  };

  const handleApproveProject = (projectId: number) => {
    console.log("Approve project:", projectId);
    // Implement approve project functionality
  };

  const handleRejectProject = (projectId: number) => {
    console.log("Reject project:", projectId);
    // Implement reject project functionality
  };

  const handleDeleteProject = (projectId: number) => {
    console.log("Delete project:", projectId);
    // Implement delete project functionality
  };

  return (
    <AdminLayout pageTitle="Projects Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects Management</h1>
          <p className="text-muted-foreground mt-1">Approve or reject project listings</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Projects</CardTitle>
            <p className="text-muted-foreground">Review submitted project listings</p>
          </CardHeader>
          <CardContent>
            {/* Projects Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project ID</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => {
                    const StatusIcon = getStatusIcon(project.status);
                    return (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">#{project.id}</TableCell>
                        <TableCell className="font-medium">{project.owner}</TableCell>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                        <TableCell>{project.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(project.status)} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProject(project.id)}
                              className="h-8 px-3"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            
                            {project.status === "Pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApproveProject(project.id)}
                                  className="h-8 px-3"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectProject(project.id)}
                                  className="h-8 px-3"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
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
              <span>Showing {projects.length} projects</span>
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
