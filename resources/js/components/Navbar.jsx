import React, { useState } from 'react'
import {adminAssets, assets} from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { destroyToken, destroyUser, getToken } from '../utils/auth';
import { logout } from '../apis/auth';
import { showToast } from '../utils/toast';
import Div from '../common/Div';
const Navbar = () => {
    const navigate = useNavigate();

    const [showMenu,setShowMenu] = useState(false);
    const token = getToken('token');
    const handleLogout = async () => {
        try {
            const logoutUserData = await logout('/api/user-logout');
            destroyUser('user');
            destroyToken('token');
            showToast(logoutUserData.message, "success");
            navigate('/');
        } catch (error) {
            console.error('Error Logout the user', error)
        }
    }
  return (
    <Div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className='w-44 cursor-pointer'/>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to={'/'}>
                <li className='py-1'>Home</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to={'/doctors'}>
                <li className='py-1'>All Doctors</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to={'/about'}>
                <li className='py-1'>About</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to={'/contact'}>
                <li className='py-1'>Contact</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
        </ul>
        <Div className='flex items-center gap-4'>
            {
                token ?
                <Div className='flex items-center gap-2 cursor-pointer group relative'>
                    <img src={adminAssets.upload_area} alt="profile-pic" className='w-8 rounded-full'/>
                    <img src={assets.dropdown_icon} alt="" className='w-2.5' />
                    <Div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <Div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appoitments</p>
                            <p onClick={()=> handleLogout()} className='hover:text-black cursor-pointer'>Logout</p>
                        </Div>
                    </Div>
                </Div>
                : <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
            }

            <img onClick={()=>setShowMenu(true)} src={assets.menu_icon} alt="" className='w-6 md:hidden'/>
            {/* mobile menu */}
            <Div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}>
                <Div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="logo" />
                    <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="close-menu" />
                </Div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={()=>setShowMenu(false)} className='px-4 py-2 rounded inline-block mob-nav' to='/'>Home</NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} className='px-4 py-2 rounded inline-block mob-nav' to='/doctors'>All Doctors</NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} className='px-4 py-2 rounded inline-block mob-nav' to='/about'>About</NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} className='px-4 py-2 rounded inline-block mob-nav' to='/contact'>Contact</NavLink>
                    {
                        !token &&
                        <button onClick={()=>{navigate('/login');setShowMenu(false)}} className='bg-primary text-white px-8 py-3 rounded-full font-light'>Create Account</button>
                    }
                </ul>
            </Div>
        </Div>
    </Div>
  )
}

export default Navbar
