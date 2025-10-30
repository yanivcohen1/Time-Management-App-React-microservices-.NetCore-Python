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
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Collapse from 'react-bootstrap/Collapse';
import { useToast } from "../../context/ToastContext";
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

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
  const [showOverlay, setShowOverlay] = useState(false);
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

  // Handler for save confirmation
  const handleSave = (confirm: boolean) => {
    showToast(confirm ? 'Saved successfully!' : 'Save cancelled', confirm ? 'success' : 'secondary', 'bottom-center');
    setShowStickySave(false);
    setStickyMsg(confirm)
  };

  useEffect(() => {
    const shouldShow = !location.pathname.startsWith('/home/todo');
    setIsVisible(shouldShow);
  }, [location.pathname]);

  return (
    <>
      {showStickySave && stickyPosition === 'current' && (
        <Container fluid="lg" className="my-2 d-flex justify-content-center" style={stickySaveWrapperStyle}>
          <div
            className="alert alert-primary mb-0 d-flex justify-content-between align-items-center gap-3 shadow-sm py-2 px-3"
            style={{ width: 'fit-content', maxWidth: '100%', padding: '0.5rem 0.75rem' }}
          >
            <span className="fw-semibold">Save changes?</span>
            <div className="d-flex gap-2">
              <Button size="sm" variant="primary" onClick={() => handleSave(true)}>Yes</Button>
              <Button size="sm" variant="secondary" onClick={() => handleSave(false)}>No</Button>
            </div>
          </div>
        </Container>
      )}
      {showStickySave && stickyPosition === 'top' && (
        <div
          className="alert alert-primary mb-0 d-flex justify-content-between align-items-center gap-3 shadow-sm py-2 px-3"
          style={fixedTopStyle}
        >
          <span className="fw-semibold">Save changes?</span>
          <div className="d-flex gap-2">
            <Button size="sm" variant="primary" onClick={() => handleSave(true)}>Yes</Button>
            <Button size="sm" variant="secondary" onClick={() => handleSave(false)}>No</Button>
          </div>
        </div>
      )}
      {showStickySave && stickyPosition === 'bottom' && (
        <div
          className="alert alert-primary mb-0 d-flex justify-content-between align-items-center gap-3 shadow-sm py-2 px-3"
          style={fixedBottomStyle}
        >
          <span className="fw-semibold">Save changes?</span>
          <div className="d-flex gap-2">
            <Button size="sm" variant="primary" onClick={() => handleSave(true)}>Yes</Button>
            <Button size="sm" variant="secondary" onClick={() => handleSave(false)}>No</Button>
          </div>
        </div>
      )}

      <Container
        fluid="lg"
        className="py-4"
      >
        <Row className="g-4">
          {isVisible && (
            <Col xs={12} md={8} lg={6} className="mx-auto">
              <Card className={`shadow-sm ${isDarkTheme ? 'bg-dark text-white border-secondary' : ''}`}>
                <Card.Header className={`text-center ${isDarkTheme ? 'bg-dark text-white border-secondary' : 'bg-white'}`}>
                  <h2 className="mb-0"><FontAwesomeIcon icon={faHome} className="me-2" />Home Page</h2>
                </Card.Header>
                <Card.Body className={isDarkTheme ? 'bg-dark text-white' : undefined}>
                  <Stack gap={3}>
                    <div ref={inputRef}>
                      <h6 className="text-muted mb-2">App Context: {user ?? 'No user logged in'}</h6>
                      <Card className={`border-0 ${isDarkTheme ? 'bg-dark text-white' : 'bg-light'}`}>
                        <Card.Body className={`d-flex justify-content-between align-items-center ${isDarkTheme ? 'text-white' : ''}`}>
                          
                          <Button variant="outline-primary" size="sm" onClick={updateI}>
                            <FontAwesomeIcon icon={faUser} className="me-2" />Set AppContext User to Alice
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>

                    <div>
                      <h6 className="text-muted mb-2">Global Storage: {global ?? 'No user logged in'}</h6>
                      <Card className={`border-0 ${isDarkTheme ? 'bg-dark text-white' : 'bg-light'}`}>
                        <Card.Body className={`d-flex justify-content-between align-items-center ${isDarkTheme ? 'text-white' : ''}`}>
                          <Button variant="outline-success" size="sm" onClick={() => setGlobalstate('global Alice')}>
                            <FontAwesomeIcon icon={faList} className="me-2" />Set global User to Alice
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>

                    <div>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button variant="info" size="sm" onClick={onToggleCookieBanner}>
                          {isCookieBannerVisible ? 'Hide' : 'Show'} Cookie Banner
                        </Button>
                      </div>
                    </div>

                    <Stack direction="horizontal" gap={2} className="flex-wrap">
                      <Button variant="primary" onClick={() => setIsModalOpen(true)}>Open Custom Modal</Button>
                      <Button variant="outline-secondary" onClick={fetchData}>Fetch Data</Button><br />
                      <Button
                        variant={isDarkTheme ? 'outline-light' : 'outline-dark'}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      >
                        {open ? 'Collapse' : 'Expand'} Content
                      </Button>
                    </Stack>

                    <Collapse in={open}>
                      <div>
                        <Card ref={expandRef}>
                          <Card.Body>
                            <div id="example-collapse-text">
                              <p className="mb-2">This is the content inside the div that can be collapsed.</p>
                              <Button onClick={() => showToast('Toast message', 'dark', 'top-center')} className="mb-2">
                                Toast
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </Collapse>

                    <Stack direction="horizontal" gap={2} className="flex-wrap">
                      <Button variant="outline-primary" onClick={() => setShowStickySave(true)}>
                        Show Save Sticky Message
                      </Button>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="sticky-position-dropdown">
                          Position: {stickyPosition}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setStickyPosition('current')}>Current</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStickyPosition('top')}>Stick to Top</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStickyPosition('bottom')}>Stick to Bottom</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      {!showStickySave && (
                        <span className="p-2 mb-0" style={{ fontSize: '0.875rem' }}>
                          Selection: {stickyMsg ? 'Save' : 'Dismiss'}
                        </span>
                    )}
                    </Stack>

                    
                    <div className="d-flex align-items-center gap-2">
                      <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                          Select Option
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setSelectedOption('save')}>Save</Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectedOption('nosave')}>No Save</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      {selectedOption && <span>Selected: {selectedOption}</span>}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <OverlayTrigger
                        show={showOverlay}
                        onToggle={setShowOverlay}
                        trigger="click"
                        placement="top"
                        overlay={
                          <Popover>
                            <Popover.Body>
                              <p>Save changes?</p>
                              <div className="d-flex gap-2">
                                <Button size="sm" variant="primary" onClick={() => {setOverlaySelection('Yes'); setShowOverlay(false);}}>Yes</Button>
                                <Button size="sm" variant="secondary" onClick={() => {setOverlaySelection('No'); setShowOverlay(false);}}>No</Button>
                              </div>
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <Button variant="outline-warning">Show Save Overlay</Button>
                      </OverlayTrigger>
                      {overlaySelection && (
                        <span className="p-2 mb-0" style={{ fontSize: '0.875rem' }}>
                          Selection: {overlaySelection}
                        </span>
                      )}
                    </div>
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        <MyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="mb-3">Welcome to the Modal!</h2>
          <p>This is some flexible content for the modal body.</p>
          <ul className="mb-0">
            <li>You can put anything here</li>
            <li>Forms, lists, images, and more</li>
            <li className="mt-2">
              <span className="me-2">User: {user ?? 'No user logged in'}</span>
              <Button size="sm" onClick={updateI}>Set AppContext User to Alice</Button>
            </li>
          </ul>
        </MyModal>

        <TransitionGroup>
          <CSSTransition
            key={location.key}
            nodeRef={outletRef}
            classNames="slide"
            timeout={300}
            exit={false}
            appear
            mountOnEnter
            unmountOnExit
          >
            <div ref={outletRef}>
              <Outlet />
            </div>
          </CSSTransition>
        </TransitionGroup>

      </Container>
    </>
  );
};

export default Home;
