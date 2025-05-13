
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add animation keyframes for use in component styling
export const keyframes = {
  "scale-in": {
    "0%": {
      transform: "scale(0.7)",
      opacity: "0"
    },
    "100%": {
      transform: "scale(1)",
      opacity: "1"
    }
  }
}
