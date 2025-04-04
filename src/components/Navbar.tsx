
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Award, User, Home, Compass, LogOut, Shield, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/use-supabase';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scoutData, setScoutData] = useState<any>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut, isAdmin } = useAuth();
  const { getScoutProfile } = useSupabase();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadScoutData = async () => {
      if (user) {
        const profile = await getScoutProfile();
        if (profile) {
          setScoutData(profile);
        }
      }
    };

    loadScoutData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });
      navigate('/sign-in');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Basic nav items for all users
  const navItems = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/achievements', name: 'Achievements', icon: Compass },
    { path: '/rewards', name: 'Rewards', icon: Award },
    { path: '/profile', name: 'Profile', icon: User },
  ];
  
  // Add admin link if user is admin
  if (isAdmin) {
    navItems.push({ path: '/admin', name: 'Admin', icon: Shield });
  }

  const userRank = scoutData?.rank || { name: 'Scout', color: 'bg-scout-sky' };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center space-x-2">
              <span className="bg-scout-pine text-white p-2 rounded-lg">
                <Award className="h-6 w-6" />
              </span>
              <span className="text-xl font-bold tracking-tight">Scout Quest</span>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center space-x-1 font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'text-scout-pine' 
                    : 'text-gray-700 hover:text-scout-pine dark:text-gray-200 dark:hover:text-scout-moss'
                }`}
                onClick={closeMenu}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {user && scoutData && (
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`${userRank.color} h-2 w-2 rounded-full animate-pulse`}></span>
                <span className="text-sm font-medium">{userRank.name}</span>
                <span className="text-sm text-muted-foreground">{scoutData.points} pts</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/achievements" className="cursor-pointer">
                      <Award className="h-4 w-4 mr-2" />
                      Achievements
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-white dark:bg-gray-900 shadow-lg rounded-b-lg overflow-hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-scout-pine text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={closeMenu}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {user && scoutData && (
              <>
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className={`${userRank.color} h-2 w-2 rounded-full animate-pulse`}></span>
                    <span className="text-sm font-medium">{userRank.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{scoutData.points} pts</span>
                </div>

                <button
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium w-full text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
