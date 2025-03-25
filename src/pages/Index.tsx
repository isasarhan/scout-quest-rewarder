
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Award, 
  Compass, 
  User, 
  BadgeCheck, 
  Target 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import { 
  achievements, 
  achievementCategories, 
  currentUser 
} from '@/data/achievements';
import { ranks, getCurrentRank } from '@/data/ranks';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const userRank = getCurrentRank(currentUser.points);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const parallaxOffset = scrollY * 0.3;
  
  return (
    <>
      <Navbar />
      <AnimatedTransition>
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-scout-pine/10 dark:bg-scout-pine/30 z-0"
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            />
            <div 
              className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10 dark:opacity-5 z-0"
              style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
            />
            
            <div className="relative z-10 container mx-auto px-4 py-32 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-scout-pine to-scout-moss">
                  Scout Quest
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                  Earn achievements, track progress, and unlock rewards on your scouting journey
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-scout-pine hover:bg-scout-pine/90"
                    asChild
                  >
                    <Link to="/achievements">
                      Explore Achievements
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    asChild
                  >
                    <Link to="/profile">View Your Progress</Link>
                  </Button>
                </div>
              </motion.div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
              >
                <div className="glass-card rounded-xl p-6 flex flex-col items-center">
                  <div className="rounded-full bg-scout-pine/10 p-3 mb-3">
                    <Compass className="h-6 w-6 text-scout-pine" />
                  </div>
                  <h3 className="text-2xl font-bold">{achievements.length}</h3>
                  <p className="text-muted-foreground">Total Achievements</p>
                </div>
                
                <div className="glass-card rounded-xl p-6 flex flex-col items-center">
                  <div className="rounded-full bg-scout-sunset/10 p-3 mb-3">
                    <Target className="h-6 w-6 text-scout-sunset" />
                  </div>
                  <h3 className="text-2xl font-bold">{ranks.length}</h3>
                  <p className="text-muted-foreground">Scout Ranks</p>
                </div>
                
                <div className="glass-card rounded-xl p-6 flex flex-col items-center">
                  <div className="rounded-full bg-scout-ruby/10 p-3 mb-3">
                    <Award className="h-6 w-6 text-scout-ruby" />
                  </div>
                  <h3 className="text-2xl font-bold">7</h3>
                  <p className="text-muted-foreground">Special Rewards</p>
                </div>
              </motion.div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10" />
          </div>
          
          {/* Features Section */}
          <section className="py-20 px-4 container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Scout Quest Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps to make progress in your scouting journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Compass,
                  title: "Discover Achievements",
                  description: "Browse through various achievement categories and find challenges that match your interests.",
                  color: "bg-scout-moss text-white"
                },
                {
                  icon: Target,
                  title: "Complete Requirements",
                  description: "Work on fulfilling the requirements for each achievement to earn valuable points.",
                  color: "bg-scout-earth text-white"
                },
                {
                  icon: BadgeCheck,
                  title: "Earn Rewards",
                  description: "Accumulate points to rank up and unlock special rewards for your accomplishments.",
                  color: "bg-scout-sunset text-white"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center card-hover"
                >
                  <div className={`rounded-full ${feature.color} p-4 mb-4`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Categories Section */}
          <section className="py-16 px-4 bg-muted">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Achievement Categories</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explore diverse skill areas and challenge yourself
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievementCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link to={`/achievements?category=${category.id}`}>
                      <Card className="h-full card-hover overflow-hidden">
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className={`${category.color} rounded-full p-3 mt-1`}>
                            <Award className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                            <p className="text-muted-foreground text-sm">{category.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Button 
                  size="lg" 
                  className="bg-scout-pine hover:bg-scout-pine/90"
                  asChild
                >
                  <Link to="/achievements">
                    View All Achievements
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* Profile CTA Section */}
          <section className="py-20 px-4 container mx-auto">
            <div className="glass-card rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Track Your Progress
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Monitor your achievement completions, rank advancements, and reward unlocks.
                    Your current rank: <span className="font-medium text-scout-pine">{userRank.name}</span>
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-scout-pine hover:bg-scout-pine/90 w-full sm:w-auto"
                    asChild
                  >
                    <Link to="/profile">
                      View Your Profile
                      <User className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-gradient-to-br from-scout-pine to-scout-moss h-64 lg:h-auto flex items-center justify-center p-8">
                  <img 
                    src="/placeholder.svg" 
                    alt="Scout profile" 
                    className="max-h-full w-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </AnimatedTransition>
    </>
  );
};

export default Index;
