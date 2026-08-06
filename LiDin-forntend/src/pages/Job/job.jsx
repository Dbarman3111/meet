import React, {useState, useEffect} from 'react'
import Advertisment from '../../components/Advertisment/advertisment'



function Job() {
  const [userData, setUserData] = useState(null)
   useEffect(()=>{
      let userData = localStorage.getItem('userInfo')
      setUserData(userData? JSON.parse(userData):null)
    }, [])

  const mediaUrl = userData?.job || userData?.resume || userData?.Job || userData?.Resume || ""
  const isDocument = /\.(pdf|docx?|pptx?)$/i.test(mediaUrl)
    
  return (
    <div className=" px-5 xl:px-50 py-9 flex gap-5 w-full ">
         <div className='w-full py-5 sm:w-[74%]'>
            {mediaUrl ? (
              isDocument ? (
                <div className='w-full rounded-lg overflow-hidden border bg-white'>
                  <iframe className='w-full h-[700px]' src={mediaUrl} title='Resume preview' />
                  <a href={mediaUrl} target='_blank' rel='noreferrer' className='block p-3 text-blue-800 underline'>Open in new tab</a>
                </div>
              ) : (
                <img className='w-full h-full rounded-lg object-cover' src={mediaUrl} alt='job preview' />
              )
            ) : (
              <div className='rounded-lg bg-white p-6 text-gray-600'>No resume or job preview uploaded yet.</div>
            )}

         </div>
         <div className='w-[26%] py-5 hidden md:block'>
            <div className='sticky top-10 ' > 
                <Advertisment />
            </div>
         </div>
 

     
    </div>
  )
}

export default Job