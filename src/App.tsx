import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { getData, saveData } from './utils/storage';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const loadingRef = useRef<InstanceType<typeof LoadingBar>>(null!);

  useEffect(() => {
    // start on any request
    const reqId = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        loadingRef.current.continuousStart();
        const token = getData<string>('jwt');
        if (token) {
          if (!config.headers) config.headers = {} as AxiosRequestHeaders;
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );
    // complete on response or error
    const resId = axios.interceptors.response.use(
      (res: AxiosResponse) => {
        loadingRef.current.complete();
        const authHeader = res.headers['authorization'] || (res.data && (res.data.token || res.data.jwt));
        if (authHeader) {
          const tokenValue = authHeader.toString().startsWith('Bearer ') ? authHeader.toString().split(' ')[1] : authHeader.toString();
          saveData('jwt', tokenValue);
        }
        return res;
      },
      (err) => {
        console.error('HTTP Error:', err);
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
        <div style={{ display: 'flex' }}>
          {/* Mobile menu icon, hidden when menu is open */}
          {!menuOpen && (
            <div className="menu-icon" onClick={() => setMenuOpen(true)}>☰</div>
          )}
          {/* Side navigation wrapper */}
          <div>
            <nav className={`side-nav${menuOpen ? ' open' : ''}`} style={{ padding: '1rem', width: '100px', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
             <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : undefined}>Home</NavLink>
             {!isAuthenticated ? (
               <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined}>Login</NavLink>
             ) : (
               <NavLink to="/logout" className={({ isActive }) => isActive ? 'active' : undefined}>Logout</NavLink>
             )}
             {isAuthenticated && (role === 'user' || role === 'admin') && (
               <NavLink to="/user" className={({ isActive }) => isActive ? 'active' : undefined}>User</NavLink>
             )}
             {isAuthenticated && role === 'admin' && (
               <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : undefined}>Admin</NavLink>
             )}
             <NavLink to="/contact?id=1&name=yan" className={({ isActive }) => isActive ? 'active' : undefined}>Contact</NavLink>
             <NavLink to="/about/1" className={({ isActive }) => isActive ? 'active' : undefined}>About</NavLink>
            </nav>
          </div>
           
          {/* Overlay to close menu */}
          {menuOpen && (
           <div
             className="overlay"
             onClick={() => setMenuOpen(false)}
             style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 999 }}
           />
         )}
          
          <div className="main-content" style={{ flex: 1, padding: '1rem' }}>
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
          </div>
       </div>
     </Router>
     <div style={{ padding: 20 }}>
       <LoadingBar color="#29d" height={3} ref={loadingRef} />
     </div>
   </>
 );
}

export default App;

