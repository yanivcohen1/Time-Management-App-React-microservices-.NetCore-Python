import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import LoadingBar from 'react-top-loading-bar';
import Home from "./pages/Home/Home";
import TodoList from "./pages/Home/todo/TodoList";
import Contact from "./pages/Contact";
import About from './pages/About/About';
import AboutMe from './pages/About/about-me/AboutMe';
import { useAuth } from './auth/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Unauthorized from './pages/Unauthorized';
import Logout from './pages/Logout';

const NotFound = () => <h1>404 - Page Not Found</h1>;

const App: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const loadingRef = useRef<InstanceType<typeof LoadingBar>>(null!);

    useEffect(() => {
    // start on any request
    const reqId = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        loadingRef.current.continuousStart();
        return config;
      }
    );
    // complete on response or error
    const resId = axios.interceptors.response.use(
      (res: AxiosResponse) => {
        loadingRef.current.complete();
        return res;
      },
      (err) => {
        loadingRef.current.complete();
        return Promise.reject(err);
      }
    );
    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, []);


  return (
    <>
      <Router>
        <nav style={{ padding: '1rem' }}>
          <Link to="/home">Home</Link> |{" "}
          {!isAuthenticated ? (
              <>
                <Link to="/login">Login</Link> |{" "}
              </>
            ) : (
              <>
                <Link to="/logout">Logout</Link> |{" "}
              </>
            )}
          {isAuthenticated && (role === 'user' || role === 'admin') ? (
              <>
                <Link to="/user">User</Link> |{" "}
              </>
            ) : null}
          {isAuthenticated && role === 'admin' && (
              <>
                <Link to="/admin">Admin</Link>|{" "}
              </>
            )}
          <Link to="/contact?id=1">Contact</Link> |{" "}
          <Link to="/about/1">About</Link> |{" "}
        </nav>
  
        <Routes>
          {/* Redirect root to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />}
          >
            <Route path="todo" element={<TodoList />} />
          </Route>
          <Route path="/about/:aboutId" element={<About />} >
            <Route path="about-me/:aboutMeId" element={<AboutMe />} />
          </Route>
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
            <Route path="/user" element={<UserPage />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <div style={{ padding: 20 }}>
        <LoadingBar color="#29d" height={3} ref={loadingRef} />
      </div>
    </>
  );
};

export default App;

