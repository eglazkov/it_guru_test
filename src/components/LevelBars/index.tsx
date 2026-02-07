import React, { type FC } from "react";
import { cn } from "../../lib/utils";
import type { Level } from "../../types/product";

interface LevelBarsProps {
  level: Level;
}

const LevelBars: FC<LevelBarsProps> = ({ level }) => {
  const bars = [1, 2, 3];

  const isActive = (barIndex: number) => {
    if (level === "high") return true;
    if (level === "medium") return barIndex <= 2;
    return barIndex === 1;
  };

  return (
    <div className="flex flex-row-reverse text-center items-center justify-center gap-2">
      {bars.map((index) => (
        <div
          key={index}
          className={cn(
            "w-6 h-18 rounded-[6px] transition-colors",
            isActive(index) ? "bg-[#949494]" : "bg-[#D8D8D8]",
          )}
        />
      ))}
    </div>
  );
};

export default LevelBars;
