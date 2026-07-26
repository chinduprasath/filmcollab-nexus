import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { 
  RefreshCw,
  ChevronLeft,
  Clock,
  TicketCheck,
  CheckCircle2,
  Send,
  UserCog
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function UserTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [ticketUpdates, setTicketUpdates] = useState<any[]>([]);
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
        .select(`*`)
        .eq("id", ticketId)
        .single();
      
      if (ticketError) throw ticketError;
      setTicket(ticketData);

      const { data: msgData, error: msgError } = await supabase
        .from("ticket_messages")
        .select(`
          *,
          author:profiles(id, full_name, role)
        `)
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
        
      if (msgError) {
        console.error("Error fetching ticket messages:", msgError);
      } else if (msgData) {
        setMessages(msgData);
      }

      const { data: updateData, error: updateError } = await supabase
        .from("ticket_updates")
        .select(`
          *,
          author:profiles(id, full_name, role)
        `)
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: false });
        
      if (updateError) {
        console.error("Error fetching ticket updates:", updateError);
      } else if (updateData) {
        setTicketUpdates(updateData);
      }

    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast({ title: "Failed to load ticket details", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !profile) return;
    
    const tempMessage = {
      id: Date.now(),
      ticket_id: ticketId,
      author_id: profile.id,
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
      author: profile
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
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
      setMessages(prev => prev.map(m => m.id === tempMessage.id ? data : m));
    } catch (error: any) {
      console.error("Send message error:", error);
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      toast({ title: `Failed to send message: ${error.message || 'Unknown error'}`, variant: "destructive" });
    } finally {
      setIsSending(false);
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
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Loading ticket details...</div>
      </AppLayout>
    );
  }

  if (!ticket) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Ticket not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/support")}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ticket Details</h1>
              <p className="text-gray-500 mt-1">View your ticket #{ticket.ticket_number}</p>
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium block">Created Date</span>
                    <span className="mt-1">{new Date(ticket.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Category</span>
                    <span className="mt-1">{ticket.category}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">{ticket.description}</div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <Label className="text-lg font-semibold text-gray-900">Official Updates</Label>
                  <div className="space-y-3">
                    {ticketUpdates.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No official updates posted yet.</p>
                    ) : (
                      ticketUpdates.map((update) => (
                        <div key={update.id} className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-blue-900 text-sm">{update.author?.full_name || "Support Team"}</span>
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
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle className="text-xl">Interaction Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 overflow-hidden space-y-4">
              {!ticket.chat_enabled ? (
                <div className="flex-1 flex items-center justify-center text-center p-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                  <div>
                    <TicketCheck className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Chat is currently disabled</p>
                    <p className="text-xs mt-1">A support agent will enable chat if they need more details from you.</p>
                  </div>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                    <div className="space-y-4 pb-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm py-4">No messages yet.</div>
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
                                {isAdmin && <UserCog className="w-3 h-3" />}
                                <span className={cn(
                                  "text-xs font-semibold", 
                                  isMe ? "text-yellow-100" : isAdmin ? "text-gray-300" : "text-gray-600"
                                )}>
                                  {isMe ? "You" : msg.author?.full_name || "Agent"}
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
                      placeholder="Type a message..."
                      className="flex-1"
                      disabled={isSending || ticket.status === 'closed' || ticket.status === 'resolved'}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isSending || !newMessage.trim() || ticket.status === 'closed' || ticket.status === 'resolved'}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
