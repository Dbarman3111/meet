import React, { useState, useEffect } from 'react'
import './navbar2.css' 
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useLocation, Link, data } from 'react-router-dom';
import axios from 'axios';



function Navbar2() {


    //  const [dropdown, setDropDown] = useState(false)
     const  location = useLocation();

     

       const [userData , setUserData]= useState(null)


       const [searchTerm, setSearchTerm] = useState("")
       const [debouncesTerm, setDebouncedTerm] = useState(""); //for performance optimization using debounce;
       const [searchUser, setSearchUser] = useState([])

       const [notificationCount, setNotificationCount] = useState("")



    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 1000);

        return () => clearTimeout(handler);
    }, [searchTerm]);

 useEffect(() => {
    if (debouncesTerm){
        searchAPICall();
    }

    },[debouncesTerm])   

  
    const searchAPICall = async () => {
        await axios.get(` http://localhost:4000/api/auth/findUser?query=${debouncesTerm}`, {withCredentials: true}).then(res=>{
            console.log(res) 
             
            setSearchUser(res.data.users)
        }).catch((err) => {
        console.log(err);
        alert(err?.response?.data?.error);
      });
    }


  const fetchNotification = async() => {
    await axios.get('http://localhost:4000/api/notification/activeNotification', {withCredentials:true}).then(res=>{
     var count = res.data.count;
     setNotificationCount(count);

    }).catch(err=> {
        console.log(err);
        alert(err?.response?.data?.error);
    })
  }


       useEffect(()=>{
         let userData = localStorage.getItem('userInfo')
         
         setUserData(userData? JSON.parse(userData):null)

         fetchNotification()
       }, [])


       

  return (
    <div className='bg-gray-300  h-13 flex justify-between py-1 px-5 xl:px-50 fixed top-0 w-[100%] z-1000 '>
        <div className='flex gap-2 items-center'>
            <Link to="/">
                <img className=' w-12 h-12' src={'https://images.rawpixel.com/image_png_social_square/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjk4Mi1kMS0xMC5wbmc.png'} alt='logo'/>
            </Link>
            <div className='relative'>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='searchInput w-24 sm:w-40 md:w-64 p-1 bg-gray-400 rounded-3xl h-10 px-4 ' placeholder="Search" />


              {

                searchUser?.length>0 && debouncesTerm?.length !== 0 && <div className='absolute w-88 left-0 bg-gray-300'>
                     
                    {
                        searchUser.map((item, index) =>{
                            return(
                    <Link to={`/profile/${item._id}`} key={index} className='flex gap:2 mb-1 items-center cursor-pointer ' onClick={()=>setSearchTerm("")}>
                                  <div><img className='w-10 h-10 rounded-full' src={item?.profilePic} /></div>
                                    <div>{item?.f_name}</div>
                    </Link>
                            )
                        })
                    }
                    
                </div>

              }
            </div>
        </div>
        
      




        <div className='flex gap-3 sm:gap-6  md:gap-10 items-center'>
            <Link to='/feeds' className='flex flex-col items-center cursor-pointer'>
                <HomeIcon sx={{color: location.pathname=== '/feeds'?"black":"gray"}} />
                <div className={`text-gray-500 hidden sm:block text-sm ${location.pathname === '/feeds' ? "border-b-3" : ""}`}>Home</div>
            </Link>

             <Link to='/mynetwork' className='flex flex-col items-center cursor-pointer'>
                <PeopleIcon sx= {{color: location.pathname=== '/mynetwork'?"black":"gray"}}/>
                <div  className={`text-gray-500 hidden sm:block ${location.pathname === '/mynetwork' ? "border-b-3" : ""}`}>My Network</div>
            </Link>


             <Link to='/job' className='flex flex-col items-center cursor-pointer'>
                <WorkIcon sx={{color: location.pathname=== '/job'?"black":"gray"}}/>
                <div  className={`text-gray-500 hidden sm:block ${location.pathname === '/job' ? "border-b-3" : ""}`}>Job</div>
            </Link>


             <Link to='/messages' className='flex flex-col items-center cursor-pointer'>
                <MessageIcon sx={{color: location.pathname=== '/messages'?"black":"gray"}} />
                <div  className={`text-gray-500 hidden sm:block ${location.pathname === '/messages' ? "border-b-3" : ""}`}>Message</div>
            </Link>

             <Link to='/notifications' className='flex flex-col items-center cursor-pointer'>
                 <div className='relative inline-block'>
                    <NotificationsNoneIcon sx={{color: location.pathname=== '/notifications'?"black":"gray"}} />  {notificationCount>0 && <span className='absolute -top-1 -right-2 flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold bg-red-600 text-white'>{notificationCount}</span>}
                    </div>
                <div  className={`text-gray-500 hidden sm:block ${location.pathname === '/notifications' ? "border-b-3" : ""}`}>Notification</div>
            </Link>


             <Link to={`/profile/${userData?._id}`} className='flex flex-col items-center cursor-pointer'>
                <img className='w-8 h-8 rounded-full' src={userData?.profilePic}/>
                <div className='text-gray-500 hidden sm:block'>Me</div>
            </Link>
        </div>
    </div>
  )
}

export default Navbar2
