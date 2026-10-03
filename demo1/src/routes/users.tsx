import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Toast from "@/components/Toast";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

interface User {
  id: number;
  name: string;
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) throw new Error("Network response failed");
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch(() => setHasError(true));
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Users</h1>
      <ul className="list-disc space-y-1 pl-8">
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      {hasError && (
        <Toast type="error" onClose={() => setHasError(false)} />
      )}
    </div>
  );
}