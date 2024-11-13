import React from 'react'
import { Outlet } from "react-router-dom";
import AdminNavbar from './../admin/AdminNavbar';
import Sidebar from './../admin/Sidebar';
import ProtectedRoute from '../auth/ProtectedRoute';
import { getRole } from '../utils/auth';
import Div from '../common/Div';

const DoctorPanelLayout = () => {
    const role = getRole('role')
  return (
    <ProtectedRoute>
        <Div>
            <AdminNavbar role={role}/>
            <Div className="flex items-start">
                <Sidebar role={role}/>
                <Div className='m-5'>
                    <Outlet/>
                </Div>
            </Div>
        </Div>
    </ProtectedRoute>
  )
}

export default DoctorPanelLayout
