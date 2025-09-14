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
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LandingTopbar } from "@/components/layout/landing-topbar";
import { useScrollAnimation, useParallax } from "@/hooks/use-scroll-animation";

const Index = () => {
  const navigate = useNavigate();
  const [heroRef, heroVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [stepsRef, stepsVisible] = useScrollAnimation();
  const [communityRef, communityVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();
  const parallaxOffset = useParallax();

  const features = [
    {
      icon: Search,
      title: "Find Projects Easily",
      description: "Browse open casting calls & film projects from around the world",
      emoji: "🎬"
    },
    {
      icon: Network,
      title: "Connect with Talent",
      description: "Network with directors, writers, actors, and crew members",
      emoji: "🤝"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Career",
      description: "Build your portfolio and gain visibility in the industry",
      emoji: "🚀"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Create a Profile",
      description: "Set up your professional profile as an actor, writer, filmmaker, or crew member",
      icon: UserPlus
    },
    {
      step: "02", 
      title: "Post or Join Projects",
      description: "Discover casting calls, crew positions, or post your own projects",
      icon: FileText
    },
    {
      step: "03",
      title: "Collaborate & Create",
      description: "Chat with team members, share scripts, and manage project tasks",
      icon: MessageSquare
    },
    {
      step: "04",
      title: "Showcase Your Work",
      description: "Build your reputation and get discovered by industry professionals",
      icon: Star
    }
  ];

  const testimonials = [
    {
      quote: "I found my dream cast for my short film on FilmCollab! The platform made it so easy to connect with talented actors.",
      author: "Sarah Chen",
      role: "Indie Director",
      avatar: "SC"
    },
    {
      quote: "FilmCollab helped me land my first major role. The networking opportunities are incredible.",
      author: "Marcus Rodriguez", 
      role: "Actor",
      avatar: "MR"
    },
    {
      quote: "As a writer, I've collaborated with amazing directors and seen my scripts come to life.",
      author: "Emma Thompson",
      role: "Screenwriter", 
      avatar: "ET"
    }
  ];

  const communityMembers = [
    { name: "Alex Kim", role: "Director", avatar: "AK" },
    { name: "Maya Patel", role: "Editor", avatar: "MP" },
    { name: "David Lee", role: "Actor", avatar: "DL" },
    { name: "Sophie Martin", role: "Producer", avatar: "SM" },
    { name: "James Wilson", role: "Cinematographer", avatar: "JW" },
    { name: "Lisa Garcia", role: "Writer", avatar: "LG" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden film-grain">
      
      <LandingTopbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        {/* Animated background elements with parallax */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
          ></div>
          <div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-slow delay-1000"
            style={{ transform: `translateY(${parallaxOffset * -0.3}px)` }}
          ></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <div className={`flex items-center justify-center lg:justify-start gap-3 mb-6 transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-glow">
                  <Film className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text-animated">
                  FilmCollab
                </h1>
              </div>
              
              <h2 className={`text-4xl md:text-6xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Collaborate. Create. <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Shine.</span>
              </h2>
              
              <p className={`text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-all duration-1000 delay-400 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                FilmCollab connects directors, actors, writers, and crew to bring stories to life. 
                Join the creative community that's revolutionizing filmmaking.
              </p>

              <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[200px] h-12 text-lg font-semibold hover-lift"
                  onClick={() => navigate("/auth/signup")}
                >
                  Start Collaborating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="min-w-[200px] h-12 text-lg border-white/20 text-white hover:bg-white/10 backdrop-blur-sm hover-lift"
                  onClick={() => navigate("/auth/signin")}
                >
                  Explore Projects
                </Button>
              </div>

              <div className={`flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400 transition-all duration-1000 delay-600 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Free to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Global community</span>
                </div>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className={`relative transition-all duration-1000 delay-700 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl hover-lift">
                {/* Mock film crew illustration */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">Director</h4>
                    <p className="text-slate-400 text-sm">Behind the lens</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '0.5s' }}>
                      <Mic className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">Actor</h4>
                    <p className="text-slate-400 text-sm">Under spotlight</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '1s' }}>
                      <Edit3 className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">Editor</h4>
                    <p className="text-slate-400 text-sm">At the desk</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '1.5s' }}>
                      <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">Writer</h4>
                    <p className="text-slate-400 text-sm">Creating stories</p>
                  </div>
                </div>
                
                {/* Subtle animated gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 px-6 bg-slate-800/30">
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-16 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">FilmCollab?</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to connect, collaborate, and create amazing films
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`bg-slate-800/50 border-white/10 hover:bg-slate-800/70 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 group hover-lift ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{feature.emoji}</div>
                  <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-16 transition-all duration-1000 ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative transition-all duration-500 ${
                  stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <Card className="bg-slate-800/50 border-white/10 hover:bg-slate-800/70 transition-all duration-300 h-full hover-lift">
                  <CardHeader className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg animate-glow">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge variant="outline" className="w-fit mx-auto mb-4 border-primary/50 text-primary">
                      Step {step.step}
                    </Badge>
                    <CardTitle className="text-xl text-white">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300 text-center">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2 transition-all duration-1000 ${
                    stepsVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  }`} style={{ transitionDelay: `${(index + 1) * 200}ms` }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section ref={communityRef} id="community" className="py-20 px-6 bg-slate-800/30">
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-16 transition-all duration-1000 ${communityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join a <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Creative Community</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Connect with talented filmmakers, actors, and creatives from around the world
            </p>
          </div>

          {/* Community members grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {communityMembers.map((member, index) => (
              <div 
                key={index} 
                className={`text-center group transition-all duration-500 ${
                  communityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                  <span className="text-white font-semibold">{member.avatar}</span>
                </div>
                <h4 className="text-white font-semibold text-sm">{member.name}</h4>
                <p className="text-slate-400 text-xs">{member.role}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`bg-slate-800/50 border-white/10 hover:bg-slate-800/70 transition-all duration-500 hover-lift ${
                  communityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 6) * 200}ms` }}
              >
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.author}</h4>
                      <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section ref={ctaRef} className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className={`bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 backdrop-blur-sm transition-all duration-1000 hover-lift ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <CardContent className="pt-12 pb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to make your next film a <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">reality?</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of filmmakers already collaborating on FilmCollab
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-14 px-8 text-lg font-semibold hover-lift animate-glow"
                onClick={() => navigate("/auth/signup")}
              >
                Join FilmCollab Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-slate-400 text-sm mt-4">
                No hidden fees – just pure collaboration.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-white/10 py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Film className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  FilmCollab
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Connecting filmmakers, actors, writers, and crew to bring stories to life.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/#features" className="text-slate-400 hover:text-primary transition-colors">About</a></li>
                <li><a href="/#community" className="text-slate-400 hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Forums</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Events</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Resources</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 FilmCollab. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;