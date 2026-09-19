import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'



function GoogleLoginComp(props) {
     const navigate = useNavigate();
    const handleOnSuccess = async (credResponse) =>{
        const token = credResponse.credential;
        console.log(credResponse);
        console.log(token);
        const res = await axios.post('https://meet-backend-p45g.onrender.com', { token },{withCredentials:true});

        
        localStorage.setItem('isLogin', 'true');
         localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        props.changeLoginValue(true)
         navigate('/feeds')


    }


  return (
    <div className='w-full'>
        
           <GoogleLogin
                 onSuccess={credentialResponse => handleOnSuccess(credentialResponse) 
                    
                }
                        onError={() => {
                     console.log('Login Failed');
                      }}
                    />
    </div>
  )
}

export default GoogleLoginComp
