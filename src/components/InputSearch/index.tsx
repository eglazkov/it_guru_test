import React, { useRef, type FC, type HTMLInputTypeAttribute } from "react";
import { cn } from "../../lib/utils";
import Label from "../Label";
import SearchIcon from "../../assets/SearchIcon.svg?react";

interface InputSearchProps {
  id?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
}

const InputSearch: FC<InputSearchProps> = ({
  id,
  value,
  onChange,
  name,
  label,
  placeholder,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {label && (
        <Label
          className="text-start text-18 text-[#232323] cursor-pointer"
          htmlFor={id}
        >
          {label}
        </Label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-16 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="w-24 h-24" />
        </div>
        <input
          ref={inputRef}
          placeholder={placeholder}
          className="bg-[#F3F3F3] placeholder:text-[#999999] text-[14px] text-[#999999] py-20 px-12 pl-52 w-full rounded-[8px]"
          name={name}
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-16 flex items-center pl-3 cursor-pointer"></div>
      </div>
    </div>
  );
};

export default InputSearch;
