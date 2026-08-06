import React from 'react'
import { Link } from 'react-router-dom'

function Navbar1() {
  return (
    <nav className='w-[100%] bg-gray-100 md:px-[100px] px-[20px] flex justify-between py-4 box-border'>
        <Link to={'/'} className='flex justify-between'>
            <div className='flex gap-0 items-center cursor-pointer'>
                <h3 className='text-blue-800 font-bold text-3xl'>Meet</h3>
                 <img src={'https://images.rawpixel.com/image_png_social_square/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjk4Mi1kMS0xMC5wbmc.png'} alt="MeetIn" className='w-8 h-8'></img>
            </div>
             
        </Link>
        <div className='flex box-border md:gap-4 gap-2 justify-center items-center'>
            <Link to={'/signUp'} className='md:px-4 md:py-2 box-border text-black rounded-3xl text-xl hover:bg-gray-300 cursor-pointer'>Join now</Link>
            <Link to ={'/login'} className='px-4 py-2 box-border border-1 text-blue-800 border-blue-800 rounded-3xl text-xl hover:bg-blue-100 cursor-pointer'>Sign in</Link>
        </div>
    </nav>
  )
}

export default Navbar1