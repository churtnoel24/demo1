# React Essentials: Midterm Review

This guide picks up where the setup guide ended. Your project already has Vite, TypeScript, Tailwind, and React Router. Everything here happens **inside** the components.

Several exam items show you a short snippet and ask whether it is **correct** or **incorrect**, and if incorrect, what the fix is. So every section follows the same pattern:

- ✅ code that works, and why
- ❌ a common mistake, and the fix
- **In code review:** what to look for when you see this in someone else's code

## Table of Contents

1. [Reading Code Like a Reviewer](#1-reading-code-like-a-reviewer)
2. [Components and Props](#2-components-and-props)
3. [useState](#3-usestate)
4. [useEffect](#4-useeffect)
5. [Fetching Data](#5-fetching-data)
6. [Conditional Rendering](#6-conditional-rendering)
7. [Rendering Lists](#7-rendering-lists)
8. [DRY and Shared Constants](#8-dry-and-shared-constants)
9. [SOLID in React](#9-solid-in-react)
10. [React Router vs TanStack Router](#10-react-router-vs-tanstack-router)
11. [SPA, MPA, and Why Vite](#11-spa-mpa-and-why-vite)
12. [Practice](#12-practice)
13. [Quick Reference](#13-quick-reference)

---

## 1. Reading Code Like a Reviewer

When you see a snippet, don't read it top to bottom like a story. Run it through a checklist.

1. **Is every variable defined?** A name used but never declared crashes the component.
2. **Does a setter get followed by reading the same variable?** That variable still holds the old value.
3. **Does an effect start something?** Timers, intervals, and listeners need a cleanup.
4. **Is fetched data in the right shape?** `fetch` gives you a Response, not your data.
5. **Does every list item have a `key`?**
6. **Is the same value typed in more than one place?**
7. **Does one component do too many jobs?**

> **Correct is a valid answer.** Not every snippet has a bug. If you check all seven questions and find nothing, circle CORRECT with confidence. Students lose easy points by inventing errors that aren't there.

---

## 2. Components and Props

A component is a function that returns JSX. Its name uses **PascalCase**, the same rule as your file names (`CustomButton.tsx`). That capital letter is how React tells your component apart from a plain HTML tag.

**Props** are the inputs you pass to a component. They flow one way: from parent to child.

### ✅ A reusable button

```tsx
// src/components/ui/CustomButton.tsx
type CustomButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

const CustomButton = ({ label, onClick, disabled = false }: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
    >
      {label}
    </button>
  )
}

export default CustomButton
```

Using it:

```tsx
<CustomButton label="Save" onClick={handleSave} />
<CustomButton label="Delete" onClick={handleDelete} disabled={!isOwner} />
```

### ❌ Changing a prop

```tsx
const Greeting = (props: { name: string }) => {
  props.name = props.name.toUpperCase()   // ❌ props are read-only
  return <h1>Hello, {props.name}</h1>
}
```

**Fix:** make a new value instead of changing the prop.

```tsx
const Greeting = ({ name }: { name: string }) => {
  const shout = name.toUpperCase()
  return <h1>Hello, {shout}</h1>
}
```

> **In code review:** a component should only *read* its props, never assign to them.

---

## 3. useState

`useState` is a component's memory. Use it for anything that changes while the page is open: a counter, form input, whether a modal is open.

```tsx
const [value, setValue] = useState(initialValue)
```

Calling `setValue` tells React to re-render with the new value. **It does not change `value` right away.** Inside the current function, `value` still holds the old number until the next render.

### ✅ A counter

```tsx
import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}

export default Counter
```

### ❌ Reading the old value after setting it

A cart that should show a warning once the quantity hits 3:

```tsx
const [quantity, setQuantity] = useState(0)
const [limitReached, setLimitReached] = useState(false)

const addItem = () => {
  setQuantity(quantity + 1)
  if (quantity === 3) setLimitReached(true)   // ❌ quantity is still the OLD number
}
```

On the click that makes the quantity 3, `quantity` is still 2 inside this function, so the warning doesn't appear. It shows one click late, when the quantity becomes 4.

**Fix:** compute the next value first, then use it for both.

```tsx
const addItem = () => {
  const next = quantity + 1
  setQuantity(next)
  if (next === 3) setLimitReached(true)   // ✅ checks the new value
}
```

### ❌ Updating twice in a row

```tsx
const addTwo = () => {
  setScore(score + 1)
  setScore(score + 1)   // ❌ both lines read the same old score, so it only goes up by 1
}
```

**Fix:** when the next value depends on the previous one, pass a function. React hands you the latest value each time.

```tsx
const addTwo = () => {
  setScore((prev) => prev + 1)
  setScore((prev) => prev + 1)   // ✅ goes up by 2
}
```

### The rule of hooks

Call hooks at the **top level** of the component, never inside an `if`, a loop, or a nested function. React tracks hooks by the order they run, so that order must be the same every render.

```tsx
if (isLoggedIn) {
  const [name, setName] = useState('')   // ❌ hook inside a condition
}
```

> **In code review:** whenever a setter is followed by a check on the same variable, ask whether it's reading the old value.

---

## 4. useEffect

Rendering should only turn data into JSX. Anything that reaches **outside** that job goes in `useEffect`: fetching data, starting a timer, listening for window events, changing the page title.

```tsx
useEffect(() => {
  // runs after the component renders
}, [dependencies])
```

### The dependency array decides when it runs

| Dependency array | When the effect runs |
|---|---|
| *(none)* | after every render |
| `[]` | once, after the first render |
| `[userId]` | after the first render, then again whenever `userId` changes |

### Cleanup

If your effect **starts** something, it must **stop** it too. Return a function from the effect, and React calls it before the effect runs again and when the component leaves the screen.

| If the effect starts... | The cleanup must... |
|---|---|
| `setTimeout(...)` | `clearTimeout(id)` |
| `setInterval(...)` | `clearInterval(id)` |
| `addEventListener(...)` | `removeEventListener(...)` |

### ✅ A live clock

```tsx
import { useEffect, useState } from 'react'

const Clock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)   // ✅ cleanup
  }, [])

  return <p>{time.toLocaleTimeString()}</p>
}

export default Clock
```

### ❌ Starting a timer and never stopping it

```tsx
useEffect(() => {
  setInterval(() => setTime(new Date()), 1000)   // ❌ never cleared
}, [])
```

Each time this component appears, a new interval starts and the old one keeps running. Leave and come back to the page three times and you have three clocks ticking in the background.

**Fix:** save the id and return a cleanup function, exactly as in the ✅ version.

> **Remember StrictMode from `main.tsx`?** In development it mounts each component, removes it, then mounts it again, so every effect runs twice. If you forgot a cleanup, you'll see the bug immediately: the clock jumps two seconds at a time. That's StrictMode doing its job.

### ❌ Using a value without listing it

```tsx
useEffect(() => {
  document.title = `${unreadCount} new messages`
}, [])   // ❌ never updates when unreadCount changes
```

**Fix:** list every value from the component that the effect uses.

```tsx
useEffect(() => {
  document.title = `${unreadCount} new messages`
}, [unreadCount])   // ✅
```

> **In code review:** if an effect calls `setTimeout`, `setInterval`, or `addEventListener`, look for a `return` that undoes it. No return means it's incorrect.

---

## 5. Fetching Data

Fetching belongs in `useEffect`, usually with `[]` so it happens once when the page loads.

The most important thing to remember: **`fetch` gives you a Response, not your data.** You have to call `.json()` to read the body.

```
fetch(url)  →  Response  →  .json()  →  your data
```

### ✅ Fetch, with loading and error states

```tsx
import { useEffect, useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: boolean
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then((response) => response.json())   // ✅ Response → data
      .then((data) => setTodos(data))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (hasError) return <p>Something went wrong.</p>

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}

export default TodoList
```

The same thing with `async` and `await`, if you find it easier to read:

```tsx
useEffect(() => {
  const loadTodos = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      const data = await response.json()
      setTodos(data)
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }
  loadTodos()
}, [])
```

> The effect function itself can't be `async`, so define an async function inside it and call it.

### ❌ Storing the Response instead of the data

```tsx
useEffect(() => {
  fetch('/api/todos').then(setTodos)   // ❌ setTodos receives the Response object
}, [])
```

No error appears, which is what makes this one sneaky. The state just holds a Response object, so `todos.map` fails and anything like `todo.title` comes out empty.

**Fix:** add `.json()` before saving.

```tsx
fetch('/api/todos')
  .then((response) => response.json())
  .then(setTodos)   // ✅ now it receives the data
```

### Going further: HTTP errors

`fetch` only fails on network problems. A 404 or 500 still counts as a successful response. To treat those as errors, check `response.ok`:

```tsx
.then((response) => {
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
})
```

> **In code review:** follow the data. Between `fetch(...)` and the setter, is there a `.json()`?

---

## 6. Conditional Rendering

Show different things depending on a condition.

### ✅ Three ways

```tsx
// Either one or the other: ternary
{isSubmitting ? <Spinner /> : <SubmitButton />}

// Something or nothing: logical AND
{hasError && <ErrorMessage />}

// Bigger branches: return early
if (isLoading) return <p>Loading...</p>
```

### ❌ The zero trap

```tsx
const NotificationBell = ({ count }: { count: number }) => (
  <div>
    🔔
    {count && <span className="badge">{count}</span>}   {/* ❌ */}
  </div>
)
```

When `count` is `0`, the expression `0 && ...` evaluates to `0`, and **React renders the number 0** on the page. You get a stray "0" next to the bell.

**Fix:** compare explicitly so the left side is always `true` or `false`.

```tsx
{count > 0 && <span className="badge">{count}</span>}   {/* ✅ */}
```

> **In code review:** if the left side of `&&` is a number, like a `.length` or a count, it's probably the zero trap.

---

## 7. Rendering Lists

Use `.map()` to turn each item in an array into JSX. Each element needs a **`key`** so React can track which item is which when the list changes.

### ✅ A list with keys

```tsx
type Student = {
  id: number
  name: string
}

const StudentList = ({ students }: { students: Student[] }) => (
  <ul>
    {students.map((student) => (
      <li key={student.id}>{student.name}</li>
    ))}
  </ul>
)
```

### ❌ Missing key

```tsx
{students.map((student) => (
  <li>{student.name}</li>   // ❌ no key
))}
```

React warns in the console, and if the list is reordered, it can mix up which item is which.

**Fix:** `<li key={student.id}>`

### Rules for keys

- Use something **stable and unique**, usually an `id` from your data.
- Keys only need to be unique **among siblings**, not across the whole app.
- Put the key on the **outermost** element the `.map()` returns.
- Avoid the array index (`key={index}`) if items can be added, removed, or reordered.

> **In code review:** every `.map()` that returns JSX needs a `key` on what it returns.

---

## 8. DRY and Shared Constants

**DRY** stands for **Don't Repeat Yourself.** Each piece of knowledge should live in exactly one place.

### ❌ The same text in several files

```tsx
// LoginPage.tsx
<p className="text-red-500">Something went wrong. Please try again.</p>

// RegisterPage.tsx
<p className="text-red-500">Something went wrong. Please try again.</p>

// ProfilePage.tsx
<p className="text-red-500">Something went wrong. Please try again.</p>
```

If the wording changes, you have to find every copy. Miss one and your app says two different things.

### ✅ One source of truth

Add a `constants/` folder. Your setup guide says to add folders only when you need them, and this is when you need one.

```ts
// src/constants/messages.ts
export const MESSAGES = {
  error: {
    generic: 'Something went wrong. Please try again.',
    network: 'Check your connection and try again.',
  },
  button: {
    save: 'Save',
    saving: 'Saving...',
  },
}
```

```tsx
import { MESSAGES } from '../../constants/messages'

<p className="text-red-500">{MESSAGES.error.generic}</p>
```

Change the text once in `messages.ts` and every page updates.

### `??` for fallbacks

`a ?? b` means "use `a`, unless `a` is `null` or `undefined`, then use `b`."

```tsx
const buttonText = customLabel ?? (isSaving ? MESSAGES.button.saving : MESSAGES.button.save)
```

If a parent passed `customLabel`, use it. Otherwise pick a shared message based on state.

**Why not `||`?** Because `||` falls back on *any* falsy value, including `0` and `''`:

```tsx
const items = savedCount || 10   // ❌ if savedCount is 0, you get 10
const items = savedCount ?? 10   // ✅ if savedCount is 0, you get 0
```

> **In code review:** the same string or number typed in two places is a DRY violation, even when both copies currently match.

---

## 9. SOLID in React

**SOLID** is five design principles, popularized by Robert C. Martin. They describe how to keep code easy to change.

| Letter | Acronym | Principle | In one line |
|---|---|---|---|
| **S** | SRP | Single Responsibility | One component, one reason to change |
| **O** | OCP | Open/Closed | Extend through props, don't edit the internals |
| **L** | LSP | Liskov Substitution | A specialized version should work anywhere the general one does |
| **I** | ISP | Interface Segregation | Don't make a component accept props it doesn't use |
| **D** | DIP | Dependency Inversion | Depend on an abstraction, not a concrete detail |

**Your folder structure already follows SOLID.** That's why it's shaped the way it is:

| Folder | What it does for you |
|---|---|
| `hooks/` | Logic lives apart from UI (SRP) |
| `utils/` | Small helpers with one job each (SRP) |
| `services/` | Components talk to a service, not the details behind it (DIP) |
| `components/ui/` | Generic pieces you extend through props (OCP) |
| `types/` | Shared shapes components agree on (LSP, ISP) |

### S: Single Responsibility

#### ❌ One component doing everything

```tsx
const ProductPage = ({ productId }: { productId: number }) => {
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
  }, [productId])

  const price = product ? `₱${product.price.toFixed(2)}` : ''

  return (
    <div>
      <h1>{product?.name}</h1>
      <p>{price}</p>
      <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
        Copy link
      </button>
    </div>
  )
}
```

This component **fetches**, **formats**, **renders**, and **copies links**. Four reasons to change. If the API changes, or the currency format, or the share feature, you're editing the same file.

#### ✅ Split by job

```ts
// src/types/product.ts
export type Product = {
  id: number
  name: string
  price: number
}
```

```ts
// src/hooks/useProduct.ts
import { useEffect, useState } from 'react'
import type { Product } from '../types/product'

export const useProduct = (productId: number) => {
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
  }, [productId])

  return product
}
```

```ts
// src/utils/formatPrice.ts
export const formatPrice = (amount: number) => `₱${amount.toFixed(2)}`
```

```tsx
// src/pages/products/ProductPage.tsx
import { useProduct } from '../../hooks/useProduct'
import { formatPrice } from '../../utils/formatPrice'
import CopyLinkButton from '../../components/ui/CopyLinkButton'

const ProductPage = ({ productId }: { productId: number }) => {
  const product = useProduct(productId)

  if (!product) return <p>Loading...</p>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{formatPrice(product.price)}</p>
      <CopyLinkButton />
    </div>
  )
}

export default ProductPage
```

Now each file has one reason to change. The page just displays.

> A custom hook is just a function whose name starts with `use` and that calls other hooks. It's the standard way to pull logic out of a component.

### O: Open/Closed

Open for extension, closed for modification. Let callers add things through props instead of editing the component.

```tsx
// src/components/ui/Card.tsx
import type { ReactNode } from 'react'

type CardProps = {
  title: string
  children: ReactNode
  footer?: ReactNode
}

const Card = ({ title, children, footer }: CardProps) => (
  <div className="rounded-lg border p-4">
    <h2 className="font-bold">{title}</h2>
    <div>{children}</div>
    {footer && <div className="mt-4 border-t pt-2">{footer}</div>}
  </div>
)

export default Card
```

```tsx
<Card title="Profile" footer={<CustomButton label="Edit" onClick={startEdit} />}>
  <p>{user.name}</p>
</Card>
```

A new kind of card needs no changes to `Card.tsx`. You pass different children.

### L: Liskov Substitution

A specialized component should accept everything the general one does, so it can replace it anywhere without breaking things.

```tsx
type IconButtonProps = CustomButtonProps & {
  icon: string
}

// ✅ accepts every CustomButton prop, including disabled
const IconButton = ({ label, onClick, disabled = false, icon }: IconButtonProps) => (
  <button onClick={onClick} disabled={disabled} aria-label={label}>
    {icon}
  </button>
)
```

If `IconButton` ignored `disabled`, swapping it into a form that relies on disabling the button would let users submit twice. That breaks the substitution.

### I: Interface Segregation

Ask only for the props you actually use.

```tsx
// ❌ needs two fields, but demands the entire user
const Avatar = ({ user }: { user: User }) => (
  <img src={user.photoUrl} alt={user.name} />
)

// ✅ asks for exactly what it uses
const Avatar = ({ name, photoUrl }: { name: string; photoUrl: string }) => (
  <img src={photoUrl} alt={name} />
)
```

The second version works anywhere you have a name and a photo, not just where you have a full `User`.

### D: Dependency Inversion

Depend on an abstraction, not a concrete detail.

#### ❌ The component knows exactly where data is stored

```tsx
const SaveDraftButton = ({ draft }: { draft: string }) => {
  const handleSave = () => {
    localStorage.setItem('draft', draft)   // ❌ tied to localStorage
  }
  return <button onClick={handleSave}>Save draft</button>
}
```

Later in this course you'll store data in Supabase. With this code, you'd have to hunt down every component that touches `localStorage`.

#### ✅ Step 1: hide the detail behind a service

```ts
// src/services/draftStorage.ts
export type DraftStorage = {
  save: (draft: string) => void
  load: () => string
}

export const localDraftStorage: DraftStorage = {
  save: (draft) => localStorage.setItem('draft', draft),
  load: () => localStorage.getItem('draft') ?? '',
}
```

#### ✅ Step 2: depend on the type, receive the implementation

```tsx
import type { DraftStorage } from '../../services/draftStorage'

const SaveDraftButton = ({ draft, storage }: { draft: string; storage: DraftStorage }) => (
  <button onClick={() => storage.save(draft)}>Save draft</button>
)
```

```tsx
<SaveDraftButton draft={text} storage={localDraftStorage} />
```

The button only knows "something with a `save` method." Switching to Supabase means writing a new `DraftStorage` and passing it in. The button never changes.

> **In code review:** SRP and DIP problems don't crash anything. They're design problems. Look for a component reaching directly into `window`, `localStorage`, or a third-party script, or one component doing several unrelated jobs.

---

## 10. React Router vs TanStack Router

Both libraries do the same job: show a different page for each URL. They decide *which* page in different ways.

### What you set up: React Router

Routes are declared in one file. You type each path yourself.

```tsx
// src/routes/index.tsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
</Routes>
```

### TanStack Router: file-based routing

Every file inside `src/routes/` **is** a route. The file's name and location decide the URL.

```
src/routes/
  __root.tsx        →  the layout every page sits inside
  index.tsx         →  /
  about.tsx         →  /about
  posts/
    index.tsx       →  /posts
    $postId.tsx     →  /posts/1, /posts/2, ...
```

Each route file exports a `Route` made with `createFileRoute`. **The path string must match the file's location.**

```tsx
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <h1>About</h1>
}
```

A Vite plugin scans the folder and generates `src/routeTree.gen.ts`, which wires everything together. **Never edit that file by hand.**

### ❌ Path and file don't match

```tsx
// src/routes/profile.tsx
export const Route = createFileRoute('/settings')({   // ❌ file is profile.tsx
  component: ProfilePage,
})
```

**Fix:** make them agree. Either change the string to `'/profile'`, or rename the file to `settings.tsx`.

### Side by side

| | React Router *(what you set up)* | TanStack Router *(file-based)* |
|---|---|---|
| Where routes live | one file listing every route | one file per route |
| How the URL is decided | the `path` you type | the file's name and location |
| Adding a page | add a `<Route>` line | create a new file |
| Checking links | basic | TypeScript checks links and params |

> **In code review:** for TanStack, compare the `// FILE:` path with the string inside `createFileRoute(...)`. For the index file, the path is `'/'`.

---

## 11. SPA, MPA, and Why Vite

### Single-page vs multi-page

| | SPA *(single-page application)* | MPA *(multi-page application)* |
|---|---|---|
| HTML files | one | one per page |
| Clicking a link | JavaScript swaps the content, no reload | the browser loads a whole new page |
| Feels like | an app | a traditional website |
| Examples | Gmail, Facebook | many news and government sites |
| Search engines | needs extra work | easier by default |

**You built an SPA.** Look at your boot sequence:

```
index.html → main.tsx → App.tsx → your components
```

One HTML file, and React Router swaps components as the URL changes. That's the definition of an SPA.

### Why Vite, and what happened to Create React App

**Create React App (CRA)** was the standard way to start a React project for years. The React team **officially deprecated it on February 14, 2025**. It's history now.

**Vite** replaced it. Its dev server serves your code as native ES modules, so it starts almost instantly instead of bundling the whole app first. That's what you used with `pnpm create vite@latest`.

### Why `node -v` came first

**Node.js** is the runtime that lets JavaScript run outside the browser. `pnpm` and Vite are themselves JavaScript programs, so they need Node.js to run on your machine. Without it, none of the other tools work.

---

## 12. Practice

For each snippet: **CORRECT or INCORRECT?** If incorrect, name the error and the fix. Answers are hidden below each one.

### Snippet 1

```tsx
useEffect(() => {
  window.addEventListener('resize', handleResize)
}, [])
```

<details>
<summary>Answer</summary>

**INCORRECT.** The listener is never removed, so it piles up each time the component mounts. Fix: return a cleanup.

```tsx
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

</details>

### Snippet 2

```tsx
useEffect(() => {
  const loadPosts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')
      const data = await response.json()
      setPosts(data)
    } catch {
      setHasError(true)
    }
  }
  loadPosts()
}, [])
```

<details>
<summary>Answer</summary>

**CORRECT.** Fetches once on mount, converts with `.json()`, handles errors, and uses an inner async function because the effect itself can't be async.

</details>

### Snippet 3

```tsx
const addTwo = () => {
  setScore(score + 1)
  setScore(score + 1)
}
```

<details>
<summary>Answer</summary>

**INCORRECT.** Both lines read the same old `score`, so it only goes up by 1. Fix: `setScore((prev) => prev + 1)` on both lines.

</details>

### Snippet 4

```tsx
{cartItems.length && <CheckoutButton />}
```

<details>
<summary>Answer</summary>

**INCORRECT.** When the cart is empty, `0 && ...` renders the number `0` on the page. Fix: `{cartItems.length > 0 && <CheckoutButton />}`

</details>

### Snippet 5

```tsx
{isSubmitting ? <Spinner /> : <SubmitButton />}
```

<details>
<summary>Answer</summary>

**CORRECT.** A standard ternary: one component or the other.

</details>

### Snippet 6

```tsx
<ul>
  {students.map((student) => (
    <li>{student.name}</li>
  ))}
</ul>
```

<details>
<summary>Answer</summary>

**INCORRECT.** No `key`. Fix: `<li key={student.id}>{student.name}</li>`

</details>

### Snippet 7

```tsx
// FILE: src/routes/index.tsx
export const Route = createFileRoute('/')({
  component: HomePage,
})
```

<details>
<summary>Answer</summary>

**CORRECT.** In TanStack file-based routing, `routes/index.tsx` is the root URL, and its path is `'/'`.

</details>

### Snippet 8

```tsx
// LoginPage.tsx
<p className="text-red-500">Something went wrong. Please try again.</p>

// RegisterPage.tsx
<p className="text-red-500">Something went wrong. Please try again.</p>
```

<details>
<summary>Answer</summary>

**INCORRECT.** The same message is hardcoded in two places, a DRY violation. Fix: move it to `MESSAGES.error.generic` in `src/constants/messages.ts` and import it in both pages.

</details>

### Snippet 9

```tsx
const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return <button onClick={handleLogout}>Log out</button>
}
```

<details>
<summary>Answer</summary>

**INCORRECT, as a design problem.** Nothing crashes, but the button is tied directly to `localStorage` and `window.location`, which is a DIP violation. Fix: move this logic into an `authService.logout()` in `src/services/` and have the button call that.

</details>

---

## 13. Quick Reference

| When you see... | Ask yourself... | If it's wrong... |
|---|---|---|
| A setter followed by a check on the same variable | Is it reading the old value? | Compute `next` first, or use `prev =>` |
| `setTimeout`, `setInterval`, or `addEventListener` in an effect | Is there a cleanup `return`? | Return a function that undoes it |
| `fetch(...)` | Is there a `.json()` before the data is saved? | Add `.then((response) => response.json())` |
| An effect using a prop or state | Is that value in the dependency array? | Add it to the array |
| `.map()` returning JSX | Does each element have a `key`? | `key={item.id}` |
| `{something && ...}` | Can `something` be `0`? | Compare explicitly: `> 0` |
| The same text or number in two files | Is there one source of truth? | Move it to `src/constants/` |
| One component with many jobs | How many reasons could it change? | Split into a hook, a util, and a component (SRP) |
| `window.something` or `localStorage` in a component | Is it tied to a concrete detail? | Hide it behind a service (DIP) |
| `createFileRoute('...')` | Does the path match the file? | Make the string and filename agree |
| A name you can't find declared anywhere | Is it defined? | Declare it, or receive it as a prop |
| Nothing from this table | | **It might just be correct.** |
