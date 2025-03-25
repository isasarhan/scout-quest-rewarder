
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Achievement, 
  achievements, 
  achievementCategories,
  getCompletedAchievements,
  getPendingAchievements,
  getAvailableAchievements
} from '@/data/achievements';
import { Search, Filter, Check, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AnimatedTransition from '@/components/AnimatedTransition';
import AchievementCard from '@/components/AchievementCard';
import Navbar from '@/components/Navbar';

const Achievements = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [levelFilter, setLevelFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('available');
  
  const [completedList, setCompletedList] = useState<Achievement[]>(getCompletedAchievements());
  const [pendingList, setPendingList] = useState<Achievement[]>(getPendingAchievements());
  const [availableList, setAvailableList] = useState<Achievement[]>(getAvailableAchievements());
  
  useEffect(() => {
    // Update URL when category filter changes (but not on initial load)
    if (categoryFilter !== initialCategory) {
      if (categoryFilter === 'all') {
        navigate('/achievements');
      } else {
        navigate(`/achievements?category=${categoryFilter}`);
      }
    }
  }, [categoryFilter, navigate, initialCategory]);
  
  const handleApplyForAchievement = (achievement: Achievement) => {
    // In a real app, this would send a request to the server
    // For demo purposes, we'll just move the achievement to the pending list
    setPendingList([...pendingList, achievement]);
    setAvailableList(availableList.filter(a => a.id !== achievement.id));
    
    toast({
      title: "Application Submitted",
      description: `You've applied for the ${achievement.name} achievement.`,
    });
  };
  
  // Filter achievements based on search, category, and level
  const filterAchievements = (achievementList: Achievement[]) => {
    return achievementList.filter(achievement => {
      const matchesSearch = 
        achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === 'all' || achievement.categoryId === categoryFilter;
      
      const matchesLevel = 
        levelFilter === 'all' || achievement.level === levelFilter;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  };
  
  const filteredCompleted = filterAchievements(completedList);
  const filteredPending = filterAchievements(pendingList);
  const filteredAvailable = filterAchievements(availableList);
  
  const getCategoryName = (categoryId: string) => {
    const category = achievementCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Achievement Catalog</h1>
            <p className="text-muted-foreground">
              Browse, apply for, and track your achievements
            </p>
          </div>
          
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search achievements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {achievementCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="min-w-36">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchTerm || categoryFilter !== 'all' || levelFilter !== 'all') && (
              <div className="flex gap-2 flex-wrap">
                {searchTerm && (
                  <Badge variant="secondary" className="flex gap-1 items-center">
                    Search: {searchTerm}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
                
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="flex gap-1 items-center">
                    Category: {getCategoryName(categoryFilter)}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setCategoryFilter('all')}
                    />
                  </Badge>
                )}
                
                {levelFilter !== 'all' && (
                  <Badge variant="secondary" className="flex gap-1 items-center">
                    Level: {levelFilter.charAt(0).toUpperCase() + levelFilter.slice(1)}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setLevelFilter('all')}
                    />
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setLevelFilter('all');
                  }}
                  className="h-6 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 w-full max-w-md mx-auto">
              <TabsTrigger value="available" className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-6 w-6 p-1 flex items-center justify-center rounded-full">
                    {filteredAvailable.length}
                  </Badge>
                  Available
                </div>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-6 w-6 p-1 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    {filteredPending.length}
                  </Badge>
                  Pending
                </div>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-6 w-6 p-1 flex items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {filteredCompleted.length}
                  </Badge>
                  Completed
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="space-y-8 animate-fade-in">
              {filteredAvailable.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-muted w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No achievements found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all'
                      ? "Try adjusting your filters to see more achievements."
                      : "You've applied for all available achievements!"}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailable.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onApply={() => handleApplyForAchievement(achievement)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-8 animate-fade-in">
              {filteredPending.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-muted w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No pending achievements</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all'
                      ? "Try adjusting your filters to see more achievements."
                      : "You don't have any achievements pending approval."}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPending.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isPending={true}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-8 animate-fade-in">
              {filteredCompleted.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-muted w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No completed achievements</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all'
                      ? "Try adjusting your filters to see more achievements."
                      : "You haven't completed any achievements yet."}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompleted.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isCompleted={true}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Achievements;
