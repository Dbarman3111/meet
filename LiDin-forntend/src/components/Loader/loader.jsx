import React from 'react'
import './loader.css'

function Loader() {
  return (
    <div className='fixed top-0 left-0 w-full z-100 h-full bg-gray-400 flex justify-center items-center'>
       
        <span class="loader"></span>
        
     </div>
  )
}

export default Loader