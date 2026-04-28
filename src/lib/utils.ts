import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function waitColor(minutes: number | null): string {
  if (minutes === null) return "bg-gray-100 text-gray-500";
  if (minutes <= 15) return "bg-green-100 text-green-800";
  if (minutes <= 30) return "bg-yellow-100 text-yellow-800";
  if (minutes <= 60) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

export function waitLabel(minutes: number | null, status: string): string {
  if (status === "DOWN") return "Down";
  if (status === "CLOSED") return "Closed";
  if (status === "REFURBISHMENT") return "Refurb";
  if (minutes === null) return "—";
  return `${minutes} min`;
}

export function crowdLevel(avgWait: number): { label: string; color: string } {
  if (avgWait <= 20) return { label: "Low", color: "text-green-600" };
  if (avgWait <= 35) return { label: "Moderate", color: "text-yellow-600" };
  if (avgWait <= 55) return { label: "High", color: "text-orange-600" };
  return { label: "Very High", color: "text-red-600" };
}
