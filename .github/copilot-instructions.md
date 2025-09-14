# Copilot Instructions for react-ts-todo-app

Welcome to the **react-ts-todo-app** codebase. This guide helps AI coding agents become productive quickly by highlighting project structure, patterns, and workflows.

## 1. Project Overview
- Bootstrapped with Create React App (TypeScript).
- Single-page app with nested routing (`react-router-dom@6`).
- Client-side storage via `src/utils/storage.ts` and React context (`AppContext`, `AuthContext`).
- HTTP client: `axios` with global interceptors for loading bar (`react-top-loading-bar`).

## 2. Key Directories & Files
- `src/pages/` – Top-level page components:
  - `Home/` contains `Home.tsx` and nested `todo/TodoList.tsx`.
  - `About/`, `Contact.tsx`, `LoginPage.tsx`, `UserPage.tsx`, etc.
- `src/auth/AuthContext.tsx` – Auth provider exposing `useAuth()` hook.
- `src/context/AppContext.tsx` – Generic context for cross-component state.
- `src/utils/Modal.tsx` – Custom modal component styled via `Modal.css`.
- `src/App.tsx` – Root router and global UI (nav bar, loading bar).
- `src/App.test.tsx` – Jest test setup; mocks `axios` in `__mocks__/axios.js`.

## 3. Routing Patterns
- Root `<Route path="/home" element={<Home />}>` with nested `<Route path="todo" element={<TodoList/>}/>`.
- Redirects: use `<Navigate to="/home" replace />` in `<Route path="/">`.
- Protect routes via `<PrivateRoute allowedRoles={['admin','user']}/>`.

## 4. State & Storage
- `AuthContext` manages `isAuthenticated`, `role`, `login()`, `logout()`.
- `AppContext` generic provider for in-memory data (e.g., `{ foo: string }`).
- `storage.ts` exports `getData`/`saveData` (localStorage) and in-memory `getGlobal`/`setGlobal`.

## 5. Data Fetching & UI Feedback
- All `axios` requests start/stop a top loading bar via interceptors in `App.tsx`.
- Example:
  ```ts
  axios.interceptors.request.use(config => { loadingRef.current.continuousStart(); return config; });
  ```
- Page-level fetch in `Home.tsx` calls `axios.get<ApiResponse>('/api/data')`.

## 6. Testing & Mocks
- Tests live alongside code in `src/*.test.tsx`.
- A manual mock in `src/__mocks__/axios.js` ensures ESM compatibility.
- Routing hooks (`useNavigate`, `Outlet`) are mocked in `App.test.tsx` to avoid `<Router>` context errors.

## 7. Developer Workflows
- **Start dev server**: `yarn start` (or `npm start`).
- **Run tests**: `yarn test` (uses CRA (create react app) watch mode).
- **Build**: `yarn build`.
- Lint errors surface in console; this codebase uses ESLint rules from CRA.

## 8. Conventions & Patterns
- TypeScript interfaces defined inline (e.g., `interface ApiResponse { message: string }`).
- Functional components using React hooks (`useState`, `useEffect`).
- Context hooks throw if used outside provider (e.g., `useAuth()`).
- CSS modules not in use; global CSS in `src/index.css` or component-scoped `.css` files.

---

> _Please review these instructions and suggest any missing details or clarifications to improve AI-assisted development._
