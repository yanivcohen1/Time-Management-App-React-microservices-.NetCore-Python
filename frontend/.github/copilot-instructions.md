# Copilot Instructions for react-ts-todo-app

Welcome to the **react-ts-todo-app** codebase. This guide helps AI coding agents become productive quickly by highlighting project structure, patterns, and workflows.

## 1. Project Overview
- Bootstrapped with Create React App (TypeScript) using `react-scripts@5.0.1`.
- Single-page app with nested routing (`react-router-dom@6`) and role-based authentication.
- Client-side storage via `src/utils/storage.ts` (localStorage wrapper) and React context (`AppContext`, `AuthContext`).
- HTTP client: `axios@1.12.0` with global interceptors for loading bar (`react-top-loading-bar`) and JWT token management.
- UI: Bootstrap 5 (`react-bootstrap@2.10.10`), PrimeReact (`primereact@10.9.7`), FontAwesome icons.
- Theming: Light/dark mode via `data-bs-theme` attribute, observed by `useTheme` hook.
- Animations: `react-transition-group` with custom CSS transitions.

## 2. Key Directories & Files
- `src/pages/` – Top-level page components with nested routes:
  - `Home/` contains `Home.tsx` (uses `<Outlet>` for nested routes) and `todo/TodoList.tsx`.
  - `About/` contains `About.tsx` and `about-me/AboutMe.tsx` for nested `/about/:id/about-me/:id`.
  - Other pages: `Contact.tsx`, `LoginPage.tsx`, `UserPage.tsx`, `AdminPage.tsx`, etc.
- `src/auth/AuthContext.tsx` – Auth provider with `isAuthenticated`, `role` ('admin'|'user'|'guest'), `login()`, `logout()`.
- `src/context/AppContext.tsx` – Generic context for cross-component state (e.g., `{ user: string | null; data: any }`).
- `src/utils/storage.ts` – Exports `getData`/`saveData` (localStorage) and `getGlobal`/`setGlobal` (in-memory).
- `src/routes/PrivateRoute.tsx` – Role-based route protection, redirects to `/login` or `/unauthorized`.
- `src/hooks/useTheme.ts` – Hook that observes `data-bs-theme` attribute changes.
- `src/utils/Modal.tsx` – Custom modal component (not Bootstrap).
- `src/App.tsx` – Root router, global UI (side nav, breadcrumbs, loading bar, cookie banner), axios interceptors.
- `src/App.test.tsx` – Jest test setup; mocks `axios` and `react-router-dom` hooks.

## 3. Routing Patterns
- Nested routes: `<Route path="/home" element={<Home />}>` with `<Route path="todo" element={<TodoList/>}/>` (renders via `<Outlet>`).
- Dynamic params: `/about/:aboutId/about-me/:aboutMeId`.
- Protected routes: `<PrivateRoute allowedRoles={['admin','user']}/>` wraps routes like `/user`, `/admin`.
- Redirects: `<Navigate to="/home" replace />` for root; auth redirects preserve `state.from` for post-login navigation.
- Side nav: Collapsible menu with submenu (About > About Me), theme toggle, role-based links.

## 4. State & Storage
- `AuthContext`: Manages auth state persisted in localStorage as `{ isAuthenticated: boolean; role: UserRole }`.
- `AppContext`: Generic provider for in-memory data (e.g., `{ foo: string }` in Home).
- `storage.ts`: `saveData('key', data)` to localStorage; `getGlobal()`/`setGlobal()` for session data.
- Theme: Stored in localStorage as `'light'|'dark'`, applied via `data-bs-theme` on root elements.

## 5. Data Fetching & UI Feedback
- Axios interceptors in `App.tsx`: Start/stop loading bar on requests; auto-save JWT from `res.headers.authorization`.
- Example API call: `axios.get<ApiResponse>('/api/data')` with `Authorization: Bearer ${token}`.
- UI: `react-top-loading-bar` for global loading; Bootstrap Toasts for notifications; custom `MyModal` and Bootstrap `Modal`; PrimeReact `BreadCrumb` for navigation.

## 6. Testing & Mocks
- Tests in `src/*.test.tsx` alongside components.
- Mocks: `axios` (manual in `__mocks__/axios.js`); `react-router-dom` hooks (`useNavigate`, `useLocation`, `Outlet`) in `App.test.tsx`.
- Setup: `MemoryRouter` and `AppProvider` for context.
- Run: `npm test` or `yarn test` (watch mode).

## 7. Developer Workflows
- **Start dev server**: `npm start` or `yarn start` (opens http://localhost:3000).
- **Run tests**: `npm test` or `yarn test` (Jest watch mode).
- **Build**: `npm run build` or `yarn build`.
- **Eject**: `npm run eject` (irreversible, copies webpack config).
- Linting: ESLint from CRA; errors in console.
- Theme toggle: Button in side nav updates `data-bs-theme` and persists to localStorage.

## 8. Conventions & Patterns
- TypeScript: Interfaces defined inline (e.g., `interface ApiResponse { message: string }`).
- Components: Functional with React hooks (`useState`, `useEffect`).
- Context hooks: Throw if used outside provider (e.g., `useAuth()`, `useAppContext()`).
- CSS: Global styles in `src/index.css`; component-scoped `.css` files; no CSS modules.
- Animations: `CSSTransition` with custom `.css` (e.g., `slide-right.css`, `fade.css`).
- Modals: Custom `MyModal` for simple overlays; Bootstrap `Modal` for complex dialogs.
- Icons: FontAwesome via `<FontAwesomeIcon icon={faHome} />`.
- Forms: Bootstrap `Form`, `InputGroup`, etc.
- Layout: Bootstrap `Container`, `Row`, `Col`, `Stack`; PrimeReact components like `BreadCrumb`.
- Error handling: `try/catch` in effects; console.error for storage/API errors.
- Cookie banner: Fixed bottom banner with accept button, togglable via props.

---

> _Please review these instructions and suggest any missing details or clarifications to improve AI-assisted development._
