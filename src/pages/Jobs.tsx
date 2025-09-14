import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Search,
  Filter,
  Plus,
  Heart,
  Share2,
  Building
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Job {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  job_type: string;
  experience_level: string;
  industry: string;
  salary_range?: string;
  skills_required?: string[];
  job_description: string;
  benefits?: string;
  posted_date: string;
  user_id: string;
  status: string;
}

const jobSchema = z.object({
  job_title: z.string().min(2, "Job title must be at least 2 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  job_type: z.string().min(1, "Please select a job type"),
  experience_level: z.string().min(1, "Please select an experience level"),
  industry: z.string().min(1, "Please select an industry"),
  salary_range: z.string().optional(),
  skills_required: z.string().optional(),
  job_description: z.string().min(10, "Job description must be at least 10 characters"),
  benefits: z.string().optional()
});

type JobFormData = z.infer<typeof jobSchema>;

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_title: "",
      company_name: "",
      location: "",
      job_type: "",
      experience_level: "",
      industry: "",
      salary_range: "",
      skills_required: "",
      job_description: "",
      benefits: ""
    }
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let query = supabase.from('jobs').select('*');
      
      if (activeTab === 'created' && user) {
        query = query.eq('user_id', user.id);
      } else if (activeTab === 'all') {
        query = query.eq('status', 'Active');
      }

      const { data, error } = await query.order('posted_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching jobs:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch jobs"
        });
      } else {
        setJobs(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [activeTab, user]);

  const onSubmit = async (data: JobFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to post a job"
      });
      return;
    }

    try {
      const skillsArray = data.skills_required 
        ? data.skills_required.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
        : [];

      const { error } = await supabase.from('jobs').insert({
        job_title: data.job_title,
        company_name: data.company_name,
        location: data.location,
        job_type: data.job_type,
        experience_level: data.experience_level,
        industry: data.industry,
        salary_range: data.salary_range || null,
        skills_required: skillsArray,
        job_description: data.job_description,
        benefits: data.benefits || null,
        user_id: user.id,
        status: 'Active'
      });

      if (error) {
        console.error('Error creating job:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create job posting"
        });
      } else {
        toast({
          title: "Success",
          description: "Job posted successfully!"
        });
        form.reset();
        setIsDialogOpen(false);
        fetchJobs();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || job.job_type === filterType;
    const matchesLocation = filterLocation === "all" || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  // Pagination logic
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterLocation, activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <AppLayout pageTitle="Jobs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
            <p className="text-muted-foreground">Discover opportunities in the film industry</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>
                  Share opportunities with the film industry community
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="job_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Senior Director" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Netflix Studios" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Los Angeles, CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salary_range"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Range (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. $80,000 - $120,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="job_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Freelance">Freelance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Entry Level">Entry Level</SelectItem>
                              <SelectItem value="Mid Level">Mid Level</SelectItem>
                              <SelectItem value="Senior Level">Senior Level</SelectItem>
                              <SelectItem value="Executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Film Production">Film Production</SelectItem>
                              <SelectItem value="Television">Television</SelectItem>
                              <SelectItem value="Documentary">Documentary</SelectItem>
                              <SelectItem value="Animation">Animation</SelectItem>
                              <SelectItem value="Post-Production">Post-Production</SelectItem>
                              <SelectItem value="Streaming">Streaming</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="skills_required"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Adobe Premiere, Final Cut Pro, Cinematography (comma separated)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="job_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the role, responsibilities, and requirements..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefits (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe benefits, perks, and additional compensation..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                      Post Job
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="created">My Jobs</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="los angeles">Los Angeles</SelectItem>
                    <SelectItem value="new york">New York</SelectItem>
                    <SelectItem value="atlanta">Atlanta</SelectItem>
                    <SelectItem value="vancouver">Vancouver</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Count */}
            {!loading && filteredJobs.length > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalJobs)} of {totalJobs} jobs
                </p>
              </div>
            )}

            {/* Jobs Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'created' 
                      ? "You haven't posted any jobs yet. Click 'Post Job' to get started."
                      : "Try adjusting your search criteria or check back later for new opportunities."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-soft transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2">{job.job_title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Building className="h-4 w-4" />
                            {job.company_name}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(job.posted_date)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{job.job_type}</Badge>
                        <Badge variant="outline">{job.experience_level}</Badge>
                        <Badge variant="outline">{job.industry}</Badge>
                      </div>
                      
                      {job.salary_range && (
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {job.salary_range}
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.job_description}
                      </p>
                      
                      {job.skills_required && job.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {job.skills_required.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills_required.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills_required.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                          Apply Now
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}