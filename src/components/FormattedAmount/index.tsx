import { type FC } from "react";

interface FormattedAmountProps {
  amount: string;
}

const FormattedAmount: FC<FormattedAmountProps> = ({ amount }) => {
  if (amount == null) {
    return <span>–</span>;
  }
  const [integer, kopecks] = Number(amount).toFixed(2).split(".");
  const formattedInteger = parseInt(integer).toLocaleString("ru-RU");

  return (
    <span className="text-16 text-[#222222]">
      {formattedInteger}
      <span className="text-[#999999] ml-1">,{kopecks}</span>
    </span>
  );
};

export default FormattedAmount;
