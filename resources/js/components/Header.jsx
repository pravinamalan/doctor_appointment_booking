import React from 'react'
import { assets } from '../assets/assets'
import Div from '../common/Div'

const Header = () => {
  return (
    <Div className='bg-primary flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20'>
        {/* left side */}
        <Div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                Book Appointment <br /> With Trusted Doctors
            </p>
            <Div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                <img src={assets.group_profiles} className='w-28' alt="grp-profile" />
                <p>Simply browse through our extensive list of trusted doctors, <br className='hidded sm:block' /> schedule your appointment hassle-free.</p>
            </Div>
            <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'> Book Appointment <img src={assets.arrow_icon} alt="" className='w-3.5' /></a>
        </Div>
        {/* right side */}
        <Div className='md:w-1/2 relative'>
            <img src={assets.header_img} alt="" className='w-full md:absolute bottom-0 h-auto rounded-lg' />
        </Div>
    </Div>
  )
}

export default Header