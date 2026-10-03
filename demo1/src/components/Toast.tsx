import { useEffect } from "react";
import { MESSAGES } from "@/constants/messages";

type ToastType = "success" | "error";

interface ToastProps {
  type: ToastType;
  onClose: () => void;
  message?: string; // Optional custom message prop
}

function Toast({ type, onClose, message }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Use custom message if provided; otherwise fallback to default string
  const text =
    message ??
    (type === "success" ? MESSAGES.toast.success : MESSAGES.toast.error);

  const colorClasses =
    type === "success"
      ? "bg-emerald-600 border-emerald-700"
      : "bg-red-600 border-red-700";

  const baseClasses =
    "fixed bottom-4 right-4 rounded-md border px-4 py-3 text-white shadow-lg";

  return (
    <div role="status" className={`${baseClasses} ${colorClasses}`}>
      {text}
    </div>
  );
}

export default Toast;