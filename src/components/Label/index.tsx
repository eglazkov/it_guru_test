import { type FC } from "react";

interface LabelProps {
  children: string;
  htmlFor?: string;
  className?: string;
}

const Label: FC<LabelProps> = ({ children, htmlFor, className }) => {
  return (
    <label className={className} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;
