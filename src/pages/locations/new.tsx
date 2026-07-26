import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const TOTAL_STEPS = 6;

export default function NewLocation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    country: "India",
    state: "",
    city: "",
    landmark: "",
    address: "",
    priceHour: "",
    priceDay: "",
    timings: "",
    instructions: "",
    contactName: "",
    phone: "",
    email: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < TOTAL_STEPS) {
      nextStep();
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to list a property.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('shooting_locations')
        .insert({
          name: formData.name,
          type: formData.type,
          city: formData.city,
          state: formData.state,
          price: Number(formData.priceDay) || 0,
          price_type: 'Per Day', // Assuming Day pricing as default for now, could be enhanced
          description: formData.description,
          instructions: formData.instructions,
          timings: formData.timings,
          image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800', // Placeholder
          owner_name: formData.contactName || user.email?.split('@')[0] || 'Unknown Owner',
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Listing Created!",
        description: "Your property has been successfully listed.",
      });
      navigate("/locations");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create listing.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      {/* Reduced padding wrapper: max-w-3xl, py-8, minimal side padding on mobile */}
      <div className="flex-1 max-w-3xl mx-auto w-full space-y-6 px-2 sm:px-4 py-8">
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/locations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">List Your Property</h1>
            <p className="text-gray-500 text-sm md:text-base">Step {currentStep} of {TOTAL_STEPS}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-yellow-600 h-full transition-all duration-300 ease-in-out" 
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Give your listing a catchy name and describe its vibe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name <span className="text-red-500">*</span></Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Vintage Heritage Villa" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type <span className="text-red-500">*</span></Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData(prev => ({...prev, type: val}))} required>
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House / Villa</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="commercial">Commercial Building</SelectItem>
                      <SelectItem value="cafe">Cafe / Restaurant</SelectItem>
                      <SelectItem value="outdoor">Outdoor / Open Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the unique features, architecture, and lighting..." 
                    className="min-h-[120px]" 
                    required 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Location Details */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>Where is your property located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={formData.country} onChange={handleInputChange} defaultValue="India" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={formData.state} onChange={handleInputChange} placeholder="e.g. Maharashtra" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input id="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Nearest landmark" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea id="address" value={formData.address} onChange={handleInputChange} placeholder="Complete street address" required />
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Pricing */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your rates for renting out the property.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priceHour">Price Per Hour (₹)</Label>
                    <Input id="priceHour" value={formData.priceHour} onChange={handleInputChange} type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceDay">Price Per Day (₹)</Label>
                    <Input id="priceDay" value={formData.priceDay} onChange={handleInputChange} type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                    <Input id="securityDeposit" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="negotiable" />
                  <Label htmlFor="negotiable" className="font-normal cursor-pointer">Prices are negotiable based on production scale.</Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: Timings & Instructions */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Timings & Instructions</CardTitle>
                <CardDescription>When is your property available and what are the rules?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="timings">Availability Timings <span className="text-red-500">*</span></Label>
                  <Input id="timings" value={formData.timings} onChange={handleInputChange} placeholder="e.g., 08:00 AM - 10:00 PM (Mon-Sat)" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Property Instructions & Rules</Label>
                  <Textarea 
                    id="instructions" 
                    value={formData.instructions} 
                    onChange={handleInputChange}
                    placeholder="e.g., No smoking indoors, Do not move furniture without permission, Maintain silence after 10PM..." 
                    className="min-h-[120px]" 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 5: Media Upload */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Media Upload</CardTitle>
                <CardDescription>Upload high-quality images and videos of your property.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Click to upload or drag and drop</h3>
                  <p className="text-gray-500 text-sm">JPG, PNG, MP4 up to 50MB</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 6: Contact Information (Optional) */}
          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information (Optional)</CardTitle>
                <CardDescription>How can interested producers reach out? Leave blank to use your profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input id="contactName" value={formData.contactName} onChange={handleInputChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input id="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+91 9876543210" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="contact@example.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between border-t pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            {currentStep < TOTAL_STEPS ? (
              <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Listing"} <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          
        </form>
      </div>
    </AppLayout>
  );
}
