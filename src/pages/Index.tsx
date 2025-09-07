import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Users, Briefcase, Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Briefcase,
      title: "Job Opportunities",
      description: "Discover and post film industry jobs worldwide"
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with industry professionals and collaborators"
    },
    {
      icon: Film,
      title: "Project Collaboration",
      description: "Find and join exciting film projects"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Access a worldwide film industry community"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Film className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FilmCollab
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Your Film Industry Network Hub
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect, collaborate, and create with film industry professionals worldwide. 
            Find opportunities, share projects, and build your career in entertainment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-elegant min-w-[200px]"
            onClick={() => navigate("/auth/signup")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="min-w-[200px] border-primary/20 hover:bg-primary/5"
              onClick={() => navigate("/auth/signin")}
            >
              Sign In
            </Button>
          </div>

          <div className="mt-8">
            <Button 
              variant="link" 
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={() => navigate("/admin-signin")}
            >
              Sign in as Administrator
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-soft transition-shadow border-border/50">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of film professionals already using FilmCollab
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                onClick={() => navigate("/auth/signup")}
              >
                Create Your Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;