import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, Settings, Globe, Phone, Image as ImageIcon, AtSign, MapPin, Share2, CreditCard, Plus, Trash2, Edit2, AlertCircle, Settings2, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AdminSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Subscriptions State
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>({
    id: "",
    name: "",
    monthly_price: "",
    yearly_price: "",
    final_monthly_price: "",
    final_yearly_price: "",
    description: "",
    features: [],
    popular: false,
    is_custom_price: false,
    restrictions: {}
  });
  const [newFeature, setNewFeature] = useState("");

  // Global Tags State
  const [globalTags, setGlobalTags] = useState<any[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  // Property Types states
  const [existingPropertyTypes, setExistingPropertyTypes] = useState<any[]>([]);
  const [newPropertyType, setNewPropertyType] = useState("");
  const [editingPropertyTypeId, setEditingPropertyTypeId] = useState<string | null>(null);
  const [editingPropertyTypeName, setEditingPropertyTypeName] = useState("");

  // Directory Categories State
  const [directoryCategories, setDirectoryCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("image");
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Form States
  const [settings, setSettings] = useState({
    id: "",
    site_title: "",
    site_description: "",
    logo_url: "",
    favicon_url: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    contact_map_link: "",
    social_facebook: "",
    social_twitter: "",
    social_instagram: "",
    social_linkedin: "",
    social_youtube: ""
  });

  useEffect(() => {
    fetchSettings();
    fetchPlans();
    fetchGlobalTags();
    fetchPropertyTypes();
    fetchDirectoryCategories();
  }, []);

  const fetchDirectoryCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const { data, error } = await supabase.from("directory_categories").select("*").order("file_type").order("name");
      if (error && error.code !== '42P01') throw error;
      if (data) setDirectoryCategories(data);
    } catch (error: any) {
      console.error("Error fetching directory categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const { error } = await supabase.from("directory_categories").insert({
        name: newCategoryName.trim(),
        file_type: newCategoryType
      });
      if (error) throw error;
      setNewCategoryName("");
      fetchDirectoryCategories();
      toast({ title: "Success", description: "Category added successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("directory_categories").delete().eq("id", id);
      if (error) throw error;
      fetchDirectoryCategories();
      toast({ title: "Success", description: "Category deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      const { data, error } = await supabase.from("property_types").select("*").order("name");
      if (!error && data) {
        setExistingPropertyTypes(data);
      }
    } catch (error) {
      console.error("Error fetching property types", error);
    }
  };

  const fetchGlobalTags = async () => {
    setIsLoadingTags(true);
    try {
      const { data, error } = await supabase.from("global_tags").select("*").order("name");
      if (error && error.code !== '42P01') throw error;
      if (data) setGlobalTags(data);
    } catch (error: any) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const { data, error } = await supabase.from("subscription_plans").select("*").order("monthly_price");
      if (error && error.code !== '42P01') throw error;
      if (data) setPlans(data);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      toast({ title: "Failed to fetch plans", description: error?.message || "Unknown error", variant: "destructive" });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error; // Ignore not found error as we might be setting up for the first time
      }
      
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
      toast({ title: "Failed to load settings. Table might be missing.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPropertyType = async () => {
    if (!newPropertyType.trim()) return;
    try {
      const { error } = await supabase.from("property_types").insert({ name: newPropertyType.trim() });
      if (error) throw error;
      toast({ title: "Property type added successfully!" });
      setNewPropertyType("");
      fetchPropertyTypes();
    } catch (error) {
      toast({ title: "Failed to add property type", variant: "destructive" });
    }
  };

  const handleUpdatePropertyType = async () => {
    if (!editingPropertyTypeId || !editingPropertyTypeName.trim()) return;
    try {
      const { error } = await supabase.from("property_types").update({ name: editingPropertyTypeName.trim() }).eq("id", editingPropertyTypeId);
      if (error) throw error;
      toast({ title: "Property type updated successfully!" });
      setEditingPropertyTypeId(null);
      setEditingPropertyTypeName("");
      fetchPropertyTypes();
    } catch (error) {
      toast({ title: "Failed to update property type", variant: "destructive" });
    }
  };

  const handleDeletePropertyType = async (id: string) => {
    try {
      const { error } = await supabase.from("property_types").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Property type deleted successfully!" });
      fetchPropertyTypes();
    } catch (error) {
      toast({ title: "Failed to delete property type", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsData = { ...settings };
      delete settingsData.id; // Don't upsert by id if we rely on a single row logic, or we can use UPSERT
      
      let error;

      if (settings.id) {
        // Update existing
        const res = await supabase.from("site_settings").update(settingsData).eq("id", settings.id);
        error = res.error;
      } else {
        // Insert new
        const res = await supabase.from("site_settings").insert([settingsData]);
        error = res.error;
      }

      if (error) throw error;
      toast({ title: "Settings saved successfully!" });
      fetchSettings(); // Refresh to get the ID if it was an insert
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "Failed to save settings.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo_url' | 'favicon_url') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldName}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site_assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('site_assets')
        .getPublicUrl(filePath);

      setSettings(prev => ({ ...prev, [fieldName]: data.publicUrl }));
      toast({ title: "Image uploaded successfully! Remember to save changes." });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({ title: "Upload failed. Does site_assets bucket exist?", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Subscription Handlers
  const handleSavePlan = async () => {
    try {
      const planData = {
        name: editingPlan.name,
        monthly_price: editingPlan.is_custom_price || editingPlan.monthly_price === '' ? null : Number(editingPlan.monthly_price),
        yearly_price: editingPlan.is_custom_price || editingPlan.yearly_price === '' ? null : Number(editingPlan.yearly_price),
        final_monthly_price: editingPlan.is_custom_price || editingPlan.final_monthly_price === '' ? null : Number(editingPlan.final_monthly_price),
        final_yearly_price: editingPlan.is_custom_price || editingPlan.final_yearly_price === '' ? null : Number(editingPlan.final_yearly_price),
        description: editingPlan.description,
        features: editingPlan.features,
        popular: editingPlan.popular,
        is_custom_price: editingPlan.is_custom_price,
        restrictions: editingPlan.restrictions
      };

      let saveError;
      if (editingPlan.id) {
        const { error } = await supabase.from("subscription_plans").update(planData).eq("id", editingPlan.id);
        saveError = error;
      } else {
        const { error } = await supabase.from("subscription_plans").insert([planData]);
        saveError = error;
      }
      
      if (saveError) {
        throw saveError;
      }

      toast({ title: "Plan saved!" });
      setIsPlanDialogOpen(false);
      fetchPlans();
    } catch (error: any) {
      console.error("Error saving plan", error);
      toast({ title: "Failed to save plan", description: error?.message || "Check if you ran the SQL setup.", variant: "destructive" });
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await supabase.from("subscription_plans").delete().eq("id", id);
      toast({ title: "Plan deleted!" });
      fetchPlans();
    } catch (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const openNewPlan = () => {
    setEditingPlan({ 
      id: "", 
      name: "", 
      monthly_price: "", 
      yearly_price: "", 
      final_monthly_price: "", 
      final_yearly_price: "", 
      description: "", 
      features: [], 
      popular: false,
      is_custom_price: false,
      restrictions: {}
    });
    setNewFeature("");
    setIsPlanDialogOpen(true);
  };

  const openEditPlan = (plan: any) => {
    setEditingPlan({
      ...plan,
      monthly_price: plan.monthly_price?.toString() || "",
      yearly_price: plan.yearly_price?.toString() || "",
      final_monthly_price: plan.final_monthly_price?.toString() || "",
      final_yearly_price: plan.final_yearly_price?.toString() || "",
      features: Array.isArray(plan.features) ? plan.features : [],
      restrictions: plan.restrictions && typeof plan.restrictions === 'object' ? plan.restrictions : {}
    });
    setNewFeature("");
    setIsPlanDialogOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setEditingPlan(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setEditingPlan(prev => {
      const updated = [...prev.features];
      updated.splice(index, 1);
      return { ...prev, features: updated };
    });
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const handleAddGlobalTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const { error } = await supabase.from("global_tags").insert([{ name: newTagName.trim() }]);
      if (error) throw error;
      toast({ title: "Tag added successfully!" });
      setNewTagName("");
      fetchGlobalTags();
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({ title: "Failed to add tag", description: error?.message, variant: "destructive" });
    }
  };

  const handleDeleteGlobalTag = async (tagId: string) => {
    try {
      const { error } = await supabase.from("global_tags").delete().eq("id", tagId);
      if (error) throw error;
      toast({ title: "Tag deleted successfully!" });
      fetchGlobalTags();
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      toast({ title: "Failed to delete tag", description: error?.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Site Settings" pageName="Settings">
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Site Settings" pageName="Settings" contentClassName="py-6 px-[20px]">
      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Global Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your site's identity, contact information, and social links.</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 bg-yellow-50/50 border border-yellow-100 rounded-md p-1 mb-6 h-auto">
            <TabsTrigger value="general" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded py-2 flex items-center gap-2">
              <Settings className="h-4 w-4" /> <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded py-2 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded py-2 flex items-center gap-2">
              <Phone className="h-4 w-4" /> <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded py-2 flex items-center gap-2">
              <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Social Media</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded py-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="configure" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded py-2 flex items-center gap-2">
              <Settings2 className="h-4 w-4" /> <span className="hidden sm:inline">Configure</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic information about your platform used for SEO and metadata.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Site Title</label>
                  <Input 
                    name="site_title" 
                    value={settings.site_title || ""} 
                    onChange={handleChange} 
                    placeholder="e.g. FilmCollab" 
                    className="focus-visible:ring-yellow-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Site Description</label>
                  <textarea 
                    name="site_description" 
                    value={settings.site_description || ""} 
                    onChange={handleChange} 
                    placeholder="Describe your platform..." 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Branding Assets</CardTitle>
                <CardDescription>Configure the visual assets of your site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Site Logo</label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo_url')} 
                      className="focus-visible:ring-yellow-500 flex-1 max-w-sm"
                    />
                    {settings.logo_url && (
                      <div className="p-2 bg-gray-50 border rounded-md">
                        <img src={settings.logo_url} alt="Logo preview" className="h-10 object-contain" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Upload a PNG or SVG logo.</p>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-semibold">Favicon</label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'favicon_url')} 
                      className="focus-visible:ring-yellow-500 flex-1 max-w-sm"
                    />
                    {settings.favicon_url && (
                      <div className="p-2 bg-gray-50 border rounded-md">
                        <img src={settings.favicon_url} alt="Favicon preview" className="h-6 w-6 object-contain" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Upload an icon file (e.g., .ico, .png 32x32px).</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How users can reach you. Displayed in footers and contact pages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><AtSign className="h-4 w-4 text-gray-500" /> Support Email</label>
                    <Input 
                      name="contact_email" 
                      value={settings.contact_email || ""} 
                      onChange={handleChange} 
                      placeholder="support@filmcollab.com" 
                      className="focus-visible:ring-yellow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> Support Phone</label>
                    <Input 
                      name="contact_phone" 
                      value={settings.contact_phone || ""} 
                      onChange={handleChange} 
                      placeholder="+91 9876543210" 
                      className="focus-visible:ring-yellow-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" /> Office Address</label>
                  <textarea 
                    name="contact_address" 
                    value={settings.contact_address || ""} 
                    onChange={handleChange} 
                    placeholder="123 Creative Street, Film City..." 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Globe className="h-4 w-4 text-gray-500" /> Google Maps Embed Link</label>
                  <Input 
                    name="contact_map_link" 
                    value={settings.contact_map_link || ""} 
                    onChange={handleChange} 
                    placeholder="https://www.google.com/maps/embed?pb=..." 
                    className="focus-visible:ring-yellow-500"
                  />
                  <p className="text-xs text-muted-foreground">Paste the src URL from a Google Maps embed iframe to display a map on your contact page.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Profiles</CardTitle>
                <CardDescription>Links to your official social media pages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Instagram URL</label>
                    <Input 
                      name="social_instagram" 
                      value={settings.social_instagram || ""} 
                      onChange={handleChange} 
                      placeholder="https://instagram.com/..." 
                      className="focus-visible:ring-yellow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">YouTube URL</label>
                    <Input 
                      name="social_youtube" 
                      value={settings.social_youtube || ""} 
                      onChange={handleChange} 
                      placeholder="https://youtube.com/..." 
                      className="focus-visible:ring-yellow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">LinkedIn URL</label>
                    <Input 
                      name="social_linkedin" 
                      value={settings.social_linkedin || ""} 
                      onChange={handleChange} 
                      placeholder="https://linkedin.com/..." 
                      className="focus-visible:ring-yellow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Twitter / X URL</label>
                    <Input 
                      name="social_twitter" 
                      value={settings.social_twitter || ""} 
                      onChange={handleChange} 
                      placeholder="https://twitter.com/..." 
                      className="focus-visible:ring-yellow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Facebook URL</label>
                    <Input 
                      name="social_facebook" 
                      value={settings.social_facebook || ""} 
                      onChange={handleChange} 
                      placeholder="https://facebook.com/..." 
                      className="focus-visible:ring-yellow-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Subscription Plans</CardTitle>
                  <CardDescription>Manage the pricing plans available to your users.</CardDescription>
                </div>
                <Button onClick={openNewPlan} className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2">
                  <Plus className="h-4 w-4" /> Add Plan
                </Button>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan Name</TableHead>
                        <TableHead>M / Y Base Price</TableHead>
                        <TableHead>M / Y Final Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans.length === 0 && !isLoadingPlans && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No plans configured. Create your first subscription plan.
                          </TableCell>
                        </TableRow>
                      )}
                      {plans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.name}</TableCell>
                          <TableCell>{plan.is_custom_price ? "Custom" : `₹${plan.monthly_price || '-'} / ₹${plan.yearly_price || '-'}`}</TableCell>
                          <TableCell>{plan.is_custom_price ? "Custom" : `₹${plan.final_monthly_price || '-'} / ₹${plan.final_yearly_price || '-'}`}</TableCell>
                          <TableCell>
                            {plan.popular ? (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Most Popular</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Standard</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditPlan(plan)}>
                              <Edit2 className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(plan.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="configure" className="space-y-4">
            <Accordion type="single" collapsible defaultValue="global-tags" className="w-full space-y-4">
              <AccordionItem value="global-tags" className="border bg-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-lg">Global Tags Configuration</span>
                    <span className="text-sm text-muted-foreground font-normal">Manage the tags that are available to be assigned to users, projects, jobs, and locations.</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-end">
                      <div className="space-y-2 flex-1 max-w-sm">
                        <label className="text-sm font-semibold">New Tag Name</label>
                        <Input 
                          value={newTagName} 
                          onChange={(e) => setNewTagName(e.target.value)} 
                          placeholder="e.g. Featured, Portfolio, Urgent"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddGlobalTag()}
                        />
                      </div>
                      <Button onClick={handleAddGlobalTag} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Tags className="h-4 w-4 mr-2" /> Add Tag
                      </Button>
                    </div>

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tag Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingTags ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-yellow-500" />
                              </TableCell>
                            </TableRow>
                          ) : globalTags.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                No tags configured. Create your first tag.
                              </TableCell>
                            </TableRow>
                          ) : (
                            globalTags.map((tag) => (
                              <TableRow key={tag.id}>
                                <TableCell className="font-medium">
                                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                    {tag.name}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteGlobalTag(tag.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="property-types" className="border bg-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-lg">Property Types Configuration</span>
                    <span className="text-sm text-muted-foreground font-normal">Manage the list of property types for shooting locations.</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-end">
                      <div className="space-y-2 flex-1 max-w-sm">
                        <label className="text-sm font-semibold">New Property Type</label>
                        <Input 
                          placeholder="e.g. Castle, Mansion, Forest" 
                          value={newPropertyType}
                          onChange={(e) => setNewPropertyType(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddPropertyType()}
                        />
                      </div>
                      <Button onClick={handleAddPropertyType} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Plus className="h-4 w-4 mr-2" /> Add Type
                      </Button>
                    </div>

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Property Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {existingPropertyTypes.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                No property types configured.
                              </TableCell>
                            </TableRow>
                          ) : (
                            existingPropertyTypes.map((pt) => (
                              <TableRow key={pt.id}>
                                <TableCell className="font-medium">
                                  {editingPropertyTypeId === pt.id ? (
                                    <Input 
                                      value={editingPropertyTypeName}
                                      onChange={(e) => setEditingPropertyTypeName(e.target.value)}
                                      className="h-8 max-w-[200px]"
                                      autoFocus
                                    />
                                  ) : (
                                    <span>{pt.name}</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  {editingPropertyTypeId === pt.id ? (
                                    <>
                                      <Button size="sm" variant="outline" onClick={() => setEditingPropertyTypeId(null)}>Cancel</Button>
                                      <Button size="sm" onClick={handleUpdatePropertyType} className="bg-green-500 hover:bg-green-600 text-white">Save</Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button variant="ghost" size="icon" onClick={() => { setEditingPropertyTypeId(pt.id); setEditingPropertyTypeName(pt.name); }}>
                                        <Edit2 className="h-4 w-4 text-gray-500" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeletePropertyType(pt.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="directory-categories" className="border rounded-lg bg-white/50 mb-4 px-2">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-lg">Directory Categories</span>
                    <span className="text-sm text-muted-foreground font-normal">Manage file categories available for each file type.</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-end flex-wrap">
                      <div className="space-y-2 w-48">
                        <label className="text-sm font-semibold">File Type</label>
                        <select
                          value={newCategoryType}
                          onChange={(e) => setNewCategoryType(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="image">Photo</option>
                          <option value="video">Video</option>
                          <option value="document">Document</option>
                          <option value="audio">Audio</option>
                        </select>
                      </div>
                      <div className="space-y-2 flex-1 max-w-sm">
                        <label className="text-sm font-semibold">New Category</label>
                        <Input 
                          placeholder="e.g. Cinematic, Portrait, Script" 
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                      </div>
                      <Button onClick={handleAddCategory} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Plus className="h-4 w-4 mr-2" /> Add Category
                      </Button>
                    </div>

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Type</TableHead>
                            <TableHead>Category Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {directoryCategories.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No categories configured.
                              </TableCell>
                            </TableRow>
                          ) : (
                            directoryCategories.map((cat) => (
                              <TableRow key={cat.id}>
                                <TableCell className="font-medium capitalize">{cat.file_type === 'image' ? 'photo' : cat.file_type}</TableCell>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPlan.id ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
            <DialogDescription>Configure the details and features for this subscription plan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_custom" 
                checked={editingPlan.is_custom_price} 
                onCheckedChange={(checked) => setEditingPlan({...editingPlan, is_custom_price: !!checked})} 
              />
              <label htmlFor="is_custom" className="text-sm font-medium">
                Custom Pricing (e.g. Enterprise)
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Plan Name</label>
              <Input 
                value={editingPlan.name} 
                onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})} 
                placeholder="e.g. Pro, Studio, Enterprise"
              />
            </div>

            {!editingPlan.is_custom_price && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Base Monthly Price (₹)</label>
                    <Input 
                      type="number"
                      value={editingPlan.monthly_price} 
                      onChange={(e) => setEditingPlan({...editingPlan, monthly_price: e.target.value})} 
                      placeholder="e.g. 19"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Final Monthly Price (₹)</label>
                    <Input 
                      type="number"
                      value={editingPlan.final_monthly_price} 
                      onChange={(e) => setEditingPlan({...editingPlan, final_monthly_price: e.target.value})} 
                      placeholder="e.g. 15 (Discounted)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Base Yearly Price (₹)</label>
                    <Input 
                      type="number"
                      value={editingPlan.yearly_price} 
                      onChange={(e) => setEditingPlan({...editingPlan, yearly_price: e.target.value})} 
                      placeholder="e.g. 200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Final Yearly Price (₹)</label>
                    <Input 
                      type="number"
                      value={editingPlan.final_yearly_price} 
                      onChange={(e) => setEditingPlan({...editingPlan, final_yearly_price: e.target.value})} 
                      placeholder="e.g. 150 (Discounted)"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Short Description</label>
              <Input 
                value={editingPlan.description} 
                onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})} 
                placeholder="e.g. Perfect for independent filmmakers"
              />
            </div>

            <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden mt-4">
              <AccordionItem value="restrictions" className="border-b-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50/50 hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-sm">Plan Restrictions (Monthly Limits)</span>
                    <span className="text-xs text-muted-foreground font-normal">Leave empty or 0 for unlimited/no access depending on your business logic.</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 border-t bg-gray-50/30">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'jobs_post', label: 'Jobs Post' },
                      { key: 'news_insights', label: 'News & Insights' },
                      { key: 'events', label: 'Events' },
                      { key: 'courses', label: 'Courses' },
                      { key: 'projects', label: 'Projects' },
                      { key: 'view_profile', label: 'View Profile' },
                      { key: 'messages', label: 'Messages' },
                      { key: 'register_business', label: 'Register Business' },
                      { key: 'shooting_locations', label: 'Shooting Locations' },
                      { key: 'connections', label: 'Connections' }
                    ].map((restriction) => (
                      <div className="space-y-1.5" key={restriction.key}>
                        <label className="text-xs font-semibold text-gray-700">{restriction.label}</label>
                        <Input
                          type="number"
                          min="0"
                          value={editingPlan.restrictions?.[restriction.key] || ''}
                          onChange={(e) => setEditingPlan({
                            ...editingPlan,
                            restrictions: {
                              ...(editingPlan.restrictions || {}),
                              [restriction.key]: e.target.value ? parseInt(e.target.value) : 0
                            }
                          })}
                          placeholder="0"
                          className="h-8 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="space-y-2 mt-4">
              <label className="text-sm font-semibold">Features</label>
              <div className="flex gap-2">
                <Input 
                  value={newFeature} 
                  onChange={(e) => setNewFeature(e.target.value)} 
                  onKeyDown={handleFeatureKeyDown}
                  placeholder="Type a feature and press Enter"
                />
                <Button type="button" onClick={addFeature} variant="secondary">Add</Button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {editingPlan.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 border p-2 rounded-md">
                    <span className="text-sm text-gray-700">{feature}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFeature(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="popular" 
                checked={editingPlan.popular} 
                onCheckedChange={(checked) => setEditingPlan({...editingPlan, popular: !!checked})} 
              />
              <label htmlFor="popular" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mark as "Most Popular"
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePlan} className="bg-yellow-500 hover:bg-yellow-600 text-white">Save Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
