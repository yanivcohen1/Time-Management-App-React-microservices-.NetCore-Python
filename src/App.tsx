import React, { useRef, useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHome, faSignInAlt, faSignOutAlt, faUser, faUsers, faEnvelope, faInfoCircle, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { BreadCrumb } from 'primereact/breadcrumb';

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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = getData<string>('theme');
    return storedTheme === 'dark' ? 'dark' : 'light';
  });
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null!);
  const isDarkTheme = theme === 'dark';

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

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    saveData('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const breadcrumbItems = useMemo(() => ([
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => {
        setMenuOpen(false);
        setAboutOpen(false);
        navigate('/home');
      },
      disabled: location.pathname === '/home'
    },
    {
      label: 'Todo',
      command: () => {
        setMenuOpen(false);
        setAboutOpen(false);
        navigate('/home/todo');
      },
      disabled: location.pathname.startsWith('/home/todo')
    }
  ]), [location.pathname, navigate]);

  const breadcrumbHome = useMemo(() => ({
    icon: 'pi pi-home',
    url: '/'
  }), []);

  const breadcrumbClassName = `flex-grow-1 rounded-3 px-3 py-2 shadow-sm ${isDarkTheme ? 'bg-dark text-white border border-secondary' : 'bg-white text-body border border-light'}`;
  const breadcrumbItemClass = isDarkTheme ? 'text-white' : 'text-secondary';
  const breadcrumbSeparatorClass = isDarkTheme ? 'text-secondary' : 'text-muted';
  const showHomeBreadcrumb = location.pathname.startsWith('/home');

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
  <nav
        ref={navRef}
        className={`side-nav${menuOpen ? ' open' : ''}`}
        style={{
          padding: '1rem',
          width: '170px',
          borderRight: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', flexGrow: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
          <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
            <FontAwesomeIcon icon={faHome} style={{ marginRight: '0.5rem' }} /> Home
          </NavLink>
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
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          {!isAuthenticated ? (
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
              <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '0.5rem' }} /> Login
            </NavLink>
          ) : (
            <NavLink to="/logout" className={({ isActive }) => isActive ? 'active' : undefined} onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>
              <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '0.5rem' }} /> Logout
            </NavLink>
          )}
        </div>
      </nav>
      {/* Main content */}
      <div
        className="main-content"
        style={{ flex: 1, padding: '1rem' }}
        data-bs-theme={theme}
      >
        {showHomeBreadcrumb && (
          <div className={isDarkTheme ? 'bg-dark text-white py-2 border-bottom border-secondary' : 'bg-light py-2 border-bottom'}>
            <Container fluid="lg" className="d-flex align-items-center">
              <BreadCrumb
                model={breadcrumbItems}
                home={breadcrumbHome}
                className={breadcrumbClassName}
                data-bs-theme={theme}
                pt={{
                  root: { className: 'border-0 bg-transparent p-0' },
                  menu: { className: 'mb-0 bg-transparent d-flex align-items-center gap-1' },
                  menuitem: { className: `${breadcrumbItemClass} d-flex align-items-center` },
                  action: { className: 'bg-transparent border-0 text-decoration-none' },
                  label: { className: breadcrumbItemClass },
                  icon: { className: breadcrumbItemClass },
                  separator: { className: `${breadcrumbSeparatorClass} mx-2` }
                }}
              />
            </Container>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
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
        <div className="cookie-banner main-content" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#333', color:'white', padding: '1rem', borderTop: '1px solid #ccc', textAlign: 'center' }}>
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

