
import { useState } from 'react';
import { supabase, Database } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Type for scout with related data
export interface ScoutWithData {
  id: string;
  name: string;
  rank_id: number;
  points: number;
  rank: Database['public']['Tables']['ranks']['Row'];
  achievements?: Database['public']['Tables']['scout_achievements']['Row'][];
}

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch the current scout's data including rank
  const getScoutProfile = async (): Promise<ScoutWithData | null> => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('scouts')
        .select(`
          *,
          rank:ranks(*)
        `)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      return data as unknown as ScoutWithData;
    } catch (error: any) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all achievements
  const getAchievements = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('category');
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error fetching achievements",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch scout's achievements
  const getScoutAchievements = async (scoutId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('scout_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('scout_id', scoutId);
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error fetching scout achievements",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Apply for an achievement
  const applyForAchievement = async (achievementId: string) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      
      // First get the scout's ID
      const { data: scoutData, error: scoutError } = await supabase
        .from('scouts')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (scoutError) throw scoutError;
      
      // Then create the application
      const { error } = await supabase
        .from('scout_achievements')
        .insert({
          scout_id: scoutData.id,
          achievement_id: achievementId,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your achievement application has been submitted for review",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error applying for achievement",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all rewards
  const getRewards = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('points_required');
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error fetching rewards",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get rewards with unlocked status based on scout's points
  const getScoutRewards = async () => {
    if (!user) return [];
    
    try {
      setLoading(true);
      
      // First get the scout's points
      const { data: scoutData, error: scoutError } = await supabase
        .from('scouts')
        .select('points')
        .eq('user_id', user.id)
        .single();
      
      if (scoutError) throw scoutError;
      
      // Then get all rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .order('points_required');
      
      if (rewardsError) throw rewardsError;
      
      // Add unlocked status
      return rewardsData.map(reward => ({
        ...reward,
        unlocked: scoutData.points >= reward.points_required
      }));
    } catch (error: any) {
      toast({
        title: "Error fetching rewards",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getScoutProfile,
    getAchievements,
    getScoutAchievements,
    applyForAchievement,
    getRewards,
    getScoutRewards,
  };
};
