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
        "bg-[#242EDB] w-full py-16 text-[18px] text-[#FFFFFF] cursor-pointer font-semibold rounded-[12px] bg-linear-to-b from-[#FFFFFF]/0 from-0% to-[#FFFFFF]/12 to-100%",
        kind === "outlined" &&
          "bg-[#FFFFFF] border border-[#ECECEB] rounded-[8px]",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
