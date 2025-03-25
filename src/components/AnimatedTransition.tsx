
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTransitionProps {
  children: ReactNode;
  className?: string;
}

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -10
  }
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

const AnimatedTransition = ({ children, className = '' }: AnimatedTransitionProps) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedTransition;
