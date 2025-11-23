import React, { useRef, useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { getlocalStorage, savelocalStorage } from './utils/storage';
import LoadingBar from 'react-top-loading-bar';
import yaml from 'js-yaml';
import Home from "./pages/Home/Home";
import TodoList from "./pages/Home/todo/TodoList";
import Contact from "./pages/Contact";
import About from './pages/About/About';
import AboutMe from './pages/About/about-me/AboutMe';
import { useAuth, JWT_KEY } from './auth/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { ToastProvider, useToast } from './context/ToastContext';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Unauthorized from './pages/Unauthorized';
import Logout from './pages/Logout';
import RegistrationPage from './pages/RegistrationPage';
import { BreadCrumb } from 'primereact/breadcrumb';
import { PrimeReactProvider } from 'primereact/api';
import Lara from "@primeuix/themes/lara";

const PRIME_THEME_CONFIG = {
  preset: Lara,
  options: {
    prefix: "p",
    darkModeSelector: "[data-theme='dark']",
    cssLayer: true,
  },
};

import {
  Collapse,
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Drawer,
  Paper
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHome, faSignInAlt, faSignOutAlt, faUser, faUsers, faEnvelope, faInfoCircle, faMoon, faSun, faIdBadge, faTasks, faUserPlus, faBars } from '@fortawesome/free-solid-svg-icons';

interface Config {
  port: number;
  backend: {
    url: string;
  };
}

const NotFound = () => <Typography variant="h3" sx={{ p: 4 }}>404 - Page Not Found</Typography>;

const App: React.FC = () => {
  const loadingRef = useRef<InstanceType<typeof LoadingBar>>(null!);

  return (
    <ToastProvider>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <PrimeReactProvider value={PRIME_THEME_CONFIG as any}>
        <Router>
          <InnerApp loadingRef={loadingRef} />
        </Router>
      </PrimeReactProvider>
    </ToastProvider>
  );
};

interface InnerAppProps {
  loadingRef: React.RefObject<InstanceType<typeof LoadingBar>>;
}

const InnerApp: React.FC<InnerAppProps> = ({ loadingRef }) => {
  const { isAuthenticated, role } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // For mobile drawer
  const [aboutOpen, setAboutOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const storedTheme = getlocalStorage<string>('theme');
    return storedTheme === 'dark' ? 'dark' : 'light';
  });
  const location = useLocation();
  const isDarkTheme = themeMode === 'dark';

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
        components: {
          MuiListItemButton: {
            styleOverrides: {
              root: {
                '&.active': {
                  color: themeMode === 'dark' ? '#ffffff' : 'inherit',
                  '& .MuiListItemIcon-root': {
                    color: themeMode === 'dark' ? '#ffffff' : 'inherit',
                  },
                  '& .MuiListItemText-primary': {
                    color: themeMode === 'dark' ? '#ffffff' : 'inherit',
                  },
                },
                '&:hover': {
                  backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                  },
                },
              },
            },
          },
        },
      }),
    [themeMode],
  );

  useEffect(() => {
    const consent = getlocalStorage<boolean>('cookieConsent');
    if (consent !== true) {
      setShowCookieBanner(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.setAttribute('data-bs-theme', themeMode);
    savelocalStorage('theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    fetch('/config.yaml')
      .then(response => response.text())
      .then(yamlText => {
        const config = yaml.load(yamlText) as Config;
        if (config.backend && config.backend.url) {
          axios.defaults.baseURL = config.backend.url;
        } else {
          console.warn('Backend URL not found in config.yaml, using default');
          axios.defaults.baseURL = 'http://localhost:5000';
        }
      })
      .catch(error => {
        console.error('Failed to load config.yaml:', error);
        axios.defaults.baseURL = 'http://localhost:5000';
      });
  }, []);

  useEffect(() => {
    const reqId = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        loadingRef.current.continuousStart();
        const token = getlocalStorage<string>(JWT_KEY);
        if (token) {
          if (!config.headers) config.headers = {} as AxiosRequestHeaders;
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );
    const resId = axios.interceptors.response.use(
      (res: AxiosResponse) => {
        loadingRef.current.complete();
        return res;
      },
      (err) => {
        console.error('HTTP Error:', err);
        loadingRef.current.complete();
        const errorMessage = err.response?.data?.error || err.response?.data?.detail || err.response?.data?.message 
            || err.message || 'An error occurred';
        showToast(errorMessage, 'danger');
        return Promise.reject(err);
      }
    );
    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, [loadingRef, showToast]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync submenu open state with URL
  useEffect(() => {
    setAboutOpen(location.pathname.startsWith('/about'));
  }, [location.pathname]);

  const handleAcceptCookies = () => {
    savelocalStorage('cookieConsent', true);
    setShowCookieBanner(false);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FontAwesomeIcon icon={faTasks} />
          <Typography variant="h6" component="span">Todo</Typography>
        </Box>
        <IconButton onClick={toggleTheme} size="small">
          <FontAwesomeIcon icon={isDarkTheme ? faSun : faMoon} />
        </IconButton>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        <ListItemButton component={NavLink} to="/home" onClick={() => setMenuOpen(false)} selected={location.pathname.startsWith('/home')}>
          <ListItemIcon><FontAwesomeIcon icon={faHome} /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        {isAuthenticated && (role === 'user' || role === 'admin') && (
          <ListItemButton component={NavLink} to="/user" onClick={() => setMenuOpen(false)} selected={location.pathname === '/user'}>
            <ListItemIcon><FontAwesomeIcon icon={faUser} /></ListItemIcon>
            <ListItemText primary="User" />
          </ListItemButton>
        )}
        {isAuthenticated && role === 'admin' && (
          <ListItemButton component={NavLink} to="/admin" onClick={() => setMenuOpen(false)} selected={location.pathname === '/admin'}>
            <ListItemIcon><FontAwesomeIcon icon={faUsers} /></ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItemButton>
        )}
        <ListItemButton component={NavLink} to="/contact/2?id=1&name=yan" onClick={() => setMenuOpen(false)} selected={location.pathname.startsWith('/contact')}>
          <ListItemIcon><FontAwesomeIcon icon={faEnvelope} /></ListItemIcon>
          <ListItemText primary="Contact" />
        </ListItemButton>
        
        <ListItemButton onClick={() => setAboutOpen(!aboutOpen)}>
          <ListItemIcon><FontAwesomeIcon icon={faInfoCircle} /></ListItemIcon>
          <ListItemText primary="About" />
          <FontAwesomeIcon icon={faChevronRight} style={{ transform: aboutOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </ListItemButton>
        <Collapse in={aboutOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/about/1" onClick={() => setMenuOpen(false)} selected={location.pathname.startsWith('/about')}>
              <ListItemIcon><FontAwesomeIcon icon={faIdBadge} /></ListItemIcon>
              <ListItemText primary="About Me" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        {!isAuthenticated && (
          <ListItemButton component={NavLink} to="/register" onClick={() => setMenuOpen(false)} selected={location.pathname === '/register'}>
            <ListItemIcon><FontAwesomeIcon icon={faUserPlus} /></ListItemIcon>
            <ListItemText primary="Register" />
          </ListItemButton>
        )}
        {!isAuthenticated ? (
          <ListItemButton component={NavLink} to="/login" onClick={() => setMenuOpen(false)} selected={location.pathname === '/login'}>
            <ListItemIcon><FontAwesomeIcon icon={faSignInAlt} /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItemButton>
        ) : (
          <ListItemButton component={NavLink} to="/logout" onClick={() => setMenuOpen(false)} selected={location.pathname === '/logout'}>
            <ListItemIcon><FontAwesomeIcon icon={faSignOutAlt} /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

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

  const showHomeBreadcrumb = location.pathname.startsWith('/home');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMenuOpen(true)}
          sx={{ mr: 2, display: { md: 'none' }, position: 'fixed', top: 10, left: 10, zIndex: 1100 }}
        >
          <FontAwesomeIcon icon={faBars} />
        </IconButton>

        {/* Sidebar Drawer for Mobile */}
        <Drawer
          variant="temporary"
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
        >
          {drawerContent}
        </Drawer>

        {/* Sidebar Permanent for Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
          }}
          open
        >
          {drawerContent}
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 240px)` } }}>
          {showHomeBreadcrumb && (
            <Paper elevation={1} sx={{ 
              mb: 2, 
              p: 1,
              '& .p-menuitem-text, & .p-menuitem-icon, & .p-breadcrumb-home': {
                color: themeMode === 'dark' ? '#ffffff !important' : '#000000 !important'
              },
              '& .p-menuitem-separator': {
                color: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7) !important' : 'rgba(0, 0, 0, 0.7) !important'
              }
            }}>
              <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} style={{ border: 'none', background: 'transparent' }} />
            </Paper>
          )}

          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home onToggleCookieBanner={() => setShowCookieBanner(!showCookieBanner)} isCookieBannerVisible={showCookieBanner} />}>
              <Route path="todo" element={<TodoList />} />
            </Route>
            <Route path="/about/:aboutId" element={<About />} >
              <Route path="about-me/:aboutMeId" element={<AboutMe />} />
            </Route>
            <Route path="/contact/:id" element={<Contact />} />
            <Route path="/register" element={<RegistrationPage />} />
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
        </Box>
      </Box>
      <LoadingBar color="#29d" height={3} ref={loadingRef} />
      
      {showCookieBanner && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, textAlign: 'center', zIndex: 1300 }} elevation={3}>
          <Typography variant="body2" component="span" sx={{ mr: 2 }}>
            By continuing to use this website, you agree that this website can store cookies on this device.
          </Typography>
          <Button variant="contained" size="small" onClick={handleAcceptCookies}>Accept</Button>
        </Paper>
      )}
    </ThemeProvider>
  );
};

export default App;

