import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import { ToastType, ToastPosition } from "@/constants/SystemConfig";
import type { ShowToastOptions } from "@/types/toast";
import { generateId } from "@/helper";

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
  action?: ShowToastOptions["action"];
  createdAt: number;
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: "ADD"; payload: Toast }
  | { type: "REMOVE"; payload: string }
  | { type: "CLEAR" };

const DEFAULT_DURATION = 5000;
const MAX_TOASTS = 5;

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD": {
      const newToasts = [action.payload, ...state.toasts].slice(0, MAX_TOASTS);
      return { ...state, toasts: newToasts };
    }
    case "REMOVE":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    case "CLEAR":
      return { ...state, toasts: [] };
    default:
      return state;
  }
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (options: ShowToastOptions) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  defaultPosition = ToastPosition.BottomEnd,
  defaultDuration = DEFAULT_DURATION,
}: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const showToast = useCallback(
    (options: ShowToastOptions): string => {
      const id = generateId();
      const toast: Toast = {
        id,
        title: options.title,
        message: options.message,
        type: options.type,
        duration: options.duration ?? defaultDuration,
        position: options.position ?? defaultPosition,
        action: options.action,
        createdAt: Date.now(),
      };
      dispatch({ type: "ADD", payload: toast });
      return id;
    },
    [defaultDuration, defaultPosition],
  );

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: id });
  }, []);

  const dismissAll = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts: state.toasts, showToast, dismissToast, dismissAll }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function useToastHelpers() {
  const { showToast, dismissToast, dismissAll } = useToast();
  return {
    error: (
      title: string,
      message: string,
      options?: Partial<ShowToastOptions>,
    ) => showToast({ title, message, type: ToastType.Error, ...options }),
    success: (
      title: string,
      message: string,
      options?: Partial<ShowToastOptions>,
    ) => showToast({ title, message, type: ToastType.Success, ...options }),
    info: (
      title: string,
      message: string,
      options?: Partial<ShowToastOptions>,
    ) => showToast({ title, message, type: ToastType.Info, ...options }),
    warning: (
      title: string,
      message: string,
      options?: Partial<ShowToastOptions>,
    ) => showToast({ title, message, type: ToastType.Warning, ...options }),
    dismiss: dismissToast,
    dismissAll,
  };
}
