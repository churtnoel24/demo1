import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MESSAGES } from "@/constants/messages";
import Toast from "@/components/Toast";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowToast(true);
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          type={showpassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="rounded-md border border-gray-300 px-3 py-2"
        />
        <button onClick={() => {setShowPassword(!showpassword)}} className="rounded-md bg-emerald-600 px-2 py-2 text-white hover:bg-emerald-700">{showpassword ? "Hide" : "Show"}</button>
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Submit
        </button>
      </form>

      {showToast && (
        <Toast
          type="success"
          message={MESSAGES.toast.loggedIn}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
