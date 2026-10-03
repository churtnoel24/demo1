# React + TypeScript + Vite — Learning Guide

A complete reference for learning React professionally. Built from a real project using Vite, TypeScript, Tailwind CSS, and React Router.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Folder Structure](#2-folder-structure)
3. [Tailwind CSS Setup](#3-tailwind-css-setup)
4. [React Router Setup](#4-react-router-setup)
5. [JSX](#5-jsx)
6. [Components & Props](#6-components--props)
7. [useState](#7-usestate)
8. [useEffect](#8-useeffect)
9. [Event Handling & Forms](#9-event-handling--forms)
10. [Conditional Rendering](#10-conditional-rendering)
11. [Lifting State Up](#11-lifting-state-up)
12. [Component Composition](#12-component-composition)
13. [Custom Hooks](#13-custom-hooks)
14. [Fetching Data from an API](#14-fetching-data-from-an-api)
15. [useReducer](#15-usereducer)
16. [useContext](#16-usecontext)
17. [useRef](#17-useref)
18. [TypeScript Patterns for React](#18-typescript-patterns-for-react)
19. [Protected Routes](#19-protected-routes)
20. [Project Structure for Real Apps](#20-project-structure-for-real-apps)

---

## 1. Project Setup

### Scaffold with Vite
```bash
npm create vite@latest .
# Select: React → TypeScript + SWC or TypeScript
```

for learning, choose typescript without react compiler.

// without React Compiler — you write this manually
const expensiveValue = useMemo(() => compute(data), [data])
const handleClick = useCallback(() => doSomething(), [])

// with React Compiler — it figures this out automatically
// you just write normal code, compiler optimizes it
const expensiveValue = compute(data)
const handleClick = () => doSomething()


### Install dependencies
```bash
npm install
npm run dev
```

### Key files created
| File | Purpose |
|---|---|
| `index.html` | Single HTML file — entry point for the browser |
| `src/main.tsx` | React entry — mounts `<App />` into `#root` |
| `src/App.tsx` | Root component |
| `vite.config.ts` | Vite configuration |
| `tsconfig.app.json` | TypeScript config for source files |

### Boot sequence
```
index.html → main.tsx → App.tsx → your components
```

### `main.tsx` — set once, rarely touched
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

> **StrictMode** — in development only, renders components twice to catch bugs. No effect in production.

---

## 2. Folder Structure

### Recommended structure
```
src/
  assets/           ← images, fonts, static files
  components/
    ui/             ← reusable generic UI (Button, Card, Modal)
    layout/         ← Header, Sidebar, Footer
  context/          ← React Context files
  hooks/            ← custom hooks
  pages/
    home/           ← public landing pages
    auth/           ← login, register, forgot password
    dashboard/      ← protected pages
  routes/           ← route definitions
  services/         ← API call functions
  types/            ← shared TypeScript types
  utils/            ← pure helper functions
  App.tsx
  main.tsx
  index.css
```

### Rules
- `components/` — reusable, not tied to any page
- `pages/` — tied to a route, composed of components
- Start minimal, add folders only when you need them
- File naming: `LoginPage.tsx`, `CustomButton.tsx` — PascalCase for components

---

## 3. Tailwind CSS Setup

### Install (Tailwind v4 + Vite)
```bash
npm install tailwindcss @tailwindcss/vite
```

### `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### `src/index.css` — replace everything with:
```css
@import "tailwindcss";
```

### Verify
Add a Tailwind class to any component:
```tsx
<h1 className="text-3xl font-bold text-blue-500">Hello</h1>
```

> **Note:** Remove all Vite scaffold CSS from `index.css` and `App.css` — they override Tailwind classes.

---

## 4. React Router Setup

### Install
```bash
npm install react-router@latest
```

### File: `src/main.tsx`
Wrap app with `BrowserRouter`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

### File: `src/routes/index.tsx`
```tsx
import { Routes, Route } from 'react-router'
import LandingPage from '../pages/home/LandingPage'
import LoginPage from '../pages/auth/LoginPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default AppRoutes
```

### File: `src/App.tsx`
```tsx
import AppRoutes from './routes'

const App = () => {
  return <AppRoutes />
}

export default App
```

### Navigation

**Programmatic navigation** — use `useNavigate` for button clicks, after form submit:
```tsx
import { useNavigate } from 'react-router'

const navigate = useNavigate()
navigate('/login')
navigate(-1)  // go back in history
```

**Link navigation** — use `<Link>` for static nav links:
```tsx
import { Link } from 'react-router'

<Link to="/login">Go to Login</Link>
```

> **Rule:** Use `<Link>` for nav menus. Use `useNavigate` when something must happen first (validation, auth check).

---

## 5. JSX

JSX is HTML-like syntax inside JavaScript — compiles to `React.createElement()` calls.

### Rules that differ from HTML

| HTML | JSX |
|---|---|
| `class=""` | `className=""` |
| `<input>` | `<input />` |
| `onclick=""` | `onClick={}` |
| Can return multiple elements | Must have one root element |

### One root element — use a fragment if needed
```tsx
return (
  <>
    <h1>Hello</h1>
    <p>World</p>
  </>
)
```

### Embedding JavaScript with `{}`
```tsx
const name = "Rey"
const age = 25

return (
  <div>
    <h1>{name}</h1>
    <p>{age + 1}</p>
    <p>{name.toUpperCase()}</p>
  </div>
)
```

### Valid vs invalid inside `{}`
```tsx
// valid — expressions (return a value)
{name}
{2 + 2}
{isLoggedIn ? 'Welcome' : 'Please login'}
{items.map(item => <li key={item.id}>{item.name}</li>)}

// invalid — statements (don't return a value)
{if (condition) { ... }}
{for (let i...) { ... }}
```

---

## 6. Components & Props

A component is a function that returns JSX. Props are arguments passed to it.

### Standard component boilerplate
```tsx
// file: src/components/ui/Button.tsx

type ButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean  // optional prop
}

const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

export default Button
```

### Using it
```tsx
<Button label="Submit" onClick={handleSubmit} />
<Button label="Delete" onClick={handleDelete} disabled />
```

### Import order convention
```tsx
// 1. React
import { useState } from 'react'
// 2. Third-party
import { useNavigate } from 'react-router'
// 3. Internal components
import Button from '../../components/ui/Button'
// 4. Internal hooks/types/utils
import { useAuth } from '../../hooks/useAuth'
```

---

## 7. useState

Tracks data that changes over time. When state changes, React re-renders the component.

### Syntax
```tsx
const [value, setValue] = useState(initialValue)
```

### TypeScript inference
```tsx
useState(0)           // inferred: number
useState('')          // inferred: string
useState(false)       // inferred: boolean
useState<User[]>([])  // explicit: needed for empty arrays/objects
```

### Multiple state values
```tsx
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [isLoading, setIsLoading] = useState(false)
```

### Common mistake — state is async
```tsx
const handleClick = () => {
  setCount(count + 1)
  console.log(count)  // still shows OLD value — state updates on next render
}
```

### Functional update — when next state depends on previous
```tsx
setCount(prev => prev + 1)
setShowPassword(prev => !prev)
```

---

## 8. useEffect

Runs code in response to renders or state changes. Syncs React with the outside world.

### Syntax
```tsx
useEffect(() => {
  // code to run
}, [dependencies])
```

### Three modes
```tsx
// 1. Runs after every render
useEffect(() => {
  console.log('every render')
})

// 2. Runs once on mount
useEffect(() => {
  console.log('mounted')
}, [])

// 3. Runs when count changes
useEffect(() => {
  console.log('count changed', count)
}, [count])
```

### Cleanup — prevent memory leaks
```tsx
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000)

  return () => {
    clearInterval(timer)  // runs when component unmounts
  }
}, [])
```

### Async inside useEffect
```tsx
// wrong — can't make the callback async
useEffect(async () => { ... }, [])

// correct — define async function inside, then call it
useEffect(() => {
  const fetchData = async () => { ... }
  fetchData()
}, [])
```

> **StrictMode note:** In development, effects run twice (mount → unmount → mount). This is intentional — it catches cleanup bugs. Production runs effects once.

---

## 9. Event Handling & Forms

### Event handler patterns
```tsx
// inline — for simple cases
<button onClick={() => console.log('clicked')}>Click</button>

// named handler — preferred when there's logic
const handleClick = () => {
  console.log('clicked')
}
<button onClick={handleClick}>Click</button>
```

### Never call the function directly
```tsx
onClick={handleClick}    // correct — passes the function reference
onClick={handleClick()}  // wrong — calls it immediately on render
```

### Forms — always use onSubmit on the form
```tsx
const handleSubmit = () => {
  console.log(email, password)
}

<form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
  <input ... />
  <button type="submit">Login</button>
</form>
```

> **`e.preventDefault()`** — stops the browser from reloading the page on submit. Always required.

### Controlled inputs
```tsx
const [email, setEmail] = useState('')

<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## 10. Conditional Rendering

### Three patterns

**Ternary — show one thing or another:**
```tsx
{isLoggedIn ? <Dashboard /> : <Login />}
```

**`&&` — show something or nothing:**
```tsx
{error && <p className="text-red-500">{error}</p>}
```

**Early return — bail before main UI:**
```tsx
if (isLoading) return <p>Loading...</p>
if (error) return <p>Something went wrong</p>

return <div>main content</div>
```

### Real example — form with error and loading
```tsx
const [error, setError] = useState('')
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = () => {
  if (!email || !password) {
    setError('Please fill in all fields')
    return
  }

  setIsLoading(true)
  setTimeout(() => setIsLoading(false), 2000)
}

return (
  <form>
    {/* ... inputs ... */}
    <button type="submit">
      {isLoading ? 'Loading...' : 'Submit'}
    </button>
    {error && <p className="text-red-500">{error}</p>}
  </form>
)
```

---

## 11. Lifting State Up

When two components need to share state, move it up to their closest common parent.

### The rule
> State should live at the **lowest common ancestor** of all components that need it.

| Scenario | Solution |
|---|---|
| Only one component needs it | Keep it there |
| Two siblings need it | Lift to parent |
| Many components across tree | Context or Zustand |

### Example
```tsx
// parent owns the state
const ParentPage = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <DisplayCount count={count} />
      <Controls onIncrement={() => setCount(c => c + 1)} />
    </>
  )
}

// children receive via props
const DisplayCount = ({ count }: { count: number }) => <p>{count}</p>
const Controls = ({ onIncrement }: { onIncrement: () => void }) => (
  <button onClick={onIncrement}>Add</button>
)
```

---

## 12. Component Composition

Build flexible components using the `children` prop.

### File: `src/components/ui/Card.tsx`
```tsx
import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="rounded-lg border p-4 shadow">
      {children}
    </div>
  )
}

export default Card
```

### Using it
```tsx
<Card>
  <h2>Title</h2>
  <p>Any content goes here</p>
</Card>

<Card>
  <form>...</form>
</Card>
```

### Modal pattern
```tsx
// file: src/components/ui/Modal.tsx
import { type ReactNode } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
```

> **`e.stopPropagation()`** — prevents click inside the modal from bubbling up to the backdrop and closing it.

### Using Modal
```tsx
const [isOpen, setIsOpen] = useState(false)

<button onClick={() => setIsOpen(true)}>Open</button>

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Title</h2>
  <button onClick={() => setIsOpen(false)}>Close</button>
</Modal>
```

---

## 13. Custom Hooks

Extract reusable logic out of components into a `use*` function.

### Rules
- Must start with `use`
- Can call other hooks inside
- Lives in `src/hooks/`
- File extension: `.ts` (no JSX) or `.tsx` (if it returns JSX)

### Example — `src/hooks/useLoginForm.ts`
```ts
import { useEffect, useRef, useState } from 'react'

const hasNumber = (str: string) => /\d/.test(str)
const hasSpecialChar = (str: string) => /[!@#$%^&*(),.?":{}|<>]/.test(str)
const hasUpperCase = (str: string) => /[A-Z]/.test(str)

const useLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!hasNumber(password) || !hasSpecialChar(password)) {
      setError('Password must contain a number and special character')
      return
    }

    if (!hasUpperCase(password)) {
      setError('Password must contain an uppercase letter')
      return
    }

    // submit logic here
    console.log('Email:', email, 'Password:', password)
  }

  return {
    email, setEmail,
    password, setPassword,
    error, setError,
    isLoading, setIsLoading,
    showPassword, setShowPassword,
    emailRef,
    handleSubmit,
  }
}

export default useLoginForm
```

### Using it — `src/pages/auth/LoginPage.tsx`
```tsx
import useLoginForm from '../../hooks/useLoginForm'

const LoginPage = () => {
  const {
    email, setEmail,
    password, setPassword,
    error,
    showPassword, setShowPassword,
    emailRef,
    handleSubmit,
  } = useLoginForm()

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
```

### When to use custom hooks
- Logic needed in one place → keep in component
- Logic reused in multiple places → extract to custom hook
- Component is getting too long → extract to custom hook

---

## 14. Fetching Data from an API

### File: `src/hooks/useUsers.ts`
```ts
import { useCallback, useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  username: string
  email: string
}

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error }
}

export default useUsers
```

### File: `src/pages/public/UsersPage.tsx`
```tsx
import useUsers from '../../hooks/useUsers'

const UsersPage = () => {
  const { users, loading, error } = useUsers()

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

export default UsersPage
```

### Key concepts
- **`response.ok`** — fetch only throws on network errors. A 404 is a "successful" fetch. Always check `response.ok` and throw manually if needed.
- **`useCallback`** — memoizes the fetch function so it's safe in `useEffect`'s dependency array
- **Three states always needed:** `data`, `loading`, `error`
- **Types:** always type your data — `useState<User[]>([])` prevents TypeScript errors from untyped empty arrays

---

## 15. useReducer

Alternative to `useState` for complex state — multiple related values or logic-heavy updates.

### When to use
| Situation | Use |
|---|---|
| Simple independent values | `useState` |
| Multiple values that change together | `useReducer` |
| Next state depends on previous | `useReducer` |
| Complex business logic | `useReducer` |

### File: `src/hooks/useCounter.ts`
```ts
import { useReducer } from 'react'

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }

const reducer = (state: number, action: Action): number => {
  switch (action.type) {
    case 'increment': return state + 1
    case 'decrement': return state - 1
    case 'reset': return 0
    default: return state
  }
}

const useCounter = () => {
  const [count, dispatch] = useReducer(reducer, 0)

  const increment = () => dispatch({ type: 'increment' })
  const decrement = () => dispatch({ type: 'decrement' })
  const reset = () => dispatch({ type: 'reset' })

  return { count, increment, decrement, reset }
}

export default useCounter
```

### Key concepts
- **`reducer`** — pure function, defined outside the hook, takes current state + action, returns new state
- **`dispatch`** — call it with an action object to trigger a state change
- **Action union type** — TypeScript union ensures only valid action types can be dispatched
- **Wrap dispatch** — expose named functions (`increment`, `decrement`) so consumers don't need to know about `dispatch`

---

## 16. useContext

Share state across the component tree without prop drilling.

### Three parts to always build

**1. Create the context**
**2. Create the provider**
**3. Create a custom hook to consume it**

### File: `src/context/ThemeContext.tsx`
```tsx
import { createContext, useContext, useState } from 'react'
import { type ReactNode } from 'react'

type ThemeContextType = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useThemeContext must be used inside ThemeProvider')
  return context
}
```

### Wire up in `src/main.tsx`
```tsx
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
```

### Consume anywhere
```tsx
import { useThemeContext } from '../../context/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeContext()

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  )
}
```

### The null guard pattern
```tsx
if (!context) throw new Error('must be used inside Provider')
```
Eliminates null checks everywhere the context is used. Without it, TypeScript forces you to handle `null` on every call.

### Context vs Zustand
| Scenario | Use |
|---|---|
| Auth, theme, language | Context |
| Frequent updates, large apps | Zustand |
| Simple shared state | Context |
| Shopping cart, real-time data | Zustand |

---

## 17. useRef

Persists a value across renders without causing re-renders. Also used to access DOM elements directly.

### Two use cases

**1. DOM access**
```tsx
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()  // auto-focus on mount
}, [])

<input ref={inputRef} type="text" />
```

**2. Persisting a value without re-render**
```tsx
const renderCount = useRef(0)

useEffect(() => {
  renderCount.current += 1
  console.log('rendered', renderCount.current, 'times')
})
```

### useState vs useRef
| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render | Yes | No |
| Persists across renders | Yes | Yes |
| Use for | UI values | DOM, timers, counters |

### Common HTML element types for useRef
```tsx
useRef<HTMLInputElement>(null)    // <input>
useRef<HTMLButtonElement>(null)   // <button>
useRef<HTMLDivElement>(null)      // <div>
useRef<HTMLFormElement>(null)     // <form>
```

### Optional chaining with refs
```tsx
emailRef.current?.focus()
// same as:
if (emailRef.current !== null) {
  emailRef.current.focus()
}
```

---

## Quick Reference

### Hook decision guide
```
Need UI to update when value changes?
  Yes → useState / useReducer
  No  → useRef

Multiple components need the same state?
  2-3 siblings → lift state up + props
  App-wide      → useContext / Zustand

Logic reused across components?
  Yes → custom hook in src/hooks/
  No  → keep in component

Fetch data once on mount?
  → useEffect with []

Fetch function needed elsewhere (refresh button)?
  → useCallback + useEffect([fetchFn])
```

### File naming conventions
| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `Button.tsx`, `LoginPage.tsx` |
| Hooks | camelCase with `use` | `useLoginForm.ts` |
| Context | PascalCase + Context | `ThemeContext.tsx` |
| Types | PascalCase | `user.ts` (exports `User`) |
| Utils | camelCase | `formatDate.ts` |

### Import type for type-only imports
```tsx
import type { ReactNode } from 'react'
import type { User } from '../types/user'
```
Required when `verbatimModuleSyntax` is enabled in `tsconfig.app.json`.

---

## Debugging

### React DevTools (Chrome Extension)
- Open Chrome DevTools → **Components** tab
- Inspect component tree, props, state, context values in real time
- Edit state directly in DevTools to test UI

### Browser DevTools — Breakpoints
- **Sources tab** → find file with `Cmd+P` / `Ctrl+P`
- Click line number → blue breakpoint (always pauses)
- Right-click line number → **conditional breakpoint** (orange, pauses when condition is true):
  ```js
  user.id === 2
  password.length < 6
  error !== undefined
  ```
- Right-click → **logpoint** (purple, logs without pausing — no code changes needed)

### `debugger` statement
```tsx
const handleSubmit = () => {
  debugger  // DevTools pauses here when this runs
  // ... rest of logic
}
```

### Debugging workflow
| Problem | Tool |
|---|---|
| State not updating | React DevTools Components tab |
| Wrong props | React DevTools Components tab |
| API response shape | `console.table(data)` |
| Logic bug | `debugger` or breakpoint |
| Performance/re-renders | React DevTools Profiler |
| Network requests | Browser DevTools Network tab |

---

## 18. TypeScript Patterns for React

### Typing component props

```tsx
// basic
type ButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

// accepts any native HTML button attributes too
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  label: string
}

// children
type CardProps = {
  children: ReactNode
  className?: string
}
```

### Typing events

```tsx
// input change
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {}

// select change
const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {}

// button click
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {}

// keyboard
const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {}

// form submit — use BaseSyntheticEvent (FormEvent is deprecated in React 19)
const handleSubmit = (e: React.BaseSyntheticEvent) => {
  e.preventDefault()
}

// or separate concerns — no event param needed
const handleSubmit = () => { ... }
<form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
```

### Typing useState explicitly

```tsx
// primitives — inferred, no annotation needed
const [count, setCount] = useState(0)
const [name, setName] = useState('')

// object — needs explicit type
type User = { id: number; name: string }
const [user, setUser] = useState<User | null>(null)

// array — needs explicit type (empty array can't be inferred)
const [users, setUsers] = useState<User[]>([])

// union status — better than multiple booleans
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
```

### Union status type — preferred over multiple booleans

```tsx
// bad — booleans can conflict (both true at the same time)
const [isLoading, setIsLoading] = useState(false)
const [isError, setIsError] = useState(false)
const [isSuccess, setIsSuccess] = useState(false)

// good — only one state possible at a time
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

if (status === 'loading') return <p>Loading...</p>
if (status === 'error') return <p>Error</p>
```

### useReducer with typed state for async data — professional standard

```ts
type User = { id: number; name: string; email: string }

type State = {
  status: 'idle' | 'loading' | 'success' | 'error'
  users: User[]
  error: string
}

type Action =
  | { type: 'fetch_start' }
  | { type: 'fetch_success'; payload: User[] }
  | { type: 'fetch_error'; payload: string }

const initialState: State = { status: 'idle', users: [], error: '' }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'fetch_start':   return { ...state, status: 'loading', error: '' }
    case 'fetch_success': return { ...state, status: 'success', users: action.payload }
    case 'fetch_error':   return { ...state, status: 'error', error: action.payload }
    default: return state
  }
}
```

### Typing async functions and API responses

```tsx
type ApiResponse<T> = {
  data: T
  error: string | null
}

const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('Failed to fetch user')
  return response.json()
}
```

### import type — required with verbatimModuleSyntax

```tsx
import type { ReactNode } from 'react'
import type { User } from '../types/user'
```

> Use `import type` for type-only imports. Required when `verbatimModuleSyntax` is enabled in `tsconfig.app.json` (Vite default).

---

## 19. Protected Routes

Prevent unauthenticated users from accessing pages. Redirects to login if no token found.

### File: `src/components/auth/ProtectedRoute.tsx`

```tsx
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

type ProtectedRouteProps = {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
```

### Wire up in `src/routes/index.tsx`

```tsx
import ProtectedRoute from '../components/auth/ProtectedRoute'

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Set token on login — `src/hooks/useLoginForm.ts`

Pass a callback so the hook stays decoupled from navigation:

```ts
const useLoginForm = (onSuccess: () => void) => {
  const handleSubmit = () => {
    // ... validation ...
    localStorage.setItem('token', 'fake-token')
    onSuccess()  // called after token is set
  }
}
```

```tsx
// LoginPage.tsx
const navigate = useNavigate()  // declare BEFORE the hook call
const { ... } = useLoginForm(() => navigate('/dashboard'))
```

> **`navigate` must be declared before the hook call** — `const` is not hoisted, so using it before declaration causes a bug.

### Testing protected routes manually

```js
// in browser console — simulate logged in
localStorage.setItem('token', 'test-token')

// simulate logged out
localStorage.removeItem('token')
```

### `<Navigate replace>`

`replace` removes the protected route from browser history so the user can't hit back and return to it after being redirected.

---

## 20. Project Structure for Real Apps

### Small app — layer-based (what you start with)

```
src/
  components/ui/
  context/
  hooks/
  pages/
  routes/
```

### Mid-size app — feature-based (5+ pages, team environment)

```
src/
  core/                     ← app-wide infrastructure
    components/             ← Layout, ErrorBoundary
    hooks/                  ← useAuth, useLocalStorage
    context/                ← AuthContext, ThemeContext
    routes/                 ← route definitions
    types/                  ← shared types

  features/                 ← one folder per feature
    auth/
      components/           ← LoginForm, RegisterForm
      hooks/                ← useLoginForm, useRegister
      pages/                ← LoginPage, RegisterPage
      services/             ← authService.ts
      types/
    dashboard/
      components/
      hooks/
      pages/
    users/
      components/
      hooks/
      pages/
      services/             ← usersService.ts

  shared/                   ← reusable across features
    components/             ← Button, Card, Modal
    hooks/                  ← useDebounce, usePagination
    utils/                  ← formatDate, validators
    types/                  ← User, ApiResponse

  assets/
  App.tsx
  main.tsx
  index.css
```

### Services layer — separating API calls from hooks

Moves fetch logic out of hooks into a dedicated file. Hooks stay focused on state management.

```ts
// features/users/services/usersService.ts
const BASE_URL = 'https://jsonplaceholder.typicode.com'

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/users`)
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  getById: async (id: number): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/${id}`)
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  }
}
```

Hook consumes the service:
```ts
const data = await usersService.getAll()
```

Benefits:
- API logic is testable independently of React
- Easy to add auth headers or base URL in one place
- Hook stays focused on state, not HTTP

### Feature folder with index.tsx entry point

```
features/TicTacToe/
  index.tsx           ← entry point, just wraps with provider
  TicTacToeGame.tsx   ← main UI, consumes context
  components/
  hooks/
  context/
  utils/
```

```tsx
// index.tsx — thin entry, just wiring
const TicTacToe = () => (
  <GameProvider>
    <TicTacToeGame />
  </GameProvider>
)

export default TicTacToe
```

The route imports from `'../TicTacToe'` — with `index.tsx`, this resolves automatically without specifying the file.

### When to migrate structure

| App size | Structure |
|---|---|
| Learning / prototyping | Layer-based |
| 5–15 pages | Start extracting features folder |
| 15+ pages / team | Full feature-based with services |

### Pure functions belong in utils, not hooks

> If a function has no hooks inside it (`useState`, `useEffect`, etc.), it is a **utility function** — not a hook. Do not prefix it with `use`.

```ts
// wrong — no hooks inside, shouldn't be a hook
const useCalculateWinner = (squares) => { ... }

// correct — pure function in utils/
export const calculateWinner = (squares) => { ... }
```
