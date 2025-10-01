import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
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
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHome, faSignInAlt, faSignOutAlt, faUser, faUsers, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => <h1>404 - Page Not Found</h1>;

const App: React.FC = () => {
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
    <Router>
      <InnerApp loadingRef={loadingRef} />
    </Router>
  );
};

interface InnerAppProps {
  loadingRef: React.RefObject<InstanceType<typeof LoadingBar>>;
}
// Separate component to use hooks like useLocation inside the router life cycle changes
const InnerApp: React.FC<InnerAppProps> = ({ loadingRef }) => {
  const { isAuthenticated, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null!);

  // close side menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (menuOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    // In each toggle of menuOpen or on unmount, React will call removeEventListener
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Sync submenu open state with URL
  useEffect(() => {
    setAboutOpen(location.pathname.startsWith('/about'));
  }, [location.pathname]);

  useEffect(() => {
    const consent = getData<boolean>('cookieConsent');
    if (consent !== true) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    saveData('cookieConsent', true);
    setShowCookieBanner(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Mobile menu icon */}
      {!menuOpen && (
        <div className="menu-icon" onClick={() => setMenuOpen(true)}>☰</div>
      )}
  {/* Side nav */}
  <nav ref={navRef} className={`side-nav${menuOpen ? ' open' : ''}`} style={{ padding: '1rem', width: '150px', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
        <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
          <FontAwesomeIcon icon={faHome} style={{ marginRight: '0.5rem' }} /> Home
        </NavLink>
        {!isAuthenticated ? (
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
            <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '0.5rem' }} /> Login
          </NavLink>
        ) : (
          <NavLink to="/logout" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '0.5rem' }} /> Logout
          </NavLink>
        )}
        {isAuthenticated && (role === 'user' || role === 'admin') && (
          <NavLink to="/user" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} /> User
          </NavLink>
        )}
        {isAuthenticated && role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '0.5rem' }} /> Admin
          </NavLink>
        )}
        <NavLink to="/contact/2?id=1&name=yan" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
          <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} /> Contact
        </NavLink>
        <div>
          <NavLink
            to="/about/1"
            className={({ isActive }) => isActive ? 'active' : undefined}
            onClick={() => setAboutOpen(prev => !prev)}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{
                marginRight: '0.5rem',
                transform: aboutOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '0.5rem' }} /> About
          </NavLink>
          <Collapse in={aboutOpen} unmountOnExit>
            <div style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <NavLink
                to="/about/1/about-me/3"
                className={({ isActive }) => (isActive || location.pathname.includes('/about-me')) ? 'active' : undefined}
                onClick={() => setMenuOpen(false)}
                style={{ padding: '0.25rem 0' }}
              >
                About Me
              </NavLink>
            </div>
          </Collapse>
        </div>
      </nav>
      {/* Main content */}
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
          <Route path="/contact/:id" element={<Contact />} />
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
      <LoadingBar color="#29d" height={3} ref={loadingRef} />
      {showCookieBanner && (
        <div className="cookie-banner" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: '1rem', borderTop: '1px solid #ccc', textAlign: 'center' }}>
          <div>
            By continuing to use this website, you agree that this website can store cookies on this device.&nbsp;&nbsp;
          
            <button onClick={handleAcceptCookies}>
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

