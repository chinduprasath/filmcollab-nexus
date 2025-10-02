import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft,
  TicketCheck,
  Clock,
  CheckCircle2,
  XCircle,
  UserCog,
  MessageSquare,
  Paperclip,
  Send,
  Image as ImageIcon,
  FileText,
  File
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AdminTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  // Mock ticket data - in real app, fetch based on ticketId
  const [ticket, setTicket] = useState({
    id: ticketId,
    title: "Account Access Issue",
    description: "Unable to login after password reset. User reports seeing an error message when attempting to use the new password.",
    status: "Open",
    assignedTo: {
      id: 1,
      name: "Sarah Johnson",
      role: "Support",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    dateCreated: "2024-03-15",
    lastUpdated: "2024-03-15",
    updates: [
      {
        id: 1,
        type: "status",
        content: "Ticket opened",
        author: "System",
        timestamp: "2024-03-15 09:00:00"
      },
      {
        id: 2,
        type: "message",
        content: "Looking into this issue. Will check the authentication logs.",
        author: "Sarah Johnson",
        timestamp: "2024-03-15 09:15:00"
      },
      {
        id: 3,
        type: "attachment",
        content: "error_screenshot.png",
        fileType: "image",
        author: "Sarah Johnson",
        timestamp: "2024-03-15 09:20:00"
      }
    ]
  });

  // New message state
  const [newMessage, setNewMessage] = useState("");
  const [isAttaching, setIsAttaching] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setTicket(prev => ({
      ...prev,
      status: newStatus,
      lastUpdated: new Date().toISOString().split('T')[0],
      updates: [
        ...prev.updates,
        {
          id: prev.updates.length + 1,
          type: "status",
          content: `Status updated to ${newStatus}`,
          author: "System",
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
        }
      ]
    }));
  };

  const handleAssigneeChange = (newAssigneeId: string) => {
    // In real app, fetch assignee details from API
    const newAssignee = {
      id: parseInt(newAssigneeId),
      name: newAssigneeId === "1" ? "Sarah Johnson" : "Mike Wilson",
      role: "Support",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAssigneeId === "1" ? "sarah" : "mike"}`
    };

    setTicket(prev => ({
      ...prev,
      assignedTo: newAssignee,
      lastUpdated: new Date().toISOString().split('T')[0],
      updates: [
        ...prev.updates,
        {
          id: prev.updates.length + 1,
          type: "assignment",
          content: `Ticket reassigned to ${newAssignee.name}`,
          author: "System",
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
        }
      ]
    }));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setTicket(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0],
      updates: [
        ...prev.updates,
        {
          id: prev.updates.length + 1,
          type: "message",
          content: newMessage.trim(),
          author: "Admin User",
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
        }
      ]
    }));

    setNewMessage("");
  };

  const handleAttachFile = () => {
    // Mock file attachment
    setTicket(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0],
      updates: [
        ...prev.updates,
        {
          id: prev.updates.length + 1,
          type: "attachment",
          content: "document.pdf",
          fileType: "document",
          author: "Admin User",
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
        }
      ]
    }));
    setIsAttaching(false);
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

  const StatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <Clock className="h-3 w-3 mr-1" />;
      case "In Progress":
        return <TicketCheck className="h-3 w-3 mr-1" />;
      case "Closed":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  const UpdateIcon = (type: string) => {
    switch (type) {
      case "status":
        return <TicketCheck className="h-4 w-4" />;
      case "assignment":
        return <UserCog className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "attachment":
        return <Paperclip className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const FileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout pageTitle="Ticket Details">
      <div className="space-y-6">
        {/* Page Header */}
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
            <p className="text-muted-foreground mt-1">View and manage ticket #{ticketId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>{ticket.title}</span>
                <Badge variant="secondary" className={getStatusBadgeStyle(ticket.status)}>
                  {StatusIcon(ticket.status)}
                  {ticket.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="mt-1">{ticket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                    <p className="mt-1">{ticket.dateCreated}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                    <p className="mt-1">{ticket.lastUpdated}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Select value={ticket.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                  <Select value={ticket.assignedTo.id.toString()} onValueChange={handleAssigneeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson</SelectItem>
                      <SelectItem value="2">Mike Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates and Chat Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">Updates & Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Area */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {ticket.updates.map((update) => (
                    <div
                      key={update.id}
                      className={cn(
                        "flex gap-3",
                        update.type === "status" || update.type === "assignment"
                          ? "justify-center"
                          : update.author === "Admin User"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      {update.type === "status" || update.type === "assignment" ? (
                        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600 flex items-center gap-2">
                          {UpdateIcon(update.type)}
                          <span>{update.content}</span>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            update.author === "Admin User"
                              ? "bg-yellow-500 text-white ml-auto"
                              : "bg-gray-100"
                          )}
                        >
                          {update.type === "attachment" ? (
                            <div className="flex items-center gap-2">
                              {FileIcon(update.fileType)}
                              <span>{update.content}</span>
                            </div>
                          ) : (
                            <p>{update.content}</p>
                          )}
                          <div
                            className={cn(
                              "text-xs mt-1",
                              update.author === "Admin User"
                                ? "text-yellow-100"
                                : "text-gray-500"
                            )}
                          >
                            {update.author} • {update.timestamp}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAttaching(!isAttaching)}
                  className={cn(
                    "h-10 w-10",
                    isAttaching && "bg-yellow-50 text-yellow-600"
                  )}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={isAttaching ? handleAttachFile : handleSendMessage}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {isAttaching ? (
                    <>
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
