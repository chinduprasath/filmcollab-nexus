import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Film, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const adminSignInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type AdminSignInFormData = z.infer<typeof adminSignInSchema>;

export default function AdminSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user, profile, userRole, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Handle role-based redirect after successful sign in
  useEffect(() => {
    if (user && !authLoading && userRole) {
      console.log('Admin signin - checking role:', userRole);
      if (isAdmin()) {
        console.log('Redirecting to admin dashboard');
        navigate("/admin-dashboard");
      } else {
        console.log('Not admin, redirecting to user dashboard');
        // If user is not admin, redirect to regular dashboard with error
        navigate("/dashboard");
      }
    }
  }, [user, authLoading, userRole, navigate, isAdmin]);

  const form = useForm<AdminSignInFormData>({
    resolver: zodResolver(adminSignInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: AdminSignInFormData) => {
    setLoading(true);
    try {
      // Use Supabase authentication - no hardcoded credentials
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error("Admin sign in error:", error);
      } else {
        // Navigation will be handled by the useEffect above after role check
        console.log('Sign in successful, checking admin role...');
      }
    } catch (error) {
      console.error("Admin sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-600 hover:text-yellow-600"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-elegant border-yellow-200 bg-white">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            </div>
            <CardTitle className="text-gray-900">Administrator Sign In</CardTitle>
            <CardDescription className="text-gray-600">Access the admin dashboard</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Admin Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@gmail.com"
                          className="border-yellow-200 focus:border-yellow-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter admin password"
                            className="border-yellow-200 focus:border-yellow-500"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-gray-600">
                Use demo credentials or{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-yellow-600 hover:text-yellow-700"
                  onClick={() => navigate("/admin-signup")}
                >
                  create admin account
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <Shield className="h-3 w-3 inline mr-1 text-yellow-600" />
                Admin accounts must be created with admin role in database
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}