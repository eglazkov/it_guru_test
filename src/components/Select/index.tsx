import { useEffect, useState, type FC } from "react";

import Label from "../Label";

interface Option {
  id?: string;
  value: string;
  title: string;
}

interface SelectProps {
  id: string;
  options: Option[];
  onChange?: (value: string) => void;
  label?: string;
}

const Select: FC<SelectProps> = ({ id, options, onChange, label }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    onChange?.(value);
  }, [value]);

  return (
    <div className="flex flex-col items-start">
      {label && (
        <Label className="pl-10 text-[#B2B3B9]" htmlFor={id}>
          {label}
        </Label>
      )}
      <select
        className="bg-[#FFFFFF] text-[18px] py-16 px-14 w-full rounded-[12px] border-2 border-[#EDEDED] truncate"
        id={id}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      >
        <option value=""></option>
        {options?.map((filterItem) => (
          <option key={filterItem.value} value={filterItem.value}>
            {filterItem.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
