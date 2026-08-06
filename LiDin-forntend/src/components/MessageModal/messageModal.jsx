import React from 'react'
import axios from 'axios';
import { useState } from 'react';

function MessageModal({ selfData, userData }) {

const [message, setMessage] = useState("");

const handleSendMessage = async(e) => {
await axios.post('http://localhost:4000/api/conversation/addConversation', { receiverId:userData?._id, message:message}, {withCredentials:true}).then(res=>{
 window.location.reload();
}).catch(err=> {
  console.log(err);;
  alert(err?.response?.data?.error)
})

}




  return (
    <div className='my-5'> 

    <div className="w-full  mb-2">
            
        <textarea className='p-1 mt-1 w-full border-1 rounded-md ' placeholder='Enter Message' cols={10} rows={8}></textarea>
        </div>
          
            <div onClick={handleSendMessage} className="bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl">Send</div>
        </div>
  )
}

export default MessageModal