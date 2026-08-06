import React from 'react'
import { useState, useEffect } from 'react'
import ProfileCard from '../../components/ProfileCard/profileCard'
import axios from 'axios'




function MyNetwork() {

    const [text, setText] = useState('Catch up with friends');
    const [data,  setData] = useState([])

    const handelFriends = () => {
        setText('Catch up with friends')
    }
    
    const handelPending = ()=>{
        setText('Pending requests')
    }

    const fetchFriendList = async () => {
    try {
        const res = await axios.get('http://localhost:4000/api/auth/friendsList', {withCredentials: true});
        setData(Array.isArray(res.data?.friends) ? res.data.friends : []);
    } catch (err) {
        console.log(err);
        setData([]);
    }
    }

    const  fetchPendingList = async () => {
    try {
        const res = await axios.get('http://localhost:4000/api/auth/pendingFriendsList', {withCredentials: true});
        setData(Array.isArray(res.data?.pendingFriends) ? res.data.pendingFriends : []);
    } catch (err) {
        console.log(err);
        setData([]);
    }
    }

    useEffect(() => {
        if(text === 'Catch up with friends'){
            fetchFriendList();
        }else{
            fetchPendingList();
        }
    }, [text])

  return (
    <div className='px-5 xl:px-50 flex flex-col gap-5 w-full mt-5 bg-gray-300'>
         
         <div className=' py-4 px-10 border-gray-400 w-full flex justify-between my-14 text-xl bg-white rounded-xl' >
            <div>{text}</div>
            <div className=' flex gap-3'> 


                <button onClick={handelFriends}
                  className={`p-1 cursor-pointer border-1 rounded-lg border-gray-300 ${text === "Catch up with friends" ? "bg-blue-800 text-white" : ""}`}>
                  Friends
                </button>

                <button onClick={handelPending}
                  className={`p-1 cursor-pointer border-1 rounded-lg border-gray-300 ${text === "Pending requests" ? "bg-blue-800 text-white" : ""}`}>
                  Pending requests
                </button>
            </div>
         </div>

         <div className='flex h-[80vh] w-full gap-6 flex-wrap items-start justify-center gap-y-2 gap-x-4 ' >
           

           {
            data.map((item, index)=>{
                return(
                      <div className='md:w-[23%] h-[250px] sm:w-full'>
                            <ProfileCard data={item}/>
                      </div> 

                )
            })


           }

           {
            data.length === 0 ? text === "Catch up with friends" ? <div className='text-2xl text-gray-400'>No friends found</div> : <div className='text-2xl text-gray-400'>No pending requests</div> : null

            
           }
             

             
         </div>
    
    
    
    </div>
  )
}

export default MyNetwork