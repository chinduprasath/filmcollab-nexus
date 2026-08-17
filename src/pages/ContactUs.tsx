import React, { useState, useEffect } from "react";
import { LandingTopbar } from "@/components/layout/landing-topbar";
import { LandingFooter } from "@/components/layout/landing-footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactUs() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error("Error fetching site settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you shortly.",
      });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans overflow-x-hidden pt-16">
      <LandingTopbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-yellow-50">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Get in <span className="text-yellow-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about FilmCollab? We're here to help you navigate your filmmaking journey.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-8 h-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {settings?.contact_email && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">Email Us</h3>
                        <a href={`mailto:${settings.contact_email}`} className="text-gray-600 hover:text-yellow-600 transition-colors">
                          {settings.contact_email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {settings?.contact_phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">Call Us</h3>
                        <a href={`tel:${settings.contact_phone}`} className="text-gray-600 hover:text-yellow-600 transition-colors">
                          {settings.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings?.contact_address && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">Location</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {settings.contact_address}
                        </p>
                        {settings?.contact_map_link && (
                          <a 
                            href={settings.contact_map_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm mt-2 inline-block"
                          >
                            View on Map →
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-8 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                      {settings?.social_facebook && (
                        <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-yellow-500 hover:text-white transition-colors">
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {settings?.social_twitter && (
                        <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-yellow-500 hover:text-white transition-colors">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {settings?.social_instagram && (
                        <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-yellow-500 hover:text-white transition-colors">
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {settings?.social_linkedin && (
                        <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-yellow-500 hover:text-white transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {settings?.social_youtube && (
                        <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-yellow-500 hover:text-white transition-colors">
                          <Youtube className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <Input 
                    name="name"
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe" 
                    className="h-12 border-gray-200 focus-visible:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input 
                    type="email" 
                    name="email"
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    className="h-12 border-gray-200 focus-visible:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <Input 
                    name="subject"
                    required 
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?" 
                    className="h-12 border-gray-200 focus-visible:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <Textarea 
                    name="message"
                    required 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..." 
                    className="min-h-[150px] border-gray-200 focus-visible:ring-yellow-500 resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-lg font-semibold mt-4"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
