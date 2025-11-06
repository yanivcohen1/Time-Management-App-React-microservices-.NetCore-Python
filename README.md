# React + TypeScript + Vite App

A modern React application built with TypeScript and Vite, featuring a todo list, user authentication, role-based access control, and nested routing. The app uses Bootstrap for styling, PrimeReact components, and Axios for API calls.

## Features

- **Todo Management**: Create, edit, and manage todo items
- **User Authentication**: Login/logout with role-based access (admin, user, guest)
- **Nested Routing**: Dynamic routes with React Router v6
- **Theming**: Light/dark mode support
- **Responsive UI**: Bootstrap 5 and PrimeReact components
- **Data Persistence**: Local storage for todos and user data
- **Loading Indicators**: Global loading bar for API requests
- **Animations**: Smooth transitions with CSS animations
- **Configurable Backend**: Backend URL loaded from YAML configuration file

## Project Structure

- `src/pages/`: Page components with nested routes
- `src/auth/`: Authentication context and logic
- `src/context/`: App-wide state management
- `src/utils/`: Utility functions and storage helpers
- `src/hooks/`: Custom React hooks
- `public/config.yaml`: Configuration file for server port and backend URL

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

Runs the app in the development mode.\
The server port and backend URL are loaded from `public/config.yaml` (default port: 3001).\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `pnpm lint`

Runs ESLint to check for code quality issues and potential errors in the codebase.

### `pnpm preview`

Serves the production build locally for testing and previewing the app before deployment.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Configuration

The app can be configured using `public/config.yaml`:

```yaml
port: 3001
backend:
  url: http://localhost:5000
```

- `port`: The port on which the React development server runs
- `backend.url`: The base URL for API calls (loaded dynamically at runtime)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
