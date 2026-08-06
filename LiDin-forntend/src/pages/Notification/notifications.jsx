import React from 'react'
import ProfileCard from '../../components/ProfileCard/profileCard'
import Advertisment from '../../components/Advertisment/advertisment'
import Card from '../../components/Card/card'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Notifications() {


 const navigate = useNavigate()
  const [ownData , setOwnData]= useState(null)
  const [ notifications , setNotifications]= useState([])

  const fetchNotificationData = async() => {
 await axios.get('http://localhost:4000/api/notification', {withCredentials:true}).then(res=>{
    console.log(res.data.notifications)
    setNotifications(res.data.notifications)
  }).catch(err=> {
    console.log(err);
    alert("Something went wrong while fetching notifications")
  })
}


const handleOnClickNotification = async(notification) => {
  await axios.put('http://localhost:4000/api/notification/isRead',{notification: notification._id}, {withCredentials:true}).then(res=>{
   if(notification?.type === 'comment'){
      navigate(`/profile/${ownData?._id}/activities/${notification?.postId}`)
   }
   else{
    navigate('/myNetwork')
   }

  }).catch(err=> {
    console.log(err);
    alert("Something went wrong while fetching notifications")
  })
}

    useEffect(()=>{
      let userData = localStorage.getItem('userInfo')
      setOwnData(userData? JSON.parse(userData):null)

      fetchNotificationData()
    }, [])



  return (
     <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-300">

      {/* {left side} */}
      <div className="w-[21%] sm:block sm-w-[23%] hidden py-5">
        <div className="h-fit">
          <ProfileCard data={ownData} />
        </div>
       
      </div>

      {/* {middle side} */}
      <div className="w-[100%] py-5  sm:w-[50%] ">
        
        <div className="w-[100%] py-5 sm:w-[100%]">
             <Card padding={0} >
              <div className="w-full">


                {/* for each notification */}

                  { notifications?.map((notification, index)=>{
                    return(
                      <div key ={index} onClick= {()=>{handleOnClickNotification(notification)}} className={'border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-2 ' + (notification?.isRead ? 'bg-gray-300' : 'bg-blue-200')}>
                  <img  className='rounded-full cursor-pointer w-13 h-13' src={notification?.sender?.profilePic}/>
                  <div>{notification?.content}</div>
                 </div>
                    );
                   })


                  }
                  

                   {/* <div className={'border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-2'}>
                  <img  className='rounded-full cursor-pointer w-13 h-13' src=' https://cdn-icons-png.flaticon.com/512/149/149071.png'/>
                  <div>Accept your friend request</div>
                 </div> */}
              </div>
             </Card>
        </div>
       

       </div>

      {/* {right side} */}
      <div className="w-[26%] py-5 hidden md:block">
         



        <div className="my-5 sticky top-19">
          <Advertisment />
        </div>
      </div>

     
    </div>
  )
}

export default Notifications