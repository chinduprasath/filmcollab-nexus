import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface LandingTopbarProps {
  className?: string;
}

export function LandingTopbar({ className }: LandingTopbarProps) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Community", href: "/#community" }
  ];

  const handleSignIn = () => {
    if (user) {
      // If already logged in, go to appropriate dashboard
      navigate(isAdmin() ? "/admin-dashboard" : "/dashboard");
    } else {
      navigate("/auth/signin");
    }
  };

  const handleGetStarted = () => {
    if (user) {
      // If already logged in, go to appropriate dashboard
      navigate(isAdmin() ? "/admin-dashboard" : "/dashboard");
    } else {
      navigate("/auth/signup");
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-yellow-200/50 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Film className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              FilmCollab
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-yellow-600 transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleSignIn}
              className="hidden sm:inline-flex border-yellow-500/30 text-gray-700 hover:bg-yellow-50 hover:border-yellow-500"
            >
              {user ? "Dashboard" : "Sign In"}
            </Button>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-yellow-500/25"
            >
              {user ? "Go to App" : "Get Started"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}