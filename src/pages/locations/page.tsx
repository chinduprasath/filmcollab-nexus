import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Search, 
  Plus,
  Heart,
  User,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Location {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  price: number;
  price_type: string;
  image_url: string;
  owner_name: string;
  likesCount: number;
  isWishlisted: boolean;
  tags?: string[];
}

export default function ShootingLocations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchLocations();
  }, [user?.id]);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch all locations
      const { data: locationsData, error: locError } = await supabase
        .from('shooting_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (locError) throw locError;

      let likesData: any[] = [];
      try {
        // 2. Fetch all likes to calculate counts and user wishlist
        const { data: fetchLikesData, error: likesError } = await supabase
          .from('shooting_location_likes')
          .select('*');

        if (likesError) throw likesError;
        likesData = fetchLikesData || [];
      } catch (err) {
        console.warn("Could not fetch location likes, table may not exist yet.", err);
      }

      const formattedLocations: Location[] = (locationsData || []).map(loc => {
        const locationLikes = likesData?.filter(like => like.location_id === loc.id) || [];
        const isWishlisted = user ? locationLikes.some(like => like.user_id === user.id) : false;
        
        return {
          id: loc.id,
          name: loc.name,
          type: loc.type,
          city: loc.city,
          state: loc.state,
          price: loc.price,
          price_type: loc.price_type,
          image_url: loc.image_url,
          owner_name: loc.owner_name,
          likesCount: locationLikes.length,
          isWishlisted,
          tags: loc.tags || []
        };
      });

      setLocations(formattedLocations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent, id: string, isCurrentlyWishlisted: boolean) => {
    e.stopPropagation();
    if (!user) return; // Must be logged in

    // Optimistic update
    setLocations(prev => prev.map(loc => {
      if (loc.id === id) {
        return {
          ...loc,
          isWishlisted: !isCurrentlyWishlisted,
          likesCount: loc.likesCount + (isCurrentlyWishlisted ? -1 : 1)
        };
      }
      return loc;
    }));

    try {
      if (isCurrentlyWishlisted) {
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
      console.error("Error toggling wishlist:", error);
      fetchLocations(); // Revert on error
    }
  };

  // Apply filters
  let filteredLocations = locations;
  
  if (showWishlist) {
    filteredLocations = filteredLocations.filter(loc => loc.isWishlisted);
  } else {
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredLocations = filteredLocations.filter(loc => 
        loc.name.toLowerCase().includes(lowerSearch) || 
        loc.city.toLowerCase().includes(lowerSearch) ||
        loc.state.toLowerCase().includes(lowerSearch)
      );
    }
    
    if (propertyTypeFilter !== "all") {
      filteredLocations = filteredLocations.filter(loc => loc.type.toLowerCase().includes(propertyTypeFilter.toLowerCase()) || propertyTypeFilter.toLowerCase().includes(loc.type.toLowerCase()));
    }
    
    if (budgetFilter !== "all") {
      filteredLocations = filteredLocations.filter(loc => {
        if (budgetFilter === "hourly") return loc.price_type.toLowerCase().includes("hour");
        if (budgetFilter === "daily") return loc.price_type.toLowerCase().includes("day");
        return true;
      });
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
  const displayedLocations = filteredLocations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset pagination if filters change and current page is now empty
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredLocations.length, totalPages, currentPage]);


  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-8 pt-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shooting Locations</h1>
            <p className="text-gray-500 mt-1">Discover and book unique properties for your next shoot.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className={cn("shadow-sm", showWishlist ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700" : "text-gray-700")}
              onClick={() => {
                setShowWishlist(!showWishlist);
                setCurrentPage(1);
              }}
            >
              <Heart className={cn("mr-2 h-4 w-4", showWishlist ? "fill-red-500 text-red-500" : "")} />
              {showWishlist ? "View All" : "View Wishlist"}
            </Button>
            <Button 
              className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-md"
              onClick={() => navigate("/locations/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              List Your Property
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        {!showWishlist && (
          <div className="bg-white rounded-xl p-4 shadow-sm border flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search by location name, city, state..." 
                className="pl-10 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-10">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House / Villa</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="commercial">Commercial Building</SelectItem>
                <SelectItem value="outdoor">Open Land / Forest</SelectItem>
              </SelectContent>
            </Select>
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger className="w-full md:w-[150px] h-10">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="hourly">Per Hour</SelectItem>
                <SelectItem value="daily">Per Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading properties...</p>
          </div>
        ) : displayedLocations.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
            <p className="text-gray-500">
              {showWishlist ? "You haven't wishlisted any properties yet." : "Try adjusting your filters or search term."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedLocations.map(location => (
              <Card key={location.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col" onClick={() => navigate(`/locations/${location.id}`)}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={location.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800"} 
                    alt={location.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm shadow-sm font-medium">
                      {location.type}
                    </Badge>
                  </div>
                  {/* Clean like icon at top right corner, rating removed */}
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={(e) => toggleWishlist(e, location.id, location.isWishlisted)}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:bg-white transition-colors"
                    >
                      <Heart className={cn("h-4 w-4 transition-colors", location.isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500")} />
                    </button>
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg line-clamp-1" title={location.name}>{location.name}</CardTitle>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center text-gray-500 text-xs">
                      <MapPin className="h-3 w-3 mr-1 shrink-0" /> 
                      <span className="truncate">{location.city}, {location.state}</span>
                    </div>
                    {location.owner_name && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <User className="h-3 w-3 mr-1 shrink-0" /> 
                        <span className="truncate">Listed by {location.owner_name}</span>
                      </div>
                    )}
                    {location.tags && location.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {location.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-gray-100 text-gray-600 font-normal">
                            {tag}
                          </Badge>
                        ))}
                        {location.tags.length > 3 && (
                          <span className="text-[10px] text-gray-400">+{location.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 flex-1">
                  <div className="flex justify-between items-end">
                    <div className="font-bold text-gray-900 text-lg">
                      ₹{location.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/ {location.price_type.replace('Per ', '')}</span>
                    </div>
                    <div className="text-xs text-gray-400 font-medium flex items-center">
                      <Heart className="h-3 w-3 mr-1 fill-gray-300 text-gray-300" /> {location.likesCount}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white h-9" 
                    onClick={(e) => { e.stopPropagation(); navigate(`/locations/${location.id}`); }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-6 pb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className={currentPage === i + 1 ? "bg-yellow-600 hover:bg-yellow-700 text-white border-transparent" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
