
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Award, User, Shield, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const { toast } = useToast();
  
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
  const { data: scouts, isLoading: loadingScouts } = useQuery({
    queryKey: ['scoutsList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scouts')
        .select(`
          id,
          name,
          points,
          user_id,
          rank:ranks(id, name, color)
        `)
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
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Analytics
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
              <CardHeader>
                <CardTitle>Scout Management</CardTitle>
                <CardDescription>
                  View and manage all registered scouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingScouts ? (
                  <div className="text-center py-8">Loading scouts...</div>
                ) : scouts && scouts.length > 0 ? (
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3">Name</th>
                          <th scope="col" className="px-6 py-3">Rank</th>
                          <th scope="col" className="px-6 py-3">Points</th>
                          <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scouts.map((scout: any) => (
                          <tr key={scout.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium">{scout.name}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className={`${scout.rank?.color} h-2 w-2 rounded-full mr-2`}></span>
                                {scout.rank?.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">{scout.points}</td>
                            <td className="px-6 py-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-scout-moss hover:text-scout-pine hover:bg-scout-pine/10"
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No scouts found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  View statistics and insights about scout achievements and progress
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-scout-moss mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    This section will provide detailed statistics and insights on scout achievements, 
                    progress, and engagement metrics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
