import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search,
  TicketCheck,
  Clock,
  CheckCircle2,
  XCircle,
  UserCog,
  MessageSquare,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AdminTickets() {
  const navigate = useNavigate();
  // Mock tickets data
  const tickets = [
    {
      id: "TKT-001",
      title: "Account Access Issue",
      description: "Unable to login after password reset",
      status: "Open",
      assignedTo: {
        id: 1,
        name: "Sarah Johnson",
        role: "Support"
      },
      dateCreated: "2024-03-15",
      lastUpdated: "2024-03-15",
      comments: [
        {
          id: 1,
          author: "Sarah Johnson",
          text: "Looking into this issue",
          date: "2024-03-15"
        }
      ]
    },
    {
      id: "TKT-002",
      title: "Project Upload Failed",
      description: "Error when trying to upload project files",
      status: "In Progress",
      assignedTo: {
        id: 2,
        name: "Mike Wilson",
        role: "Support"
      },
      dateCreated: "2024-03-14",
      lastUpdated: "2024-03-15",
      comments: [
        {
          id: 1,
          author: "Mike Wilson",
          text: "Investigating the upload service",
          date: "2024-03-15"
        }
      ]
    },
    {
      id: "TKT-003",
      title: "Payment Processing Error",
      description: "Payment failed during subscription upgrade",
      status: "Closed",
      assignedTo: {
        id: 1,
        name: "Sarah Johnson",
        role: "Support"
      },
      dateCreated: "2024-03-13",
      lastUpdated: "2024-03-14",
      comments: [
        {
          id: 1,
          author: "Sarah Johnson",
          text: "Issue resolved - payment processed successfully",
          date: "2024-03-14"
        }
      ]
    }
  ];

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  // New ticket form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "Open"
  });

  // View/Edit ticket dialog state
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddTicket = () => {
    // Here you would typically make an API call to add the new ticket
    console.log("Adding new ticket:", newTicket);
    setIsAddDialogOpen(false);
    setNewTicket({
      title: "",
      description: "",
      assignedTo: "",
      status: "Open"
    });
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsViewDialogOpen(true);
  };

  const handleAddComment = () => {
    if (!selectedTicket || !newComment.trim()) return;

    // Here you would typically make an API call to add the comment
    console.log("Adding comment to ticket:", selectedTicket.id, newComment);
    setNewComment("");
  };

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    console.log("Updating ticket status:", ticketId, newStatus);
    // Implement status update functionality
  };

  const handleDeleteTicket = (ticketId: string) => {
    console.log("Delete ticket:", ticketId);
    // Implement delete functionality
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-50 text-blue-700 hover:bg-blue-100";
      case "In Progress":
        return "bg-yellow-50 text-yellow-700 hover:bg-yellow-100";
      case "Closed":
        return "bg-green-50 text-green-700 hover:bg-green-100";
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return Clock;
      case "In Progress":
        return TicketCheck;
      case "Closed":
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status.toLowerCase().replace(" ", "-") === statusFilter.toLowerCase();
    const matchesAssignee = assigneeFilter === "all" || ticket.assignedTo.name.toLowerCase() === assigneeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  return (
    <AdminLayout pageTitle="Support Tickets">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage and track support tickets</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Tickets</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  <TicketCheck className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Ticket</DialogTitle>
                  <DialogDescription>
                    Create a new support ticket and assign it to a team member.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      placeholder="Enter ticket title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder="Enter ticket description"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assign To</Label>
                    <Select
                      value={newTicket.assignedTo}
                      onValueChange={(value) => setNewTicket({ ...newTicket, assignedTo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={handleAddTicket}
                  >
                    Create Ticket
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Status:</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Assignee:</label>
                  <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      <SelectItem value="sarah johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="mike wilson">Mike Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => {
                    const StatusIcon = getStatusIcon(ticket.status);
                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div
                              role="button"
                              tabIndex={0}
                              className="font-medium text-left hover:text-yellow-600 cursor-pointer"
                              onClick={() => {
                                console.log("Navigating to:", `/admin-dashboard/tickets/${ticket.id}`);
                                navigate(`/admin-dashboard/tickets/${ticket.id}`);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  console.log("Navigating to:", `/admin-dashboard/tickets/${ticket.id}`);
                                  navigate(`/admin-dashboard/tickets/${ticket.id}`);
                                }
                              }}
                            >
                              {ticket.title}
                            </div>
                            <span className="text-sm text-muted-foreground truncate max-w-xs">
                              {ticket.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              <UserCog className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{ticket.assignedTo.name}</span>
                              <span className="text-xs text-muted-foreground">{ticket.assignedTo.role}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadgeStyle(ticket.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{ticket.lastUpdated}</span>
                            <span className="text-xs text-muted-foreground">
                              Created: {ticket.dateCreated}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewTicket(ticket)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTicket(ticket.id)}
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
              <span>Showing {filteredTickets.length} tickets</span>
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

        {/* View/Edit Ticket Dialog */}
        {selectedTicket && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{selectedTicket.id}</span>
                  <Badge variant="secondary" className={getStatusBadgeStyle(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Created on {selectedTicket.dateCreated}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTicket.title}</h3>
                  <p className="text-muted-foreground mt-1">{selectedTicket.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Assigned To</h4>
                    <Select
                      value={selectedTicket.assignedTo.id.toString()}
                      onValueChange={(value) => console.log("Reassign to:", value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sarah Johnson</SelectItem>
                        <SelectItem value="2">Mike Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Status</h4>
                    <Select
                      value={selectedTicket.status.toLowerCase().replace(" ", "-")}
                      onValueChange={(value) => handleUpdateStatus(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Comments</h4>
                  <div className="space-y-4">
                    {selectedTicket.comments.map((comment: any) => (
                      <div key={comment.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <UserCog className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-sm text-muted-foreground">{comment.date}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddComment}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
