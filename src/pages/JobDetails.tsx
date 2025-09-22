import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Building, 
  Users, 
  Bookmark,
  Share2,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  job_type: string;
  experience_level: string;
  industry: string;
  salary_range?: string;
  salary_min?: number;
  salary_max?: number;
  skills_required?: string[];
  job_description: string;
  benefits?: string;
  posted_date: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  useEffect(() => {
    // Load saved jobs from localStorage
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job details"
        });
        navigate('/jobs');
        return;
      }

      setJob(data);
      
      // If it's the user's own job, fetch applicants
      if (data.user_id === user?.id) {
        fetchApplicants(data.id);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId: string) => {
    try {
      // Mock applicants data - in a real app, you'd fetch from your database
      const mockApplicants = [
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@email.com",
          avatar: "JS",
          appliedDate: "2025-01-08",
          status: "pending",
          experience: "5 years",
          skills: ["React", "Node.js", "TypeScript"],
          resume: "john_smith_resume.pdf"
        },
        {
          id: "2", 
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          avatar: "SJ",
          appliedDate: "2025-01-07",
          status: "reviewed",
          experience: "3 years",
          skills: ["Vue.js", "Python", "Django"],
          resume: "sarah_johnson_resume.pdf"
        },
        {
          id: "3",
          name: "Mike Chen",
          email: "mike.chen@email.com", 
          avatar: "MC",
          appliedDate: "2025-01-06",
          status: "shortlisted",
          experience: "7 years",
          skills: ["Angular", "Java", "Spring Boot"],
          resume: "mike_chen_resume.pdf"
        }
      ];
      setApplicants(mockApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    }
  };

  const handleSaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    
    toast({
      title: savedJobs.includes(jobId) ? "Job Removed" : "Job Saved",
      description: savedJobs.includes(jobId) 
        ? "Job removed from saved jobs" 
        : "Job added to saved jobs"
    });
  };

  const handleShareJob = async () => {
    if (!job) return;
    
    const jobUrl = window.location.href;
    const shareText = `Check out this job opportunity: ${job.job_title} at ${job.company_name}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.job_title,
          text: shareText,
          url: jobUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${jobUrl}`);
        toast({
          title: "Link Copied",
          description: "Job link has been copied to clipboard"
        });
      } catch (error) {
        alert(`${shareText}\n${jobUrl}`);
      }
    }
  };

  const handleApplyJob = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign In Required",
        description: "Please sign in to apply for this job"
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AppLayout pageTitle="Job Details">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  if (!job) {
    return (
      <AppLayout pageTitle="Job Not Found">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/jobs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle={job.job_title}>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/jobs')}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        {/* Job Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-1">{job.job_title}</CardTitle>
                <CardDescription className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {job.company_name}
                </CardDescription>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(job.posted_date)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveJob(job.id)}
                  className={savedJobs.includes(job.id) ? "text-primary" : ""}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                  {savedJobs.includes(job.id) ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareJob}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="applicants">
              Applicants ({applicants.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4">
                {/* Job Description */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{job.job_description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Required Skills */}
                {job.skills_required && job.skills_required.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.skills_required.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                {job.benefits && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Benefits & Perks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{job.benefits}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Job Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Job Type:</span>
                      <Badge variant="secondary">{job.job_type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience Level:</span>
                      <Badge variant="outline">{job.experience_level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <Badge variant="outline">{job.industry}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posted:</span>
                      <span>{formatDate(job.posted_date)}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salary:</span>
                        <span className="font-medium text-green-600">{job.salary_range}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge 
                        variant={job.status === "active" ? "default" : "secondary"}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Company</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{job.company_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{job.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Created by */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Posted by</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {job.user_id === user?.id ? "You" : "FilmCollab User"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Apply Button */}
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  onClick={handleApplyJob}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="applicants" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Job Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                {applicants.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applicants yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((applicant) => (
                      <Card key={applicant.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {applicant.avatar}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{applicant.name}</h4>
                              <p className="text-muted-foreground text-sm">{applicant.email}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>Applied: {formatDate(applicant.appliedDate)}</span>
                                <span>Experience: {applicant.experience}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {applicant.skills.map((skill: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant={
                                applicant.status === "shortlisted" ? "default" :
                                applicant.status === "reviewed" ? "secondary" : "outline"
                              }
                            >
                              {applicant.status}
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                View Resume
                              </Button>
                              <Button size="sm" variant="outline">
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
