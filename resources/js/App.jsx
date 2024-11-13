import React from 'react'
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments'
import Appointments from './pages/Appointments';
import Layout from './layouts/Layout';
import AdminPanelLayout from './layouts/AdminPanelLayout';
import Dashboard from './admin/Dashboard';
import AddDoctor from './admin/AddDoctor';
import DoctorsList from './admin/DoctorsList';
import AllAppointments from './admin/AllAppointments';
import AdminLogin from './admin/AdminLogin';
import NotFoundPage from './components/NotFoundPage';
import { ToastContainer } from 'react-toastify';
import DoctorProfile from './admin/DoctorProfile';
import DoctorPanelLayout from './layouts/DoctorPanelLayout';
import Div from './common/Div';
const App = () => {
  return (
    <Div >
        <Router>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path='/doctors' element={<Doctors/>}/>
                <Route path='/doctors/:speciality' element={<Doctors/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/contact' element={<Contact/>}/>
                <Route path='/my-profile' element={<MyProfile/>}/>
                <Route path='/my-appointments' element={<MyAppointments/>}/>
                <Route path='/appointment/:docId' element={<Appointments/>}/>
                <Route path='/login' element={<Login/>}/>
            </Route>
            <Route path="admin/" element={<AdminPanelLayout/>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="all-appointments" element={<AllAppointments />} />
                <Route path="add-doctor" element={<AddDoctor />} />
                <Route path="doctors-list" element={<DoctorsList />} />
                <Route path="profile" element={<DoctorProfile/>} />
            </Route>
            <Route path="doctor/" element={<DoctorPanelLayout/>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="all-appointments" element={<AllAppointments />} />
                <Route path="profile" element={<DoctorProfile/>} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </Div>
  )
}

export default App
