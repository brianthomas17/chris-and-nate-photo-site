
import { useToast as useToastOriginal } from "@/components/ui/toast";

export const useToast = useToastOriginal;

// Creating a direct export of the toast function for easier usage
export const toast = useToastOriginal().toast;
