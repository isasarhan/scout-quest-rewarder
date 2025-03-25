
import { motion } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  Clock, 
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import RankBadge from '@/components/RankBadge';
import MilestoneTracker from '@/components/MilestoneTracker';
import { 
  currentUser, 
  getCompletedAchievements,
  getPendingAchievements,
  achievementCategories,
  achievements
} from '@/data/achievements';
import { ranks, getCurrentRank, getNextRank, calculateProgress } from '@/data/ranks';

const Profile = () => {
  const completedAchievements = getCompletedAchievements();
  const pendingAchievements = getPendingAchievements();
  const currentRank = getCurrentRank(currentUser.points);
  const nextRank = getNextRank(currentUser.points);
  const progressPercent = calculateProgress(currentUser.points);
  
  // Group achievements by category
  const achievementsByCategory = completedAchievements.reduce((acc, achievement) => {
    const categoryId = achievement.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(achievement);
    return acc;
  }, {} as Record<string, typeof completedAchievements>);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="page-container">
          {/* Profile Header */}
          <div className="relative mb-8">
            <div className="h-48 bg-gradient-to-r from-scout-pine to-scout-moss rounded-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('/placeholder.svg')] bg-cover bg-center" />
            </div>
            
            <div className="relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 px-4 sm:px-8">
              <div className="rounded-full bg-white dark:bg-gray-800 p-1.5 border-4 border-white dark:border-gray-800 shadow-lg">
                <img 
                  src={currentUser.avatar || "/placeholder.svg"} 
                  alt={currentUser.name}
                  className="h-32 w-32 rounded-full object-cover"
                />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  {currentUser.name}
                  <Badge className={`${currentRank.color} text-white`}>
                    {currentRank.name}
                  </Badge>
                </h1>
                <p className="text-muted-foreground mt-1">
                  Member since {formatDate(currentUser.joinDate)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/achievements">
                    <Award className="mr-2 h-4 w-4" />
                    Achievements
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/rewards">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Rewards
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats and Progress */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Scout Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Points</span>
                    <span className="text-2xl font-bold">{currentUser.points}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {completedAchievements.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Achievements
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {pendingAchievements.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Pending
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {nextRank ? nextRank.name : 'Max Rank'}</span>
                      <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    
                    {nextRank && (
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{currentUser.points} pts</span>
                        <span>{nextRank.minPoints} pts</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Rank Progression */}
              <Card>
                <CardHeader>
                  <CardTitle>Rank Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-4">
                    {ranks.map(rank => {
                      const isCurrentRank = rank.id === currentRank.id;
                      const isUnlocked = currentUser.points >= rank.minPoints;
                      const isNextRank = nextRank && rank.id === nextRank.id;
                      
                      return (
                        <div 
                          key={rank.id} 
                          className={`relative ${
                            isUnlocked ? 'opacity-100' : 'opacity-40'
                          }`}
                        >
                          <RankBadge rank={rank} size="sm" />
                          
                          {isCurrentRank && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          
                          {isNextRank && (
                            <div className="absolute -top-1 -right-1 bg-scout-sunset rounded-full p-0.5 animate-pulse">
                              <div className="h-3 w-3 text-white flex items-center justify-center">
                                ↑
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Milestone Tracker */}
              <MilestoneTracker points={currentUser.points} />
            </div>
            
            {/* Right Column - Achievements */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest scout achievements and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentUser.achievements
                      .sort((a, b) => new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime())
                      .slice(0, 5)
                      .map((userAchievement, index) => {
                        const achievement = completedAchievements.find(a => a.id === userAchievement.achievementId);
                        if (!achievement) return null;
                        
                        const category = achievementCategories.find(c => c.id === achievement.categoryId);
                        
                        return (
                          <motion.div
                            key={userAchievement.achievementId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className={`${category?.color || 'bg-muted'} rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0`}>
                              <Award className="h-5 w-5 text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <h4 className="font-medium truncate">
                                  {achievement.name}
                                </h4>
                                <div className="flex items-center text-sm text-muted-foreground sm:ml-4">
                                  <Calendar className="inline h-3 w-3 mr-1" />
                                  {formatDate(userAchievement.dateCompleted)}
                                </div>
                              </div>
                              <div className="mt-1">
                                <Badge variant="outline" className="mr-2">
                                  +{achievement.points} pts
                                </Badge>
                                <Badge variant="secondary" className={category?.color || 'bg-muted'}>
                                  {category?.name || 'General'}
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      
                    {pendingAchievements.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="flex gap-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="bg-yellow-200 dark:bg-yellow-700 rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-yellow-700 dark:text-yellow-200" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <h4 className="font-medium">
                              Pending Achievements
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            You have {pendingAchievements.length} achievement{pendingAchievements.length !== 1 ? 's' : ''} pending approval
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Achievement Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievement Breakdown</CardTitle>
                  <CardDescription>Your completed achievements by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {achievementCategories.map(category => {
                      const categoryAchievements = achievementsByCategory[category.id] || [];
                      const totalInCategory = achievements.filter(a => a.categoryId === category.id).length;
                      const completionPercent = Math.round((categoryAchievements.length / totalInCategory) * 100) || 0;
                      
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`${category.color} w-3 h-3 rounded-full`}></div>
                              <h4 className="font-medium">{category.name}</h4>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {categoryAchievements.length} / {totalInCategory}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={completionPercent} 
                              className="h-2 flex-1" 
                            />
                            <span className="text-sm font-medium w-10 text-right">
                              {completionPercent}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/achievements">
                        View All Achievements
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Profile;
