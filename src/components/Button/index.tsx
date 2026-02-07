import React, { type FC, type MouseEventHandler, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps {
  children: ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
  kind?: "default" | "outlined";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<ButtonProps> = ({
  children,
  type,
  className,
  kind = "default",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "bg-[#242EDB] w-full py-16 text-[18px] text-[#FFFFFF] cursor-pointer font-semibold",
        "rounded-[12px] bg-linear-to-b from-[#FFFFFF]/0 from-0% to-[#FFFFFF]/12 to-100%",
        "hover:bg-[#1E26C2] active:bg-[#191FB0] focus:ring-2 focus:ring-[#242EDB]/50 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl",
        kind === "outlined" && [
          "bg-[#FFFFFF] border border-[#ECECEB] rounded-[8px] hover:bg-gray-100 hover:text-gray-900",
          "hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-500/50 hover:border-gray-300 shadow-sm hover:shadow-md text-gray-900 transition-all duration-200",
        ],
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
