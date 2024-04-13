import React, { useState } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; // Make sure your CSS file path is correct
import Sidebar from './Sidebar'; // Import Sidebar component
import Dashboard from './Pages/Dashboard';
import Events from './Pages/Events';
import Faq from './Pages/Faq';
import Login from './Components/Login';
import BIndigency from './Transactions/BIndigency';
import BClearance from './Transactions/BClearance';
import GMoral from './Transactions/GMoral';
import Approved from './Transactions/Approved';
import Archived from './Transactions/Archived';
import Denied from './Transactions/Denied';
import FinishedEvents from './Transactions/FinishedEvents';
import Residents from './Residents';
import SuperDash from './SuperAdmin/SuperDash';
import SuperEvents from './SuperAdmin/SuperEvents';
import SuperResidents from './SuperAdmin/SuperResidents';
import SuperApproved from './SuperAdmin/SuperApproved';
import SuperDenied from './SuperAdmin/SuperDenied';
import SuperArchived from './SuperAdmin/SuperArchived';
import SBI from './SuperAdmin/SBI';
import SBC from './SuperAdmin/SBC';
import SGM from './SuperAdmin/SGM';
import Admins from './SuperAdmin/Admins';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },

  {
    path: '/dashboard',
    element: <Dashboard />,
  },

  {
    path: '/about',
    element: <Events />,
  },
  {
    path: '/faq',
    element: <Faq />,
  },
  {
    path: '/indigencies',
    element: <BIndigency/>
  },
  {
    path: '/clearances',
    element: <BClearance/>
  },
  {
    path: '/gmoral',
    element: <GMoral/>
  },
  {
    path: '/approved',
    element: <Approved/>
  },
  {
    path: '/archived',
    element: <Archived/>
  },
  {
    path: '/denied',
    element: <Denied/>
  },
  {
    path: '/finished',
    element: <FinishedEvents/>

  },
  {
    path: '/residents',
    element: <Residents/>

  },
  {
    path: '/superadmin',
    element: <SuperDash/>

  },
  {
    path: '/superevent',
    element: <SuperEvents/>

  },
  {
    path: '/superresident',
    element: <SuperResidents/>

  },
  {
    path: '/superapproved',
    element: <SuperApproved/>

  },
  {
    path: '/superdenied',
    element: <SuperDenied/>

  },
  {
    path: '/superarchived',
    element: <SuperArchived/>

  },
  {
    path: '/sbi',
    element: <SBI/>

  },
 
  {
    path: '/sbc',
    element: <SBC/>

  },
   
  {
    path: '/sgm',
    element: <SGM/>

  },
  {
    path: '/admins',
    element: <Admins/>

  },
 
 
 
 
  
]);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Assuming you have a function to set login state
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  document.title = "Santa Cruz";

  return (
    <React.StrictMode>
      <RouterProvider router={router}>
        <>
          <Sidebar /> {/* Render the Sidebar component */}
          <Login /> {/* Assuming Home is your main component */}
        </>
      </RouterProvider>
    </React.StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<App />); // Use createRoot from react-dom/client
