import type { FC } from "react";
import { cn } from "../../lib/utils";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  kind?: "primary" | "secondary";
  className?: string;
}

const Spinner: FC<SpinnerProps> = ({
  size = "medium",
  className,
  kind = "primary",
}) => {
  return (
    <div className={className}>
      <div
        className={cn(
          "border-4 rounded-full animate-spin",
          kind === "primary" && "border-[#242EDB]/20 border-t-[#242EDB]",
          kind === "secondary" && "border-[#EDEDED]/20 border-t-[#9C9C9C]",
          size === "small" && "w-20 h-20",
          size === "medium" && "w-40 h-40",
          size === "large" && "w-80 h-80 ",
        )}
      />
    </div>
  );
};

export default Spinner;
