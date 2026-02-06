import React, {
  useRef,
  useState,
  type FC,
  type HTMLInputTypeAttribute,
} from "react";

import { cn } from "../../lib/utils";
import Label from "../Label";
import LockIcon from "../../assets/LockIcon.svg?react";
import MailIcon from "../../assets/MailIcon.svg?react";
import CloseIcon from "../../assets/CloseIcon.svg?react";
import EyeOffIcon from "../../assets/EyeOffIcon.svg?react";

interface InputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
}

const Input: FC<InputProps> = ({
  id,
  value,
  onChange,
  type,
  name,
  label,
  placeholder,
  className,
  clearable = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentType, setCurrentType] = useState<
    HTMLInputTypeAttribute | undefined
  >(type);

  const showPasswordToggle = () => {
    setCurrentType((prev) => (prev === "password" ? "text" : "password"));
  };

  const clearValue = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

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
          {type === "email" && <MailIcon />}
          {type === "password" && <LockIcon />}
        </div>
        <input
          ref={inputRef}
          placeholder={placeholder}
          className="bg-[#FFFFFF] text-[18px] py-16 px-14 pl-54 w-full rounded-[12px] border-2 border-[#EDEDED]"
          name={name}
          type={currentType}
          id={id}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-16 flex items-center pl-3 cursor-pointer">
          {clearable && <CloseIcon onClick={clearValue} />}
          {type === "password" && <EyeOffIcon onClick={showPasswordToggle} />}
        </div>
      </div>
    </div>
  );
};

export default Input;
