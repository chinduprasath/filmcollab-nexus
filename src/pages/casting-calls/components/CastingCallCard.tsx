import { Link } from "react-router-dom";
import { CastingCall } from "../data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useCastingCalls } from "@/hooks/use-casting-calls";
import { CheckCircle2, Bookmark, MapPin, Calendar, Briefcase, IndianRupee, ShieldCheck } from "lucide-react";

interface CastingCallCardProps {
  call: CastingCall;
}

export function CastingCallCard({ call }: CastingCallCardProps) {
  const { user } = useAuth();
  const { getUserApplicationStatus, toggleSave } = useCastingCalls();
  const appStatus = getUserApplicationStatus(call.id);
  const isSaved = user ? call.savedBy.includes(user.id) : false;

  const getStatusBadge = () => {
    switch (appStatus) {
      case "Interested":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Interested</Badge>;
      case "Confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getCallStateBadge = () => {
    switch (call.status) {
      case "Closed":
      case "Cancelled":
        return <Badge variant="destructive">{call.status}</Badge>;
      case "Closing Soon":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Closing Soon</Badge>;
      case "Applications Full":
        return <Badge variant="secondary">Full</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0 flex flex-col sm:flex-row h-full">
        {/* Left Side: Poster (35%) */}
        <div className="w-full sm:w-[35%] relative">
          <div className="aspect-[4/5] sm:aspect-auto sm:h-full relative overflow-hidden">
            <img 
              src={call.poster} 
              alt={call.title} 
              className="object-cover w-full h-full absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
          </div>
          <div className="absolute top-2 left-2 flex gap-2">
            {getCallStateBadge()}
          </div>
          <div className="absolute top-2 right-2">
             <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-8 w-8 bg-background/90 dark:bg-card/90 hover:bg-background text-foreground shadow-sm backdrop-blur-sm border border-border/50"
                onClick={(e) => {
                  e.preventDefault();
                  toggleSave(call.id);
                }}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-primary' : ''}`} />
              </Button>
          </div>
        </div>

        {/* Right Side: Details (65%) */}
        <div className="w-full sm:w-[65%] p-4 flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="text-lg font-bold text-foreground leading-tight mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                  {call.title}
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  {call.projectName} • {call.productionHouse} 
                  {call.verified && <ShieldCheck className="inline-block w-3 h-3 ml-1 text-blue-500" />}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Posted by {call.castingDirector}</p>
              </div>
              {getStatusBadge()}
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 my-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate col-span-2">
                <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate">Shoot: {call.shootDates}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate">{call.location}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Briefcase className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate">{call.experience}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <IndianRupee className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate">{call.compensation}</span>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {call.roleDescription}
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant="outline" className="bg-muted text-foreground/90 border-border font-normal text-[10px] px-1.5 py-0">{call.category}</Badge>
              <Badge variant="outline" className="bg-muted text-foreground/90 border-border font-normal text-[10px] px-1.5 py-0">{call.gender}</Badge>
              <Badge variant="outline" className="bg-muted text-foreground/90 border-border font-normal text-[10px] px-1.5 py-0">{call.ageRange[0]}-{call.ageRange[1]} yrs</Badge>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="text-[10px] text-muted-foreground leading-tight">
                <p>Posted: {new Date(call.datePosted).toLocaleDateString()}</p>
                <p className="font-medium text-red-500 mt-0.5">Deadline: {new Date(call.lastDateToApply).toLocaleDateString()}</p>
              </div>
              <Link to={`/casting-calls/${call.id}`}>
                <Button className="rounded-full px-4 h-8 text-xs">View Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
