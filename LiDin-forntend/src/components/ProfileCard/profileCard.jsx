import React from 'react'
import Card from '../Card/card'
import { Link } from 'react-router-dom'

function ProfileCard(props) {
  
  return (
     <Card padding={0}>
      <Link to={`/profile/${props.data?._id}`} className='relative h-25'>
        <div className='relative w-full h-25 rounded-md overflow-hidden'>
            <img src={props.data?.cover_pic} className='rounded-t-md h-full w-full object-cover' />
        </div>
        <div className='absolute top-14 left-16 z-10'>
            <img src={props.data?.profilePic} className='rounded-full border-2 h-16 w-16 border-white cursor-pointer'/>
        </div>
      </Link>
      <div className='px-5 py-5'>
        <div className='text-xl'>{props.data?.f_name}</div>
        <div className='text-sm my-1'>{props.data?.headline}</div>
        <div className='text-sm my-1'>{props.data?.curr_location}</div>
        <div className='text-sm my-1'>{props.data?.curr_company}</div>
      </div>
     </Card>
  )
}

export default ProfileCard