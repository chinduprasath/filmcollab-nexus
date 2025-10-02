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
  Settings,
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
  Info
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

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [groupSettings, setGroupSettings] = useState({
    name: "My Film Production Group",
    description: "A private group for my upcoming film project. Collaborating with trusted team members.",
    privacy: "private", // private, public
    allowMemberInvites: true,
    allowMemberPosts: true,
    requireApproval: false,
    notifications: true,
    autoDeleteMessages: false,
    messageRetentionDays: 30
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock group data - in real app, this would be fetched based on groupId
  const group = {
    id: groupId,
    name: "My Film Production Group",
    description: "A private group for my upcoming film project. Collaborating with trusted team members.",
    members: 12,
    posts: 45,
    category: "Production",
    tags: ["production", "private", "collaboration"],
    createdBy: "You",
    createdDate: "2024-11-15",
    status: "Active",
    rules: [
      "Be respectful to all members",
      "Keep discussions relevant to film production",
      "No spam or self-promotion without permission",
      "Share resources and knowledge generously"
    ],
    recentActivity: [
      { action: "New member joined", user: "Sarah Chen", time: "2 hours ago" },
      { action: "Posted in chat", user: "Mike Johnson", time: "3 hours ago" },
      { action: "Shared resource", user: "Lisa Park", time: "1 day ago" }
    ]
  };

  const members: GroupMember[] = [
    { id: "1", name: "You", role: "Group Admin", avatar: "Y", joinedDate: "2024-11-15", isAdmin: true, isModerator: false, online: true },
    { id: "2", name: "Sarah Chen", role: "Producer", avatar: "SC", joinedDate: "2024-11-16", isAdmin: false, isModerator: true, online: true },
    { id: "3", name: "Mike Johnson", role: "Director", avatar: "MJ", joinedDate: "2024-11-17", isAdmin: false, isModerator: false, online: false },
    { id: "4", name: "Lisa Park", role: "Cinematographer", avatar: "LP", joinedDate: "2024-11-18", isAdmin: false, isModerator: false, online: true },
    { id: "5", name: "David Kim", role: "Editor", avatar: "DK", joinedDate: "2024-11-19", isAdmin: false, isModerator: false, online: false },
    { id: "6", name: "Emma Rodriguez", role: "Sound Designer", avatar: "ER", joinedDate: "2024-11-20", isAdmin: false, isModerator: false, online: true }
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: "1",
      userId: "2",
      userName: "Sarah Chen",
      userAvatar: "SC",
      message: "Hey everyone! Just wanted to share the updated production schedule. We're ahead of schedule on pre-production!",
      timestamp: "2 hours ago",
      type: "text",
      isModerator: true
    },
    {
      id: "2",
      userId: "1",
      userName: "You",
      userAvatar: "Y",
      message: "That's fantastic news, Sarah! Thanks for keeping us updated. The team is doing amazing work.",
      timestamp: "2 hours ago",
      type: "text",
      isAdmin: true
    },
    {
      id: "3",
      userId: "3",
      userName: "Mike Johnson",
      userAvatar: "MJ",
      message: "I've been reviewing the script changes. The new dialogue flows much better. Great work on the revisions!",
      timestamp: "1 hour ago",
      type: "text"
    },
    {
      id: "4",
      userId: "4",
      userName: "Lisa Park",
      userAvatar: "LP",
      message: "I've uploaded some location photos to the shared drive. Check them out when you get a chance.",
      timestamp: "45 minutes ago",
      type: "text"
    },
    {
      id: "5",
      userId: "5",
      userName: "David Kim",
      userAvatar: "DK",
      message: "The rough cut is looking good. I'll have the first edit ready by tomorrow evening.",
      timestamp: "30 minutes ago",
      type: "text"
    },
    {
      id: "6",
      userId: "6",
      userName: "Emma Rodriguez",
      userAvatar: "ER",
      message: "Sound design is progressing well. I've created some ambient tracks that should work perfectly for the forest scenes.",
      timestamp: "15 minutes ago",
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

  return (
    <AppLayout>
      <div className="h-screen bg-yellow-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-yellow-200 p-4">
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
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="w-4 h-4 mr-1" />
                Settings
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
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                    {message.userAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">{message.userName}</span>
                      {message.isAdmin && <Crown className="w-3 h-3 text-yellow-500" />}
                      {message.isModerator && <Shield className="w-3 h-3 text-blue-500" />}
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-yellow-200">
                      <p className="text-sm text-gray-800">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-yellow-200 p-4">
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
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l border-yellow-200 overflow-y-auto">
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
                    <p className="text-sm text-gray-600 mb-1">Created</p>
                    <p className="text-sm text-gray-800">{group.createdDate}</p>
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
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Invite
                  </Button>
                </div>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-yellow-50">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
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

        {/* Settings Popup */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Group Settings</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Group Name</label>
                        <Input
                          value={groupSettings.name}
                          onChange={(e) => setGroupSettings(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                        <textarea
                          value={groupSettings.description}
                          onChange={(e) => setGroupSettings(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-yellow-200 rounded-lg focus:border-yellow-500 focus:ring-yellow-500 text-sm"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Privacy Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Group Visibility</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="privacy"
                              value="private"
                              checked={groupSettings.privacy === "private"}
                              onChange={(e) => setGroupSettings(prev => ({ ...prev, privacy: e.target.value }))}
                              className="text-purple-600"
                            />
                            <Lock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Private</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="privacy"
                              value="public"
                              checked={groupSettings.privacy === "public"}
                              onChange={(e) => setGroupSettings(prev => ({ ...prev, privacy: e.target.value }))}
                              className="text-purple-600"
                            />
                            <Globe className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Public</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Member Permissions */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Member Permissions
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Allow members to invite others</p>
                          <p className="text-xs text-gray-500">Members can invite new people to join the group</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={groupSettings.allowMemberInvites}
                            onChange={(e) => setGroupSettings(prev => ({ ...prev, allowMemberInvites: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Allow members to post messages</p>
                          <p className="text-xs text-gray-500">Members can send messages in the group chat</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={groupSettings.allowMemberPosts}
                            onChange={(e) => setGroupSettings(prev => ({ ...prev, allowMemberPosts: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Require approval for new members</p>
                          <p className="text-xs text-gray-500">New member requests need admin approval</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={groupSettings.requireApproval}
                            onChange={(e) => setGroupSettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notification Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Enable notifications</p>
                          <p className="text-xs text-gray-500">Receive notifications for group activities</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={groupSettings.notifications}
                            onChange={(e) => setGroupSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Message Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Message Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Auto-delete old messages</p>
                          <p className="text-xs text-gray-500">Automatically delete messages older than specified days</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={groupSettings.autoDeleteMessages}
                            onChange={(e) => setGroupSettings(prev => ({ ...prev, autoDeleteMessages: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                        </label>
                      </div>
                      {groupSettings.autoDeleteMessages && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Message retention (days)</label>
                          <Input
                            type="number"
                            value={groupSettings.messageRetentionDays}
                            onChange={(e) => setGroupSettings(prev => ({ ...prev, messageRetentionDays: parseInt(e.target.value) || 30 }))}
                            className="w-32"
                            min="1"
                            max="365"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="border-t border-yellow-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      Danger Zone
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="text-sm font-medium text-red-800">Delete Group</p>
                          <p className="text-xs text-red-600">Permanently delete this group and all its data</p>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-yellow-200">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                      onClick={() => {
                        // Save settings logic here
                        console.log("Saving settings:", groupSettings);
                        setShowSettings(false);
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
