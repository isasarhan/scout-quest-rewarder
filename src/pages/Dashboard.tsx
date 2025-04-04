
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Award, Sparkles, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-scout-pine/10 p-1.5 text-scout-pine">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [activeScouts, setActiveScouts] = useState(78);
  const [completedAchievements, setCompletedAchievements] = useState(352);
  const [pendingApprovals, setPendingApprovals] = useState(12);
  const [topScouts, setTopScouts] = useState([
    { id: 1, name: "Alex Johnson", points: 1250, achievements: 25 },
    { id: 2, name: "Maya Smith", points: 1120, achievements: 22 },
    { id: 3, name: "Ethan Davis", points: 980, achievements: 19 },
    { id: 4, name: "Sophia Brown", points: 845, achievements: 17 },
    { id: 5, name: "Noah Wilson", points: 790, achievements: 16 },
  ]);
  
  const [recentAchievements, setRecentAchievements] = useState([
    { id: 1, scout: "Alex Johnson", achievement: "First Aid Master", date: "2 days ago" },
    { id: 2, scout: "Maya Smith", achievement: "Environmental Stewardship", date: "3 days ago" },
    { id: 3, scout: "Ethan Davis", achievement: "Wilderness Survival", date: "5 days ago" },
    { id: 4, scout: "Sophia Brown", achievement: "Leadership Challenge", date: "1 week ago" },
    { id: 5, scout: "Noah Wilson", achievement: "Community Service", date: "1 week ago" },
  ]);

  // Check if user is admin, if not redirect
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin!</p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Admin Panel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Active Scouts" 
            value={activeScouts.toString()} 
            description="+5% from last month" 
            icon={<Users className="h-5 w-5" />} 
          />
          <StatCard 
            title="Completed Achievements" 
            value={completedAchievements.toString()} 
            description="+12% from last month" 
            icon={<Award className="h-5 w-5" />} 
          />
          <StatCard 
            title="Pending Approvals" 
            value={pendingApprovals.toString()} 
            description="Needs your attention" 
            icon={<Sparkles className="h-5 w-5" />} 
          />
          <StatCard 
            title="Average Points" 
            value="452" 
            description="Per active scout" 
            icon={<BarChart3 className="h-5 w-5" />} 
          />
        </div>

        <div className="grid gap-4 mt-8 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Scouts</CardTitle>
              <CardDescription>Scouts with highest points this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topScouts.map((scout) => (
                  <div key={scout.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-scout-pine h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
                        {scout.id}
                      </div>
                      <div>
                        <p className="font-medium">{scout.name}</p>
                        <p className="text-xs text-muted-foreground">{scout.achievements} achievements</p>
                      </div>
                    </div>
                    <div className="font-bold">{scout.points} pts</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/admin')}>
                View All Scouts
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Latest completed achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.achievement}</p>
                      <p className="text-xs text-muted-foreground">Completed by {item.scout}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/admin')}>
                View All Achievements
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
