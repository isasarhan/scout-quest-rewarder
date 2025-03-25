
import { Progress } from "@/components/ui/progress";
import { getNextReward, calculateRewardProgress } from "@/data/rewards";
import { getCurrentRank, getNextRank, calculateProgress } from "@/data/ranks";
import RankBadge from "./RankBadge";
import { ArrowRight } from "lucide-react";

interface MilestoneTrackerProps {
  points: number;
}

const MilestoneTracker = ({ points }: MilestoneTrackerProps) => {
  const currentRank = getCurrentRank(points);
  const nextRank = getNextRank(points);
  const nextReward = getNextReward(points);
  
  const rankProgress = calculateProgress(points);
  const rewardProgress = nextReward ? calculateRewardProgress(points, nextReward) : 100;
  
  return (
    <div className="space-y-8 p-6 glass-card rounded-xl animate-fade-in">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Rank Progress</h3>
        <div className="flex items-center justify-between">
          <RankBadge rank={currentRank} size="sm" />
          
          {nextRank && (
            <>
              <div className="flex-1 px-4">
                <Progress value={rankProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{points} points</span>
                  <span>{nextRank.minPoints} points</span>
                </div>
              </div>
              <RankBadge rank={nextRank} size="sm" />
            </>
          )}
          
          {!nextRank && (
            <div className="flex-1 px-4 flex items-center justify-center">
              <span className="text-sm font-medium text-scout-pine">Maximum Rank Achieved!</span>
            </div>
          )}
        </div>
      </div>
      
      {nextReward && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Next Reward</h3>
          <div className="flex items-center gap-4">
            <div className="min-w-16 h-16 bg-gradient-to-tr from-scout-moss to-scout-pine rounded-lg flex items-center justify-center">
              <img 
                src={nextReward.image} 
                alt={nextReward.name} 
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{nextReward.name}</h4>
              <Progress value={rewardProgress} className="h-2 mt-2 bg-gray-200 dark:bg-gray-700" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{points} points</span>
                <span>{nextReward.pointsRequired} points</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!nextReward && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Rewards</h3>
          <div className="flex items-center justify-center bg-gradient-to-r from-scout-moss to-scout-pine text-white p-4 rounded-lg">
            <span className="font-medium">All rewards unlocked! Congratulations!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;
