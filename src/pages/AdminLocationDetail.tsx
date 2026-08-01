import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, IndianRupee, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminLocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [location, setLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("shooting_locations")
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setLocation(data);
      } catch (error) {
        console.error("Error fetching location:", error);
        toast({ title: "Failed to fetch location details", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchLocation();
    }
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Location Details" pageName="Locations">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading location details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!location) {
    return (
      <AdminLayout pageTitle="Location Not Found" pageName="Locations">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-muted-foreground">This location could not be found or has been deleted.</p>
          <Button onClick={() => navigate("/admin-dashboard/locations")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Locations
          </Button>
        </div>
      </AdminLayout>
    );
  }

  let timingsList = [];
  try {
    if (location.timings) {
      timingsList = JSON.parse(location.timings);
    }
  } catch (e) {
    // legacy string support
    timingsList = location.timings ? [{ from: "N/A", to: "N/A", days: [location.timings] }] : [];
  }

  return (
    <AdminLayout pageTitle="Location Details" pageName="Locations">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin-dashboard/locations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{location.name}</h1>
            <p className="text-muted-foreground mt-1">Listed on {new Date(location.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                  <p className="mt-1">{location.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Instructions & Rules</h4>
                  <p className="mt-1 whitespace-pre-wrap">{location.instructions || "No specific instructions provided."}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability Timings</CardTitle>
              </CardHeader>
              <CardContent>
                {timingsList.length > 0 ? (
                  <div className="space-y-3">
                    {timingsList.map((t: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-md border border-border">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{t.from || "Start"} to {t.to || "End"}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {t.days && t.days.map((day: string) => (
                            <Badge key={day} variant="outline" className="bg-background">{day}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No timings provided.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                {location.media_urls && location.media_urls.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {location.media_urls.map((url: string, index: number) => (
                      <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-muted">
                        <img src={url} alt={`Property Media ${index + 1}`} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg border border-dashed">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No media uploaded.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>At a Glance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Type</span>
                  <Badge className="capitalize">{location.type}</Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-medium">{location.owner_name || "Unknown"}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium flex items-center">
                    <IndianRupee className="h-3 w-3 mr-1" /> {location.price} / {location.price_type === 'Per Day' ? 'Day' : 'Hour'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{location.city}, {location.state}</p>
                    {location.landmark && <p className="text-sm text-muted-foreground">Near {location.landmark}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
