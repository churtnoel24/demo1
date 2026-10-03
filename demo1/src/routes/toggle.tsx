import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/toggle")({
  component: TogglePage,
});

function TogglePage() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <h1 className="text-2xl font-bold">Toggle</h1>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="rounded-md bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
      >
        {isVisible ? "Hide Message" : "Show Message"}
      </button>

      {isVisible && (
        <p className="text-lg">You found the hidden message!</p>
      )}
    </div>
  );
}