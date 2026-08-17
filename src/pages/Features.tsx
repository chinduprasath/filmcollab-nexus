import { LandingTopbar } from "@/components/layout/landing-topbar";
import { LandingFooter } from "@/components/layout/landing-footer";
import { 
  Search, 
  Network, 
  TrendingUp, 
  Globe, 
  Trophy, 
  Zap,
  CheckCircle,
  Star,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Discover Opportunities",
      description: "Find casting calls, crew positions, and collaboration opportunities worldwide. Our advanced search helps you match with the perfect projects.",
      color: "bg-yellow-500"
    },
    {
      icon: Network,
      title: "Professional Network",
      description: "Connect with directors, producers, actors, and industry professionals. Build meaningful relationships that advance your career.",
      color: "bg-yellow-600"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Build your portfolio, gain exposure, and advance your film career with our industry-leading tools and resources.",
      color: "bg-yellow-500"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Access international projects and collaborate across borders. The film industry is global, and now your network is too.",
      color: "bg-yellow-600"
    },
    {
      icon: Trophy,
      title: "Project Management",
      description: "Organize shoots, manage timelines, and track project progress from pre-production to post-production all in one place.",
      color: "bg-yellow-500"
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Chat, share files, and coordinate with your team instantly. Never miss a beat when working on fast-paced productions.",
      color: "bg-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans overflow-x-hidden pt-16">
      <LandingTopbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-yellow-50 to-white">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="block bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              Film Professionals
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Everything you need to connect, collaborate, and create extraordinary cinema, all in one platform.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`h-14 w-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Join thousands of film professionals who are already using FilmCollab to bring their stories to life.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-yellow-700 hover:bg-gray-50 h-14 px-8 text-lg font-semibold rounded-full"
            onClick={() => navigate("/auth/signup")}
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
