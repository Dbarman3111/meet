import React, { useState , useEffect} from "react";
import Advertisment from "../../components/Advertisment/advertisment";
import Card from "../../components/Card/card";
import EditIcon from "@mui/icons-material/Edit";
import Post from "../../components/Post/post";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../../components/Modal/modal";
import ImageModel from "../../components/ImageModel/imageModel";
import Editinfomodal from "../../components/EditInfoModal/editinfomodal";
import AboutModal from "../../components/AboutModal/aboutModal";
import ExpModal from "../../components/ExpModal/expModal";
import MessageModal from "../../components/MessageModal/messageModal";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Profile() {
  const {id}= useParams();
 
  const [imageSetModel, setImageModel] = useState(false);
  const[circularImage,setCircularImage]= useState(true);


  const [infoModal , setInfoModal] = useState(false);
  const [aboutModal , setAboutModal] = useState(false);
  const [expModal, setExpModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);

  const [userData , setUserData] = useState(null);
  const[postData , setPostData] = useState([]);
  const [ownData, setOwnData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [updateExp, setUpdateExp] = useState({clicked: "", id: "", datas:{}});

  const updateExpEdit = (id, datas)=>{
    setUpdateExp({...updateExp, clicked: true, id:id, datas:datas})
    setExpModal(prev => !prev)
  }

 
  useEffect(()=>{
    fetchDataOnLoad()
  },[id])

  const fetchDataOnLoad = async()=>{
    try {
       const [userDatas, postDatas, ownDatas] = await Promise.all([
        axios.get(`http://localhost:4000/api/auth/user/${id}`),
         axios.get(`http://localhost:4000/api/post/getTop5Post/${id}`),
         axios.get('http://localhost:4000/api/auth/self', {withCredentials: true})
       ]);

       setUserData(userDatas.data.user);
       
       setPostData(postDatas.data.posts || []);
       setOwnData(ownDatas.data.user)
       setLoading(false);

       const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
       localStorage.setItem('userInfo', JSON.stringify({ ...storedUser, ...ownDatas.data.user }));
       localStorage.setItem('ownData', JSON.stringify(ownDatas.data.user));

       
      
        
    } catch (error) {
      console.log(error)
      setLoading(false);
      alert('something went wrong')
    }
  }



  const handleMessageModal= ()=>{
    setMessageModal(prev => !prev)
  }

  const handleExpModal =() =>{
    if(expModal){
      setUpdateExp({clicked: "", id: "", datas:{}})
    }
    setExpModal(prev => !prev)
  }


  const handleAboutModal = ()=>{
    setAboutModal(prev => !prev)
  }


  const handleInfoModal =() =>{
    setInfoModal(prev => !prev)
  }

  const handleImageModalOpenClose = () => {
    setImageModel(prev => !prev);
  }

  const handleOnEditCover =()=>{
    setImageModel(true)
    setCircularImage(false)
  }

  const handleCircularImageOPen =()=>{
    setImageModel(true)
    setCircularImage(true)
  }

const handleEditFunc = async(data)=>{
    if (!data) {
      console.warn('handleEditFunc called with undefined data');
      return;
    }
    try{
      await axios.put(`http://localhost:4000/api/auth/update`,{user: data}, {withCredentials: true});
      await fetchDataOnLoad();
      setImageModel(false);
    }catch(err){
      console.log(err.response?.data);
      console.log(err.message);
    }
  }

  const handleSendFriendRequest = async () => {
    if (!id || id === ownData?._id) return;
    try {
      await axios.post('http://localhost:4000/api/auth/sendFriendReq', { receiver: id }, { withCredentials: true });
      await fetchDataOnLoad();
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Request failed';
      console.log(message);
      window.alert(message);
    }
  }

  const amIfriend = ()=>{
    if (!userData?.friends || !ownData?._id) return false;
    return userData.friends.some((item) => item?.toString() === ownData?._id?.toString());
  }
   

  const isPendingFriend = ()=>{
    if (!userData?.pending_friends || !ownData?._id) return false;
    return userData.pending_friends.some((item) => item?.toString() === ownData?._id?.toString());
  }

  const isSelfPendingFriend = ()=>{
    if (!ownData?.pending_friends || !userData?._id) return false;
    return ownData.pending_friends.some((item) => item?.toString() === userData?._id?.toString());
  }

 const checkFriendStatus = ()=>{
    if(amIfriend()){
      return "Disconnect"
    }
    if(isPendingFriend()){
      return "Pending"
    }
    if(isSelfPendingFriend()){
      return "Approve request"
    }
    return "Connect"
  }

   const handleSendFriendsRequest = async () => {
    if (!userData?._id || !ownData?._id || userData?._id === ownData?._id) return;

    const status = checkFriendStatus();

    try {
      if (status === "Approve request") {
        const res = await axios.post(
          'http://localhost:4000/api/auth/acceptFriendRequest',
          { friendId: userData?._id },
          { withCredentials: true }
        );

        toast.success(res.data.message);
      } else if (status === "Connect") {
        const res = await axios.post(
          'http://localhost:4000/api/auth/sendFriendReq',
          { receiver: userData?._id },
          { withCredentials: true }
        );

        toast.success(res.data.message);
      } else if (status === "Disconnect") {
        const res = await axios.delete(
          `http://localhost:4000/api/auth/removeFromFriendList/${userData?._id}`,
          { withCredentials: true }
        );

        toast.success(res.data.message);
      } else {
        return;
      }

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
    }
  }

 const handleLogout = async () => {
 await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true }).then(res=>{
  localStorage.clear();
  window.location.reload();
 }).catch (err=> {
       console.log(err);
       toast.error(err?.response?.data?.error)
    })
 }

 const copyToClipboard = () => {
    try{
     let string = `http://localhost:5173/profile/${id}`;
     navigator.clipboard.writeText(string);
    toast.success("Link copied to clipboard");
    }catch(err){
     console.log(err);
     console.error("Failed to copy text: ", err);
     alert('Something went wrong')
    }
 
 
  }

  

  return (
    <div className="px-5 xl:px-50 pt-5 mt-7 flex flex-col gap-3 w-full py-12 bg-gray-300 ">
      <div className="flex justify-between ">

        {/* left side main section */}

        <div className="w-full md:w-[80%]">
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-[200px]">
                   {userData?._id && ownData?._id && userData._id === ownData._id && 
                   <div className="absolute cursor-pointer top-3 right-3  z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white " onClick={handleOnEditCover}>
                     {" "}
                    <EditIcon />
                  </div>
                   
                   }
                  <img
                    src={userData?.cover_pic}
                    className="w-full h-[200px] rounded-tr-lg rounded-tl-lg"
                  />
                  <div onClick={handleCircularImageOPen} className="absolute object-cover top-24 left-6 z-10 ">
                    <img
                      className="rounded-full cursor-pointer border-2 border-white w-30 h-30  "
                      src={userData?.profilePic}
                    />
                  </div>
                </div>
                <div className="mt-10 relative px-8 py-2">
                  {userData?._id && ownData?._id && userData._id === ownData._id && 
                   <div className="absolute cursor-pointer top-3 right-3  z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white" onClick={handleInfoModal}>
                    {" "}
                    <EditIcon />
                  </div>
                  }
                  <div className="w-full">
                    <div className="text-2xl ">{userData?.f_name}</div>
                    <div className="text-gray-700">{userData?.headline}</div>
                    <div className="text-sm text-gray-500 ">
                      {" "}
                       {userData?.curr_location}
                    </div>
                    <div className="text-md text-blue-800 w-fit cursor-pointer hover:underline">
                      {userData?.friends?.length}Connections
                    </div>

                    <div className="md:flex w-full justify-between">
                      <div className="my-5 flex gap-5">
                        <div className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold">
                          Open to
                        </div>
                        <div className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold" onClick={copyToClipboard}>
                          Share
                        </div>
                      {userData?._id && ownData?._id && userData._id === ownData._id &&
                         <div onClick={handleLogout} className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold">
                          Logout
                        </div>
                      }
                      </div>
                      <div className="my-5 flex gap-5">
                        {userData?._id && ownData?._id && userData._id !== ownData._id ? (
                          <div onClick={handleSendFriendsRequest} className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold">
                            {checkFriendStatus()}
                          </div>
                        ) : null}
                         {amIfriend() ? 
                           <div onClick={handleMessageModal} className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold">
                             Message
                           </div>:null
                           }
                         
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">About</div>
                 {userData?._id && ownData?._id && userData._id === ownData._id &&
                 <div onClick={handleAboutModal} className="cursor-pointer">
                  <EditIcon />
                </div>
                 }
              </div>
              <div className="text-gray-700 text-md w-[80%]">
                 {userData?.about}
              </div>
            </Card>
          </div>

          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Skills</div>
              </div>
 
              <div className="text-gray-700 text-md my-2 w-full flex gap-4 flex-wrap">
                 
                   

                 {

                      

                       (userData?.skills || []).map((item, index)=>{
                        return(
                          <div key={index} className="py-2 px-3 cursor-pointer bg-blue-800 text-white rounded-lg">
                                 {item}
                         </div>
                        )
                       })



                      }



                {/* <div className="py-2 px-3 cursor-pointer bg-blue-800 text-white rounded-lg">
                  MongoDB
                </div>
                <div className="py-2 px-3 cursor-pointer bg-blue-800 text-white rounded-lg">
                  Node.js
                </div> */}



              </div>
            </Card>
          </div>

          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Activities</div>
              </div>
              <div className="cursor-pointer px-3 py-1 w-fit border-1 rounded-4xl bg-green-800 text-white font-semibold ">
                Post
              </div>

              {/* parent div for activities */}

              <div className="overflow-x-auto my-2 flex gap-1 overflow-hidden w-full">
               

            {
              postData.map((item,index)=>{
                return(
                    <Link to={`/profile/${id}/activities/${item?._id}`} className="cursor-pointer shrink-0 w-[350px] h-[560px]">
                  <Post profile={1} item={item}  personalData={ownData}/>
                </Link>
                )
              })
            }
                
              </div>


               {
                postData?.length>5 && <div className="w-full flex justify-center items-center">
                 <Link to={`/profile/${id}/activities`} className="p-2 rounded-xl cursor-pointer hover:bg-gray-300">Show all Post <ArrowRightAltIcon /></Link>
              </div>
               }

               
            </Card>
          </div>

          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Experience</div>
                {userData?._id && ownData?._id && userData._id === ownData._id &&
                 <div onClick={handleExpModal} className="cursor-pointer">
                  <AddIcon />
                </div>
                }
              </div>

              <div className="mt-5">
                 

                 {
                  userData?.experience.map((item, index)=>{
                    return(
                      <div className="p-2 border-t-1 border-gray-400 flex justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-700 ">
                      {item.designation}
                    </div>
                    <div className="text-sm ">{item.company_name}</div>
                    <div className="text-sm text-gray-500  ">
                      {item.duration}
                    </div>
                    <div className="text-sm  text-gray-500">{item.location}</div>
                  </div>

                  <div onClick={() => updateExpEdit(item._id, item)} className="cursor-pointer">
                    <EditIcon />
                  </div>
                </div>
                    )
                  })
                 }

                
                   
 
                
              </div>
            </Card>
          </div>
        </div>

        {/* right side */}

        <div className="hidden md:flex md:w-[28%]">
          <div className="sticky top-19">
            <Advertisment />
          </div>
        </div>
      </div>


       {
                imageSetModel && (
                           <Modal closeModal={handleImageModalOpenClose} title={"Upload Image"} >
                           <ImageModel handleEditFunc={handleEditFunc}  selfData={ownData} isCircular={circularImage} />
                 </Modal>
        )
       }



       {
        infoModal && <Modal  title='Edit Info' closeModal={handleInfoModal} >
          <Editinfomodal handleEditFunc={handleEditFunc}  selfData={ownData} closeModal={handleInfoModal}/>
        </Modal>
       }
 
       {
        
          aboutModal && <Modal title='Edit About' closeModal={handleAboutModal}>
          <AboutModal  handleEditFunc={handleEditFunc}  selfData={ownData} closeModal={handleAboutModal} />
       </Modal>
       }

         {
          expModal &&  <Modal title='Experience' closeModal={handleExpModal}>
          <ExpModal handleEditFunc={handleEditFunc}  selfData={ownData} closeModal={handleExpModal} updateExp={updateExp} setUpdateExp={setUpdateExp}/>
         </Modal>
         }

         {
          messageModal && <Modal title='Message' closeModal={ handleMessageModal}>
            <MessageModal selfData={ownData} userData={userData} />
          </Modal>
         }
          <ToastContainer />
    </div>
  );
}

export default Profile;


