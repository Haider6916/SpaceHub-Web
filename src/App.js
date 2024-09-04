import { useState } from "react";
import { Box, CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import Error from "./pages/Common/Error/Error.jsx";
import Login from "./pages/Common/Login/Login.jsx";
import SignUp from "./pages/Common/SignUp/SignUp.jsx";
import ForgetPassword from "./pages/Common/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/Common/ResetPassword/ResetPassword";
import Verify from "./pages/Common/Verify/Verify";
import NotVerified from "./pages/Common/NotVerified/NotVerified";

import Dashboard from './pages/Main/Dashboard/Dashboard.jsx'
import Directory from './pages/Main/Directory/Directory.jsx'
import Listing from './pages/Main/Listing/Listing.jsx'
import Booking from './pages/Main/Booking/Booking.jsx'
import Plans from './pages/Main/Plans/Plans.jsx'
import Visitors from './pages/Main/Visitors/Visitors.jsx'
import Events from './pages/Main/Events/Events.jsx'

import Calendar from './pages/Maintaince/Calendar/Calendar.jsx'
import Tasks from './pages/Maintaince/Tasks/Tasks.jsx'

import PerksAndBenefits from './pages/Other/Perks&Benefits/PerksAndBenefits.jsx'
import Support from './pages/Other/Support/Support.jsx'
import Settings from './pages/Other/Settings/Settings.jsx'
import Language from './pages/Other/Language/Language.jsx'
import Layout from "./pages/Layout.jsx";
import RequireAuth from "./pages/RequireAuth.jsx";

import Announcements from "./pages/Main/Announcements/Announcements";
import { Toaster } from "react-hot-toast";
import { closeAddTicketDrawer, closeViewDrawer } from './Redux/supportSlice';
import { useDispatch } from "react-redux";
import { closeAddBookingDrawer } from "./Redux/bookingsSlice.js";


function App() {
  const [role, setRole] = useState('space_owner')
  console.log(process.env.REACT_APP_ENV);

  const dispatch = useDispatch()

  window.addEventListener('beforeunload', () => {
    dispatch(closeAddTicketDrawer());
    dispatch(closeViewDrawer());
    dispatch(closeAddBookingDrawer())
    // dispatch(close)
  });

  return (
    <>
      <CssBaseline />
      <Box>
        <Toaster />
      </Box>
      <Routes>
        {/* Publiv Routes  */}
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path='/reset/:id' element={<ResetPassword />} />
        <Route path='/verify/:id' element={<Verify />} />
        <Route path='/not-verified' element={<NotVerified />} />

        {/* Private Routes */}
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth />}>
            {role === 'space_owner' ? (
              <>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='dashboard/announcements' element={<Announcements />} />
                <Route path='directory' element={<Directory />} />
                <Route path='listing' element={<Listing />} />
                <Route path='booking' element={<Booking />} />
                <Route path='plans' element={<Plans />} />
                <Route path='visitors' element={<Visitors />} />
                <Route path='events' element={<Events />} />
                <Route path='calendar' element={<Calendar />} />
                <Route path='tasks' element={<Tasks />} />
                <Route path='perks&benefits' element={<PerksAndBenefits />} />
                <Route path='support' element={<Support />} />
                <Route path='settings/integrations' element={<Settings />} />
                <Route path='settings/payment&billing' element={<Settings />} />
                <Route path='language' element={<Language />} />
              </>
            ) : role === 'CompanyOwner' ? (
              <>
                <Route path='/company' element={<div> This section of code is for Company Owner routes</div>} />
              </>
            ) : (
              <>
                <Route path='/employee' element={<div> This section of code is for employee routes</div>} />
              </>
            )}

          </Route>
        </Route>


        {/* Missing */}
        <Route path='*' element={<Error />} />
      </Routes>





    </>
  );
}

export default App;
