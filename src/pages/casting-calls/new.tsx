import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryDropdown } from "@/components/ui/category-dropdown";
import { useCastingCalls } from "@/hooks/use-casting-calls";
import { toast } from "sonner";
import { ArrowLeft, Save, Image as ImageIcon, UploadCloud, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function NewCastingCall() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addCastingCall } = useCastingCalls();
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    projectName: "",
    productionHouse: "",
    castingDirector: "",
    contactPerson: "",
    email: "",
    phone: "",
    category: "",
    roleName: "",
    roleDescription: "",
    gender: "Any",
    ageMin: "18",
    ageMax: "60",
    height: "",
    languages: "",
    experience: "Any",
    compensation: "Paid",
    location: "",
    shootDates: "",
    auditionDates: "",
    auditionVenue: "",
    vacancies: "1",
    lastDateToApply: "",
    projectDescription: "",
    requirements: "",
    whatToBring: "",
    googleMapsLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.projectName || !form.roleName || !form.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsUploading(true);
    let posterUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"; // fallback
    let scriptUrl = "";

    try {
      if (posterFile) {
        const fileExt = posterFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `posters/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('post-media') // Re-using existing bucket
          .upload(filePath, posterFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('post-media')
          .getPublicUrl(filePath);

        posterUrl = data.publicUrl;
      }

      if (scriptFile) {
        const fileExt = scriptFile.name.split('.').pop();
        const fileName = `${Date.now()}-script-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `scripts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(filePath, scriptFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('post-media')
          .getPublicUrl(filePath);

        scriptUrl = data.publicUrl;
      }

      await addCastingCall({
        title: form.title,
        projectName: form.projectName,
        productionHouse: form.productionHouse,
        castingDirector: form.castingDirector,
        contactPerson: form.contactPerson,
        email: form.email,
        phone: form.phone,
        poster: posterUrl,
        category: form.category,
        roleName: form.roleName,
        roleDescription: form.roleDescription,
        gender: form.gender as any,
        ageRange: [parseInt(form.ageMin), parseInt(form.ageMax)],
        height: form.height,
        languages: form.languages ? form.languages.split(',').map(l => l.trim()) : [],
        experience: form.experience as any,
        compensation: form.compensation as any,
        location: form.location,
        shootDates: form.shootDates,
        auditionDates: form.auditionDates,
        auditionVenue: form.auditionVenue,
        vacancies: parseInt(form.vacancies) || 1,
        lastDateToApply: form.lastDateToApply,
        projectDescription: form.projectDescription,
        requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : [],
        whatToBring: form.whatToBring ? form.whatToBring.split('\n').filter(Boolean) : [],
        status: "Open",
        verified: false,
        attachments: [],
        googleMapsLink: form.googleMapsLink,
        scriptAttachmentUrl: scriptUrl || undefined
      });

      navigate("/casting-calls");
    } catch (error: any) {
      toast.error(error.message || "Failed to post casting call");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppLayout pageTitle="Post a Casting Call">
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <Link to="/casting-calls" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Casting Calls
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-10">
            <div className="mb-8 border-b pb-6">
              <h1 className="text-3xl font-black text-gray-900">Post a Casting Call</h1>
              <p className="text-gray-500 mt-2">Create a detailed listing to attract the best talent for your project.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">1</span>
                  Project Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="poster">Casting Call Poster / Cover Image</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        id="poster"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                      />
                      {posterFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="w-8 h-8 text-blue-500" />
                          <span className="font-medium text-gray-900">{posterFile.name}</span>
                          <span className="text-xs text-gray-500">Click or drag to replace</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="w-8 h-8 text-gray-400" />
                          <span className="font-medium text-gray-900">Upload Poster Image</span>
                          <span className="text-xs text-gray-500">PNG, JPG or WEBP up to 5MB</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Casting Title *</Label>
                    <Input id="title" placeholder="e.g. Lead Hero Required" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <CategoryDropdown
                      value={form.category}
                      onChange={(val) => setForm({...form, category: val || ""})}
                      placeholder="Select Category"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input id="projectName" placeholder="e.g. The Great Adventure" required value={form.projectName} onChange={e => setForm({...form, projectName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productionHouse">Production House</Label>
                    <Input id="productionHouse" placeholder="e.g. Royal Studios" value={form.productionHouse} onChange={e => setForm({...form, productionHouse: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <Textarea id="projectDescription" placeholder="Brief synopsis of the project..." className="h-24" value={form.projectDescription} onChange={e => setForm({...form, projectDescription: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Role Info */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">2</span>
                  Role Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name *</Label>
                    <Input id="roleName" placeholder="e.g. Protagonist / Background Actor" required value={form.roleName} onChange={e => setForm({...form, roleName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacancies">Number of Vacancies</Label>
                    <Input id="vacancies" type="number" min="1" value={form.vacancies} onChange={e => setForm({...form, vacancies: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="roleDescription">Role Description</Label>
                    <Textarea id="roleDescription" placeholder="Describe the character in detail..." className="h-24" value={form.roleDescription} onChange={e => setForm({...form, roleDescription: e.target.value})} />
                  </div>
                  
                  {/* Requirements Grid */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={form.gender} onValueChange={v => setForm({...form, gender: v})}>
                      <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">Any</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Transgender">Transgender</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Age Range</Label>
                    <div className="flex gap-2 items-center">
                      <Input type="number" placeholder="Min" value={form.ageMin} onChange={e => setForm({...form, ageMin: e.target.value})} />
                      <span>to</span>
                      <Input type="number" placeholder="Max" value={form.ageMax} onChange={e => setForm({...form, ageMax: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Required</Label>
                    <Select value={form.experience} onValueChange={v => setForm({...form, experience: v})}>
                      <SelectTrigger><SelectValue placeholder="Experience" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">Any</SelectItem>
                        <SelectItem value="Fresher">Fresher</SelectItem>
                        <SelectItem value="Experienced">Experienced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages (Comma separated)</Label>
                    <Input id="languages" placeholder="e.g. Hindi, English" value={form.languages} onChange={e => setForm({...form, languages: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="requirements">Specific Requirements (One per line)</Label>
                    <Textarea id="requirements" placeholder="- Must know horse riding&#10;- Willing to travel" className="h-24" value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2 mt-4">
                    <Label htmlFor="script">Script Attachment (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative h-32">
                      <input 
                        type="file" 
                        id="script"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => setScriptFile(e.target.files?.[0] || null)}
                      />
                      {scriptFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-6 h-6 text-blue-500" />
                          <span className="font-medium text-gray-900 text-sm">{scriptFile.name}</span>
                          <span className="text-xs text-gray-500">Click or drag to replace</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <UploadCloud className="w-6 h-6 text-gray-400" />
                          <span className="font-medium text-gray-900 text-sm">Upload Script</span>
                          <span className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">3</span>
                  Logistics & Contact
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="compensation">Compensation</Label>
                    <Select value={form.compensation} onValueChange={v => setForm({...form, compensation: v})}>
                      <SelectTrigger><SelectValue placeholder="Select Compensation" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Revenue Share">Revenue Share</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Primary Shoot Location</Label>
                    <Input id="location" placeholder="e.g. Mumbai, Maharashtra" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shootDates">Expected Shoot Dates</Label>
                    <Input id="shootDates" placeholder="e.g. Jan 10 - Jan 25, 2027" value={form.shootDates} onChange={e => setForm({...form, shootDates: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastDateToApply">Last Date to Apply</Label>
                    <Input id="lastDateToApply" type="date" value={form.lastDateToApply} onChange={e => setForm({...form, lastDateToApply: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="castingDirector">Casting Director Name</Label>
                    <Input id="castingDirector" placeholder="John Doe" value={form.castingDirector} onChange={e => setForm({...form, castingDirector: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input id="email" type="email" placeholder="contact@example.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auditionVenue">Audition Venue</Label>
                    <Input id="auditionVenue" placeholder="Full address or Virtual Link" value={form.auditionVenue} onChange={e => setForm({...form, auditionVenue: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="googleMapsLink">Google Maps Link</Label>
                    <Input id="googleMapsLink" placeholder="https://maps.google.com/..." value={form.googleMapsLink} onChange={e => setForm({...form, googleMapsLink: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-8 border-t flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => navigate("/casting-calls")} disabled={isUploading}>Cancel</Button>
                <Button type="submit" size="lg" className="px-8 font-bold gap-2" disabled={isUploading}>
                  <Save className="w-4 h-4" /> {isUploading ? 'Publishing...' : 'Publish Casting Call'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

