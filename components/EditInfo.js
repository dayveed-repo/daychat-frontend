import React, { useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { motion } from "framer-motion";

const EditInfo = ({ field, value, editable, handleInputChange }) => {
  const [editMode, setEditMode] = useState(true);

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-gray-400">{field}</p>
      <input
        type="text"
        className={`${
          editMode ? "bg-transparent" : "border-2 border-green-500 px-2 py-1"
        }  text-gray-700 font-medium text-sm outline-none rounded-md`}
        value={value}
        onChange={(e) => handleInputChange(e)}
        disabled={editMode}
        name={field}
      />
      {editable && (
        <div
          onClick={() => setEditMode(!editMode)}
          className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          <motion.div
            className="absolute bg-green-500 opacity-0 rounded-full w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            whileTap={{ opacity: 1, scale: 1.3 }}
            transition={{ ease: "easeOut", duration: 1.2 }}
          ></motion.div>
          <IoMdCreate className="text-gray-700" />
        </div>
      )}
    </div>
  );
};

export default EditInfo;
