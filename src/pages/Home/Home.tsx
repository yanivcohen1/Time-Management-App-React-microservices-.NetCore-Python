import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "../../animation/slide-right.css";
import axios from 'axios';
import { getGlobal, setGlobal } from "../../utils/storage"; // for data storage
import { useTheme } from "../../hooks/useTheme";
import { useAppContext } from "../../context/AppContext"; // for events updates
import MyModal from '../../utils/Modal';
import '../../utils/Modal.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Toast from 'react-bootstrap/Toast';
import ToastContainer, { ToastPosition } from 'react-bootstrap/ToastContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList } from '@fortawesome/free-solid-svg-icons';

const Home: React.FC = () => {
  const { user, setUser } = useAppContext(); // return json
  const [global, setGlobalstate] = useState<string>(getGlobal); // return array
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleB, setIsVisibleB] = useState(false);
  const [i, setI] = useState(parseInt(user?.split(" ").pop() || "0") || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const outletRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  type MyData = { foo: string; };
  const { data, setData } = useAppContext<MyData>();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isDarkTheme = theme === 'dark';
  const [showToast, setShowToast] = useState(false);
  const [position, setPosition] = useState<ToastPosition>("top-center");
  const toastContainerStyle: React.CSSProperties = {
    zIndex: 1080,
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    ...(position.includes('bottom') ? { bottom: '1rem' } : { top: '1rem' })
  };
  const stickySaveWrapperStyle: React.CSSProperties = {
    position: 'sticky',
    top: '1rem',
    zIndex: 1090
  };
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('one');
  const [confirmedOption, setConfirmedOption] = useState<string>('');
  // Add sticky save message state and toast message state
  const [showStickySave, setShowStickySave] = useState(true);
  const [toastMessage, setToastMessage] = useState<string>('');
  type ToastVariant = 'dark' | 'success' | 'danger' | 'secondary';
  const [toastVariant, setToastVariant] = useState<ToastVariant>('dark');
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

  const toggleDiv = () => {
    setIsVisibleB(prev => !prev);
  };

  const updateI = () => {
    setUser("AppContext Alice " + (i+1))
    setI(i+1);
  }

  const fetchData = async () => {
    try {
      const { data } = await axios.get<ApiResponse>('/api/data');
      setToastMessage(data.message);
      setToastVariant('success');
      setPosition('top-center');
      setShowToast(true);
    } catch (e) {
      console.error(e);
      let errorMessage = 'Failed to fetch data';
      if (axios.isAxiosError(e)) {
        const responseMessage = (e.response?.data as Partial<ApiResponse> | undefined)?.message;
        errorMessage = responseMessage ?? e.message ?? errorMessage;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      setToastMessage(errorMessage);
      setToastVariant('danger');
      setPosition('top-center');
      setShowToast(true);
    }
  };

  // Handler for save confirmation
  const handleSave = (confirm: boolean) => {
    setToastMessage(confirm ? 'Saved successfully!' : 'Save cancelled');
    setToastVariant(confirm ? 'success' : 'secondary');
    setPosition('bottom-center');
    setShowToast(true);
    setShowStickySave(false);
  };

  useEffect(() => {
    const shouldShow = !location.pathname.startsWith('/home/todo');
    setIsVisible(shouldShow);
  }, [location.pathname]);

  return (
    <>
      {showStickySave && (
        <Container fluid="lg" className="my-2 d-flex justify-content-center" style={stickySaveWrapperStyle}>
          <div
            className="alert alert-primary mb-0 d-flex justify-content-between align-items-center gap-3 shadow-sm py-2 px-3"
            style={{ width: 'fit-content', maxWidth: '100%', padding: '0.5rem 0.75rem' }}
          >
            <span className="fw-semibold">Do you want to save changes?</span>
            <div className="d-flex gap-2">
              <Button size="sm" variant="primary" onClick={() => handleSave(true)}>Yes</Button>
              <Button size="sm" variant="secondary" onClick={() => handleSave(false)}>No</Button>
            </div>
          </div>
        </Container>
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
                        <Button variant="info" size="sm" onClick={toggleDiv}>
                          {isVisibleB ? 'Hide' : 'Show'} Content
                        </Button>
                      </div>
                      <Collapse in={isVisibleB}>
                        <Card className={`mt-3 border-0 ${isDarkTheme ? 'bg-dark text-white' : 'bg-light'}`}>
                          <Card.Body>This is the content inside the div.</Card.Body>
                        </Card>
                      </Collapse>
                    </div>

                    <Stack direction="horizontal" gap={2} className="flex-wrap">
                      <Button variant="primary" onClick={() => setIsModalOpen(true)}>Open Custom Modal</Button>
                      <Button variant="outline-secondary" onClick={fetchData}>Fetch Data</Button>
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
                      <Card className={`border-0 ${isDarkTheme ? 'bg-dark text-white' : 'bg-light'}`} id="example-collapse-text">
                        <Card.Body className={isDarkTheme ? 'text-white' : undefined}>
                          <p className="mb-2">This is the content inside the div that can be collapsed.</p>
                          <Button onClick={() => { setShowToast(true); setPosition('top-center'); }} className="mb-2">
                            Toast
                          </Button>
                        </Card.Body>
                      </Card>
                    </Collapse>

                    <Button onClick={() => { setShowToast(true); setPosition('bottom-center'); }}>
                      Toast <strong>with</strong> Animation
                    </Button>

                    <Stack direction="horizontal" gap={2} className="flex-wrap">
                      <Button variant="outline-primary" onClick={() => setShowStickySave(true)}>
                        Show Save Sticky Message
                      </Button>
                      <Button
                        variant={isDarkTheme ? 'outline-light' : 'outline-dark'}
                        onClick={() => setShowSelectBox(true)}
                      >
                        Show Selection Modal
                      </Button>
                      {confirmedOption && (
                        <span className="fw-bold text-success">Selected: {confirmedOption}</span>
                      )}
                    </Stack>
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

        <Modal
          show={showSelectBox}
          onHide={() => setShowSelectBox(false)}
          centered
          contentClassName={isDarkTheme ? 'bg-dark text-white border-secondary' : undefined}
          data-bs-theme={theme}
        >
          <Modal.Header
            closeButton
            closeVariant={isDarkTheme ? 'white' : undefined}
            className={isDarkTheme ? 'bg-dark text-white border-secondary' : undefined}
          >
            <Modal.Title>Select an option</Modal.Title>
          </Modal.Header>
          <Modal.Body className={isDarkTheme ? 'bg-dark text-white' : undefined}>
            <Form>
              <Form.Group controlId="selectOption">
                <Form.Label className={isDarkTheme ? 'text-white' : undefined}>Available options</Form.Label>
                <Form.Select
                  value={selectedOption}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedOption(e.target.value)}
                  className={isDarkTheme ? 'bg-dark text-white border-secondary' : undefined}
                >
                  <option value="one">One</option>
                  <option value="two">Two</option>
                  <option value="tree">Tree</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className={isDarkTheme ? 'bg-dark border-secondary' : undefined}>
            <Button variant="secondary" onClick={() => setShowSelectBox(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setConfirmedOption(selectedOption);
                console.log('Selected:', selectedOption);
                setShowSelectBox(false);
              }}
            >
              Accept
            </Button>
          </Modal.Footer>
        </Modal>

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

        <ToastContainer className="p-3" position={position} style={toastContainerStyle}>
          <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} bg={toastVariant} autohide>
            <Toast.Header>
              <strong className="me-auto">Bootstrap</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body className="text-white d-flex justify-content-between align-items-center gap-3">
              <span>{toastMessage}</span>
              <Button
                size="sm"
                variant="outline-light"
                onClick={() => setShowToast(false)}
              >
                Close
              </Button>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </>
  );
};

export default Home;
