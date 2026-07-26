import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { 
  ArrowLeft, 
  MapPin, 
  Share2, 
  Heart,
  Shield,
  MessageSquare,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function LocationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [location, setLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Lightbox State
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchLocationDetails();
  }, [id, user]);

  const fetchLocationDetails = async () => {
    setIsLoading(true);
    try {
      if (!id) return;
      
      // Fetch location
      const { data: locData, error: locError } = await supabase
        .from('shooting_locations')
        .select('*')
        .eq('id', id)
        .single();
        
      if (locError) throw locError;
      setLocation(locData);

      // Fetch likes
      const { data: likesData, error: likesError } = await supabase
        .from('shooting_location_likes')
        .select('*')
        .eq('location_id', id);

      if (likesError) throw likesError;
      
      setLikesCount(likesData.length);
      setIsWishlisted(user ? likesData.some(like => like.user_id === user.id) : false);

    } catch (error) {
      console.error("Error fetching location details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!user) return;
    
    const currentlyWishlisted = isWishlisted;
    // Optimistic UI update
    setIsWishlisted(!currentlyWishlisted);
    setLikesCount(prev => prev + (currentlyWishlisted ? -1 : 1));

    try {
      if (currentlyWishlisted) {
        await supabase
          .from('shooting_location_likes')
          .delete()
          .eq('location_id', id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('shooting_location_likes')
          .insert({ location_id: id, user_id: user.id });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      fetchLocationDetails(); // revert on error
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden'; 
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && location?.images) {
      setSelectedImageIndex((prev) => (prev! + 1) % location.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && location?.images) {
      setSelectedImageIndex((prev) => (prev! === 0 ? location.images.length - 1 : prev! - 1));
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
      </AppLayout>
    );
  }

  if (!location) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold">Location not found</h2>
          <Button onClick={() => navigate("/locations")}>Back to Locations</Button>
        </div>
      </AppLayout>
    );
  }

  // Fallback images if none in DB (since image_url is a single string in DB for now)
  const images = location.image_url 
    ? [location.image_url] 
    : [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800"
      ];

  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(location.city + ', ' + location.state)}`;

  return (
    <AppLayout>
      <div className="flex-1 max-w-6xl mx-auto w-full space-y-6 p-6">
        
        {/* Top Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate("/locations")} className="w-fit -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Locations
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            {/* Functional Like Button replacing Save */}
            <Button 
              variant={isWishlisted ? "default" : "outline"}
              size="sm"
              className={isWishlisted ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200" : ""}
              onClick={toggleLike}
            >
              <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} /> 
              {isWishlisted ? "Liked" : "Like"} ({likesCount})
            </Button>
          </div>
        </div>

        {/* Title */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">{location.type}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{location.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-gray-400" /> {location.city}, {location.state}</span>
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4 mr-1" /> View on Google Maps
            </a>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden h-[400px]">
          <div className="md:col-span-2 h-full" onClick={() => openLightbox(0)}>
            <img src={images[0]} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
          </div>
          <div className="hidden md:flex flex-col gap-2 h-full">
            <img src={images[1] || images[0]} alt="Gallery 1" className="w-full h-[calc(50%-4px)] object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" onClick={() => openLightbox(1)} />
            <div className="relative w-full h-[calc(50%-4px)] group cursor-pointer" onClick={() => openLightbox(2)}>
              <img src={images[2] || images[0]} alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {images.length > 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">+{images.length - 3} More Photos</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-4">
          
          {/* Main Content (Left Column) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-3">About this location</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{location.description}</p>
            </section>

            <hr />

            {/* Instructions */}
            {location.instructions && (
              <section>
                <h2 className="text-2xl font-bold mb-3 flex items-center">
                  <AlertCircle className="mr-2 h-6 w-6 text-yellow-600" /> 
                  Property Instructions & Rules
                </h2>
                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{location.instructions}</p>
                </div>
              </section>
            )}

          </div>

          {/* Sidebar (Right Column) */}
          <div className="relative">
            <div className="sticky top-6 space-y-6">
              
              {/* Pricing Card */}
              <Card className="border-yellow-200 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-3xl font-bold">₹{Number(location.price).toLocaleString()}</span>
                      <span className="text-gray-500 pb-1">/ {location.price_type.replace('Per ', '')}</span>
                    </div>
                  </div>

                  {/* Availability Timings */}
                  {location.timings && (
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border text-sm">
                      <Clock className="h-5 w-5 text-gray-500 shrink-0" />
                      <div>
                        <span className="block font-semibold text-gray-900">Availability</span>
                        <span className="text-gray-600">{location.timings}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700 h-12 text-lg">
                      Enquire Now
                    </Button>
                    <Button variant="outline" className="w-full h-12 text-lg border-yellow-600 text-yellow-700 hover:bg-yellow-50">
                      Book Site Visit
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                    <Shield className="h-4 w-4 text-green-500" /> Secure enquiry via FilmCollab
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">Contact Information</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider">Name</span>
                      <span className="font-medium">{location.owner_name}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-6">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message Directly
                  </Button>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Overlay */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <Button 
            variant="ghost" 
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full h-12 w-12 p-0"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button 
            variant="ghost" 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-14 w-14 p-0 hidden md:flex"
            onClick={prevImage}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <img 
            src={images[selectedImageIndex]} 
            alt="Gallery preview" 
            className="max-h-[90vh] max-w-full object-contain select-none"
            onClick={(e) => e.stopPropagation()} 
          />

          <Button 
            variant="ghost" 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-14 w-14 p-0 hidden md:flex"
            onClick={nextImage}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Mobile navigation overlays */}
          <div className="absolute inset-y-0 left-0 w-1/3 md:hidden" onClick={prevImage} />
          <div className="absolute inset-y-0 right-0 w-1/3 md:hidden" onClick={nextImage} />

          <div className="absolute bottom-4 left-1/2 -translate-y-1/2 text-white/70 bg-black/50 px-4 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
