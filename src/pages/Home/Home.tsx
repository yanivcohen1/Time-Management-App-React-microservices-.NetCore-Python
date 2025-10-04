import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "../../animation/slide-right.css";
import axios from 'axios';
import { getGlobal, setGlobal } from "../../utils/storage"; // for data storage
import { useAppContext } from "../../context/AppContext"; // for events updates
import MyModal from '../../utils/Modal';
import '../../utils/Modal.css';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Toast from 'react-bootstrap/Toast';
import ToastContainer, { ToastPosition } from 'react-bootstrap/ToastContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import { BreadCrumb } from "primereact/breadcrumb";

const Home: React.FC = () => {
  const { user, setUser } = useAppContext(); // return json
  const [global, setGlobalstate] = useState<string>(getGlobal); // return array
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleB, setIsVisibleB] = useState(false);
  const [i, setI] = useState(parseInt(user?.split(" ").pop() || "0") || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const outletRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  type MyData = { foo: string; };
  const { data, setData } = useAppContext<MyData>();
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [position, setPosition] = useState<ToastPosition>("top-center");
  const toastContainerStyle: React.CSSProperties = {
    zIndex: 9999,
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    ...(position.includes('bottom') ? { bottom: '1rem' } : { top: '1rem' })
  };
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('one');
  const [confirmedOption, setConfirmedOption] = useState<string>('');
  // Add sticky save message state and toast message state
  const [showStickySave, setShowStickySave] = useState(true);
  const [toastMessage, setToastMessage] = useState<string>('');
  // Style for sticky save message banner
  const stickyStyle: React.CSSProperties = {
    position: 'sticky',
    top: '0.2rem',
    backgroundColor: '#fff',
    padding: '8px 16px',
    zIndex: 1000,
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // size banner to content and center horizontally
    width: 'fit-content',
    margin: '0 auto',
  };
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        setIsVisible(true);
        navigate('/home')
        //console.log("Home clicked!");
      }
    },
    {
      label: "Todo",
      command: () => {
        setIsVisible(false);
        navigate('todo')
        // alert("Products clicked!");
      }
  }];

  const home = {
    icon: "pi pi-home",
    url: "/"
  };
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
      alert(data.message);
    } catch (e) {
      console.error(e);
    }
  };

  // Handler for save confirmation
  const handleSave = (confirm: boolean) => {
    setToastMessage(confirm ? 'Saved successfully!' : 'Save cancelled');
    setPosition('top-center');
    setShowToast(true);
    setShowStickySave(false);
  };

  return (
  <>
    <div className="p-1 custom-breadcrumb">
        <BreadCrumb model={items} home={home} />
    </div>
    {showStickySave && (
      <div style={stickyStyle}>
        <span>Do you want to save changes? &nbsp;</span>
        <div>
          <button className="btn btn-primary btn-sm me-2" onClick={() => handleSave(true)}>Yes</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleSave(false)}>No</button>
        </div>
      </div>
    )}
    <div style={{ width: '100%' }}>
      {isVisible && (
        <div style={{width: '400px', margin: '0 auto', backgroundColor: '#eee', padding: '16px', borderRadius: '8px'}}>
          <h2 style={{ textAlign: 'center' }}><FontAwesomeIcon icon={faHome} /> Home Page</h2>
          <div ref={inputRef}>
            <h6>User: {user ?? "No user logged in"}</h6>
            <button  onClick={() => updateI()}><FontAwesomeIcon icon={faUser} /> Set AppContext User to Alice</button>
          </div>
    
          <div>
            <h6>User: {global ?? "No user logged in"}</h6>
            <button onClick={() => setGlobalstate("global Alice")}><FontAwesomeIcon icon={faList} /> Set global User to Alice</button>
          </div>
    
          <h6>Toggle Div Example</h6>
          <div className="p-0">
            <button onClick={toggleDiv} className="bg-blue-500 text-black px-1 py-0 rounded">
              {isVisibleB ? 'Hide' : 'Show'} Content
            </button>
    
            {isVisibleB && (
              <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                This is the content inside the div.
              </div>
            )}
          </div><br></br>
          <button onClick={() => setIsModalOpen(true)}>Open My Modal</button>
          
          <br></br><br></br>
          <button onClick={fetchData}>Fetch Data</button>
          
          <br></br><br></br>
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            {open! ? 'Collapse' : 'Uncollapse'} Content
          </Button>
          <Collapse in={open}>
            <div className="bg-gray-100 rounded shadow" id="example-collapse-text">
                This is the content inside the div. <br></br>
                that can be collapsed.<br></br>
                <Button onClick={()=>{setShowToast(true); setPosition("top-center")}} className="mb-2">
                  Toast
                </Button>
            </div>
          </Collapse><br></br><br></br>
          <Button onClick={()=>{setShowToast(true); setPosition("bottom-center")}} className="mb-2">
            Toast <strong>with</strong> Animation
          </Button>
          {/* Button to manually show save message banner */}
          <div style={{ margin: '0.1rem 0' }}>
            <button className="btn btn-outline-primary" onClick={() => setShowStickySave(true)}>
              Show Save sticky Message
            </button>
          </div>
          <br></br>
          <button onClick={() => setShowSelectBox(true)}>Show Selection Box</button>
          {confirmedOption && <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>Selected: {confirmedOption}</span>}
        </div>
      )}

      {/* Modal window - the contant of MyModal will be project in children prop */}
      <div>
        <MyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {/* The content wrapped inside will be strongly typed */}
          <h2>Welcome to the Modal!</h2>
          <p>This is some flexible content for the modal body.</p>
          <ul>
            <li>You can put anything here</li>
            <li>Forms, lists, images, and more</li>
            <h2>User: {user ?? "No user logged in"}</h2>
            <button onClick={() => updateI()}>Set AppContext User to Alice</button>
          </ul>
        </MyModal>
      </div>
      {/* Animate route changes */}
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          nodeRef={outletRef}
          classNames="slide"
          timeout={300}
          exit={false}
          appear={true}
          mountOnEnter
          unmountOnExit
        >
          <div ref={outletRef}>
            <Outlet />
          </div>
        </CSSTransition>
      </TransitionGroup>

      <ToastContainer
          className="p-3"
          position={position}
          style={toastContainerStyle}>
        <Toast show={showToast} onClose={()=>setShowToast(false)} delay={3000} bg="dark" autohide>
          <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
            <Toast.Body className='text-white'>
              {toastMessage}
            </Toast.Body>
        </Toast>
      </ToastContainer>

      {showSelectBox && (
        <div style={{position: 'sticky', bottom: 0, backgroundColor: '#fff', padding: '16px', boxShadow: '0 -2px 5px rgba(0,0,0,0.3)', marginTop: '16px', textAlign: 'center'}}>
          <h6>Select an option:</h6>
          <select value={selectedOption} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedOption(e.target.value)}>
            <option value="one">One</option>
            <option value="two">Two</option>
            <option value="tree">Tree</option>
          </select>
          <button 
            onClick={() => { 
              setConfirmedOption(selectedOption);
              console.log('Selected:', selectedOption);
              setShowSelectBox(false);
            }} 
            style={{marginLeft: '8px'}}>Accept
          </button>
        </div>
      )}
    </div>
  </>
  );
};

export default Home;
