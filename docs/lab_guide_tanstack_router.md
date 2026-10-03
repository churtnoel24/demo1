# LABORATORY CLASS NO. 5
## TanStack Router Skeleton, Reusable Toast & Hands-On Practice

**Course:** IT Elective 2 / CS Elective 1 — Website Application Development (Frontend Framework)  
**Topic:** Routing Expansion, Component Reuse, State & Effect Integration, and Architecture Scaling  

---

## TODAY'S LAB OBJECTIVES

1. **Expand your TanStack Router skeleton** with four new routes (`/counter`, `/toggle`, `/login`, `/users`), reusing the setup from Lecture Class No. 5.
2. **Reuse the Toast component** you built across multiple pages, proving it is genuinely reusable with zero changes to its core logic.
3. **Practice `useState` hands-on** by building a Counter, a Show/Hide Toggle, and wiring your Login Form into a real route.
4. **Practice `useEffect` hands-on** by wiring your API-fetching Users component into a real route with error handling.
5. **Understand project file structure growth**, seeing how a small app scales into the feature-based structure used in real production codebases.
6. **Compare TanStack Router with React Router** side by side to reinforce why modern React applications make the switch.

---

## PART A. EXPAND THE ROUTED SKELETON

### A.1 What You Should Already Have

From Lecture Class No. 5, your `my-app` project should already have all of the following configured and working. If any item is missing, complete it before continuing:

- [x] `@tanstack/react-router`, `@tanstack/react-router-devtools`, and `@tanstack/router-plugin` installed.
- [x] The `@/` path alias configured in both `tsconfig.app.json` and `vite.config.ts`.
- [x] `src/main.tsx` rewritten to boot `<RouterProvider>`.
- [x] `src/routes/__root.tsx`, `src/routes/index.tsx`, and `src/routes/about.tsx`.
- [x] `src/constants/messages.ts` and `src/components/Toast.tsx`.

---

### A.2 Scaffolding Four New Route Files

We are adding four new pages: `/counter`, `/toggle`, `/login`, and `/users`. Every file follows the exact same TanStack Router file-route pattern.

#### 1. Create [`src/routes/counter.tsx`](file:///src/routes/counter.tsx):

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/counter")({
  component: CounterPage,
});

function CounterPage() {
  return <h1 className="p-6 text-2xl font-bold">Counter</h1>;
}
```

#### 2. Create the other three pages by replicating this structure:

- **[`src/routes/toggle.tsx`](file:///src/routes/toggle.tsx)** → route `"/toggle"` → component `TogglePage` → heading `"Toggle"`
- **[`src/routes/login.tsx`](file:///src/routes/login.tsx)** → route `"/login"` → component `LoginPage` → heading `"Login"`
- **[`src/routes/users.tsx`](file:///src/routes/users.tsx)** → route `"/users"` → component `UsersPage` → heading `"Users"`

> You now have a 5-page skeleton app where every route URL is reachable.

---

### A.3 Updating the Navigation

Update [`src/routes/__root.tsx`](file:///src/routes/__root.tsx) to expand the navigation menu so all six pages are accessible.

Applying the **DRY principle**, pull the repeated Tailwind styling out into shared constants:

```tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

// DRY Principle: Centralized Link Styling
const linkClass = "hover:underline";
const activeClass = { className: "font-bold text-emerald-700" };

function RootLayout() {
  return (
    <>
      <nav className="flex flex-wrap gap-4 border-b border-gray-200 p-4">
        <Link to="/" activeProps={activeClass} className={linkClass}>
          Home
        </Link>
        <Link to="/about" activeProps={activeClass} className={linkClass}>
          About
        </Link>
        <Link to="/counter" activeProps={activeClass} className={linkClass}>
          Counter
        </Link>
        <Link to="/toggle" activeProps={activeClass} className={linkClass}>
          Toggle
        </Link>
        <Link to="/login" activeProps={activeClass} className={linkClass}>
          Login
        </Link>
        <Link to="/users" activeProps={activeClass} className={linkClass}>
          Users
        </Link>
      </nav>
      <Outlet />
    </>
  );
}
```

> **Verification**: Run `pnpm dev` and click through all six links in your browser navigation bar to confirm every page renders its heading.

---

## PART B. REUSING THE TOAST COMPONENT

### B.1 Quick Recap: The Reusable Recipe

A reusable component drops into any page with this 3-step state pattern:

```tsx
const [toastType, setToastType] = useState<"success" | "error" | null>(null);

// In JSX:
{toastType && (
  <Toast type={toastType} onClose={() => setToastType(null)} />
)}
```

---

### B.2 Extending the Message Library

Update [`src/constants/messages.ts`](file:///src/constants/messages.ts) to add two new keys (`milestone` and `loggedIn`). **Extend the object, do not replace it**:

```typescript
export const MESSAGES = {
  toast: {
    success: "Saved successfully!",
    error: "Something went wrong. Please try again.",
    milestone: "Nice! You've clicked 5 times.",
    loggedIn: "Logged in successfully!",
  },
  button: {
    loading: "Saving...",
    submit: "Submit",
  },
} as const;
```

---

### B.3 Upgrade: Allowing Custom Toast Messages

Update [`src/components/Toast.tsx`](file:///src/components/Toast.tsx) to accept an optional `message` prop. This is fully backward-compatible with your existing Home page:

```tsx
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
```

> **Key Rule**: The nullish coalescing operator (`??`) falls back only when `message` is `null` or `undefined`, preserving empty strings if intentionally passed.

---

## PART C. STATE HANDS-ON: COUNTER, TOGGLE, LOGIN

### C.1 Counter — `useState` & Toast Together

Update [`src/routes/counter.tsx`](file:///src/routes/counter.tsx) to trigger a milestone Toast when the count reaches `5`:

```tsx
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
    if (next === 5) setShowToast(true);
  };

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
          onClick={() => setCount(count - 1)}
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
```

> **Note**: Checking `if (next === 5)` inspects the calculated upcoming state value rather than `count`, avoiding stale state evaluation issues during execution.

---

### C.2 Toggle — Boolean State Exercise

Update [`src/routes/toggle.tsx`](file:///src/routes/toggle.tsx):

```tsx
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
```

---

### C.3 Login — Upgrading `alert()` to Toast

Update [`src/routes/login.tsx`](file:///src/routes/login.tsx):

```tsx
import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MESSAGES } from "@/constants/messages";
import Toast from "@/components/Toast";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = useState("");
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
```

---

## PART D. HOOKS PRACTICE: FETCH AND DISPLAY A LIST

### D.1 Users — API Fetching with Error Handling

Update [`src/routes/users.tsx`](file:///src/routes/users.tsx) to fetch external API data via `useEffect` and trigger an error Toast if network requests fail:

```tsx
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
```

> **Testing Error Handling**: Disconnect your internet connection or turn off Wi-Fi, then reload `/users` to verify the error Toast triggers automatically.

---

## PART E. FILE ORGANIZATION: WHERE THIS IS HEADED

### E.1 Current Project Structure
Your project currently resides cleanly inside simple component and route folders:

```text
src/
├── components/
│   └── Toast.tsx
├── constants/
│   ├── common.json
│   └── messages.ts
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── about.tsx
│   ├── counter.tsx
│   ├── toggle.tsx
│   ├── login.tsx
│   └── users.tsx
├── main.tsx
└── index.css
```

---

### E.2 How Real Production Codebases Scale

As applications grow beyond 10+ pages, codebases adopt a **feature-based structure** to keep code modular:

```text
src/
├── components/
│   ├── ui/               # Button.tsx, Card.tsx, Badge.tsx
│   └── layout/           # AppShell.tsx, TopBar.tsx
├── features/
│   ├── auth/             # Login form components, auth hooks
│   └── teacher/
│       └── dashboard/    # TeacherDashboard.tsx, GradeDistribution.tsx
├── routes/
│   ├── __root.tsx
│   ├── _auth.tsx         # Pathless layout route for authenticated routes
│   └── _auth/
│       └── teacher/
│           └── dashboard.tsx
```

- Thin route files (`dashboard.tsx`) simply render feature components from `features/`.
- Pathless routes (`_auth.tsx` with leading underscore) wrap nested routes with shared security logic without changing the public URL path.

---

## PART F. THE OLD WAY: REACT ROUTER (FOR CONTRAST)

> **Reference Only Section** — Do not install `react-router-dom`.

### F.1 The Same App in `react-router-dom`

```tsx
// Reference only - Old React Router DOM approach
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/students/1">Student 1</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students/:id" element={<StudentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function StudentPage() {
  const { id } = useParams();
  return <h2>Student ID: {id}</h2>;
}
```

### F.2 Side-by-Side Comparison

| Feature | React Router DOM | TanStack Router |
| :--- | :--- | :--- |
| **Route Registration** | Hand-typed in a centralized `<Routes>` JSX block. | Automatic file placement inside `src/routes/`. |
| **Route Parameters** | `useParams()` returns string or `undefined`. | Guaranteed typed parameters parsed automatically. |
| **Link Validation** | Broken links (`<Link to="/studnets">`) fail at runtime in browser. | Broken links fail at compile-time during build. |
| **Navigation Mechanism** | Client-side SPA routing without page reloads. | Client-side SPA routing without page reloads. |
