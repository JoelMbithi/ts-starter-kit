import { motion } from 'framer-motion';

export default function WelcomeBanner() {
  return (
    <div className="overflow-hidden w-full">
      <motion.div
      
        className="inline-block whitespace-nowrap   font-bold text-xl text-white dark:text-white"
        animate={{ x: ['100%', '-100%'] }} // move from right to left
        transition={{
          x: {
            repeat: Infinity,      // loop infinitely
            repeatType: 'loop',    // loop smoothly
            duration: 20,          // adjust speed
            ease: 'linear',        // continuous movement
          },
        }}
      >
        WELCOME TO JOESOFTWORK POS MANAGEMENT SYSTEM
      </motion.div>
    </div>
  );
}
