import { ToastPosition, ToastType } from "@/constants/SystemConfig";

export interface ToastAction {
  label: string;
  href: string;
}

export interface ShowToastOptions {
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
  action?: ToastAction;
}
