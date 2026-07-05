import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Film, 
  Users, 
  Search, 
  Network, 
  TrendingUp, 
  UserPlus, 
  FileText, 
  MessageSquare, 
  Star,
  ArrowRight,
  Play,
  Camera,
  Mic,
  Edit3,
  Lightbulb,
  Quote,
  CheckCircle,
  Sparkles,
  Globe,
  Trophy,
  Zap,
  Heart,
  Eye,
  Award,
  Clock,
  MapPin,
  ChevronRight,
  Briefcase,
  Target,
  Shield,
  Rocket,
  Crown,
  Diamond
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LandingTopbar } from "@/components/layout/landing-topbar";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Discover Opportunities",
      description: "Find casting calls, crew positions, and collaboration opportunities worldwide",
      color: "bg-yellow-500"
    },
    {
      icon: Network,
      title: "Professional Network",
      description: "Connect with directors, producers, actors, and industry professionals",
      color: "bg-yellow-600"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Build your portfolio, gain exposure, and advance your film career",
      color: "bg-yellow-500"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Access international projects and collaborate across borders",
      color: "bg-yellow-600"
    },
    {
      icon: Trophy,
      title: "Project Management",
      description: "Organize shoots, manage timelines, and track project progress",
      color: "bg-yellow-500"
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Chat, share files, and coordinate with your team instantly",
      color: "bg-yellow-600"
    }
  ];

  const testimonials = [
    {
      quote: "FilmCollab completely transformed how I find and manage film projects. I've connected with amazing talent and my career has skyrocketed!",
      author: "Sarah Chen",
      role: "Independent Director",
      avatar: "SC",
      rating: 5,
      project: "Award-winning Short Film 'Moments'"
    },
    {
      quote: "The platform's networking features helped me land my biggest role yet. The industry connections I've made here are invaluable.",
      author: "Marcus Rodriguez", 
      role: "Professional Actor",
      avatar: "MR",
      rating: 5,
      project: "Lead in 'City Lights' Feature Film"
    },
    {
      quote: "As a screenwriter, FilmCollab gave my scripts the exposure they needed. Three of my projects are now in production!",
      author: "Emma Thompson",
      role: "Screenwriter", 
      avatar: "ET",
      rating: 5,
      project: "Netflix Original Series Writer"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Creators", icon: Users },
    { number: "10K+", label: "Projects Completed", icon: Film },
    { number: "25K+", label: "Connections Made", icon: Heart },
    { number: "150+", label: "Countries Reached", icon: Globe }
  ];

  const benefits = [
    {
      icon: Crown,
      title: "Premium Access",
      description: "Get priority access to exclusive projects and casting calls"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your work and personal information are protected with enterprise-grade security"
    },
    {
      icon: Rocket,
      title: "Fast Growth",
      description: "Accelerate your career with our AI-powered matching system"
    },
    {
      icon: Diamond,
      title: "Quality Assurance",
      description: "Verified professionals and curated opportunities only"
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      <LandingTopbar />
      
      {/* Hero Section - Professional Yellow & White */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-yellow-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-yellow-600 rounded-full blur-2xl"></div>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rotate-45 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-500 rotate-45 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-600 rotate-45 animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-yellow-300 rotate-45 animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            
            {/* Logo & Brand */}
            <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-2xl animate-glow">
                <Film className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                FilmCollab
              </h1>
            </div>

            {/* Main Headlines */}
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in delay-300">
              Where Stories
              <span className="block bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                Come to Life
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-500">
              The premier platform connecting film industry professionals worldwide. 
              Collaborate, create, and showcase your talent in cinema's next chapter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in delay-700">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 min-w-[250px] h-14 text-lg font-semibold group"
                onClick={() => navigate("/auth/signup")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="min-w-[250px] h-14 text-lg border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 group"
                onClick={() => navigate("/auth/signin")}
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-gray-500 animate-fade-in delay-1000">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Trusted by 50K+ creators</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span>150+ countries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-yellow-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-white border-y border-yellow-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="h-16 w-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section id="features" className="py-32 px-6 relative bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Why FilmCollab
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                Create Amazing Films
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools and global network to bring your creative vision to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white border-yellow-200 hover:border-yellow-400 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 group"
              >
                <CardHeader>
                  <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-yellow-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-yellow-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-6">
              <Target className="h-4 w-4 mr-2" />
              Premium Benefits
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Choose
              <span className="block bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                FilmCollab Pro
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="bg-white border-yellow-200 hover:border-yellow-400 transition-all duration-500 hover:shadow-xl group text-center"
              >
                <CardHeader>
                  <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Professional Style */}
      <section className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-6">
              <Quote className="h-4 w-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              What Creators Are
              <span className="block bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                Saying About Us
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-white border-yellow-200 hover:border-yellow-400 transition-all duration-500 group"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-semibold">{testimonial.author}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-700 mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-400">
                    <Award className="h-3 w-3 mr-1" />
                    {testimonial.project}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Professional & Compelling */}
      <section className="py-32 px-6 relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Ready to Create
            <span className="block text-yellow-100">
              Your Masterpiece?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-yellow-100 mb-12 max-w-3xl mx-auto">
            Join thousands of filmmakers, actors, and creatives who are already building the future of cinema.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg" 
              className="bg-white text-yellow-600 hover:bg-yellow-50 shadow-2xl hover:shadow-white/25 transition-all duration-500 min-w-[300px] h-16 text-xl font-semibold group"
              onClick={() => navigate("/auth/signup")}
            >
              Join FilmCollab Now
              <Sparkles className="ml-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
            </Button>
            
            <div className="text-center">
              <p className="text-yellow-100 text-sm">Free to join • No credit card required</p>
              <p className="text-white text-sm font-semibold">Start collaborating in under 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-yellow-200 bg-yellow-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <Film className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">FilmCollab</span>
              </div>
              <p className="text-gray-600 mb-6">
                Connecting the global film community to create extraordinary stories together.
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#features" className="hover:text-yellow-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-yellow-600 transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-yellow-200 mt-12 pt-8 text-center">
            <p className="text-gray-600">
              © 2024 FilmCollab. All rights reserved. Made for creators, by creators.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;