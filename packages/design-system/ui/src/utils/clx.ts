import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function clx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}
