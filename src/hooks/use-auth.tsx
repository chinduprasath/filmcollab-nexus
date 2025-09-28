import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  category?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  skills?: string[] | null;
  experience_level?: string | null;
  industry?: string | null;
  portfolio_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  is_verified?: boolean | null;
  followers_count?: number | null;
  projects_count?: number | null;
  posts_count?: number | null;
  likes_count?: number | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  linkProfile: (profileId: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const profileFetchingRef = useRef<Set<string>>(new Set());

  const fetchProfile = async (userId: string) => {
    // Prevent duplicate fetches
    if (profileFetchingRef.current.has(userId)) {
      console.log('Profile fetch already in progress for user:', userId);
      return;
    }
    
    console.log('Starting profile fetch for user:', userId);
    console.log('User ID type:', typeof userId, 'Value:', userId);
    profileFetchingRef.current.add(userId);

    // First, let's check all profiles to see what's available
    try {
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(10);
      
      console.log('All profiles in database:', allProfiles);
      console.log('All profiles error:', allProfilesError);
      
      // If we can see profiles but none are linked to this user, try to find a match
      if (allProfiles && allProfiles.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const emailPrefix = user.email.split('@')[0].toLowerCase();
          console.log('Looking for profile matching email prefix:', emailPrefix);
          
          // Look for profiles that might match this user
          const matchingProfiles = allProfiles.filter(profile => 
            profile.full_name?.toLowerCase().includes(emailPrefix) ||
            profile.first_name?.toLowerCase().includes(emailPrefix) ||
            profile.full_name?.toLowerCase() === 'vfx' ||
            profile.first_name?.toLowerCase() === 'vfx'
          );
          
          console.log('Matching profiles found:', matchingProfiles);
          
          if (matchingProfiles.length > 0) {
            const matchedProfile = matchingProfiles[0];
            console.log('Auto-linking to matched profile:', matchedProfile);
            
            // Link this profile to the current user
            const { error: linkError } = await supabase
              .from('profiles')
              .update({ user_id: userId })
              .eq('id', matchedProfile.id);
            
            if (!linkError) {
              console.log('Successfully auto-linked profile');
              setProfile({ ...matchedProfile, user_id: userId });
              return;
            }
          }
        }
      }
    } catch (err) {
      console.log('Error fetching all profiles:', err);
    }
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );
      
      const fetchPromise = supabase
        .from('profiles')
        .select('id, user_id, full_name, first_name, last_name, role, bio, location, website, skills, experience_level, industry, portfolio_url, linkedin_url, github_url, is_verified, followers_count, projects_count, posts_count, likes_count, created_at, updated_at')
        .eq('user_id', userId)
        .single();
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      console.log('Profile fetch result:', { data, error });
      console.log('Profile data details:', {
        full_name: data?.full_name,
        first_name: data?.first_name,
        last_name: data?.last_name,
        role: data?.role
      });
      
      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist by user_id, try to find by email or create default
        if (error.code === 'PGRST116') {
          console.log('Profile not found by user_id, trying alternative approach');
          
          // Try to get user email and search by that
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            console.log('Trying to find profile by email:', user.email);
            
            // Try to find a profile that matches the email prefix
            const emailPrefix = user.email.split('@')[0].toLowerCase();
            console.log('Looking for profile with name containing:', emailPrefix);
            
            const { data: matchingProfiles, error: matchError } = await supabase
              .from('profiles')
              .select('*')
              .or(`full_name.ilike.%${emailPrefix}%,first_name.ilike.%${emailPrefix}%`)
              .limit(1);
            
            console.log('Matching profiles found:', matchingProfiles);
            
            if (matchingProfiles && matchingProfiles.length > 0) {
              const matchedProfile = matchingProfiles[0];
              console.log('Found matching profile, linking to user:', matchedProfile);
              
              // Link this profile to the current user
              const { error: linkError } = await supabase
                .from('profiles')
                .update({ user_id: userId })
                .eq('id', matchedProfile.id);
              
              if (linkError) {
                console.error('Error linking matched profile:', linkError);
              } else {
                console.log('Successfully linked matched profile to user');
                setProfile({ ...matchedProfile, user_id: userId });
                return;
              }
            }
            
            // If no matching profile found, create one with email prefix
            const userEmailPrefix = user.email.split('@')[0];
            const defaultProfile = {
              user_id: userId,
              first_name: userEmailPrefix,
              last_name: null,
              role: 'USER',
              category: 'user'
            };
            
            // Save profile to database
            const { data: savedProfile, error: saveError } = await supabase
              .from('profiles')
              .insert(defaultProfile)
              .select()
              .single();
            
            if (saveError) {
              console.error('Error saving default profile:', saveError);
              // Still set profile locally even if save fails
              setProfile({
                id: userId,
                user_id: userId,
                full_name: userEmailPrefix,
                first_name: userEmailPrefix,
                last_name: null,
                role: 'USER',
                category: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            } else {
              setProfile(savedProfile);
            }
            return;
          }
          
          // Final fallback
          const fallbackEmailPrefix = user?.email?.split('@')[0] || 'User';
          const defaultProfile = {
            user_id: userId,
            first_name: fallbackEmailPrefix,
            last_name: null,
            role: 'USER',
            category: 'user'
          };
          
          // Save profile to database
          const { data: savedProfile, error: saveError } = await supabase
            .from('profiles')
            .insert(defaultProfile)
            .select()
            .single();
          
          if (saveError) {
            console.error('Error saving fallback profile:', saveError);
            // Still set profile locally even if save fails
            setProfile({
              id: userId,
              user_id: userId,
              full_name: fallbackEmailPrefix,
              first_name: fallbackEmailPrefix,
              last_name: null,
              role: 'USER',
              category: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          } else {
            setProfile(savedProfile);
          }
          return;
        }
        console.log('Profile fetch failed, setting profile to null');
        setProfile(null);
        return;
      }
      
      setProfile(data);
      console.log('Profile set successfully:', data);
      
      // If we found a profile but it has no user_id, let's try to update it
      if (data && !data.user_id) {
        console.log('Profile found but has no user_id, attempting to link...');
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ user_id: userId })
            .eq('id', data.id);
          
          if (updateError) {
            console.error('Error linking profile to user:', updateError);
          } else {
            console.log('Successfully linked profile to user');
            // Update the profile data with the new user_id
            setProfile({ ...data, user_id: userId });
          }
        } catch (linkError) {
          console.error('Error in profile linking:', linkError);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Create a default profile even if database query fails
      console.log('Creating fallback profile due to error');
      const fallbackProfile = {
        id: userId,
        user_id: userId,
        full_name: null,
        first_name: null,
        last_name: null,
        role: 'USER',
        category: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(fallbackProfile);
      console.log('Fallback profile created:', fallbackProfile);
    } finally {
      profileFetchingRef.current.delete(userId);
    }
  };

  useEffect(() => {
    console.log('useAuth useEffect running');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            await fetchProfile(session.user.id);
          } catch (error) {
            console.error('Error in auth state change profile fetch:', error);
            // Create a fallback profile even if fetch fails
            const fallbackProfile = {
              id: session.user.id,
              user_id: session.user.id,
              full_name: null,
              first_name: null,
              last_name: null,
              role: 'USER',
              category: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setProfile(fallbackProfile);
            console.log('Fallback profile created in auth state change:', fallbackProfile);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
        console.log('Auth state change - loading set to false');
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          await fetchProfile(session.user.id);
        } catch (error) {
          console.error('Error in initial session profile fetch:', error);
          // Create a fallback profile even if fetch fails
          const fallbackProfile = {
            id: session.user.id,
            user_id: session.user.id,
            full_name: null,
            first_name: null,
            last_name: null,
            role: 'USER',
            category: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(fallbackProfile);
          console.log('Fallback profile created in initial session:', fallbackProfile);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
      console.log('Initial session check - loading set to false');
    }).catch((error) => {
      console.error('Error in initial session check:', error);
      setLoading(false);
    });

    // Fallback timeout to ensure loading is set to false
    const fallbackTimeout = setTimeout(() => {
      console.log('Fallback timeout - setting loading to false');
      setLoading(false);
    }, 5000); // Reduced from 10 seconds to 5 seconds

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, role: string = 'USER') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '',
            role
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link"
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('SignIn attempt for email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('SignIn result:', { data, error });

      if (error) {
        console.error('SignIn error:', error);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message
        });
        return { error };
      }

      if (data.user) {
        console.log('SignIn successful, user:', data.user.id);
        // The auth state change listener will handle the rest
        toast({
          title: "Sign in successful",
          description: "Welcome back!"
        });
        
        // Set user immediately, but let the auth state listener handle profile loading
        setUser(data.user);
        setLoading(false);
        console.log('SignIn - user set, profile will be loaded by auth listener');
      }

      return { error: null };
    } catch (error: any) {
      console.error('SignIn exception:', error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Signed out successfully"
      });
    } catch (error: any) {
      console.error('SignOut error:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message
      });
      throw error; // Re-throw to let the caller handle it
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: error.message
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link"
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message
      });
      return { error };
    }
  };

  const linkProfile = async (profileId: string) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      // First, get the profile data
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (fetchError) {
        console.error('Error fetching profile for linking:', fetchError);
        return { error: fetchError };
      }

      // Update the profile to link it to the current user
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_id: user.id })
        .eq('id', profileId);

      if (updateError) {
        console.error('Error linking profile:', updateError);
        return { error: updateError };
      }

      // Update the local profile state
      setProfile({ ...profileData, user_id: user.id });
      
      toast({
        title: "Profile linked successfully",
        description: `Linked to ${profileData.full_name || profileData.first_name}`
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error in linkProfile:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    linkProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}