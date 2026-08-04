import { clsx, type ClassValue } from "clsx";

export function mergeClasses(...inputs: ClassValue[]) {
  return clsx(inputs);
}
