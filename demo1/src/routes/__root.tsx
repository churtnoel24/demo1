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