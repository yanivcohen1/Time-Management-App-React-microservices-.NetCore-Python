# React TypeScript Todo App

A modern React application built with TypeScript, featuring a todo list, user authentication, role-based access control, and nested routing. The app uses Bootstrap for styling, PrimeReact components, and Axios for API calls.

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

### `npm start`

Runs the app in the development mode.\
The server port and backend URL are loaded from `public/config.yaml` (default port: 3001).\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

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
