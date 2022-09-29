import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="w-screen h-screen flex flex-col space-y-14 justify-center items-center bg-green-100">
      <h3 className="text-lg text-green-800 font-medium animate-pulse">
        Loading
      </h3>

      <div className="w-16 h-16 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            repeatType: "reverse",
          }}
          className="absolute bg-green-500 z-30 w-full h-full rounded-full"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1.3 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            repeatType: "reverse",
          }}
          className="absolute bg-green-400 w-full z-20 h-full rounded-full"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1.6 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            repeatType: "reverse",
          }}
          className="absolute bg-green-300 w-full h-full rounded-full"
        ></motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
