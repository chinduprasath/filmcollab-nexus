import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  TicketCheck,
  Clock,
  CheckCircle2,
  MoreVertical,
  Eye,
  Trash2,
  UserCog
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminTickets() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          id,
          ticket_number,
          subject,
          description,
          status,
          created_at,
          creator:profiles!tickets_user_id_fkey(id, full_name, username),
          assignee:profiles!tickets_assigned_to_fkey(id, full_name, role)
        `)
        .order("created_at", { ascending: false });

      console.log("Fetched tickets data:", data);
      console.log("Fetch error:", error);

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({ title: "Failed to fetch tickets", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;
    try {
      const { error } = await supabase.from("tickets").delete().eq("id", ticketToDelete);
      if (error) throw error;
      setTickets(prev => prev.filter(t => t.id !== ticketToDelete));
      toast({ title: "Ticket deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete ticket", variant: "destructive" });
    } finally {
      setTicketToDelete(null);
    }
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
    const ticketId = ticket.ticket_number || "";
    const subject = ticket.subject || "";
    const matchesSearch = 
      ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status.toLowerCase().replace(" ", "-") === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout pageTitle="Support Tickets" pageName="Tickets">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage and track support tickets</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl">All Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by ticket number or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
            </div>

            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">Loading tickets...</TableCell>
                    </TableRow>
                  ) : filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">No tickets found.</TableCell>
                    </TableRow>
                  ) : filteredTickets.map((ticket) => {
                    const StatusIcon = getStatusIcon(ticket.status);
                    return (
                      <TableRow 
                        key={ticket.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/admin-dashboard/tickets/${ticket.id}`)}
                      >
                        <TableCell className="font-medium">{ticket.ticket_number || "TKT-UNKNOWN"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col max-w-[200px]">
                            <span className="font-medium truncate">{ticket.subject}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           {ticket.creator?.full_name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {ticket.assignee ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <UserCog className="h-4 w-4 text-yellow-600" />
                              </div>
                              <span className="text-sm font-medium">{ticket.assignee.full_name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadgeStyle(ticket.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/admin-dashboard/tickets/${ticket.id}`); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={(e) => { e.stopPropagation(); setTicketToDelete(ticket.id); }}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <span>Showing {filteredTickets.length} tickets</span>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Alert */}
        <AlertDialog open={!!ticketToDelete} onOpenChange={(open) => !open && setTicketToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the ticket
                and all of its associated messages.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTicket} className="bg-red-600 hover:bg-red-700 text-white">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
