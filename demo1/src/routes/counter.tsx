import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MESSAGES } from "@/constants/messages";
import Toast from "@/components/Toast";

export const Route = createFileRoute("/counter")({
  component: CounterPage,
});

function CounterPage() {

  const [count, setCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const increment = () => {
    const next = count + 1;
    setCount(next);
    if(next === 5) setShowToast(true);
  }

  const decrement = () => {
    const next = count - 1;
    setCount(next);
    if(next === (-5)) setShowToast(true);
  }



  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <h1 className="text-2xl font-bold">Counter</h1>
      <p className="text-xl">Count: {count}</p>
      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded-md bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
          Decrement
        </button>
      </div>

      {showToast && (
        <Toast
          type="success"
          message={MESSAGES.toast.milestone}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}