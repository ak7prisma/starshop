// src/hooks/useAlert.ts
import { useState, useCallback } from "react";
import type { AlertType } from "@/app/utils/alertconfig";

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
  onConfirm?: () => void;
}

const initialState: AlertState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
};

export function useAlert() {
  const [alertConfig, setAlertConfig] = useState<AlertState>(initialState);

  const showAlert = useCallback((
    type: AlertType,
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setAlertConfig({ isOpen: true, type, title, message, onConfirm });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alertConfig,
    showAlert,
    closeAlert,
  };
}