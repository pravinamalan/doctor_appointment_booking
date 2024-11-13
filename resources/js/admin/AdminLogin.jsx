import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from './../apis/auth';
import { setRole, setToken, setUser } from './../utils/auth';
import { showToast } from './../utils/toast';
import Div from '../common/Div';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [management,setManagement] = useState('Admin')
    const navigate = useNavigate()
    const handleAdminLogin = async (event) =>{
      event.preventDefault()
      try {
        const role_id = management == "Admin" ? 2 : 3;
        const data = { email, password,role_id };
        const response = await adminLogin('/api/login', data);
        if (response.status ="success") {

            let {authorisation, data} = response;
            setToken(authorisation.token);
            setRole(data?.role?.name);
            setUser(JSON.stringify(data));
            showToast(response.message, 'success');
            data?.role?.name == "Admin" ? navigate('/admin/dashboard') : navigate('/doctor/dashboard');

        }
      } catch (error) {

        showToast(error.response.data.message, 'error')
      }
    }
  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={handleAdminLogin}>
      <Div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[30px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'><span className='text-blue-600'>{management =="Admin" ? "Admin" :"Doctor"}</span> Login</p>
        <Div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" name="email" id="" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
        </Div>
        <Div  className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" name="password" id="" onChange={(e)=>setPassword(e.target.value)} value={password} required/>
        </Div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
        {management === "Admin" ? (
          <p>Doctor Login? <span onClick={() => setManagement('Doctor')} className='text-primary cursor-pointer underline'>Click here</span></p>
        ) : (
          <p>Admin Login? <span onClick={() => setManagement('Admin')} className='text-primary cursor-pointer underline'>Click here</span></p>
        )}
      </Div>
    </form>
  )
}

export default AdminLogin
