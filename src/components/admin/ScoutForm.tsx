
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ScoutFormProps {
  scout?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ScoutForm({ scout, onSuccess, onCancel }: ScoutFormProps) {
  const [name, setName] = useState(scout?.name || '');
  const [rankId, setRankId] = useState(scout?.rank_id?.toString() || '1');
  const [points, setPoints] = useState(scout?.points?.toString() || '0');
  const [isAdmin, setIsAdmin] = useState(scout?.is_admin || false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch ranks for dropdown
  const { data: ranks } = useQuery({
    queryKey: ['ranks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ranks')
        .select('*')
        .order('min_points');
        
      if (error) throw error;
      return data || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const scoutData = {
        name,
        rank_id: parseInt(rankId),
        points: parseInt(points),
        is_admin: isAdmin
      };
      
      if (scout) {
        // Update existing scout
        const { error } = await supabase
          .from('scouts')
          .update(scoutData)
          .eq('id', scout.id);
          
        if (error) throw error;
        
        toast({
          title: "Scout updated",
          description: `${name} has been updated successfully.`
        });
      } else {
        // Create new scout - need to generate userId for development mode
        const mockUserId = `mock-user-${Date.now()}`;
        
        const { error } = await supabase
          .from('scouts')
          .insert({
            ...scoutData,
            user_id: mockUserId
          });
          
        if (error) throw error;
        
        toast({
          title: "Scout created",
          description: `${name} has been added successfully.`
        });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{scout ? 'Edit Scout' : 'Add New Scout'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Scout name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="rank" className="text-sm font-medium">Rank</label>
            <Select
              value={rankId}
              onValueChange={setRankId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent>
                {ranks?.map((rank: any) => (
                  <SelectItem key={rank.id} value={rank.id.toString()}>
                    {rank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="points" className="text-sm font-medium">Points</label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="0"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-scout-pine focus:ring-scout-pine"
            />
            <label htmlFor="isAdmin" className="text-sm font-medium">Admin Access</label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-scout-pine hover:bg-scout-pine/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (scout ? 'Update Scout' : 'Add Scout')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
