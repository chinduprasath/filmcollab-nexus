import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Film, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const roles = [
  { value: "Director", label: "🎥 Director", category: "Direction & Production" },
  { value: "Assistant Director", label: "🎥 Assistant Director", category: "Direction & Production" },
  { value: "Producer", label: "🎥 Producer", category: "Direction & Production" },
  { value: "Executive Producer", label: "🎥 Executive Producer", category: "Direction & Production" },
  { value: "Line Producer", label: "🎥 Line Producer", category: "Direction & Production" },
  { value: "Production Manager", label: "🎥 Production Manager", category: "Direction & Production" },
  { value: "Production Assistant", label: "🎥 Production Assistant", category: "Direction & Production" },
  
  { value: "Cinematographer / DOP", label: "📸 Cinematographer / DOP", category: "Cinematography & Camera" },
  { value: "Assistant Cameraman", label: "📸 Assistant Cameraman", category: "Cinematography & Camera" },
  { value: "Camera Operator", label: "📸 Camera Operator", category: "Cinematography & Camera" },
  { value: "Steadicam Operator", label: "📸 Steadicam Operator", category: "Cinematography & Camera" },
  { value: "Drone Operator", label: "📸 Drone Operator", category: "Cinematography & Camera" },
  { value: "Gaffer", label: "📸 Gaffer", category: "Cinematography & Camera" },
  { value: "Lighting Technician", label: "📸 Lighting Technician", category: "Cinematography & Camera" },
  
  { value: "Lead Actor / Actress", label: "🎭 Lead Actor / Actress", category: "Actors & Performers" },
  { value: "Supporting Actor / Actress", label: "🎭 Supporting Actor / Actress", category: "Actors & Performers" },
  { value: "Child Artist", label: "🎭 Child Artist", category: "Actors & Performers" },
  { value: "Theatre Artist", label: "🎭 Theatre Artist", category: "Actors & Performers" },
  { value: "Voice Over Artist", label: "🎭 Voice Over Artist", category: "Actors & Performers" },
  { value: "Dancer", label: "🎭 Dancer", category: "Actors & Performers" },
  { value: "Stunt Artist", label: "🎭 Stunt Artist", category: "Actors & Performers" },
  
  { value: "Script Writer", label: "✍️ Script Writer", category: "Writing & Creative" },
  { value: "Screenplay Writer", label: "✍️ Screenplay Writer", category: "Writing & Creative" },
  { value: "Dialogue Writer", label: "✍️ Dialogue Writer", category: "Writing & Creative" },
  { value: "Lyricist", label: "✍️ Lyricist", category: "Writing & Creative" },
  { value: "Storyboard Artist", label: "✍️ Storyboard Artist", category: "Writing & Creative" },
  
  { value: "Music Director", label: "🎼 Music Director", category: "Music & Sound" },
  { value: "Background Score Composer", label: "🎼 Background Score Composer", category: "Music & Sound" },
  { value: "Singer / Vocalist", label: "🎼 Singer / Vocalist", category: "Music & Sound" },
  { value: "Instrumentalist", label: "🎼 Instrumentalist", category: "Music & Sound" },
  { value: "Sound Engineer", label: "🎼 Sound Engineer", category: "Music & Sound" },
  { value: "Foley Artist", label: "🎼 Foley Artist", category: "Music & Sound" },
  { value: "Dubbing / Voice Artist", label: "🎼 Dubbing / Voice Artist", category: "Music & Sound" },
  
  { value: "Art Director", label: "🎨 Art Director", category: "Art & Design" },
  { value: "Set Designer", label: "🎨 Set Designer", category: "Art & Design" },
  { value: "Costume Designer", label: "🎨 Costume Designer", category: "Art & Design" },
  { value: "Fashion Stylist", label: "🎨 Fashion Stylist", category: "Art & Design" },
  { value: "Makeup Artist", label: "🎨 Makeup Artist", category: "Art & Design" },
  { value: "Hair Stylist", label: "🎨 Hair Stylist", category: "Art & Design" },
  { value: "Graphic Designer", label: "🎨 Graphic Designer", category: "Art & Design" },
  { value: "Poster Designer", label: "🎨 Poster Designer", category: "Art & Design" },
  
  { value: "Video Editor", label: "🖥️ Video Editor", category: "Editing & Post Production" },
  { value: "VFX Artist", label: "🖥️ VFX Artist", category: "Editing & Post Production" },
  { value: "Motion Graphics Designer", label: "🖥️ Motion Graphics Designer", category: "Editing & Post Production" },
  { value: "Colorist", label: "🖥️ Colorist", category: "Editing & Post Production" },
  { value: "DI Supervisor", label: "🖥️ DI Supervisor", category: "Editing & Post Production" },
  { value: "Sound Editor", label: "🖥️ Sound Editor", category: "Editing & Post Production" },
  
  { value: "Digital Marketer", label: "📣 Digital Marketer", category: "Marketing & Distribution" },
  { value: "Public Relations (PR)", label: "📣 Public Relations (PR)", category: "Marketing & Distribution" },
  { value: "Social Media Manager", label: "📣 Social Media Manager", category: "Marketing & Distribution" },
  { value: "Film Distributor", label: "📣 Film Distributor", category: "Marketing & Distribution" },
  
  { value: "Others", label: "Others", category: "Others" }
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      const { error } = await signUp(data.email, data.password, fullName, false);
      if (!error) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign up error:", error);
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
                <Film className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                FilmCollab
              </h1>
            </div>
            <CardTitle className="text-gray-900">Create Your Account</CardTitle>
            <CardDescription className="text-gray-600">Join the film industry community</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" className="border-yellow-200 focus:border-yellow-500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" className="border-yellow-200 focus:border-yellow-500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Role</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between border-yellow-200 hover:border-yellow-500"
                            >
                              {field.value
                                ? roles.find((role) => role.value === field.value)?.label
                                : "Select your role in the film industry"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search roles..." />
                            <CommandList>
                              <CommandEmpty>No role found.</CommandEmpty>
                              {Object.entries(
                                roles.reduce((acc, role) => {
                                  if (!acc[role.category]) {
                                    acc[role.category] = [];
                                  }
                                  acc[role.category].push(role);
                                  return acc;
                                }, {} as Record<string, typeof roles>)
                              ).map(([category, categoryRoles]) => (
                                <CommandGroup key={category} heading={category}>
                                  {categoryRoles.map((role) => (
                                    <CommandItem
                                      key={role.value}
                                      value={role.value}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue === field.value ? "" : currentValue);
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          field.value === role.value ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                      {role.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                            placeholder="Create a password"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="border-yellow-200 focus:border-yellow-500"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
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
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-yellow-600 hover:text-yellow-700"
                  onClick={() => navigate("/auth/signin")}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}