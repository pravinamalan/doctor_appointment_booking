import React, { useEffect } from 'react'
import { Outlet, useLocation } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Div from '../common/Div';
const Layout = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
  return (
    <Div className='mx-4 sm:mx-[10%]'>
        <Navbar/>
        <Div>
             <Outlet />
        </Div>
      <Footer/>

    </Div>
  )
}

export default Layout
