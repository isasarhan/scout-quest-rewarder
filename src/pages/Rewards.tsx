
import { motion } from 'framer-motion';
import { Lock, Check, ArrowRight, Medal, Trophy, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import { rewards, getUnlockedRewards, getNextReward, calculateRewardProgress } from '@/data/rewards';
import { currentUser } from '@/data/achievements';
import { ranks, getCurrentRank } from '@/data/ranks';

const Rewards = () => {
  const unlockedRewards = getUnlockedRewards(currentUser.points);
  const nextReward = getNextReward(currentUser.points);
  const currentRank = getCurrentRank(currentUser.points);
  
  const progressToNextReward = nextReward 
    ? calculateRewardProgress(currentUser.points, nextReward) 
    : 100;
  
  const rewardContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const rewardItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  // Helper to get icon based on reward name
  const getRewardIcon = (name: string) => {
    if (name.includes("Medal")) return Medal;
    if (name.includes("Ultimate")) return Trophy;
    return Award;
  };
  
  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Rewards & Milestones</h1>
            <p className="text-muted-foreground">
              Track your progress and unlock special rewards as you earn achievement points
            </p>
          </div>
          
          {/* Current Progress Card */}
          <Card className="mb-12 overflow-hidden bg-gradient-to-r from-scout-pine/10 to-scout-moss/10 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <Badge variant="outline" className={`${currentRank.color} text-white mb-2`}>
                      {currentRank.name} Rank
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                      {currentUser.points} Achievement Points
                    </h2>
                    
                    {nextReward && (
                      <p className="text-muted-foreground">
                        {nextReward.pointsRequired - currentUser.points} more points until {nextReward.name}
                      </p>
                    )}
                    
                    {!nextReward && (
                      <p className="text-muted-foreground">
                        You've unlocked all available rewards!
                      </p>
                    )}
                  </div>
                  
                  {nextReward && (
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span>Progress to next reward</span>
                        <span>{progressToNextReward}%</span>
                      </div>
                      <Progress 
                        value={progressToNextReward} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  <Button className="bg-scout-pine hover:bg-scout-pine/90 w-full sm:w-auto">
                    View Available Achievements
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-scout-pine to-scout-moss p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="mb-4 inline-block">
                      <motion.div
                        className="rounded-full bg-white/10 p-6 backdrop-blur-sm border border-white/20"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <Trophy className="h-20 w-20" />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Scout Achievement Program</h3>
                    <p className="text-white/80">
                      Earn points by completing achievements and unlock special rewards
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Rewards List */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={rewardContainerVariants}
            initial="hidden"
            animate="show"
          >
            {rewards.map((reward) => {
              const isUnlocked = currentUser.points >= reward.pointsRequired;
              const RewardIcon = getRewardIcon(reward.name);
              const progress = isUnlocked 
                ? 100 
                : calculateRewardProgress(currentUser.points, reward);
              
              return (
                <motion.div 
                  key={reward.id}
                  variants={rewardItemVariants}
                >
                  <Card className={`h-full overflow-hidden transition-all duration-300 ${
                    isUnlocked 
                      ? 'border-scout-pine dark:border-scout-moss shadow-md hover:shadow-lg' 
                      : 'opacity-75 hover:opacity-100'
                  }`}>
                    <CardContent className="p-0">
                      <div className={`h-32 relative overflow-hidden ${
                        isUnlocked 
                          ? 'bg-gradient-to-r from-scout-pine to-scout-moss' 
                          : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800'
                      }`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={isUnlocked ? { 
                              y: [0, -5, 0],
                              rotate: [0, 5, 0, -5, 0],
                            } : {}}
                            transition={{ 
                              duration: 5, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            className="text-white"
                          >
                            <RewardIcon className="h-16 w-16" />
                          </motion.div>
                        </div>
                        
                        {!isUnlocked && (
                          <div className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-1.5">
                            <Lock className="h-4 w-4" />
                          </div>
                        )}
                        
                        {isUnlocked && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{reward.name}</h3>
                          <Badge variant={isUnlocked ? "default" : "outline"}>
                            {reward.pointsRequired} pts
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-4">
                          {reward.description}
                        </p>
                        
                        {!isUnlocked && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress 
                              value={progress} 
                              className="h-1.5"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {reward.pointsRequired - currentUser.points} points needed
                            </p>
                          </div>
                        )}
                        
                        {isUnlocked && (
                          <div className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center mt-2">
                            <Check className="mr-1 h-4 w-4" />
                            Unlocked
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* How to Earn Points */}
          <Card className="mt-12">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">How to Earn More Points</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Complete achievements across different categories to earn points and unlock rewards
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Complete Achievements",
                    description: "Apply for achievements, fulfill the requirements, and get them approved by your scout leader.",
                    icon: Award,
                    color: "bg-scout-pine"
                  },
                  {
                    title: "Advance in Rank",
                    description: "As you earn points, you'll progress through scout ranks, unlocking new opportunities.",
                    icon: Trophy,
                    color: "bg-scout-earth"
                  },
                  {
                    title: "Collect Rewards",
                    description: "Reach point milestones to earn special rewards recognizing your achievements.",
                    icon: Medal,
                    color: "bg-scout-sunset"
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className={`${item.color} h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Rewards;
