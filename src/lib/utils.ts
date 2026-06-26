import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNok(amount: number): string {
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK" }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("nb-NO", { dateStyle: "long" }).format(new Date(dateStr));
}
