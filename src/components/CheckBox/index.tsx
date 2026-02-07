import React, { type FC } from "react";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";
import Label from "../Label";

interface CheckBoxProps {
  id: string;
  name?: string;
  label?: string;
  className?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBox: FC<CheckBoxProps> = ({
  id,
  name,
  label,
  className,
  checked,
  onChange,
}) => {
  return (
    <div className={cn("flex flex-row items-center gap-10", className)}>
      <input
        className="sr-only"
        name={name}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`
        w-18 h-18 appearance-none border-2 rounded-[4px] border-[#EDEDED]
      `}
      >
        {checked && (
          <svg
            className={`w-18 h-18 text-[#232323]`}
            fill="none"
            viewBox="0 0 30 30"
            stroke="currentColor"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: checked ? 1 : 0,
                opacity: checked ? 1 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.3,
              }}
            />
          </svg>
        )}
      </div>
      {label && (
        <Label
          className="text-start text-[#9C9C9C] text-16 font-medium cursor-pointer"
          htmlFor={id}
        >
          {label}
        </Label>
      )}
    </div>
  );
};

export default CheckBox;
