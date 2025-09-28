"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  ArrowLeft,
  Users,
  MessageSquare,
  Share2,
  Send,
  MoreHorizontal,
  Calendar,
  MapPin,
  Tag,
  UserPlus,
  UserX,
  Crown,
  Shield,
  Bell,
  BellOff,
  Edit,
  Trash2,
  Image,
  FileText,
  Link,
  Smile,
  Paperclip,
  X,
  Save,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Globe,
  UserCheck,
  AlertTriangle,
  Info,
  LogOut
} from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joinedDate: string;
  isAdmin: boolean;
  isModerator: boolean;
  online: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isAdmin?: boolean;
  isModerator?: boolean;
}

export default function JoinedGroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock group data - in real app, this would be fetched based on groupId
  const group = {
    id: groupId,
    name: "Independent Filmmakers Network",
    description: "A community for independent filmmakers to share resources, collaborate, and support each other.",
    members: 2847,
    posts: 156,
    category: "Filmmaking",
    tags: ["independent", "filmmaking", "collaboration"],
    createdBy: "Sarah Johnson",
    createdDate: "2024-01-15",
    status: "Active",
    joinedDate: "2024-11-20",
    userRole: "Member",
    rules: [
      "Be respectful to all members",
      "Keep discussions relevant to independent filmmaking",
      "Share resources and knowledge generously",
      "No spam or self-promotion without permission"
    ],
    recentActivity: [
      { action: "New member joined", user: "Alex Chen", time: "1 hour ago" },
      { action: "Posted in chat", user: "Maria Garcia", time: "2 hours ago" },
      { action: "Shared resource", user: "David Kim", time: "3 hours ago" }
    ]
  };

  const members: GroupMember[] = [
    { id: "1", name: "Sarah Johnson", role: "Group Admin", avatar: "SJ", joinedDate: "2024-01-15", isAdmin: true, isModerator: false, online: true },
    { id: "2", name: "Mike Chen", role: "Moderator", avatar: "MC", joinedDate: "2024-02-10", isAdmin: false, isModerator: true, online: true },
    { id: "3", name: "Lisa Park", role: "Member", avatar: "LP", joinedDate: "2024-03-05", isAdmin: false, isModerator: false, online: false },
    { id: "4", name: "David Kim", role: "Member", avatar: "DK", joinedDate: "2024-03-15", isAdmin: false, isModerator: false, online: true },
    { id: "5", name: "Emma Rodriguez", role: "Member", avatar: "ER", joinedDate: "2024-04-01", isAdmin: false, isModerator: false, online: false },
    { id: "6", name: "James Wilson", role: "Member", avatar: "JW", joinedDate: "2024-04-10", isAdmin: false, isModerator: false, online: true },
    { id: "7", name: "You", role: "Member", avatar: "Y", joinedDate: "2024-11-20", isAdmin: false, isModerator: false, online: true }
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: "1",
      userId: "1",
      userName: "Sarah Johnson",
      userAvatar: "SJ",
      message: "Welcome everyone! Great to see so many independent filmmakers joining our community. Let's support each other and share our experiences!",
      timestamp: "3 hours ago",
      type: "text",
      isAdmin: true
    },
    {
      id: "2",
      userId: "2",
      userName: "Mike Chen",
      userAvatar: "MC",
      message: "Has anyone worked with the new Sony FX6? I'm considering it for my next documentary project.",
      timestamp: "2 hours ago",
      type: "text",
      isModerator: true
    },
    {
      id: "3",
      userId: "3",
      userName: "Lisa Park",
      userAvatar: "LP",
      message: "I've used the FX6 for a few projects. The low-light performance is excellent and the autofocus is really reliable. What's your budget range?",
      timestamp: "2 hours ago",
      type: "text"
    },
    {
      id: "4",
      userId: "4",
      userName: "David Kim",
      userAvatar: "DK",
      message: "I'm looking for collaborators for a short film I'm directing. Anyone interested in cinematography or sound design?",
      timestamp: "1 hour ago",
      type: "text"
    },
    {
      id: "5",
      userId: "5",
      userName: "Emma Rodriguez",
      userAvatar: "ER",
      message: "I'd be interested in sound design! What's the timeline for your project?",
      timestamp: "45 minutes ago",
      type: "text"
    },
    {
      id: "6",
      userId: "7",
      userName: "You",
      userAvatar: "Y",
      message: "This community is amazing! I'm learning so much from everyone's experiences. Thanks for sharing your knowledge!",
      timestamp: "30 minutes ago",
      type: "text"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLeaveGroup = () => {
    // In a real app, this would leave the group
    console.log("Leaving group:", group.id);
    navigate('/community');
  };

  return (
    <AppLayout>
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/community')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{group.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{group.members} members</span>
                  <span>•</span>
                  <span>{group.status}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                    {group.userRole}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleLeaveGroup} className="text-red-600 border-red-300 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-1" />
                Leave Group
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                    {message.userAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">{message.userName}</span>
                      {message.isAdmin && <Crown className="w-3 h-3 text-yellow-500" />}
                      {message.isModerator && <Shield className="w-3 h-3 text-blue-500" />}
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-800">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Paperclip className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Smile className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Group Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Group Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-sm text-gray-800">{group.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {group.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created By</p>
                    <p className="text-sm text-gray-800">{group.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created</p>
                    <p className="text-sm text-gray-800">{group.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">You Joined</p>
                    <p className="text-sm text-gray-800">{group.joinedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Role</p>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                      {group.userRole}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {group.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Members ({members.length})</h3>
                </div>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {member.avatar}
                        </div>
                        {member.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          {member.isAdmin && <Crown className="w-3 h-3 text-yellow-500" />}
                          {member.isModerator && <Shield className="w-3 h-3 text-blue-500" />}
                        </div>
                        <p className="text-xs text-gray-600">{member.role}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group Rules */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Group Rules</h3>
                <div className="space-y-2">
                  {group.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <p className="text-sm text-gray-700">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  {group.recentActivity.map((activity, index) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-800">{activity.action}</p>
                      <p className="text-gray-600 text-xs">{activity.user} • {activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
