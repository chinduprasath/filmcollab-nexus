import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  ChevronLeft,
  Clock,
  TicketCheck,
  CheckCircle2,
  Send,
  MessageSquare,
  UserCog,
  RefreshCw
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function AdminTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [ticketUpdates, setTicketUpdates] = useState<any[]>([]);
  const [newUpdate, setNewUpdate] = useState("");
  const [isSendingUpdate, setIsSendingUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [ticketId]);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const fetchData = async (background = false) => {
    if (!background) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      // Fetch ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select(`
          *,
          creator:profiles!tickets_user_id_fkey(id, full_name, username)
        `)
        .eq("id", ticketId)
        .single();
      
      if (ticketError) throw ticketError;
      setTicket(ticketData);

      // Fetch messages
      const { data: msgData, error: msgError } = await supabase
        .from("ticket_messages")
        .select(`
          *,
          author:profiles(id, full_name, role)
        `)
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
        
      if (msgError) throw msgError;
      setMessages(msgData || []);

      // Fetch official updates
      const { data: updateData, error: updateError } = await supabase
        .from("ticket_updates")
        .select(`
          *,
          author:profiles(id, full_name, role)
        `)
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: false });
        
      if (!updateError && updateData) {
        setTicketUpdates(updateData);
      }

      // Fetch team members for assignment
      const { data: teamData, error: teamError } = await supabase
        .from("admin_team_members")
        .select(`profile:profiles(id, full_name)`);
        
      if (!teamError && teamData) {
        setTeamMembers(teamData.map(t => t.profile));
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast({ title: "Failed to load ticket details", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("tickets")
        .update({ status: newStatus })
        .eq("id", ticketId);

      if (error) throw error;
      setTicket({ ...ticket, status: newStatus });
      toast({ title: "Status updated" });
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handleAssigneeChange = async (newAssigneeId: string) => {
    try {
      const val = newAssigneeId === "unassigned" ? null : newAssigneeId;
      const { error } = await supabase
        .from("tickets")
        .update({ assigned_to: val })
        .eq("id", ticketId);

      if (error) throw error;
      setTicket({ ...ticket, assigned_to: val });
      toast({ title: "Assignee updated" });
    } catch (error) {
      toast({ title: "Failed to reassign ticket", variant: "destructive" });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !profile) return;
    setIsSending(true);
    
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: ticketId,
          author_id: profile.id,
          message: newMessage.trim()
        })
        .select(`*, author:profiles(id, full_name, role)`).single();

      if (error) throw error;
      setMessages(prev => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      toast({ title: "Failed to send message", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendUpdate = async () => {
    if (!newUpdate.trim() || !profile) return;
    setIsSendingUpdate(true);
    
    try {
      const { data, error } = await supabase
        .from("ticket_updates")
        .insert({
          ticket_id: ticketId,
          author_id: profile.id,
          content: newUpdate.trim()
        })
        .select(`*, author:profiles(id, full_name, role)`).single();

      if (error) {
        console.error("Error inserting update:", error);
        throw error;
      }
      setTicketUpdates(prev => [data, ...prev]);
      setNewUpdate("");
      toast({ title: "Update posted successfully" });
    } catch (error: any) {
      console.error("Send update error:", error);
      toast({ title: `Failed to post update: ${error.message || 'Unknown error'}`, variant: "destructive" });
    } finally {
      setIsSendingUpdate(false);
    }
  };

  const toggleChatEnabled = async () => {
    const newValue = !ticket.chat_enabled;
    try {
      const { error } = await supabase
        .from("tickets")
        .update({ chat_enabled: newValue })
        .eq("id", ticketId);

      if (error) {
        console.error("Error toggling chat:", error);
        throw error;
      }
      setTicket({ ...ticket, chat_enabled: newValue });
      toast({ title: `Chat ${newValue ? "enabled" : "disabled"}` });
    } catch (error: any) {
      console.error("Toggle chat error:", error);
      toast({ title: `Failed to toggle chat: ${error.message || 'Unknown error'}`, variant: "destructive" });
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const s = status?.toLowerCase() || "";
    switch (s) {
      case "open": return "bg-blue-50 text-blue-700 hover:bg-blue-100";
      case "in-progress": return "bg-yellow-50 text-yellow-700 hover:bg-yellow-100";
      case "resolved":
      case "closed": return "bg-green-50 text-green-700 hover:bg-green-100";
      default: return "bg-gray-50 text-gray-700 hover:bg-gray-100";
    }
  };

  const StatusIcon = (status: string) => {
    const s = status?.toLowerCase() || "";
    switch (s) {
      case "open": return <Clock className="h-3 w-3 mr-1" />;
      case "in-progress": return <TicketCheck className="h-3 w-3 mr-1" />;
      case "resolved":
      case "closed": return <CheckCircle2 className="h-3 w-3 mr-1" />;
      default: return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Ticket Details" pageName="Tickets">
        <div className="p-8 text-center text-muted-foreground">Loading ticket details...</div>
      </AdminLayout>
    );
  }

  if (!ticket) {
    return (
      <AdminLayout pageTitle="Ticket Details" pageName="Tickets">
        <div className="p-8 text-center text-muted-foreground">Ticket not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle={`Ticket ${ticket.ticket_number || "Details"}`} pageName="Tickets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin-dashboard/tickets")}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Ticket Details</h1>
              <p className="text-muted-foreground mt-1">View and manage ticket #{ticket.ticket_number}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="h-9 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>{ticket.subject}</span>
                <Badge variant="secondary" className={getStatusBadgeStyle(ticket.status)}>
                  {StatusIcon(ticket.status)}
                  {ticket.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created By</Label>
                    <p className="mt-1 font-medium">{ticket.creator?.full_name || "Unknown"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                    <p className="mt-1">{new Date(ticket.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Select value={ticket.status?.toLowerCase()} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                    <Select value={ticket.assigned_to || "unassigned"} onValueChange={handleAssigneeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teamMembers.map(tm => (
                          <SelectItem key={tm.id} value={tm.id}>{tm.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">{ticket.description}</div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <Label className="text-lg font-semibold text-foreground">Official Updates</Label>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        placeholder="Add an official update (visible to user)..."
                        disabled={isSendingUpdate}
                      />
                      <Button onClick={handleSendUpdate} disabled={isSendingUpdate || !newUpdate.trim()}>
                        Post Update
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {ticketUpdates.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No official updates posted yet.</p>
                      ) : (
                        ticketUpdates.map((update) => (
                          <div key={update.id} className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-blue-900 text-sm">{update.author?.full_name}</span>
                              <span className="text-xs text-blue-600 font-medium">
                                {new Date(update.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-blue-800 whitespace-pre-wrap">{update.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 flex flex-col h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Interaction Chat</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={ticket.chat_enabled || false}
                  onCheckedChange={toggleChatEnabled}
                  id="chat-toggle"
                />
                <Label htmlFor="chat-toggle" className="text-sm">
                  {ticket.chat_enabled ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 overflow-hidden space-y-4">
              <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                <div className="space-y-4 pb-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-4">No messages yet.</div>
                  ) : messages.map((msg) => {
                    const isAdmin = msg.author?.role === "admin";
                    const isMe = msg.author_id === profile?.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-3",
                          isMe ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-lg p-3",
                            isMe
                              ? "bg-yellow-500 text-white ml-auto"
                              : isAdmin ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                          )}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            {isAdmin && !isMe && <UserCog className="w-3 h-3 text-gray-400" />}
                            <span className={cn(
                              "text-xs font-semibold", 
                              isMe ? "text-yellow-100" : isAdmin ? "text-gray-300" : "text-gray-600"
                            )}>
                              {isMe ? "You" : msg.author?.full_name || "User"}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <div
                            className={cn(
                              "text-[10px] mt-1 text-right",
                              isMe ? "text-yellow-100" : isAdmin ? "text-gray-400" : "text-gray-500"
                            )}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="flex gap-2 pt-2 border-t">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type an update..."
                  className="flex-1"
                  disabled={isSending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !newMessage.trim()}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
