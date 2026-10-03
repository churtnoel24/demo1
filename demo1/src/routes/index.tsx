import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MESSAGES } from "@/constants/messages";
import Toast from "@/components/Toast";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setToastType("success");
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome Home</h1>
      
      <button
        type="button"
        disabled={isLoading}
        onClick={handleSave}
        className="rounded-md bg-emerald-600 px-4 py-2 text-white transition-colors
                   hover:bg-emerald-700
                   disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {isLoading ? MESSAGES.button.loading : MESSAGES.button.submit}
      </button>

      {toastType && (
        <Toast type={toastType} onClose={() => setToastType(null)} />
      )}
    </div>
  );
}