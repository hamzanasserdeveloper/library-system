import { ToastPosition, ToastType } from "@/constants/SystemConfig";

export interface ShowToastOptions {
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
}
