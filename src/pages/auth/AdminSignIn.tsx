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
  const { signIn, user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle role-based redirect after successful sign in
  useEffect(() => {
    if (user && profile && !authLoading) {
      if (profile.role === 'ADMIN') {
        navigate("/admin-dashboard");
      } else {
        // If user is not admin, redirect to regular dashboard
        navigate("/dashboard");
      }
    }
  }, [user, profile, authLoading, navigate]);

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
      const { error } = await signIn(data.email, data.password);
      if (error) {
        console.error("Admin sign in error:", error);
      }
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error("Admin sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-elegant border-border/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-destructive to-orange-500 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            </div>
            <CardTitle>Administrator Sign In</CardTitle>
            <CardDescription>Access the admin dashboard</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@filmcollab.com"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter admin password"
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
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
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
                  className="w-full bg-gradient-to-r from-destructive to-orange-500 hover:opacity-90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Need admin access?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-destructive hover:text-orange-500"
                  onClick={() => navigate("/admin-signup")}
                >
                  Create admin account
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <Shield className="h-3 w-3 inline mr-1" />
                Admin access requires special privileges
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}