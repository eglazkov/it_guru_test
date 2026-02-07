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
import EyeOnIcon from "../../assets/EyeOnIcon.svg?react";

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
  noPadding?: boolean;
  kind?: "small" | "medium" | "large";
  disabled?: boolean;
  required?: boolean;
  isNotValid?: boolean;
}

const Input: FC<InputProps> = ({
  id,
  value,
  onChange,
  kind = "medium",
  type,
  name,
  label,
  placeholder,
  className,
  clearable = false,
  noPadding = false,
  disabled = false,
  required = false,
  isNotValid = false,
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
          className={cn(
            "bg-[#FFFFFF] text-[18px] py-16 px-14 w-full rounded-[12px] border-2 border-[#EDEDED] truncate",
            !noPadding && "pl-54",
            kind === "small" && "py-12 px-10 min-h-50",
            disabled && "opacity-60 pointer-events-none",
            isNotValid && "border-[#F11010]",
          )}
          name={name}
          type={currentType}
          id={id}
          value={value}
          onChange={onChange}
          autoComplete="off"
          disabled={disabled}
          required={required}
        />
        <div className="absolute inset-y-0 right-16 flex items-center pl-3 cursor-pointer">
          {clearable && <CloseIcon onClick={clearValue} />}
          {type === "password" &&
            (currentType === "text" ? (
              <EyeOnIcon
                className="fill-[#C9C9C9] w-22 h-22"
                onClick={showPasswordToggle}
              />
            ) : (
              <EyeOffIcon
                className="fill-[#C9C9C9] w-22 h-22"
                onClick={showPasswordToggle}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Input;
