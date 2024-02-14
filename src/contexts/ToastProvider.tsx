import { ReactNode, useState } from "react";
import { Severity, ToastContext } from "./ToastContext";

interface Props {
  children: ReactNode;
}

export interface ToastAlertProps {
  message: string;
  severity: Severity;
  timeout?: number;
}

export const ToastProvider: React.FC<Props> = ({ children }) => {
  const [toast, setToast] = useState<ToastAlertProps | null>(null);

  const showError = (msg: string) => {
    setToast({message: msg, severity: "error"});
  }

  const showSuccess = (msg: string) => {
    setToast({message: msg, severity: "success", timeout: 2000});
  }

  const value = { 
    toast, 
    setToast, 
    showError,
    showSuccess 
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};