import React from 'react'
import { adminAssets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { destroyRole, destroyToken, destroyUser } from './../utils/auth';
import { showToast } from './../utils/toast';
import { adminLogout } from '../apis/auth';
import Div from '../common/Div';

const AdminNavbar = ({role}) => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const logoutUserData = await adminLogout('/api/logout');
            destroyUser('user');
            destroyToken('token');
            destroyRole('role');
            showToast(logoutUserData.message, "success");
            navigate('/admin/login');
        } catch (error) {
            console.error('Error Logout the user', error)
        }
    }
  return (
    <Div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <Div className='flex items-center gap-2 text-xs'>
            <img className='w-28 xs:w-32 sm:w-40 cursor-pointer' src={adminAssets.admin_logo} alt="" />
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{role}</p>
        </Div>
        <button onClick={() => {handleLogout()}} className='bg-primary text-white text-sm px-5 xs:px-10 py-2 rounded-full'>Logout</button>
    </Div>
  )
}

export default AdminNavbar
