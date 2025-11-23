import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "../../animation/slide-right.css";
import "../../animation/fade.css";
import axios from 'axios';
import { getGlobal, setGlobal } from "../../utils/storage"; // for data storage
import { useTheme } from "../../hooks/useTheme";
import { useAppContext } from "../../context/AppContext"; // for events updates
import MyModal from '../../utils/Modal';
import '../../utils/Modal.css';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
  Stack,
  Collapse,
  Box,
  Alert,
  Menu,
  MenuItem,
  Popover
} from '@mui/material';
import { useToast } from "../../context/ToastContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../../components/CustomButton';
import CustomSelect from '../../components/CustomSelect';
import type { Option } from '../../components/CustomSelect';

interface HomeProps {
  onToggleCookieBanner: () => void;
  isCookieBannerVisible: boolean;
}

const Home: React.FC<HomeProps> = ({ onToggleCookieBanner, isCookieBannerVisible }) => {
  const { user, setUser } = useAppContext(); // return json
  const [global, setGlobalstate] = useState<string>(getGlobal); // return array
  const [isVisible, setIsVisible] = useState(true);
  const [i, setI] = useState(parseInt(user?.split(" ").pop() || "0") || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const outletRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const expandRef = useRef<HTMLDivElement>(null);
  type MyData = { foo: string; };
  const { data, setData } = useAppContext<MyData>();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isDarkTheme = theme === 'dark';
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [overlaySelection, setOverlaySelection] = useState<string>('');
  const { showToast } = useToast();
  const stickySaveWrapperStyle: React.CSSProperties = {
    position: 'sticky',
    top: '0.3rem',
    zIndex: 1200
  };
  const fixedTopStyle: React.CSSProperties = {
    position: 'fixed',
    top: '0.3rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1200,
    width: 'fit-content',
    maxWidth: '100%'
  };
  const fixedBottomStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '0.3rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1200,
    width: 'fit-content',
    maxWidth: '100%'
  };
  // Add sticky save message state and toast message state
  const [showStickySave, setShowStickySave] = useState(true);
  const [stickyMsg, setStickyMsg] = useState(true);
  const [stickyPosition, setStickyPosition] = useState<'current' | 'top' | 'bottom'>('current');
  const [selectedFruit, setSelectedFruit] = useState<string>("apple");

  // State for MUI Menu (Sticky Position)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // State for MUI Menu (Select Option)
  const [optionAnchorEl, setOptionAnchorEl] = useState<null | HTMLElement>(null);
  const openOptionMenu = Boolean(optionAnchorEl);
  const handleOptionMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOptionAnchorEl(event.currentTarget);
  };
  const handleOptionMenuClose = () => {
    setOptionAnchorEl(null);
  };

  // State for MUI Popover
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };
  const openPopover = Boolean(popoverAnchorEl);

  const fruits: Option[] = [
    { label: "🍎 Apple", value: "apple" },
    { label: "🍌 Banana", value: "banana" },
    { label: "🍊 Orange", value: "orange" },
    { label: "🍇 Grape", value: "grape" },
  ];
  const [selectedMode, setSelectedMode] = useState<string>('normal');
  const modes: Option[] = [
    { label: "Mock", value: "normal" },
    { label: "Admin", value: "admin" },
  ];
  interface ApiResponse {
    message: string;
  }
  // update one time on load
  useEffect(() => {
    console.log('Home mounted');
    if (data) {
      console.log('data read from context:', data.foo);
    }
    const initialData = { foo: "bar" };
    setData(initialData);
    console.log('data set to context:', initialData.foo);
    console.log('useRef read inner text:', inputRef.current?.innerText);

    return () => {
      console.log('Home is about to unmount');
      // put your cleanup logic here
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // run every time global changes
  useEffect(() => {
    try {
      setGlobal(global); // update the global variable
      console.log('global set:', global);
    } catch (error) {
      console.error('Error saving todos to global Storage:', error);
    }
  }, [global]);

  const updateI = () => {
    setUser("AppContext Alice " + (i+1))
    setI(i+1);
  }

  const fetchData = async () => {
    try {
      const { data } = await axios.get<ApiResponse>('/api/data');
      showToast(data.message, 'success', 'top-center');
    } catch (e) {
      console.error(e);
      let errorMessage = 'Failed to fetch data';
      if (axios.isAxiosError(e)) {
        const responseMessage = (e.response?.data as Partial<ApiResponse> | undefined)?.message;
        errorMessage = responseMessage ?? e.message ?? errorMessage;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      showToast(errorMessage, 'danger', 'top-center');
    }
  };

  const handleGetReports = async () => {
    try {
      const response = await axios.get('/api/admin/reports');
      showToast(`Reports: ${JSON.stringify(response.data)}`, 'success', 'top-end');
    } catch (error) {
      console.error('Error fetching reports:', error);
      //showToast('Failed to fetch reports', 'danger', 'top-end');
    }
  };

  // Handler for save confirmation
  const handleSave = (confirm: boolean) => {
    showToast(confirm ? 'Saved successfully!' : 'Save cancelled', confirm ? 'success' : 'secondary', 'bottom-center');
    setShowStickySave(false);
    setStickyMsg(confirm)
  };

  const renderStickySave = (position: 'top' | 'bottom') => {
    const style = position === 'top' ? fixedTopStyle : fixedBottomStyle;
    return (
      <Alert
        severity="info"
        sx={{
          ...style,
          boxShadow: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 1,
          px: 2
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="contained" onClick={() => handleSave(true)}>Yes</Button>
            <Button size="small" variant="outlined" onClick={() => handleSave(false)}>No</Button>
          </Box>
        }
      >
        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>Save changes?</Typography>
      </Alert>
    );
  };

  useEffect(() => {
    const shouldShow = !location.pathname.startsWith('/home/todo');
    setIsVisible(shouldShow);
  }, [location.pathname]);

  return (
    <>
      {showStickySave && stickyPosition === 'current' && (
        <Container maxWidth="lg" sx={{ my: 2, display: 'flex', justifyContent: 'center', ...stickySaveWrapperStyle }}>
          <Alert
            severity="info"
            sx={{
              width: 'fit-content',
              maxWidth: '100%',
              py: 1,
              px: 2,
              boxShadow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained" onClick={() => handleSave(true)}>Yes</Button>
                <Button size="small" variant="outlined" onClick={() => handleSave(false)}>No</Button>
              </Box>
            }
          >
            <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>Save changes?</Typography>
          </Alert>
        </Container>
      )}
      {showStickySave && stickyPosition === 'top' && renderStickySave('top')}
      {showStickySave && stickyPosition === 'bottom' && renderStickySave('bottom')}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {isVisible && (
            <Grid size={{ xs: 12, md: 8, lg: 6 }}>
              <Card sx={{ boxShadow: 1 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <FontAwesomeIcon icon={faHome} />
                      <Typography variant="h5" component="span">Home Page</Typography>
                    </Box>
                  }
                  sx={{ textAlign: 'center', bgcolor: isDarkTheme ? 'grey.900' : 'background.paper', color: isDarkTheme ? 'common.white' : 'text.primary' }}
                />
                <CardContent>
                  <Stack gap={3}>
                    <div ref={inputRef}>
                      <Card variant="outlined" sx={{ bgcolor: isDarkTheme ? 'grey.900' : 'grey.50' }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:last-child': { pb: 2 } }}>
                          <Typography variant="subtitle2" color="text.secondary">App Context: {user ?? 'No user logged in'}</Typography>
                          <Button variant="outlined" color="primary" size="small" onClick={updateI} startIcon={<FontAwesomeIcon icon={faUser} />}>
                            Set AppContext User to Alice
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Card variant="outlined" sx={{ bgcolor: isDarkTheme ? 'grey.900' : 'grey.50' }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:last-child': { pb: 2 } }}>
                          <Typography variant="subtitle2" color="text.secondary">Global Storage: {global ?? 'No user logged in'}</Typography>
                          <Button variant="outlined" color="success" size="small" onClick={() => setGlobalstate('global Alice')} startIcon={<FontAwesomeIcon icon={faList} />}>
                            Set global User to Alice
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button variant="contained" color="info" size="small" onClick={onToggleCookieBanner}>
                          {isCookieBannerVisible ? 'Hide' : 'Show'} Cookie Banner
                        </Button>
                      </Box>
                    </div>

                    <Stack direction="row" gap={2} flexWrap="wrap">
                      <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>Open Custom Modal</Button>
                      <Box sx={{ width: '100%' }} />
                      <Button variant="outlined" color="secondary" onClick={() => selectedMode === 'admin' ? handleGetReports() : fetchData()}>Fetch Data</Button>
                      <CustomSelect
                        options={modes}
                        value={selectedMode}
                        onChange={setSelectedMode}
                      />
                      <Box sx={{ width: '100%' }} />
                      <Button
                        variant={isDarkTheme ? 'outlined' : 'outlined'}
                        color={isDarkTheme ? 'inherit' : 'primary'}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      >
                        {open ? 'Collapse' : 'Expand'} Content
                      </Button>
                    </Stack>

                    <Collapse in={open}>
                      <div>
                        <Card ref={expandRef} variant="outlined">
                          <CardContent>
                            <div id="example-collapse-text">
                              <Typography paragraph>This is the content inside the div that can be collapsed.</Typography>
                              <Button onClick={() => showToast('Toast message', 'dark', 'top-center')} sx={{ mb: 2 }}>
                                Toast
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </Collapse>

                    <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
                      <Button variant="outlined" onClick={() => setShowStickySave(true)}>
                        Show Sticky Message
                      </Button>
                      
                      <Box>
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          onClick={handleMenuClick}
                          endIcon={<span style={{ fontSize: '0.7em' }}>▼</span>}
                        >
                          Position: {stickyPosition}
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={openMenu}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={() => { setStickyPosition('current'); handleMenuClose(); }}>Current</MenuItem>
                          <MenuItem onClick={() => { setStickyPosition('top'); handleMenuClose(); }}>Stick to Top</MenuItem>
                          <MenuItem onClick={() => { setStickyPosition('bottom'); handleMenuClose(); }}>Stick to Bottom</MenuItem>
                        </Menu>
                      </Box>

                      {!showStickySave && (
                        <Typography variant="body2" sx={{ p: 1 }}>
                          Selection: {stickyMsg ? 'Save' : 'Dismiss'}
                        </Typography>
                    )}
                    </Stack>

                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleOptionMenuClick}
                          endIcon={<span style={{ fontSize: '0.7em' }}>▼</span>}
                        >
                          Select Option
                        </Button>
                        <Menu
                          anchorEl={optionAnchorEl}
                          open={openOptionMenu}
                          onClose={handleOptionMenuClose}
                        >
                          <MenuItem onClick={() => { setSelectedOption('save'); handleOptionMenuClose(); }}>Save</MenuItem>
                          <MenuItem onClick={() => { setSelectedOption('nosave'); handleOptionMenuClose(); }}>No Save</MenuItem>
                        </Menu>
                      </Box>
                      {selectedOption && <Typography variant="body2">Selected: {selectedOption}</Typography>}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button variant="outlined" color="warning" onClick={handlePopoverClick}>Show Save Overlay</Button>
                      <Popover
                        open={openPopover}
                        anchorEl={popoverAnchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Typography gutterBottom>Save changes?</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="contained" onClick={() => {setOverlaySelection('Yes'); handlePopoverClose();}}>Yes</Button>
                            <Button size="small" variant="outlined" onClick={() => {setOverlaySelection('No'); handlePopoverClose();}}>No</Button>
                          </Box>
                        </Box>
                      </Popover>
                      
                      {overlaySelection && (
                        <Typography variant="body2" sx={{ p: 1 }}>
                          Selection: {overlaySelection}
                        </Typography>
                      )}
                    </Box>
                    <CustomButton
                      variant="danger"
                      onClick={updateI}
                      label='My costum botton'
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, p: 4 }}>

                      <CustomSelect
                        label="My costom select fruit"
                        options={fruits}
                        value={selectedFruit}
                        onChange={setSelectedFruit}
                      />

                      <Typography variant="h6" sx={{ mt: 4 }}>
                        You selected: <Box component="span" sx={{ fontWeight: 'bold' }}>{selectedFruit}</Box>
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          <Grid size={{ xs: 12 }}>
            <TransitionGroup component={null}>
              <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}
                nodeRef={outletRef}
              >
                <div ref={outletRef}>
                  <Outlet />
                </div>
              </CSSTransition>
            </TransitionGroup>
          </Grid>
        </Grid>
      </Container>

      <MyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Custom Modal Content</h3>
        <p>This is a custom modal.</p>
        <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
      </MyModal>
    </>
  );
};

export default Home;
