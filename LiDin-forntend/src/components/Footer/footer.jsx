import React from 'react'

function Footer() {
  return (
     <div className='w-[100%] bg-gray-200 flex justify-center'>
        <div className='md:p-3 w-[100%] flex flex-col items-center py-4'>
            <div className='flex gap-0 items-center cursor-pointer'> 
            <h3 className='text-blue-800 font-bold text-xl'>Meet</h3>
            <img src={'https://images.rawpixel.com/image_png_social_square/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjk4Mi1kMS0xMC5wbmc.png'} alt="DlbInLogo" className='w-7 h-7' />
            </div>
            <div className='text-sm'> @Copyright 2026</div>
        </div>
     </div>
  )
}

export default Footer