
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface AchievementFormProps {
  achievement?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AchievementForm({ achievement, onSuccess, onCancel }: AchievementFormProps) {
  const [name, setName] = useState(achievement?.name || '');
  const [description, setDescription] = useState(achievement?.description || '');
  const [category, setCategory] = useState(achievement?.category || '');
  const [points, setPoints] = useState(achievement?.points?.toString() || '10');
  const [requirements, setRequirements] = useState(achievement?.requirements || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const achievementData = {
        name,
        description,
        category,
        points: parseInt(points),
        requirements,
        badge_image: achievement?.badge_image || ''
      };
      
      if (achievement) {
        // Update existing achievement
        const { error } = await supabase
          .from('achievements')
          .update(achievementData)
          .eq('id', achievement.id);
          
        if (error) throw error;
        
        toast({
          title: "Achievement updated",
          description: `${name} has been updated successfully.`
        });
      } else {
        // Create new achievement
        const { error } = await supabase
          .from('achievements')
          .insert(achievementData);
          
        if (error) throw error;
        
        toast({
          title: "Achievement created",
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
        <CardTitle>{achievement ? 'Edit Achievement' : 'Add New Achievement'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Achievement name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Achievement description"
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Outdoor, Leadership, Citizenship"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="points" className="text-sm font-medium">Points</label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="requirements" className="text-sm font-medium">Requirements</label>
            <Textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="What needs to be done to earn this achievement"
              required
              rows={4}
            />
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
            {isLoading ? 'Saving...' : (achievement ? 'Update Achievement' : 'Add Achievement')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
