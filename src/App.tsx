import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Index from "./pages/Index";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import AdminSignIn from "./pages/auth/AdminSignIn";
import AdminSignUp from "./pages/auth/AdminSignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  // Ensure user has USER role for regular protected routes
  if (profile && profile.role !== 'USER' && profile.role !== 'ADMIN') {
    return <Navigate to="/auth/signin" replace />;
  }
  
  return <>{children}</>;
}

// Admin Route Component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-destructive border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/admin-signin" replace />;
  }

  // Only allow ADMIN role for admin routes
  if (profile && profile.role !== 'ADMIN') {
    return <Navigate to="/admin-signin" replace />;
  }
  
  return <>{children}</>;
}

// Public Route Component (redirect if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user && profile) {
    // Redirect based on role
    if (profile.role === 'ADMIN') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route
        path="/auth/signin"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin-signin"
        element={
          <PublicRoute>
            <AdminSignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/admin-signup"
        element={
          <PublicRoute>
            <AdminSignUp />
          </PublicRoute>
        }
      />

      {/* Protected user routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />

      {/* Protected admin routes */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
