
import { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useSupabase } from '@/hooks/use-supabase';
import { useAuth } from '@/contexts/AuthContext';
import ScoutForm from '@/components/admin/ScoutForm';
import AchievementForm from '@/components/admin/AchievementForm';
import Navbar from '@/components/Navbar';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('scouts');
  const [searchTerm, setSearchTerm] = useState('');
  const [scouts, setScouts] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [selectedScout, setSelectedScout] = useState<any>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [isScoutFormOpen, setIsScoutFormOpen] = useState(false);
  const [isAchievementFormOpen, setIsAchievementFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string | null }>({ type: '', id: null });
  const { loading, getAllScoutProfiles, getAllAchievements, deleteScoutProfile, deleteAchievement } = useSupabase();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadScoutData();
      loadAchievementData();
    }
  }, [isAdmin]);

  const loadScoutData = async () => {
    const allScouts = await getAllScoutProfiles();
    setScouts(allScouts);
  };

  const loadAchievementData = async () => {
    const allAchievements = await getAllAchievements();
    setAchievements(allAchievements);
  };

  const filteredScouts = scouts.filter(scout =>
    scout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scout.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAchievements = achievements.filter(achievement =>
    achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditScout = (scout: any) => {
    setSelectedScout(scout);
    setIsScoutFormOpen(true);
  };

  const handleEditAchievement = (achievement: any) => {
    setSelectedAchievement(achievement);
    setIsAchievementFormOpen(true);
  };

  const handleDeleteConfirmation = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setIsDeleteConfirmationOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete.id) return;

    try {
      if (itemToDelete.type === 'scout') {
        await deleteScoutProfile(itemToDelete.id);
        setScouts(scouts.filter(scout => scout.id !== itemToDelete.id));
        toast({
          title: "Scout deleted",
          description: "Scout profile has been deleted successfully."
        });
      } else if (itemToDelete.type === 'achievement') {
        await deleteAchievement(itemToDelete.id);
        setAchievements(achievements.filter(achievement => achievement.id !== itemToDelete.id));
        toast({
          title: "Achievement deleted",
          description: "Achievement has been deleted successfully."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleteConfirmationOpen(false);
      setItemToDelete({ type: '', id: null });
    }
  };

  const handleScoutFormSuccess = () => {
    setIsScoutFormOpen(false);
    setSelectedScout(null);
    loadScoutData();
  };

  const handleAchievementFormSuccess = () => {
    setIsAchievementFormOpen(false);
    setSelectedAchievement(null);
    loadAchievementData();
  };

  const handleCancelForm = () => {
    setIsScoutFormOpen(false);
    setIsAchievementFormOpen(false);
    setSelectedScout(null);
    setSelectedAchievement(null);
  };

  if (!isAdmin) {
    return <div className="h-screen flex items-center justify-center">You are not authorized to view this page.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="scouts">Scouts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="scouts">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
              <Input
                type="text"
                placeholder="Search scouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md md:w-auto mb-2 md:mb-0"
              />
              <Button onClick={() => setIsScoutFormOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Scout
              </Button>
            </div>

            {filteredScouts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScouts.map(scout => (
                  <Card key={scout.id} className="bg-white dark:bg-gray-800 shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">{scout.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">Email: {scout.email}</p>
                      <p className="text-gray-600 dark:text-gray-400">Rank: <Badge>{scout.rank?.name || 'Scout'}</Badge></p>
                      <p className="text-gray-600 dark:text-gray-400">Points: {scout.points}</p>
                    </CardContent>
                    <Separator />
                    <div className="flex justify-end p-2 space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditScout(scout)}
                        className="text-blue-500 hover:bg-blue-500 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteConfirmation('scout', scout.id)}
                        className="text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No scouts found.</div>
            )}
          </TabsContent>

          <TabsContent value="achievements">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
              <Input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md md:w-auto mb-2 md:mb-0"
              />
              <Button onClick={() => setIsAchievementFormOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            </div>

            {filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map(achievement => (
                  <Card key={achievement.id} className="bg-white dark:bg-gray-800 shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">{achievement.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">Category: {achievement.category}</p>
                      <p className="text-gray-600 dark:text-gray-400">Points: {achievement.points}</p>
                      <p className="text-gray-600 dark:text-gray-400">Description: {achievement.description}</p>
                    </CardContent>
                    <Separator />
                    <div className="flex justify-end p-2 space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditAchievement(achievement)}
                        className="text-blue-500 hover:bg-blue-500 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteConfirmation('achievement', achievement.id)}
                        className="text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No achievements found.</div>
            )}
          </TabsContent>
        </Tabs>

        {/* Scout Form Modal */}
        {isScoutFormOpen && (
          <ScoutForm
            scout={selectedScout}
            onSuccess={handleScoutFormSuccess}
            onCancel={handleCancelForm}
          />
        )}

        {/* Achievement Form Modal */}
        {isAchievementFormOpen && (
          <AchievementForm
            achievement={selectedAchievement}
            onSuccess={handleAchievementFormSuccess}
            onCancel={handleCancelForm}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to delete this {itemToDelete.type}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteConfirmationOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;
