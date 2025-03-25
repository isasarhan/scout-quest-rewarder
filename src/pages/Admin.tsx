
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Check, 
  X, 
  Award, 
  User, 
  Shield, 
  Sparkles, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import ScoutForm from '@/components/admin/ScoutForm';
import AchievementForm from '@/components/admin/AchievementForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for managing CRUD operations
  const [showScoutForm, setShowScoutForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [selectedScout, setSelectedScout] = useState<any>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  
  // Fetch pending achievement applications
  const { data: pendingAchievements, isLoading: loadingAchievements, refetch: refetchAchievements } = useQuery({
    queryKey: ['pendingAchievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scout_achievements')
        .select(`
          id,
          status,
          created_at,
          scout:scouts(id, name),
          achievement:achievements(id, name, description, points, category)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch all scouts
  const { data: scouts, isLoading: loadingScouts, refetch: refetchScouts } = useQuery({
    queryKey: ['scoutsList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scouts')
        .select(`
          id,
          name,
          points,
          user_id,
          is_admin,
          rank:ranks(id, name, color)
        `)
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch all achievements
  const { data: achievements, isLoading: loadingAllAchievements, refetch: refetchAllAchievements } = useQuery({
    queryKey: ['achievementsList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('category')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });
  
  // Approve an achievement application
  const handleApprove = async (id: string, points: number, scoutId: string) => {
    try {
      // Update the achievement status
      const { error: updateError } = await supabase
        .from('scout_achievements')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Add points to the scout
      const { error: pointsError } = await supabase
        .from('scouts')
        .update({ 
          points: supabase.rpc('increment_points', { row_id: scoutId, points_to_add: points })
        })
        .eq('id', scoutId);
        
      if (pointsError) throw pointsError;
      
      // Refresh the data
      refetchAchievements();
      refetchScouts();
      
      toast({
        title: "Achievement approved",
        description: `The achievement has been approved and points awarded.`,
      });
    } catch (error: any) {
      toast({
        title: "Error approving achievement",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Reject an achievement application
  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scout_achievements')
        .update({ status: 'rejected' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh the data
      refetchAchievements();
      
      toast({
        title: "Achievement rejected",
        description: "The achievement application has been rejected.",
      });
    } catch (error: any) {
      toast({
        title: "Error rejecting achievement",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Delete a scout
  const handleDeleteScout = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scouts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      refetchScouts();
      
      toast({
        title: "Scout deleted",
        description: "The scout has been removed from the system.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting scout",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Delete an achievement
  const handleDeleteAchievement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      refetchAllAchievements();
      
      toast({
        title: "Achievement deleted",
        description: "The achievement has been removed from the system.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting achievement",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Handle form success
  const handleFormSuccess = () => {
    setShowScoutForm(false);
    setShowAchievementForm(false);
    setSelectedScout(null);
    setSelectedAchievement(null);
    refetchScouts();
    refetchAllAchievements();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage scouts, achievements, and rewards</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-scout-pine" />
            <span className="font-medium text-scout-pine">Admin Panel</span>
          </div>
        </div>
        
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievement Applications
            </TabsTrigger>
            <TabsTrigger value="scouts" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Scout Management
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievement Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Pending Achievement Applications</CardTitle>
                <CardDescription>
                  Review and approve/reject achievement applications from scouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAchievements ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : pendingAchievements && pendingAchievements.length > 0 ? (
                  <div className="space-y-4">
                    {pendingAchievements.map((item: any) => (
                      <div key={item.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.scout?.name}</span>
                            <span className="text-muted-foreground">applied for</span>
                            <span className="font-medium">{item.achievement?.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.achievement?.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs bg-scout-moss/10 text-scout-moss px-2 py-1 rounded-full">
                              {item.achievement?.category}
                            </span>
                            <span className="text-xs font-medium">
                              {item.achievement?.points} points
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleReject(item.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            className="text-white bg-scout-pine hover:bg-scout-pine/90"
                            onClick={() => handleApprove(item.id, item.achievement?.points, item.scout?.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending achievement applications
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scouts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Scout Management</CardTitle>
                  <CardDescription>
                    View and manage all registered scouts
                  </CardDescription>
                </div>
                <Dialog open={showScoutForm} onOpenChange={setShowScoutForm}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setSelectedScout(null);
                        setShowScoutForm(true);
                      }}
                      className="bg-scout-pine hover:bg-scout-pine/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Scout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <ScoutForm 
                      scout={selectedScout}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setShowScoutForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loadingScouts ? (
                  <div className="text-center py-8">Loading scouts...</div>
                ) : scouts && scouts.length > 0 ? (
                  <div className="relative overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Rank</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Admin</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scouts.map((scout: any) => (
                          <TableRow key={scout.id}>
                            <TableCell className="font-medium">{scout.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className={`${scout.rank?.color} h-2 w-2 rounded-full mr-2`}></span>
                                {scout.rank?.name}
                              </div>
                            </TableCell>
                            <TableCell>{scout.points}</TableCell>
                            <TableCell>
                              {scout.is_admin ? (
                                <Badge className="bg-scout-pine">Admin</Badge>
                              ) : (
                                <Badge variant="outline">User</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => {
                                        e.preventDefault();
                                        setSelectedScout(scout);
                                        setShowScoutForm(true);
                                      }}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <ScoutForm 
                                        scout={selectedScout}
                                        onSuccess={handleFormSuccess}
                                        onCancel={() => setShowScoutForm(false)}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete the scout and all associated achievement records.
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-500 hover:bg-red-600 text-white"
                                          onClick={() => handleDeleteScout(scout.id)}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No scouts found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Achievement Management</CardTitle>
                  <CardDescription>
                    Create and manage achievement badges that scouts can earn
                  </CardDescription>
                </div>
                <Dialog open={showAchievementForm} onOpenChange={setShowAchievementForm}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setSelectedAchievement(null);
                        setShowAchievementForm(true);
                      }}
                      className="bg-scout-pine hover:bg-scout-pine/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Achievement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <AchievementForm 
                      achievement={selectedAchievement}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setShowAchievementForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loadingAllAchievements ? (
                  <div className="text-center py-8">Loading achievements...</div>
                ) : achievements && achievements.length > 0 ? (
                  <div className="relative overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {achievements.map((achievement: any) => (
                          <TableRow key={achievement.id}>
                            <TableCell className="font-medium">{achievement.name}</TableCell>
                            <TableCell>
                              <span className="text-xs bg-scout-moss/10 text-scout-moss px-2 py-1 rounded-full">
                                {achievement.category}
                              </span>
                            </TableCell>
                            <TableCell>{achievement.points}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => {
                                        e.preventDefault();
                                        setSelectedAchievement(achievement);
                                        setShowAchievementForm(true);
                                      }}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <AchievementForm 
                                        achievement={selectedAchievement}
                                        onSuccess={handleFormSuccess}
                                        onCancel={() => setShowAchievementForm(false)}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete this achievement.
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-500 hover:bg-red-600 text-white"
                                          onClick={() => handleDeleteAchievement(achievement.id)}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No achievements found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
