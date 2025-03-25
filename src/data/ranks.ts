
export interface Rank {
  id: number;
  name: string;
  color: string;
  minPoints: number;
  image: string;
  description: string;
}

export const ranks: Rank[] = [
  {
    id: 1,
    name: "Scout",
    color: "bg-scout-sky",
    minPoints: 0,
    image: "/placeholder.svg",
    description: "The beginning of your journey. Learn the basic skills and values of scouting."
  },
  {
    id: 2,
    name: "Pathfinder",
    color: "bg-scout-moss",
    minPoints: 100,
    image: "/placeholder.svg",
    description: "You've mastered the basics and are ready to explore more advanced skills."
  },
  {
    id: 3,
    name: "Adventurer",
    color: "bg-scout-earth",
    minPoints: 250,
    image: "/placeholder.svg",
    description: "An experienced scout who has demonstrated proficiency in multiple skill areas."
  },
  {
    id: 4,
    name: "Ranger",
    color: "bg-scout-sunset",
    minPoints: 500,
    image: "/placeholder.svg",
    description: "A highly skilled scout who can lead others and tackle complex challenges."
  },
  {
    id: 5,
    name: "Eagle",
    color: "bg-scout-ruby",
    minPoints: 1000,
    image: "/placeholder.svg",
    description: "The highest rank. You embody the values and skills of scouting at their finest."
  }
];

export const getCurrentRank = (points: number): Rank => {
  // Find the highest rank that the points qualify for
  const currentRank = [...ranks]
    .reverse()
    .find(rank => points >= rank.minPoints);
  
  return currentRank || ranks[0];
};

export const getNextRank = (points: number): Rank | null => {
  // Find the next rank that the points don't yet qualify for
  const nextRank = ranks
    .find(rank => points < rank.minPoints);
  
  return nextRank || null;
};

export const calculateProgress = (points: number): number => {
  const currentRank = getCurrentRank(points);
  const nextRank = getNextRank(points);
  
  if (!nextRank) return 100; // At max rank
  
  const pointsInCurrentLevel = points - currentRank.minPoints;
  const pointsNeededForNextLevel = nextRank.minPoints - currentRank.minPoints;
  
  return Math.min(100, Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100));
};
