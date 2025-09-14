import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LandingTopbarProps {
  className?: string;
}

export function LandingTopbar({ className }: LandingTopbarProps) {
  const navigate = useNavigate();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Community", href: "/#community" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Film className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FilmCollab
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth/signin")}
              className="hidden sm:inline-flex border-primary/20 hover:bg-primary/5"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/auth/signup")}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}