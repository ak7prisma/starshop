import { AlertTriangle, CheckCircle, Trash2, XCircle } from "lucide-react";
import { ReactNode } from "react";

export type AlertType = "success" | "error" | "delete" | "info";

interface AlertConfig {
  icon: ReactNode;
  bgIcon: string;
  borderColor: string;
  btnColor: string;
  btnText: string;
}

export const getAlertConfig = (type: AlertType): AlertConfig => {
  switch (type) {
    case "success":
      return {
        icon: <CheckCircle size={48} className="text-green-500" />,
        bgIcon: "bg-green-500/10",
        borderColor: "border-green-500/20",
        btnColor: "bg-green-600 hover:bg-green-500",
        btnText: "OK",
      };
    case "error":
      return {
        icon: <XCircle size={48} className="text-red-500" />,
        bgIcon: "bg-red-500/10",
        borderColor: "border-red-500/20",
        btnColor: "bg-red-600 hover:bg-red-500",
        btnText: "Close",
      };
    case "delete":
      return {
        icon: <Trash2 size={40} className="text-red-500" />,
        bgIcon: "bg-red-500/10",
        borderColor: "border-red-500/20",
        btnColor: "bg-red-600 hover:bg-red-500",
        btnText: "Delete",
      };
    default: // info
      return {
        icon: <AlertTriangle size={48} className="text-blue-500" />,
        bgIcon: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        btnColor: "bg-blue-600 hover:bg-blue-500",
        btnText: "OK",
      };
  }
};