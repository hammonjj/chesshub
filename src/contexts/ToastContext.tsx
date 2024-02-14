import { createContext } from "react";
import { ToastAlertProps } from "./ToastProvider";

export type Severity = "success" | "error" | "warning";

interface ToastContextProps {
  toast: ToastAlertProps | null;
  setToast: React.Dispatch<React.SetStateAction<ToastAlertProps | null>>;
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
}

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);
