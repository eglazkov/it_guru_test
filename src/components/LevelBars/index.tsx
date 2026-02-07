import React, { type FC } from "react";
import { cn } from "../../lib/utils";

type Level = "low" | "medium" | "high";

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

const range = {
  low: [0, 40],
  medium: [41, 80],
  high: [81, 100],
};
const ranges = Object.entries(range);

export const getLevel = (count: string | number): Level => {
  return ranges.find(
    ([key, [min, max]]) => Number(count) >= min && Number(count) <= max,
  )?.[0] as Level;
};

export default LevelBars;
