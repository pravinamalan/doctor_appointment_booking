import React from 'react'
import {assets} from '../assets/assets';
import Div from '../common/Div';
const Footer = () => {
  return (
    <Div className='flex flex-col text-sm'>
        <Div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm'>
            <Div>
                <img className='mb-5 w-40' src={assets.logo} alt="logo" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis officia et similique quo cumque perspiciatis maxime mollitia, consequuntur minus. Obcaecati cupiditate aperiam doloribus porro unde nobis tempore id necessitatibus asperiores.</p>
            </Div>
            <Div>
                <p className='uppercase text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </Div>
            <Div>
                <p className='uppercase text-xl font-medium mb-5'>Get In Touch</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91 9876543210</li>
                    <li>prescripto@gmail.com</li>
                </ul>
            </Div>
        </Div>
        <Div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright {new Date().getFullYear()} @ prescripto - All Right Reserved.</p>
        </Div>
    </Div>
  )
}

export default Footer
