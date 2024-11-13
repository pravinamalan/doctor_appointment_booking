import React from 'react';
import { NavLink } from 'react-router-dom';
import { adminAssets } from '../assets/assets';
import Div from '../common/Div';

const Sidebar = ({ role }) => {

    return (
        <Div className='min-h-screen bg-white border-r'>
            <ul className='mt-5 text-gray-600'>
                <NavLink
                    to='dashboard'
                    className='flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer admin-sidebar'
                >
                    <img className='min-w-5' src={adminAssets.home_icon} alt="" />
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>

                <NavLink
                    to='all-appointments'
                    className='flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer admin-sidebar'
                >
                    <img className='min-w-5' src={adminAssets.appointment_icon} alt="" />
                    <p className='hidden md:block'>Appointments</p>
                </NavLink>

                {role !== "Doctor" && (
                    <>
                        <NavLink
                            to='add-doctor'
                            className='flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer admin-sidebar'
                        >
                            <img className='min-w-5' src={adminAssets.add_icon} alt="" />
                            <p className='hidden md:block'>Add Doctor</p>
                        </NavLink>

                        <NavLink
                            to='doctors-list'
                            className='flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer admin-sidebar'
                        >
                            <img className='min-w-5' src={adminAssets.people_icon} alt="" />
                            <p className='hidden md:block'>Doctors List</p>
                        </NavLink>
                    </>
                )}
                {(
                    role == "Doctor" &&
                    <NavLink
                            to='profile'
                            className='flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer admin-sidebar'
                        >
                            <img className='min-w-5' src={adminAssets.people_icon} alt="" />
                            <p className='hidden md:block'>Profile</p>
                    </NavLink>
                )}
            </ul>
        </Div>
    );
};

export default Sidebar;
