"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  AtSign,
  Hash,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Search,
  Filter,
  Clock,
  Flame,
  Users,
  Plus,
  X,
  ChevronRight,
  Upload,
  Play,
  Pause,
} from "lucide-react";

interface Post {
  id: string;
  title?: string;
  content: string;
  author_id: string;
  media_urls?: string[];
  media_types?: string[];
  hashtags?: string[];
  is_published: boolean;
  is_featured: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name?: string;
  };
  is_liked?: boolean;
  is_saved?: boolean;
}

interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name?: string;
  };
  replies?: PostComment[];
}

const PostsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState("");
  
  // Create post form state
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    hashtags: [] as string[],
    mediaFiles: [] as File[],
    mediaUrls: [] as string[],
  });
  const [isUploading, setIsUploading] = useState(false);
  
  // Loading states for actions
  const [loadingActions, setLoadingActions] = useState<{[key: string]: boolean}>({});

  // Helper function to get or create user profile
  const getOrCreateProfile = async () => {
    if (!user?.id) return null;

    try {
      // First, try to get existing profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        return profile;
      }

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }

        return newProfile;
      }

      throw profileError;
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      throw error;
    }
  };

  // Fetch posts from database
  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(id, full_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      // Apply filters based on active tab
      if (activeTab === "trending") {
        query = query.order('likes_count', { ascending: false });
      } else if (activeTab === "published") {
        query = query.eq('is_published', true);
      } else if (activeTab === "saved") {
        if (!user?.id) {
          setPosts([]);
          return;
        }
        // Get saved posts
        try {
          const profile = await getOrCreateProfile();
          if (!profile) {
            setPosts([]);
            return;
          }

        const { data: savedPosts } = await supabase
          .from('post_saves')
          .select('post_id')
          .eq('user_id', profile.id);
        
        if (savedPosts && savedPosts.length > 0) {
          const postIds = savedPosts.map(sp => sp.post_id);
          query = query.in('id', postIds);
        } else {
          setPosts([]);
          return;
        }
        } catch (profileError) {
          console.error('Error getting profile for saved posts:', profileError);
          setPosts([]);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      console.log('Fetched posts:', data);

      // Get user interactions (likes and saves) for each post
      if (user?.id && data) {
        try {
          const profile = await getOrCreateProfile();
          if (profile) {
          const postIds = data.map(post => post.id);
          
          const [likesResult, savesResult] = await Promise.all([
            supabase
              .from('post_likes')
              .select('post_id')
              .eq('user_id', profile.id)
              .in('post_id', postIds),
            supabase
              .from('post_saves')
              .select('post_id')
              .eq('user_id', profile.id)
              .in('post_id', postIds)
          ]);

          const likedPostIds = new Set(likesResult.data?.map(like => like.post_id) || []);
          const savedPostIds = new Set(savesResult.data?.map(save => save.post_id) || []);

          const postsWithInteractions = data.map(post => ({
            ...post,
            is_liked: likedPostIds.has(post.id),
            is_saved: savedPostIds.has(post.id),
          }));

          setPosts(postsWithInteractions);
          } else {
            setPosts(data || []);
          }
        } catch (profileError) {
          console.error('Error getting profile in fetchPosts:', profileError);
          setPosts(data || []);
        }
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch posts. Please make sure the database is set up correctly."
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          author:profiles(id, full_name)
        `)
        .eq('post_id', postId)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch replies for each comment
      if (data) {
        const commentsWithReplies = await Promise.all(
          data.map(async (comment) => {
            const { data: replies } = await supabase
              .from('post_comments')
              .select(`
                *,
                author:profiles(id, full_name)
              `)
              .eq('parent_id', comment.id)
              .order('created_at', { ascending: true });

            return {
              ...comment,
              replies: replies || []
            };
          })
        );

        setComments(commentsWithReplies);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch comments"
      });
    }
  };

  // Upload media files to Supabase Storage
  const uploadMedia = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      console.log('Uploading file:', file.name, 'to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('post-media')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully:', data.publicUrl);
      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a post"
      });
      return;
    }

    if (!newPost.content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Post content is required"
      });
      return;
    }

    try {
      setIsUploading(true);

      // First, get the profile ID for the current user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          variant: "destructive",
          title: "Profile Error",
          description: "Could not find user profile. Please make sure you have a profile set up."
        });
        return;
      }

      let mediaUrls: string[] = [];
      let mediaTypes: string[] = [];

      // Upload media files if any
      if (newPost.mediaFiles.length > 0) {
        try {
          mediaUrls = await uploadMedia(newPost.mediaFiles);
          mediaTypes = newPost.mediaFiles.map(file => 
            file.type.startsWith('video/') ? 'video' : 'image'
          );
        } catch (uploadError) {
          console.error('Media upload failed:', uploadError);
          toast({
            variant: "destructive",
            title: "Upload Error",
            description: "Failed to upload media files. Creating post without media."
          });
          // Continue without media
          mediaUrls = [];
          mediaTypes = [];
        }
      }

      // Extract hashtags from content
      const hashtagMatches = newPost.content.match(/#\w+/g);
      const hashtags = hashtagMatches ? hashtagMatches.map(tag => tag.substring(1)) : [];

      const postData = {
        title: newPost.title || null,
        content: newPost.content,
        author_id: profile.id, // Use profile ID, not user ID
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        media_types: mediaTypes.length > 0 ? mediaTypes : null,
        hashtags: hashtags.length > 0 ? hashtags : null,
        is_published: true,
      };

      console.log('Creating post with data:', postData);

      const { data: insertedData, error } = await supabase
        .from('posts')
        .insert(postData)
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Post created successfully:', insertedData);

      toast({
        title: "Success",
        description: "Post created successfully"
      });

      // Reset form and close dialog
      setNewPost({
        title: "",
        content: "",
        hashtags: [],
        mediaFiles: [],
        mediaUrls: [],
      });
      setIsCreateDialogOpen(false);
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post. Please make sure the database is set up correctly."
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle like/unlike post
  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to like posts"
      });
      return;
    }

    const actionKey = `like-${postId}`;
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));

    try {
      // Get or create user profile
      const profile = await getOrCreateProfile();
      if (!profile) {
        throw new Error('Unable to get or create user profile');
      }

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', profile.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: profile.id,
          });

        if (error) throw error;
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !isLiked,
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));

      // Show success feedback
      toast({
        title: isLiked ? "Post unliked" : "Post liked",
        description: isLiked ? "You've unliked this post" : "You've liked this post"
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like status. Please try again."
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  // Handle save/unsave post
  const handleSavePost = async (postId: string, isSaved: boolean) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to save posts"
      });
      return;
    }

    const actionKey = `save-${postId}`;
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));

    try {
      // Get or create user profile
      const profile = await getOrCreateProfile();
      if (!profile) {
        throw new Error('Unable to get or create user profile');
      }

      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from('post_saves')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', profile.id);

        if (error) throw error;
      } else {
        // Save
        const { error } = await supabase
          .from('post_saves')
          .insert({
            post_id: postId,
            user_id: profile.id,
          });

        if (error) throw error;
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_saved: !isSaved }
          : post
      ));

      // Show success feedback
      toast({
        title: isSaved ? "Post unsaved" : "Post saved",
        description: isSaved ? "Post removed from your saved posts" : "Post saved to your collection"
      });
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update save status. Please try again."
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  // Handle share post
  const handleSharePost = async (post: Post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title || 'Check out this post',
          text: post.content,
          url: window.location.href,
        });
        toast({
          title: "Post shared",
          description: "Post shared successfully"
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${post.title || 'Check out this post'}\n\n${post.content}\n\n${window.location.href}`
        );
        toast({
          title: "Copied to clipboard",
          description: "Post link copied to clipboard"
        });
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      if (error.name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to share post. Please try again."
        });
      }
    }
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!user?.id || !selectedPost || !newComment.trim()) return;

    try {
      // Get or create user profile
      const profile = await getOrCreateProfile();
      if (!profile) {
        throw new Error('Unable to get or create user profile');
      }

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: selectedPost.id,
          user_id: profile.id,
          content: newComment.trim(),
        });

      if (error) throw error;

      setNewComment("");
      fetchComments(selectedPost.id);
      
      // Update comments count
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ));

      toast({
        title: "Success",
        description: "Comment added successfully"
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment"
      });
    }
  };

  // Handle media file selection
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewPost(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
    }));
  };

  // Remove media file
  const removeMediaFile = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
    }));
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 2592000)}mo`;
  };

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;

    return posts.filter(post => 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.hashtags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [posts, searchTerm]);

  // Test function to debug post creation
  const testPostCreation = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }

    try {
      console.log('Testing post creation with user ID:', user.id);
      
      // First, get the profile ID for the current user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          variant: "destructive",
          title: "Profile Error",
          description: "Could not find user profile. Please make sure you have a profile set up."
        });
        return;
      }

      console.log('Found profile ID:', profile.id);
      
      const testData = {
        content: 'Test post from debug function',
        author_id: profile.id, // Use profile ID, not user ID
        is_published: true,
      };

      console.log('Test data:', testData);

      const { data, error } = await supabase
        .from('posts')
        .insert(testData)
        .select();

      if (error) {
        console.error('Test post creation failed:', error);
        toast({
          variant: "destructive",
          title: "Test Failed",
          description: `Error: ${error.message}`
        });
      } else {
        console.log('Test post created successfully:', data);
        toast({
          title: "Test Success",
          description: "Test post created successfully!"
        });
      }
    } catch (error) {
      console.error('Test post creation error:', error);
      toast({
        variant: "destructive",
        title: "Test Error",
        description: "An unexpected error occurred during testing."
      });
    }
  };

  // Load posts on component mount and when dependencies change
  useEffect(() => {
    fetchPosts();
  }, [activeTab, user?.id]);

  return (
    <AppLayout pageTitle="Posts">
      <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Posts</h1>
              <p className="text-muted-foreground mt-1">
                Share updates, work-in-progress, and ideas with the community
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts or #hashtag"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={testPostCreation}
                  className="text-xs"
                >
                  Debug Test
                </Button>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Share your thoughts, updates, or work-in-progress with the community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Post title (optional)"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="What's on your mind? Use #hashtags to categorize your post..."
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        className="min-h-32"
                      />
                    </div>
                    
                    {/* Media Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Add Media (Optional)</label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleMediaSelect}
                          className="hidden"
                          id="media-upload"
                        />
                        <label
                          htmlFor="media-upload"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload images or videos
                          </p>
                        </label>
                      </div>
                      
                      {/* Selected Media Preview */}
                      {newPost.mediaFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {newPost.mediaFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                              {file.type.startsWith('image/') ? (
                                <ImageIcon className="h-4 w-4" />
                              ) : (
                                <VideoIcon className="h-4 w-4" />
                              )}
                              <span className="text-sm flex-1 truncate">{file.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMediaFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreatePost}
                        disabled={isUploading || !newPost.content.trim()}
                      >
                        {isUploading ? "Creating..." : "Create Post"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="trending">Trending Posts</TabsTrigger>
            <TabsTrigger value="published">Published Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved Posts</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No posts found</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {post.author?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">
                          {post.author?.full_name || "Unknown User"}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(post.created_at)}
                        </p>
                      </div>
                    </div>
                    {post.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Flame className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Post Content */}
                  <div>
                    {post.title && (
                      <h4 className="font-semibold text-base mb-2">{post.title}</h4>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                    
                    {/* Hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.hashtags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media */}
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="space-y-2">
                      {post.media_urls.map((url, index) => (
                        <div key={index} className="relative">
                          {post.media_types?.[index] === 'video' ? (
                            <video
                              src={url}
                              controls
                              className="w-full max-h-96 object-cover rounded-lg"
                            />
                          ) : (
                            <img
                              src={url}
                              alt="Post media"
                              className="w-full max-h-96 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id, post.is_liked || false)}
                        disabled={loadingActions[`like-${post.id}`]}
                        className={`flex items-center gap-2 transition-colors ${post.is_liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Heart className={`h-4 w-4 transition-all ${post.is_liked ? 'fill-current scale-110' : 'hover:scale-110'}`} />
                        <span className="font-medium">{post.likes_count}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPost(post);
                          setIsCommentsDialogOpen(true);
                          fetchComments(post.id);
                        }}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 hover:scale-110 transition-transform" />
                        <span className="font-medium">{post.comments_count}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSharePost(post)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Share2 className="h-4 w-4 hover:scale-110 transition-transform" />
                        <span className="font-medium">{post.shares_count}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSavePost(post.id, post.is_saved || false)}
                        disabled={loadingActions[`save-${post.id}`]}
                        className={`flex items-center gap-2 transition-colors ${post.is_saved ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Bookmark className={`h-4 w-4 transition-all ${post.is_saved ? 'fill-current scale-110' : 'hover:scale-110'}`} />
                      </Button>
                    </div>
                    
                    {post.comments_count > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPost(post);
                          setIsCommentsDialogOpen(true);
                          fetchComments(post.id);
                        }}
                        className="text-muted-foreground text-xs"
                      >
                        View comments
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Comments Dialog */}
        <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
              <DialogDescription>
                Join the conversation and share your thoughts on this post.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Post
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {comment.author?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">
                            {comment.author?.full_name || "Unknown User"}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-11 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                {reply.author?.full_name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-xs">
                                  {reply.author?.full_name || "Unknown User"}
                                </h5>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-xs mt-1">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default PostsPage;
