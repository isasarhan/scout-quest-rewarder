import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Mock users for development
const MOCK_USERS = [
  {
    email: 'user@example.com',
    password: 'password123',
    name: 'Regular User',
    isAdmin: false
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    isAdmin: true
  }
];

// Check if we're using the mock environment
const IS_MOCK_ENV = import.meta.env.VITE_SUPABASE_URL === undefined || 
                   import.meta.env.VITE_SUPABASE_URL === 'https://your-supabase-project.supabase.co';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (IS_MOCK_ENV) {
      // In mock mode, just initialize with no session
      setLoading(false);
      return;
    }

    // For real Supabase connection
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user is admin
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user is admin
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('scouts')
        .select('is_admin')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        throw error;
      }
      
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Handle mock authentication in development
      if (IS_MOCK_ENV) {
        const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (!mockUser) {
          throw new Error('Invalid email or password');
        }
        
        // Create a mock user and session
        const mockUserObj = {
          id: `mock-${Date.now()}`,
          email: mockUser.email,
          user_metadata: { full_name: mockUser.name }
        } as unknown as User;
        
        setUser(mockUserObj);
        setIsAdmin(mockUser.isAdmin);
        
        toast({
          title: "Development Mode",
          description: `Signed in as ${mockUser.name} (${mockUser.isAdmin ? 'Admin' : 'User'})`,
        });
        
        setLoading(false);
        return;
      }
      
      // Real Supabase authentication
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Handle mock signup in development
      if (IS_MOCK_ENV) {
        // Check if user already exists
        if (MOCK_USERS.some(u => u.email === email)) {
          throw new Error('User already exists');
        }
        
        // Create a mock user
        const mockUserObj = {
          id: `mock-${Date.now()}`,
          email: email,
          user_metadata: { full_name: name }
        } as unknown as User;
        
        setUser(mockUserObj);
        setIsAdmin(false);
        
        toast({
          title: "Development Mode",
          description: `Created and signed in as ${name}`,
        });
        
        setLoading(false);
        return;
      }
      
      // Real Supabase signup
      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: name }
        }
      });
      
      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create scout profile in the scouts table
        const { error: profileError } = await supabase
          .from('scouts')
          .insert({
            user_id: authData.user.id,
            name,
            rank_id: 1,
            points: 0
          });

        if (profileError) {
          throw profileError;
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Handle mock signout in development
      if (IS_MOCK_ENV) {
        setUser(null);
        setIsAdmin(false);
        
        toast({
          title: "Development Mode",
          description: "You've been signed out",
        });
        
        setLoading(false);
        return;
      }
      
      // Real Supabase signout
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
