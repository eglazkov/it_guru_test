import React, { type FC } from "react";
import LogoIcon from "../../assets/Logo.svg?react";

const Logo: FC = () => {
  return (
    <div className="rounded-[100px] shadow-[0_12px_8px_2px_rgba(0,0,0,0.03)] mb-32">
      <div
        className="py-1 px-1 bg-linear-to-b
            from-[#EDEDED]/70 from-0% to-[#FFFFFF] to-70% rounded-[100px] shadow-[0_0_0_2px_#FFFFFF]"
      >
        <div
          className="py-8 px-7.5 bg-linear-to-b
              from-[#EDEDED]/3 from-0% to-[#FFFFFF] to-70% rounded-[100px]"
        >
          <div>
            <LogoIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
