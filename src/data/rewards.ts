
export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  image: string;
  unlocked: boolean;
}

export const rewards: Reward[] = [
  {
    id: "bronze-pin",
    name: "Bronze Scout Pin",
    description: "Awarded to scouts who have earned 50 achievement points. A symbol of dedication to the scouting path.",
    pointsRequired: 50,
    image: "/placeholder.svg",
    unlocked: true
  },
  {
    id: "silver-pin",
    name: "Silver Scout Pin",
    description: "Awarded to scouts who have earned 150 achievement points. A mark of growing expertise in scouting skills.",
    pointsRequired: 150,
    image: "/placeholder.svg",
    unlocked: true
  },
  {
    id: "gold-pin",
    name: "Gold Scout Pin",
    description: "Awarded to scouts who have earned 300 achievement points. Represents significant accomplishment in the scouting program.",
    pointsRequired: 300,
    image: "/placeholder.svg",
    unlocked: false
  },
  {
    id: "bronze-medal",
    name: "Bronze Medal of Achievement",
    description: "A prestigious award for scouts who have earned 500 achievement points. Signifies exceptional dedication to scouting ideals.",
    pointsRequired: 500,
    image: "/placeholder.svg",
    unlocked: false
  },
  {
    id: "silver-medal",
    name: "Silver Medal of Achievement",
    description: "A rare honor bestowed upon scouts who have earned 750 achievement points. Demonstrates remarkable commitment and skill.",
    pointsRequired: 750,
    image: "/placeholder.svg",
    unlocked: false
  },
  {
    id: "gold-medal",
    name: "Gold Medal of Achievement",
    description: "The pinnacle achievement for scouts who have earned 1000 achievement points. Reserved for those who exemplify scouting at its finest.",
    pointsRequired: 1000,
    image: "/placeholder.svg",
    unlocked: false
  },
  {
    id: "ultimate-award",
    name: "Ultimate Scout Award",
    description: "The rarest and most prestigious recognition, awarded to scouts who have earned 1500 achievement points. A testament to extraordinary dedication and mastery of scouting skills.",
    pointsRequired: 1500,
    image: "/placeholder.svg",
    unlocked: false
  }
];

export const getUnlockedRewards = (points: number): Reward[] => {
  return rewards.map(reward => ({
    ...reward,
    unlocked: points >= reward.pointsRequired
  }));
};

export const getNextReward = (points: number): Reward | null => {
  const nextReward = rewards
    .filter(reward => points < reward.pointsRequired)
    .sort((a, b) => a.pointsRequired - b.pointsRequired)[0];
  
  return nextReward || null;
};

export const calculateRewardProgress = (points: number, reward: Reward): number => {
  // Find the previous reward threshold
  const previousReward = [...rewards]
    .sort((a, b) => b.pointsRequired - a.pointsRequired)
    .find(r => r.pointsRequired < reward.pointsRequired);
  
  const previousThreshold = previousReward ? previousReward.pointsRequired : 0;
  const pointsNeeded = reward.pointsRequired - previousThreshold;
  const pointsEarned = Math.max(0, points - previousThreshold);
  
  return Math.min(100, Math.round((pointsEarned / pointsNeeded) * 100));
};
