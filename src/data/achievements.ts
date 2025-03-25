
export interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  categoryId: string;
  requirements: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  image?: string;
}

export const achievementCategories: AchievementCategory[] = [
  {
    id: "outdoor",
    name: "Outdoor Skills",
    description: "Develop skills for outdoor living, survival, and appreciation of nature.",
    color: "bg-scout-pine"
  },
  {
    id: "citizenship",
    name: "Citizenship",
    description: "Learn about your community, country, and role as a responsible citizen.",
    color: "bg-scout-sky"
  },
  {
    id: "personal-development",
    name: "Personal Development",
    description: "Focus on personal growth, leadership, and character building.",
    color: "bg-scout-sunset"
  },
  {
    id: "stem",
    name: "STEM",
    description: "Explore science, technology, engineering, and mathematics.",
    color: "bg-scout-moss"
  },
  {
    id: "emergency",
    name: "Emergency Preparedness",
    description: "Learn critical skills for handling emergencies and providing assistance.",
    color: "bg-scout-ruby"
  }
];

export const achievements: Achievement[] = [
  // Outdoor Skills
  {
    id: "fire-building",
    name: "Fire Building",
    description: "Learn to safely build, maintain, and extinguish a campfire.",
    points: 25,
    categoryId: "outdoor",
    requirements: [
      "Demonstrate knowledge of fire safety rules",
      "Successfully build and light a fire using only natural materials",
      "Properly maintain a fire for cooking",
      "Safely extinguish a fire and leave no trace"
    ],
    level: "beginner",
    image: "/placeholder.svg"
  },
  {
    id: "wilderness-survival",
    name: "Wilderness Survival",
    description: "Master the essential skills needed to survive in the wilderness.",
    points: 75,
    categoryId: "outdoor",
    requirements: [
      "Build an emergency shelter using natural materials",
      "Identify 5 edible plants in your region",
      "Demonstrate three methods of water purification",
      "Create and follow an emergency action plan"
    ],
    level: "advanced",
    image: "/placeholder.svg"
  },
  
  // Citizenship
  {
    id: "community-service",
    name: "Community Service",
    description: "Contribute meaningful service to improve your community.",
    points: 50,
    categoryId: "citizenship",
    requirements: [
      "Complete 10 hours of community service",
      "Identify a community need and develop a plan to address it",
      "Recruit at least two peers to join your service effort",
      "Document and reflect on your service experience"
    ],
    level: "intermediate",
    image: "/placeholder.svg"
  },
  {
    id: "civic-awareness",
    name: "Civic Awareness",
    description: "Understand how government works and the responsibilities of citizenship.",
    points: 30,
    categoryId: "citizenship",
    requirements: [
      "Explain the structure of your local government",
      "Attend a civic meeting or event",
      "Interview an elected official",
      "Create a presentation on a current civic issue"
    ],
    level: "beginner",
    image: "/placeholder.svg"
  },
  
  // Personal Development
  {
    id: "leadership",
    name: "Leadership",
    description: "Develop and demonstrate effective leadership skills.",
    points: 60,
    categoryId: "personal-development",
    requirements: [
      "Serve in a leadership role for at least 3 months",
      "Plan and lead a group activity or project",
      "Mentor a younger scout",
      "Create a personal leadership development plan"
    ],
    level: "intermediate",
    image: "/placeholder.svg"
  },
  {
    id: "public-speaking",
    name: "Public Speaking",
    description: "Learn to communicate effectively in front of groups.",
    points: 40,
    categoryId: "personal-development",
    requirements: [
      "Prepare and deliver a 5-minute speech on a scouting topic",
      "Lead a skill demonstration for your troop",
      "Create and present a visual presentation",
      "Give an impromptu speech on an assigned topic"
    ],
    level: "intermediate",
    image: "/placeholder.svg"
  },
  
  // STEM
  {
    id: "robotics",
    name: "Robotics",
    description: "Explore the world of robotics through hands-on projects.",
    points: 45,
    categoryId: "stem",
    requirements: [
      "Build a simple robot that can complete a basic task",
      "Program a robot to navigate an obstacle course",
      "Explain the components and principles of your robot",
      "Demonstrate your robot to your troop"
    ],
    level: "advanced",
    image: "/placeholder.svg"
  },
  {
    id: "environmental-science",
    name: "Environmental Science",
    description: "Study ecosystems and learn about environmental conservation.",
    points: 35,
    categoryId: "stem",
    requirements: [
      "Conduct an environmental impact study of a local area",
      "Monitor a specific environmental factor over two weeks",
      "Participate in an environmental conservation project",
      "Create a presentation on an environmental issue"
    ],
    level: "intermediate",
    image: "/placeholder.svg"
  },
  
  // Emergency Preparedness
  {
    id: "first-aid",
    name: "First Aid",
    description: "Learn essential first aid skills to help in emergency situations.",
    points: 55,
    categoryId: "emergency",
    requirements: [
      "Demonstrate proper treatment for common injuries",
      "Create a comprehensive first aid kit",
      "Role-play emergency response scenarios",
      "Earn CPR certification"
    ],
    level: "intermediate",
    image: "/placeholder.svg"
  },
  {
    id: "emergency-planning",
    name: "Emergency Planning",
    description: "Develop comprehensive plans for various emergency situations.",
    points: 40,
    categoryId: "emergency",
    requirements: [
      "Create emergency plans for home, school, and outdoor activities",
      "Build an emergency supplies kit",
      "Demonstrate knowledge of natural disaster preparedness",
      "Lead an emergency drill with your troop"
    ],
    level: "beginner",
    image: "/placeholder.svg"
  }
];

export const getAchievementsByCategory = (categoryId: string): Achievement[] => {
  return achievements.filter(achievement => achievement.categoryId === categoryId);
};

export const getMilestones = (): { points: number, reward: string }[] => {
  return [
    { points: 50, reward: "Bronze Scout Pin" },
    { points: 150, reward: "Silver Scout Pin" },
    { points: 300, reward: "Gold Scout Pin" },
    { points: 500, reward: "Bronze Medal of Achievement" },
    { points: 750, reward: "Silver Medal of Achievement" },
    { points: 1000, reward: "Gold Medal of Achievement" },
    { points: 1500, reward: "Ultimate Scout Award" }
  ];
};

// Mock user data for demo purposes
export interface UserAchievement {
  achievementId: string;
  dateCompleted: string;
  approved: boolean;
  approvedBy?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  rank: number;
  points: number;
  joinDate: string;
  achievements: UserAchievement[];
  avatar?: string;
}

export const currentUser: UserProfile = {
  id: "user1",
  name: "Alex Johnson",
  rank: 2,
  points: 215,
  joinDate: "2023-01-15",
  achievements: [
    {
      achievementId: "fire-building",
      dateCompleted: "2023-02-10",
      approved: true,
      approvedBy: "Scoutmaster Williams"
    },
    {
      achievementId: "civic-awareness",
      dateCompleted: "2023-03-22",
      approved: true,
      approvedBy: "Scoutmaster Williams"
    },
    {
      achievementId: "emergency-planning",
      dateCompleted: "2023-05-15",
      approved: true,
      approvedBy: "Scoutmaster Williams"
    },
    {
      achievementId: "leadership",
      dateCompleted: "2023-07-08",
      approved: true,
      approvedBy: "Scoutmaster Rodriguez"
    },
    {
      achievementId: "first-aid",
      dateCompleted: "2023-09-14",
      approved: true,
      approvedBy: "Scoutmaster Williams"
    }
  ],
  avatar: "/placeholder.svg"
};

export const getCompletedAchievements = (): Achievement[] => {
  const completedIds = currentUser.achievements
    .filter(ua => ua.approved)
    .map(ua => ua.achievementId);
  
  return achievements.filter(achievement => completedIds.includes(achievement.id));
};

export const getPendingAchievements = (): Achievement[] => {
  const pendingIds = currentUser.achievements
    .filter(ua => !ua.approved)
    .map(ua => ua.achievementId);
  
  return achievements.filter(achievement => pendingIds.includes(achievement.id));
};

export const getAvailableAchievements = (): Achievement[] => {
  const completedAndPendingIds = currentUser.achievements
    .map(ua => ua.achievementId);
  
  return achievements.filter(achievement => !completedAndPendingIds.includes(achievement.id));
};
