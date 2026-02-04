import { Check, Clock, X } from "lucide-react";

export const STATUS_OPTIONS = [
  { id: "pending", label: "Pending", icon: Clock, color: "text-amber-400" },
  { id: "success", label: "Success", icon: Check, color: "text-emerald-400" },
  { id: "failed", label: "Failed", icon: X, color: "text-red-400" },
] as const;
