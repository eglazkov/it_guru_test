import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function isSerializedError(error: unknown): error is SerializedError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("message" in error ||
      "name" in error ||
      "code" in error ||
      "stack" in error)
  );
}

export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
}

export const cleanParams = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Partial<T>;

export const toSearchParams = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

export const debounceFn = <F extends (...args: any[]) => void>(
  func: F,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<F>) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export const areFieldsNonEmpty = <T extends Partial<Record<string, string>>>(
  obj: T,
  keys: (keyof T)[],
) => keys.every((key) => key in obj && obj[key] != null && obj[key] !== "");

export const hasFalseValue = (obj: Partial<Record<string, boolean>>) =>
  Object.values(obj).some((value) => value === false);

export const hasTrueValue = (obj: Partial<Record<string, boolean>>) =>
  Object.values(obj).some((value) => value === true);
