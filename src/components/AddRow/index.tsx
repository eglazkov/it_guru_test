import React, { useCallback, useState, type FC } from "react";
import Input from "../Input";
import Button from "../Button";
import SuccessIcon from "../../assets/SuccessIcon.svg?react";
import CancelIcon from "../../assets/CancelIcon.svg?react";
import PlusSingIcon from "../../assets/PlusSingIcon.svg?react";
import {
  areFieldsNonEmpty,
  cn,
  hasFalseValue,
  hasTrueValue,
} from "../../lib/utils";

interface AddRowProps<T> {
  columns: T[];
  editableFields?: string[];
  requiredFields?: string[];
  editRowData?: Record<string, string>;
  widths: Record<keyof T & string, number>;
  isLoading?: boolean;
  onAdd: (row: Partial<Record<string, string>>) => void;
  onCancel: () => void;
}

const AddRow = <T extends Record<string, any>>({
  columns,
  editableFields = [],
  requiredFields = [],
  editRowData,
  widths,
  isLoading = false,
  onAdd,
  onCancel,
}: AddRowProps<T>) => {
  const [row, setRow] = useState<Partial<Record<string, string>>>(
    editRowData ||
      columns.reduce(
        (acc, cur) => {
          acc[cur.key] = "";
          return acc;
        },
        {} as Partial<Record<string, string>>,
      ),
  );
  const [notValidFields, setNotValidFields] = useState<
    Partial<Record<string, boolean>> | undefined
  >({});

  const isValidInput = useCallback((): boolean => {
    if (!requiredFields.length) return true;

    const notValid = requiredFields.reduce(
      (acc, cur) => {
        acc[cur] = !Boolean(row[cur]);
        return acc;
      },
      {} as Partial<Record<string, boolean>>,
    );
    setNotValidFields((prev) => ({
      ...prev,
      ...notValid,
    }));
    return !hasTrueValue(notValid);
  }, [row]);
  return (
    <tr
      className={cn(
        "align-middle hover:bg-gray-50 transition-colors duration-150",
        isLoading && "opacity-60 pointer-events-none animate-pulse",
      )}
    >
      <td className="relative w-40 pl-18"></td>
      {columns.map((column) => (
        <td
          style={{ width: widths[column.key] }}
          key={column.key}
          className="px-18 py-18 text-16 font-medium text-[#000000] truncate"
        >
          <Input
            noPadding
            disabled={
              editableFields.length > 0
                ? !editableFields.includes(column.key)
                : false
            }
            required={
              requiredFields.length > 0
                ? !requiredFields.includes(column.key)
                : false
            }
            isNotValid={
              requiredFields.length > 0 ? notValidFields?.[column.key] : false
            }
            kind="small"
            id={`add-${column.key}`}
            placeholder={column.title}
            value={row[column.key] || ""}
            onChange={(e) => {
              setRow((prev) => ({
                ...prev,
                [column.key]: e.target.value,
              }));
            }}
          />
        </td>
      ))}
      <td className="text-end">
        <button
          className="inline-flex items-center justify-center cursor-pointer bg-[#242EDB] text-white text-[28px] rounded-[23px] w-52 h-28 text-center mr-32"
          onClick={() => {
            if (!isValidInput()) {
              return;
            }
            onAdd(row);
          }}
        >
          <SuccessIcon className="stroke-current text-green-500" />
        </button>
        <button
          className="inline-flex items-center justify-center cursor-pointer bg-[#242EDB] text-white text-[28px] rounded-[23px] w-52 h-28 text-center mr-8"
          onClick={onCancel}
        >
          <CancelIcon className="stroke-current text-red-500" />
        </button>
      </td>
    </tr>
  );
};

export default AddRow;
