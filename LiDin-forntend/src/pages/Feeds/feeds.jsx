import React, { useState, useEffect } from "react";
import Card from "../../components/Card/card";
import ProfileCard from "../../components/ProfileCard/profileCard";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import Advertisment from "../../components/Advertisment/advertisment";
import Post from "../../components/Post/post";
import Modal from "../../components/Modal/modal";
import AddModal from "../../components/AddModal/addModal";
import Loader from "../../components/Loader/loader";
import axios from "axios";
import { ToastContainer , toast } from "react-toastify";


function Feeds() {
  const [personalData, setPersonalData] = useState(null);
  const [addPostModel, setAddPostModel] = useState(false);
  const [post, setPost] = useState([])

  // const fetchSelfData = async ()=> {
  //   await axios.get('http://localhost:4000/api/auth/self', {withCredentials: true}).then(res =>{
  //     setPersonalData(res.data.user)
  //   }).catch(err => {
  //     console.error('API error:', err);
  //     toast.error(err?.response?.data?.error)
  //   })
  // }

  const fetchSelfData = async ()=>{
    try {
        const [userData, postData] = await Promise.all([
       await axios.get('http://localhost:4000/api/auth/self', {withCredentials: true}),
        await axios.get('http://localhost:4000/api/post/getAllPost')
    ]);
     
    setPersonalData(userData.data.user)
    localStorage.setItem('userInfo', JSON.stringify(userData.data.user));
    setPost(postData.data.posts)

    

    } catch (err) {
      console.log(err)
       toast.error(err?.response?.data?.error)
    }
    
  }


  useEffect (()=>{
   // fetchSelfData()
    fetchSelfData()
  })

  const handleOpenPostModel = () => {
    setAddPostModel(prev =>!prev)
  }

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-300">


      {/* {left side} */}


      <div className="w-[35%] sm:block sm-w-[23%] hidden py-5  ">
        <div className="h-fit">
          <ProfileCard data={personalData} />
        </div>
        <div className="w-full  my-5 bg-gray-500">
          <Card padding={1}>
            <div className="w-full flex justify-between ">
              <div >Profile Viewer</div>
              <div className="text-blue-900 ">23</div>
            </div>
            <div className="w-full flex justify-between">
              <div>Post Impressions</div>
              <div className="text-blue-900 ">90</div>
            </div>
          </Card>
        </div>
      </div>

      {/* {middle side} */}

      <div className=" py-6  w-[100%] h-[50%]  ">

        {/* post section */}

        <div >
          <Card padding={1}>
            <div className="flex gap-2 items-center">
              <img
                src={personalData?.profilePic}
                className="rounded-4xl w-13 h-13 border-2 border-white cursor-pointer"
              />
              <div onClick={() => setAddPostModel(true)} className="w-full  border py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-200">
                Start a post
              </div>
            </div>

            <div className="w-full flex mt-3">
              <div onClick={() => setAddPostModel(true)} className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-200">
                <VideoCallIcon sx={{ color: "green" }} />
                Video
              </div>

              <div onClick={() => setAddPostModel(true)} className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-200">
                <ImageIcon sx={{ color: "blue" }} />
                Photo
              </div>

              <div onClick={() => setAddPostModel(true)} className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-200">
                <ArticleIcon sx={{ color: "orange" }} />
                Artical
              </div>
            </div>
          </Card>
        </div>

        <div className="border-b border-gray-400 w-full my-5" />
        <div className="w-full h-full flex flex-col gap-5">

        {
          post.map((item, index)=>{
            return <Post item={item} key={index} personalData={personalData}  />;
          })
        }
          


        </div>

      </div>

      {/* {right side} */}
      <div className="w-[51%] py-5 hidden md:block">
        <div>
          <Card padding={1}>
            <div className="text-xl ">MeetIn news</div>
            <div className="text-gray-600">Top stories</div>

            <div className="my-1">
              <div className="test-md ">International Football Match </div>
              <div className="text-xs text-gray-200">2h ago</div>
            </div>

            <div className="my-1">
              <div className="test-md ">
                Google invest 3000cr in west Bengal{" "}
              </div>
              <div className="text-xs text-gray-200">2h ago</div>
            </div>
          </Card>
        </div>

        <div className="my-5 sticky top-19 ">
          <Advertisment />
        </div>
      </div>

       {
        addPostModel && <Modal closeModal={handleOpenPostModel} title={""} >
         <AddModal  personalData={personalData}/>
         </Modal>
       }
      
      <ToastContainer />
         
    </div>
  );
}

export default Feeds;
