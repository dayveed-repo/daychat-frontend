import React from "react";
import { motion } from "framer-motion";

const NotificationBar = ({ info }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0.3 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0.3, y: -100 }}
      transition={{ type: "spring", duration: 1 }}
      className="w-max px-4 py-1 fixed top-10 left-[40%] rounded-md bg-white shadow-lg border-l-2 border-green-700"
    >
      <p className="text-green-700">{info}</p>
    </motion.div>
  );
};

export default NotificationBar;
