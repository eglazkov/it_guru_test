import React, { type FC } from "react";

interface ButtonProps {
  children: string;
  type?: "submit" | "reset" | "button" | undefined;
}

const Button: FC<ButtonProps> = ({ children, type }) => {
  return (
    <button
      type={type}
      className="bg-[#242EDB] w-full py-16 text-[18px] text-[#FFFFFF] cursor-pointer
      font-semibold rounded-[12px] bg-linear-to-b from-[#FFFFFF]/0 from-0% to-[#FFFFFF]/12 to-100%"
    >
      {children}
    </button>
  );
};

export default Button;
