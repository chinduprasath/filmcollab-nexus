import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function NewIndustryHubPost() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState(searchParams.get("type") || "news");
  const creatorName = profile?.full_name || profile?.username || "Anonymous";

  const [editId, setEditId] = useState<string | null>(searchParams.get("edit"));
  
  useEffect(() => {
    if (editId) {
      const fetchItemToEdit = async () => {
        setLoading(true);
        try {
          let table = "industry_news";
          if (selectedPostType === "events") table = "industry_events";
          if (selectedPostType === "courses") table = "industry_courses";
          
          const { data, error } = await supabase.from(table).select("*").eq("id", editId).single();
          if (error) throw error;
          
          if (data) {
            if (selectedPostType === "news") {
              setFormFields(prev => ({
                ...prev,
                newsTitle: data.title || "",
                newsDescription: data.description || "",
                newsCategory: data.category || "Technology",
                newsContent: data.content || ""
              }));
            } else if (selectedPostType === "events") {
              setFormFields(prev => ({
                ...prev,
                eventTitle: data.title || "",
                eventDate: data.date || "",
                eventPriceType: data.price === "Free" ? "Free" : "Paid",
                eventPriceAmount: data.price && data.price !== "Free" ? data.price.replace(/[^0-9.]/g, '') : "",
                eventLocation: data.location || "",
                eventType: data.is_online ? "Online" : "In-Person",
                eventDescription: data.description || "",
                eventGoogleMapsLink: data.google_maps_link || "",
                eventMeetingLink: data.meeting_link || "",
                eventRegistrationLink: data.registration_link || ""
              }));
            } else if (selectedPostType === "courses") {
              setFormFields(prev => ({
                ...prev,
                courseTitle: data.title || "",
                courseDuration: data.duration || "",
                coursePriceType: data.price === "Free" ? "Free" : "Paid",
                coursePriceAmount: data.price && data.price !== "Free" ? data.price.replace(/[^0-9.]/g, '') : "",
                courseLevel: data.level || "Beginner",
                courseCategory: data.category || "Cinematography",
                courseInstructor: data.instructor || "",
                courseDescription: data.description || "",
                courseWebsiteLink: data.website_link || ""
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching item to edit:", error);
          toast({ title: "Error loading item", description: "Could not load item details for editing.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      
      fetchItemToEdit();
    }
  }, [editId, selectedPostType]);


  const [formFields, setFormFields] = useState({
    // News
    newsTitle: "",
    newsCategory: "Technology",
    newsDescription: "",
    newsContent: "",

    // Events
    eventTitle: "",
    eventDate: "",
    eventPriceType: "Free",
    eventPriceAmount: "",
    eventLocation: "",
    eventType: "In-Person",
    eventDescription: "",
    eventGoogleMapsLink: "",
    eventMeetingLink: "",
    eventRegistrationLink: "",

    // Courses
    courseTitle: "",
    courseDuration: "",
    coursePriceType: "Free",
    coursePriceAmount: "",
    courseLevel: "Beginner",
    courseCategory: "Cinematography",
    courseInstructor: "",
    courseDescription: "",
    courseWebsiteLink: "",
  });

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please log in to post.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (selectedPostType === "news") {
        if (!formFields.newsTitle.trim() || !formFields.newsDescription.trim() || !formFields.newsContent.trim()) {
          toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
          setLoading(false);
          return;
        }

        const payload: any = {
          title: formFields.newsTitle,
          description: formFields.newsDescription,
          category: formFields.newsCategory,
          content: formFields.newsContent,
          created_by: creatorName,
          user_id: user.id
        };

        let { error } = editId 
          ? await supabase.from("industry_news").update(payload).eq("id", editId) 
          : await supabase.from("industry_news").insert([payload]);
        if (error && error.code === "42703") {
          console.warn("New news columns don't exist. Falling back to old schema.", error);
          const fallbackPayload = { ...payload };
          delete fallbackPayload.content;
          
          const result = editId 
            ? await supabase.from("industry_news").update(fallbackPayload).eq("id", editId)
            : await supabase.from("industry_news").insert([fallbackPayload]);
          error = result.error;
        }
        
        if (error) throw error;
        toast({ title: "News posted successfully" });

      } else if (selectedPostType === "events") {
        if (!formFields.eventTitle.trim() || !formFields.eventDate || !formFields.eventLocation.trim() || !formFields.eventDescription.trim()) {
          toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
          setLoading(false);
          return;
        }
        
        if (formFields.eventPriceType === "Paid" && !formFields.eventPriceAmount.trim()) {
          toast({ title: "Validation Error", description: "Please enter the price amount.", variant: "destructive" });
          setLoading(false);
          return;
        }

        if (formFields.eventType === "In-Person" && !formFields.eventLocation.trim()) {
          toast({ title: "Validation Error", description: "Please enter a location/address for the in-person event.", variant: "destructive" });
          setLoading(false);
          return;
        } else if (formFields.eventType === "Online" && !formFields.eventMeetingLink.trim()) {
          toast({ title: "Validation Error", description: "Please enter a meeting link for the online event.", variant: "destructive" });
          setLoading(false);
          return;
        }

        const finalPrice = formFields.eventPriceType === "Free" ? "Free" : `₹${formFields.eventPriceAmount}`;

        const payload: Record<string, string | boolean | null | undefined> = {
          title: formFields.eventTitle,
          date: formFields.eventDate,
          price: finalPrice,
          location: formFields.eventLocation,
          is_online: formFields.eventType === "Online",
          description: formFields.eventDescription,
          created_by: creatorName,
          user_id: user.id,
          google_maps_link: formFields.eventType === "In-Person" ? (formFields.eventGoogleMapsLink || null) : null,
          meeting_link: formFields.eventType === "Online" ? (formFields.eventMeetingLink || null) : null,
          registration_link: formFields.eventRegistrationLink || null
        };

        let { error } = editId 
          ? await supabase.from("industry_events").update(payload).eq("id", editId) 
          : await supabase.from("industry_events").insert([payload]);

        if (error && error.code === "42703") {
          console.warn("New event columns don't exist. Falling back to old schema.", error);
          const fallbackPayload = { ...payload };
          delete fallbackPayload.google_maps_link;
          delete fallbackPayload.meeting_link;
          delete fallbackPayload.registration_link;
          
          const result = editId 
            ? await supabase.from("industry_events").update(fallbackPayload).eq("id", editId)
            : await supabase.from("industry_events").insert([fallbackPayload]);
          error = result.error;
          
          toast({
            title: "Event created with limits",
            description: "Event saved successfully. Please run the updated SQL in setup_industry_hub_upgrades.sql in your Supabase dashboard to support Google Maps, Meeting, and Registration links.",
            variant: "default"
          });
        } else if (error) {
          throw error;
        } else {
          toast({ title: "Event created successfully" });
        }

      } else if (selectedPostType === "courses") {
        if (!formFields.courseTitle.trim() || !formFields.courseDuration.trim() || !formFields.courseInstructor.trim() || !formFields.courseDescription.trim()) {
          toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
          setLoading(false);
          return;
        }

        if (formFields.coursePriceType === "Paid" && !formFields.coursePriceAmount.trim()) {
          toast({ title: "Validation Error", description: "Please enter the price amount.", variant: "destructive" });
          setLoading(false);
          return;
        }

        const finalPrice = formFields.coursePriceType === "Free" ? "Free" : `₹${formFields.coursePriceAmount}`;

        const payload: Record<string, string | boolean | null | undefined> = {
          title: formFields.courseTitle,
          duration: formFields.courseDuration,
          price: finalPrice,
          instructor: formFields.courseInstructor,
          level: formFields.courseLevel,
          category: formFields.courseCategory,
          description: formFields.courseDescription,
          created_by: creatorName,
          user_id: user.id,
          website_link: formFields.courseWebsiteLink || null
        };

        let { error } = editId 
          ? await supabase.from("industry_courses").update(payload).eq("id", editId) 
          : await supabase.from("industry_courses").insert([payload]);
        if (error && error.code === "42703") {
          console.warn("New course columns don't exist. Falling back to old schema.", error);
          const fallbackPayload = { ...payload };
          delete fallbackPayload.website_link;
          
          const result = editId 
            ? await supabase.from("industry_courses").update(fallbackPayload).eq("id", editId)
            : await supabase.from("industry_courses").insert([fallbackPayload]);
          error = result.error;
        }

        if (error) throw error;
        toast({ title: "Course created successfully" });
      }

      navigate("/industry-hub");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred while saving. Please ensure the database tables are setup.";
      toast({
        title: "Error saving item",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <AppLayout>
      <div className="bg-yellow-50/30 dark:bg-background min-h-screen p-4 md:p-8 -m-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/industry-hub")}
            className="mb-4 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Industry Hub
          </Button>

          <Card className="border-yellow-200 dark:border-yellow-900/40 shadow-sm">
            <CardHeader className="bg-white dark:bg-background border-b border-yellow-100 dark:border-yellow-900/40 rounded-t-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                <div className="w-full sm:w-auto">
                  <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white">Create New Post</CardTitle>
                  <CardDescription className="w-full break-words">Share news, events, or educational courses with the community.</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border shrink-0 max-w-full">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Posting as: <span className="text-foreground">{creatorName}</span></span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Post Type</label>
                <Select value={selectedPostType} onValueChange={setSelectedPostType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News & Insights</SelectItem>
                    <SelectItem value="events">Event</SelectItem>
                    <SelectItem value="courses">Course</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-border pt-6">
                {selectedPostType === "news" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title <span className="text-red-500">*</span></label>
                        <Input 
                          placeholder="Enter news title" 
                          value={formFields.newsTitle}
                          onChange={(e) => setFormFields(prev => ({ ...prev, newsTitle: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category <span className="text-red-500">*</span></label>
                        <Select 
                          value={formFields.newsCategory}
                          onValueChange={(val) => setFormFields(prev => ({ ...prev, newsCategory: val }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Industry">Industry Updates</SelectItem>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Description <span className="text-red-500">*</span></label>
                      <Textarea 
                        placeholder="Enter a short summary for the news card..." 
                        className="min-h-[80px]"
                        value={formFields.newsDescription}
                        onChange={(e) => setFormFields(prev => ({ ...prev, newsDescription: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Article Content <span className="text-red-500">*</span></label>
                      <div className="bg-white dark:bg-zinc-900 rounded-md border overflow-hidden">
                        <ReactQuill 
                          theme="snow" 
                          value={formFields.newsContent} 
                          onChange={(val) => setFormFields(prev => ({ ...prev, newsContent: val }))}
                          modules={modules}
                          className="min-h-[300px]"
                          placeholder="Write your full article here..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPostType === "events" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Title <span className="text-red-500">*</span></label>
                      <Input 
                        placeholder="Enter event title" 
                        value={formFields.eventTitle}
                        onChange={(e) => setFormFields(prev => ({ ...prev, eventTitle: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date <span className="text-red-500">*</span></label>
                        <Input 
                          type="date" 
                          value={formFields.eventDate}
                          onChange={(e) => setFormFields(prev => ({ ...prev, eventDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <Select 
                            value={formFields.eventPriceType}
                            onValueChange={(val) => setFormFields(prev => ({ ...prev, eventPriceType: val, eventPriceAmount: val === 'Free' ? '' : prev.eventPriceAmount }))}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Free">Free</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            placeholder="Amount (e.g. 1500)" 
                            type="number"
                            value={formFields.eventPriceAmount}
                            onChange={(e) => setFormFields(prev => ({ ...prev, eventPriceAmount: e.target.value }))}
                            className="flex-1"
                            disabled={formFields.eventPriceType === 'Free'}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
                      <Select 
                        value={formFields.eventType}
                        onValueChange={(val) => {
                          setFormFields(prev => ({ 
                            ...prev, 
                            eventType: val,
                            eventLocation: val === "Online" ? "Online" : prev.eventLocation === "Online" ? "" : prev.eventLocation
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In-Person">In-Person</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formFields.eventType === "Online" ? "Platform / Location" : "Location / Address"} <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        placeholder={formFields.eventType === "Online" ? "e.g., Zoom, Google Meet" : "Enter physical address"} 
                        value={formFields.eventLocation}
                        onChange={(e) => setFormFields(prev => ({ ...prev, eventLocation: e.target.value }))}
                      />
                    </div>

                    {formFields.eventType === "In-Person" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Google Maps Link (Optional)</label>
                        <Input 
                          placeholder="https://maps.google.com/..." 
                          value={formFields.eventGoogleMapsLink}
                          onChange={(e) => setFormFields(prev => ({ ...prev, eventGoogleMapsLink: e.target.value }))}
                        />
                      </div>
                    )}

                    {formFields.eventType === "Online" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meeting Link <span className="text-red-500">*</span></label>
                        <Input 
                          placeholder="https://zoom.us/j/..." 
                          value={formFields.eventMeetingLink}
                          onChange={(e) => setFormFields(prev => ({ ...prev, eventMeetingLink: e.target.value }))}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Registration Link (Optional)</label>
                      <Input 
                        placeholder="https://example.com/register" 
                        value={formFields.eventRegistrationLink}
                        onChange={(e) => setFormFields(prev => ({ ...prev, eventRegistrationLink: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description <span className="text-red-500">*</span></label>
                      <Textarea 
                        placeholder="Enter event details and agenda..." 
                        className="min-h-[150px]"
                        value={formFields.eventDescription}
                        onChange={(e) => setFormFields(prev => ({ ...prev, eventDescription: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {selectedPostType === "courses" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Title <span className="text-red-500">*</span></label>
                      <Input 
                        placeholder="Enter course title" 
                        value={formFields.courseTitle}
                        onChange={(e) => setFormFields(prev => ({ ...prev, courseTitle: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration <span className="text-red-500">*</span></label>
                        <Input 
                          placeholder="e.g., 8 weeks" 
                          value={formFields.courseDuration}
                          onChange={(e) => setFormFields(prev => ({ ...prev, courseDuration: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <Select 
                            value={formFields.coursePriceType}
                            onValueChange={(val) => setFormFields(prev => ({ ...prev, coursePriceType: val, coursePriceAmount: val === 'Free' ? '' : prev.coursePriceAmount }))}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Free">Free</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            placeholder="Amount (e.g. 15000)" 
                            type="number"
                            value={formFields.coursePriceAmount}
                            onChange={(e) => setFormFields(prev => ({ ...prev, coursePriceAmount: e.target.value }))}
                            className="flex-1"
                            disabled={formFields.coursePriceType === 'Free'}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Level <span className="text-red-500">*</span></label>
                        <Select 
                          value={formFields.courseLevel}
                          onValueChange={(val) => setFormFields(prev => ({ ...prev, courseLevel: val }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category <span className="text-red-500">*</span></label>
                        <Select 
                          value={formFields.courseCategory}
                          onValueChange={(val) => setFormFields(prev => ({ ...prev, courseCategory: val }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cinematography">Cinematography</SelectItem>
                            <SelectItem value="Writing">Writing</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Sound">Sound Design</SelectItem>
                            <SelectItem value="Post-Production">Post-Production</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Instructor <span className="text-red-500">*</span></label>
                      <Input 
                        placeholder="Enter instructor's name" 
                        value={formFields.courseInstructor}
                        onChange={(e) => setFormFields(prev => ({ ...prev, courseInstructor: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Website Link (Optional)</label>
                      <Input 
                        placeholder="https://example.com/course" 
                        value={formFields.courseWebsiteLink}
                        onChange={(e) => setFormFields(prev => ({ ...prev, courseWebsiteLink: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description <span className="text-red-500">*</span></label>
                      <Textarea 
                        placeholder="Enter course curriculum and details..." 
                        className="min-h-[150px]"
                        value={formFields.courseDescription}
                        onChange={(e) => setFormFields(prev => ({ ...prev, courseDescription: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>

            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-zinc-900/50 rounded-b-xl border-t border-yellow-100 dark:border-yellow-900/40 p-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/industry-hub")}
                className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-white min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  `Post ${selectedPostType === 'news' ? 'News' : selectedPostType === 'events' ? 'Event' : 'Course'}`
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
