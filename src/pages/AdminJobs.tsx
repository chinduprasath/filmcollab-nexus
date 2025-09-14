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

export default function AdminJobs() {
  // Mock jobs data
  const jobs = [
    {
      id: 1,
      company: "Film Studio A",
      title: "Cinematographer",
      location: "Los Angeles",
      date: "2024-03-12",
      status: "Active"
    },
    {
      id: 2,
      company: "Production Co",
      title: "Sound Engineer",
      location: "New York",
      date: "2024-03-11",
      status: "Pending"
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
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

  const handleViewJob = (jobId: number) => {
    console.log("View job:", jobId);
    // Implement view job functionality
  };

  const handleApproveJob = (jobId: number) => {
    console.log("Approve job:", jobId);
    // Implement approve job functionality
  };

  const handleRejectJob = (jobId: number) => {
    console.log("Reject job:", jobId);
    // Implement reject job functionality
  };

  const handleDeleteJob = (jobId: number) => {
    console.log("Delete job:", jobId);
    // Implement delete job functionality
  };

  return (
    <AdminLayout pageTitle="Jobs Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs Management</h1>
          <p className="text-muted-foreground mt-1">Approve or reject job listings</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Jobs</CardTitle>
            <p className="text-muted-foreground">Review submitted job listings</p>
          </CardHeader>
          <CardContent>
            {/* Jobs Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => {
                    const StatusIcon = getStatusIcon(job.status);
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">#{job.id}</TableCell>
                        <TableCell className="font-medium">{job.company}</TableCell>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(job.status)} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewJob(job.id)}
                              className="h-8 px-3"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            
                            {job.status === "Pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApproveJob(job.id)}
                                  className="h-8 px-3"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectJob(job.id)}
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
                              onClick={() => handleDeleteJob(job.id)}
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
              <span>Showing {jobs.length} jobs</span>
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
