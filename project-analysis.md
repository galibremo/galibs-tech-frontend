# Frontend Project Analysis (Next.js)

Based on the review of the `next-boilerplate` codebase, here are the details of the project, the patterns followed, its structure, and features.

**Overall Health Check**: Everything is excellent. The frontend is a highly modernized React application. It correctly implements the Next.js App Router and utilizes a Feature-Sliced Design pattern which is great for scaling frontend architecture. The choice of UI libraries (Tailwind + Shadcn) is currently the industry gold standard for React.

## 1. Project Overview & Technologies
The frontend is a dynamic, responsive web application built with **Next.js**.

* **Core Framework:** Next.js (v16.2 App Router) & React 19
* **Styling & UI:** Tailwind CSS v4, Radix UI primitives, `shadcn/ui` components, `motion` (Framer Motion) for animations.
* **Data Fetching & State:** `@tanstack/react-query` (React Query)
* **Forms & Validation:** `react-hook-form` with `@hookform/resolvers` and `zod`.
* **Icons & Typography:** `@hugeicons/react` and `next/font/google` (Geist, Figtree).
* **Utility Libraries:** `date-fns`, `sonner` (toast notifications), `nuqs` (URL search param state management), `cmdk`.

## 2. Architectural Patterns Followed
* **App Router & Server/Client Components:** Utilizes the modern Next.js App Router, separating UI into logical layout groups (e.g., `(auth)`, `(dashboard)`, `(public)`).
* **Feature-Sliced Design (FSD) Inspired:** The `src/features` directory encapsulates domain logic (like `auth`, `users`, `profile`) keeping the Next.js `app` directory strictly for routing and layouts.
* **Provider Pattern:** Global state and contexts are injected via providers in a unified `layout.tsx` (e.g., `ThemeProvider`, `AuthProvider`, `QueryProvider`, `RedirectProvider`).
* **Component-Based UI Architecture:** Uses highly reusable, composable, and accessible UI components heavily based on `shadcn/ui`.

## 3. Directory Structure
```
next-boilerplate/
├── src/
│   ├── app/               # Next.js App Router definitions
│   │   ├── (auth)/        # Route group for authentication pages (login, register)
│   │   ├── (dashboard)/   # Route group for authenticated user dashboard
│   │   ├── (public)/      # Route group for public-facing pages (landing)
│   │   └── layout.tsx     # Root layout wrapping global providers
│   ├── components/        # Reusable UI components (buttons, inputs, dialogs, etc.)
│   ├── core/              # Core types and foundational utilities
│   ├── features/          # Domain-specific logic and UI components
│   │   ├── auth/          # Auth forms, hooks, and logic
│   │   ├── email-*/       # Email related UI/logic
│   │   ├── landing/       # Landing page specific components
│   │   ├── profile/       # Profile management UI
│   │   ├── sessions/      # Session management UI
│   │   └── users/         # User management logic
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions, API clients, and services
│   ├── providers/         # React Context providers (Theme, Auth, Query)
│   ├── routes/            # Route configuration and path constants
│   ├── types/             # Global TypeScript type definitions
│   └── validators/        # Zod schemas for frontend form validation
```

## 4. Features Breakdown
* **Modern Authentication Flow:**
  * Context-aware auth via `AuthProvider` handling protected routes and redirects (`RedirectProvider`).
  * Forms built with React Hook Form + Zod matching the backend schemas.
* **Optimized Data Fetching:**
  * React Query is used for caching, background syncing, and optimistic updates for server state.
* **Rich User Interface:**
  * Built-in dark/light mode via `next-themes` (`ThemeProvider`).
  * Accessible, styled components utilizing Radix UI.
  * Toast notifications via `sonner` for immediate user feedback.
  * Complex data tables (likely using `@tanstack/react-table`).
* **State via URL:**
  * Uses `nuqs` to synchronize component state with URL search parameters, enabling shareable URLs and better SSR compatibility.
