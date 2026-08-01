import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Building,
  Briefcase,
  Star,
  Share2,
  Bookmark,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  min_salary: number;
  max_salary: number;
  description: string;
  requirements: string;
  skills_required: string[] | string;
  job_tags?: string[];
  benefits: string;
  job_type: string;
  experience_level: string;
  category: string;
  posted_date: string;
  application_deadline: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Job>>({});

  // Hardcoded jobs data (same as in Jobs.tsx)
  const hardcodedJobs: Job[] = [
    {
      id: "my-1",
      title: "Senior Film Director",
      company: "Netflix Studios",
      location: "Los Angeles, CA",
      min_salary: 150000,
      max_salary: 250000,
      description: "We are looking for an experienced film director to lead our upcoming feature film project. The ideal candidate will have a strong vision for storytelling and experience working with large production teams. This role involves overseeing the entire creative process from pre-production through post-production, working closely with producers, writers, cinematographers, and editors to bring compelling stories to life on screen.",
      requirements: "Minimum 8 years of experience in film direction, proven track record of successful feature films, strong leadership skills, ability to work under pressure, excellent communication skills, experience with both studio and independent productions, knowledge of current film industry trends and technologies.",
      skills_required: ["Film Direction", "Storytelling", "Leadership", "Project Management", "Creative Vision", "Team Management", "Budget Management", "Post-Production"],
      benefits: "Comprehensive health insurance, flexible working hours, creative freedom, professional development opportunities, stock options, annual bonus, relocation assistance, equipment allowance.",
      job_type: "Full-time",
      experience_level: "Senior",
      category: "Director",
      posted_date: "2024-01-15",
      application_deadline: "2024-02-15",
      status: "Active",
      user_id: "current-user-id",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    },
    {
      id: "1",
      title: "Film Director",
      company: "Hollywood Studios",
      location: "Los Angeles, CA",
      min_salary: 80000,
      max_salary: 120000,
      description: "We are looking for an experienced film director to lead our upcoming feature film project. The ideal candidate will have a strong vision for storytelling and experience working with large production teams.",
      requirements: "Minimum 5 years of experience in film direction, proven track record of successful projects, strong leadership skills, ability to work under pressure.",
      skills_required: ["Film Direction", "Storytelling", "Leadership", "Project Management"],
      benefits: "Comprehensive health insurance, flexible working hours, creative freedom, professional development opportunities.",
      job_type: "Full-time",
      experience_level: "Senior",
      category: "Director",
      posted_date: "2024-01-15",
      application_deadline: "2024-02-15",
      status: "Active",
      user_id: "current-user-id",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      title: "Cinematographer",
      company: "Warner Bros",
      location: "Burbank, CA",
      min_salary: 80000,
      max_salary: 120000,
      description: "Join our cinematography team to work on high-profile film and television projects. We need a creative and technical cinematographer with experience in various shooting styles.",
      requirements: "Bachelor's degree in Film or related field, 3+ years of cinematography experience, proficiency with professional camera equipment, strong portfolio.",
      skills_required: ["Cinematography", "Camera Operation", "Lighting", "Color Grading"],
      benefits: "Competitive salary, health benefits, equipment allowance, networking opportunities.",
      job_type: "Full-time",
      experience_level: "Mid-level",
      category: "Cinematographer / DOP",
      posted_date: "2024-01-14",
      application_deadline: "2024-02-14",
      status: "Active",
      user_id: "current-user-id",
      created_at: "2024-01-14T09:00:00Z",
      updated_at: "2024-01-14T09:00:00Z"
    },
    {
      id: "3",
      title: "Video Editor",
      company: "Disney Studios",
      location: "Orlando, FL",
      min_salary: 60000,
      max_salary: 90000,
      description: "We're seeking a talented video editor to join our post-production team. You'll work on various projects including feature films, documentaries, and promotional content.",
      requirements: "Proficiency in Adobe Premiere Pro, After Effects, and DaVinci Resolve, 2+ years of editing experience, strong storytelling skills.",
      skills_required: ["Video Editing", "Adobe Premiere", "After Effects", "Color Correction"],
      benefits: "Health insurance, paid time off, professional development, creative projects.",
      job_type: "Full-time",
      experience_level: "Mid-level",
      category: "Video Editor",
      posted_date: "2024-01-13",
      application_deadline: "2024-02-13",
      status: "Active",
      user_id: "current-user-id",
      created_at: "2024-01-13T08:00:00Z",
      updated_at: "2024-01-13T08:00:00Z"
    },
    {
      id: "4",
      title: "Script Writer",
      company: "Amazon Studios",
      location: "Seattle, WA",
      min_salary: 70000,
      max_salary: 110000,
      description: "Join our creative writing team to develop compelling scripts for our streaming platform. We're looking for writers with fresh perspectives and strong narrative skills.",
      requirements: "Bachelor's degree in Creative Writing or Film, portfolio of completed scripts, 3+ years of writing experience, ability to work collaboratively.",
      skills_required: ["Script Writing", "Storytelling", "Character Development", "Dialogue Writing"],
      benefits: "Competitive compensation, health benefits, flexible schedule, creative freedom.",
      job_type: "Full-time",
      experience_level: "Mid-level",
      category: "Script Writer",
      posted_date: "2024-01-12",
      application_deadline: "2024-02-12",
      status: "Active",
      user_id: "current-user-id",
      created_at: "2024-01-12T07:00:00Z",
      updated_at: "2024-01-12T07:00:00Z"
    },
    {
      id: "5",
      title: "Sound Engineer",
      company: "Sony Pictures",
      location: "Culver City, CA",
      min_salary: 65000,
      max_salary: 95000,
      description: "We need a skilled sound engineer to work on our film and television productions. You'll be responsible for recording, mixing, and mastering audio content.",
      requirements: "Degree in Audio Engineering or related field, 3+ years of sound engineering experience, proficiency with Pro Tools, strong technical skills.",
      skills_required: ["Sound Engineering", "Audio Mixing", "Pro Tools", "Foley"],
      benefits: "Health insurance, retirement plan, professional equipment, career growth opportunities.",
      job_type: "Full-time",
      experience_level: "Mid-level",
      category: "Sound Engineer",
      posted_date: "2024-01-11",
      application_deadline: "2024-02-11",
      status: "Active",
      user_id: "current-user-id",
      created_at: "2024-01-11T06:00:00Z",
      updated_at: "2024-01-11T06:00:00Z"
    }
  ];

  // Hardcoded applicants data
  const applicants = [
    {
      id: "app-1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      experience: "8 years",
      skills: ["Film Direction", "Storytelling", "Leadership", "Project Management"],
      appliedDate: "2024-01-16",
      status: "Under Review",
      resume: "sarah_johnson_resume.pdf",
      portfolio: "sarahjohnson.com"
    },
    {
      id: "app-2", 
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 234-5678",
      experience: "6 years",
      skills: ["Film Direction", "Creative Vision", "Team Management", "Post-Production"],
      appliedDate: "2024-01-17",
      status: "Interview Scheduled",
      resume: "michael_chen_resume.pdf",
      portfolio: "michaelchenfilms.com"
    },
    {
      id: "app-3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com", 
      phone: "+1 (555) 345-6789",
      experience: "10 years",
      skills: ["Film Direction", "Budget Management", "Leadership", "Creative Vision"],
      appliedDate: "2024-01-18",
      status: "Under Review",
      resume: "emily_rodriguez_resume.pdf",
      portfolio: "emilyrodriguez.com"
    }
  ];

  const handleEdit = () => {
    if (job) {
      setEditForm({
        ...job,
        skills_required: Array.isArray(job.skills_required) ? job.skills_required.join(', ') : job.skills_required
      });
      setShowEditDialog(true);
    }
  };

  const handleDelete = () => {
    if (job) {
      toast({
        title: "Job deleted",
        description: "The job has been deleted successfully."
      });
      navigate("/jobs");
    }
  };

  const handleUpdateJob = () => {
    if (job && editForm) {
      const skillsArray = typeof editForm.skills_required === 'string' 
        ? editForm.skills_required.split(',').map(s => s.trim())
        : Array.isArray(editForm.skills_required) ? editForm.skills_required : job.skills_required;
      
      const updatedJob = {
        ...job,
        ...editForm,
        skills_required: skillsArray
      };
      setJob(updatedJob);
      setShowEditDialog(false);
      toast({
        title: "Job updated",
        description: "The job has been updated successfully."
      });
    }
  };

  useEffect(() => {
    const fetchJobDetails = () => {
      console.log('JobDetails: jobId from URL:', jobId);
      console.log('JobDetails: Available job IDs:', hardcodedJobs.map(job => job.id));
      
      if (!jobId) {
        console.log('JobDetails: No jobId provided');
        setLoading(false);
        return;
      }

      // Find the job in hardcoded data
      const foundJob = hardcodedJobs.find(job => job.id === jobId);
      console.log('JobDetails: Found job:', foundJob);
      
      if (foundJob) {
        setJob(foundJob);
        setLoading(false);
      } else {
        console.log('JobDetails: Job not found for ID:', jobId);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Job not found",
          description: "The requested job could not be found."
        });
      }
    };

    fetchJobDetails();
  }, [jobId, toast]);

  const handleApply = () => {
    setIsApplied(true);
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully."
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Job unsaved" : "Job saved",
      description: isSaved ? "Job removed from saved jobs." : "Job added to saved jobs."
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: job?.title || "Job Opportunity",
      text: `Check out this job opportunity: ${job?.title} at ${job?.company}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Job link has been copied to clipboard."
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <AppLayout pageTitle="Job Details">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!job) {
    return (
      <AppLayout pageTitle="Job Not Found">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested job could not be found.</p>
            <Button onClick={() => navigate("/jobs")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle={`${job.title} - ${job.company}`}>
      <div className="w-full space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-2 border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </div>

        {/* Job Header */}
        <Card className="border-yellow-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {job.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEdit} className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={handleDelete} className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" onClick={handleSave} className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                  <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleShare} className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-yellow-50 border-yellow-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="applicants" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Applicants ({applicants.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Job Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Description */}
                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Briefcase className="h-5 w-5 text-yellow-600" />
                      Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 whitespace-pre-wrap mb-4">
                      {job.requirements}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(job.skills_required) ? job.skills_required : [job.skills_required]).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {job.job_tags && job.job_tags.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium text-gray-900">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.job_tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-sm px-3 py-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {job.benefits}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Job Info */}
                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Job Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Salary Range</p>
                        <p className="text-sm text-gray-600">
                          {formatSalary(job.min_salary, job.max_salary)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Job Type</p>
                        <p className="text-sm text-gray-600">{job.job_type}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Experience Level</p>
                        <p className="text-sm text-gray-600">{job.experience_level}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Category</p>
                        <p className="text-sm text-gray-600">{job.category}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Posted Date</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(job.posted_date)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Deadline</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(job.application_deadline)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={job.status === 'Active' ? 'default' : 'secondary'}
                        className={`w-fit ${job.status === 'Active' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {job.user_id !== user?.id && (
                  /* Apply Button */
                  <Card className="border-yellow-200">
                    <CardContent className="pt-6">
                      <Button 
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white" 
                        size="lg"
                        onClick={handleApply}
                        disabled={isApplied}
                      >
                        {isApplied ? 'Applied' : 'Apply Now'}
                      </Button>
                      {isApplied && (
                        <p className="text-sm text-green-600 text-center mt-2">
                          ✓ Application submitted successfully
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applicants" className="space-y-6">
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Job Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicants.map((applicant) => (
                    <Card key={applicant.id} className="p-4 border-yellow-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                            <Badge variant="outline" className="border-yellow-200">{applicant.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {applicant.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {applicant.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {applicant.experience}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {applicant.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            Applied on {formatDate(applicant.appliedDate)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                            View Resume
                          </Button>
                          <Button variant="outline" size="sm" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                            View Portfolio
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Edit Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-700">Job Title</Label>
                  <Input
                    id="title"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="border-yellow-200 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-gray-700">Company</Label>
                  <Input
                    id="company"
                    value={editForm.company || ''}
                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                    className="border-yellow-200 focus:border-yellow-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location" className="text-gray-700">Location</Label>
                <Input
                  id="location"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="border-yellow-200 focus:border-yellow-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_salary" className="text-gray-700">Min Salary</Label>
                  <Input
                    id="min_salary"
                    type="number"
                    value={editForm.min_salary || ''}
                    onChange={(e) => setEditForm({...editForm, min_salary: parseInt(e.target.value)})}
                    className="border-yellow-200 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <Label htmlFor="max_salary" className="text-gray-700">Max Salary</Label>
                  <Input
                    id="max_salary"
                    type="number"
                    value={editForm.max_salary || ''}
                    onChange={(e) => setEditForm({...editForm, max_salary: parseInt(e.target.value)})}
                    className="border-yellow-200 focus:border-yellow-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={4}
                  className="border-yellow-200 focus:border-yellow-500"
                />
              </div>
              <div>
                <Label htmlFor="requirements" className="text-gray-700">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={editForm.requirements || ''}
                  onChange={(e) => setEditForm({...editForm, requirements: e.target.value})}
                  rows={3}
                  className="border-yellow-200 focus:border-yellow-500"
                />
              </div>
              <div>
                <Label htmlFor="skills_required" className="text-gray-700">Skills Required (comma separated)</Label>
                <Input
                  id="skills_required"
                  value={editForm.skills_required || ''}
                  onChange={(e) => setEditForm({...editForm, skills_required: e.target.value})}
                  className="border-yellow-200 focus:border-yellow-500"
                />
              </div>
              <div>
                <Label htmlFor="benefits" className="text-gray-700">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={editForm.benefits || ''}
                  onChange={(e) => setEditForm({...editForm, benefits: e.target.value})}
                  rows={3}
                  className="border-yellow-200 focus:border-yellow-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="job_type" className="text-gray-700">Job Type</Label>
                  <Select value={editForm.job_type || ''} onValueChange={(value) => setEditForm({...editForm, job_type: value})}>
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience_level" className="text-gray-700">Experience Level</Label>
                  <Select value={editForm.experience_level || ''} onValueChange={(value) => setEditForm({...editForm, experience_level: value})}>
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry</SelectItem>
                      <SelectItem value="Mid-level">Mid-level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                  Cancel
                </Button>
                <Button onClick={handleUpdateJob} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                  Update Job
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}