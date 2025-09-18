import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { getGlobal, setGlobal } from "../../utils/storage"; // for data storage
import { useAppContext } from "../../context/AppContext"; // for events updates
import MyModal from '../../utils/Modal';
import '../../utils/Modal.css';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import { BreadCrumb } from "primereact/breadcrumb";

const Home: React.FC = () => {
  const { user, setUser } = useAppContext(); // return json
  const [global, setGlobalstate] = useState<string>(getGlobal); // return array
  const [isVisible, setIsVisible] = useState(false);
  const [i, setI] = useState(parseInt(user?.split(" ").pop() || "0") || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  type MyData = { foo: string; };
  const { data, setData } = useAppContext<MyData>();
  const [open, setOpen] = useState(false);
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigate('/home')
        //console.log("Home clicked!");
      }
    },
    {
      label: "Todo",
      command: () => {
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
    if (data) {
      console.log('data read from context:', data.foo);
    }
    const initialData = { foo: "bar" };
    setData(initialData);
    console.log('data set to context:', initialData.foo);
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
    setIsVisible(prev => !prev);
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

  return (
  <>
    <div className="p-4 custom-breadcrumb">
        <BreadCrumb model={items} home={home} />
    </div>
    <div style={{ width: '100%' }}>
      <div style={{width: '400px', margin: '0 auto', backgroundColor: '#eee', padding: '16px', borderRadius: '8px'}}>
        <h2 style={{ textAlign: 'center' }}><FontAwesomeIcon icon={faHome} /> Home Page</h2>
        <div>
          <h6>User: {user ?? "No user logged in"}</h6>
          <button onClick={() => updateI()}><FontAwesomeIcon icon={faUser} /> Set AppContext User to Alice</button>
        </div>
  
        <div>
          <h6>User: {global ?? "No user logged in"}</h6>
          <button onClick={() => setGlobalstate("global Alice")}><FontAwesomeIcon icon={faUser} /> Set global User to Alice</button>
        </div>
  
        <h6>Toggle Div Example</h6>
        <div className="p-0">
          <button onClick={toggleDiv} className="bg-blue-500 text-black px-1 py-0 rounded">
            {isVisible ? 'Hide' : 'Show'} Content
          </button>
  
          {isVisible && (
            <div className="mt-4 p-4 bg-gray-100 rounded shadow">
              This is the content inside the div.
            </div>
          )}
        </div><br></br>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        
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
              that can be collapsed.
            </div>
        </Collapse>
      </div>

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
          <Outlet />
    </div>
  </>
  );
};

export default Home;
