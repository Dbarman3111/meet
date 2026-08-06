import React from "react";
import Card from "../../components/Card/card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Conversation from "../../components/Conversation/conversation";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImageIcon from "@mui/icons-material/Image";
import Advertisment from "../../components/Advertisment/advertisment";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from '../../../socket';

function Messages() {
  const [conversations, setConversations] = useState([]);

  const [ownData, setOwnData] = useState(null);
  const [activeConvId, setActiveConvId] = useState(null);
  const [selectedConvDetails, setSelectedConvDetail] = useState(null);

  const [messages, setMessages] = useState([]);
  const  [loading, setLoading ] = useState(false)
  const [ imageLink , setImageLink] = useState(null)
  const [ messageText  , setMessageText] = useState(null)


  const ref = useRef();

  useEffect(()=>{
        ref?.current?.scrollIntoView({behaviour:"smooth"});
  },[messages])


  const handleSelectedConv = (id, userData) => {
    setActiveConvId(id);
    socket.emit("joinConversation", id)
    setSelectedConvDetail(userData);
  };

  useEffect(() => {
    let userData = localStorage.getItem("userInfo");
    setOwnData(userData ? JSON.parse(userData) : null);
    fetchConversationOnLoad();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages();
    }
  }, [activeConvId]);


  useEffect(()=>{
    socket.on("receiveMessage", (response)=>{
       setMessages([...messages, response])

    })
  },[messages])

  const fetchMessages = async () => {
    await axios
      .get(`http://localhost:4000/api/message/${activeConvId}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setMessages(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went Wrong");
      });
  };

  const fetchConversationOnLoad = async () => {
    await axios
      .get("http://localhost:4000/api/conversation/getConversation", {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversations || []);
        setActiveConvId(res.data?.conversations[0]?._id);   
         socket.emit("joinConversation", res.data?.conversations[0]?._id)
        let ownId = ownData?._id;
        let members = res.data?.conversations[0]?.member || [];
        let otherUsers = members.filter((it) => it._id !== ownId);
        setSelectedConvDetail(members[0]);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went Wrong");
      });
  };


 const handleInputImage = async(e)=>{
      console.log("Upload started"); 
      const files = e.target.files;
      console.log("files:", files);
      
      const data = new FormData(); 
      data.append('file', files[0]);
         data.append("upload_preset", "meetinProfile");
         setLoading(true)

      try {
          
           const response = await axios.post("https://api.cloudinary.com/v1_1/r7gow40k/image/upload", data);
          
          const  imageUrl = response.data.secure_url;
          console.log("upload successfully");
          console.log(response.data);
         
          setImageLink(imageUrl)



      } catch (error) {
        console.log("upload failed")
        console.log(error.response?.data);
        console.log(error.message)
      }
      finally{
        setLoading(false)
      }
}

const handleSendMessage = async ()=>{
    await axios.post(`http://localhost:4000/api/message`, {conversation: activeConvId, message: messageText, picture: imageLink }, {withCredentials:true}).then(res=>{
      
        socket.emit("sendMessage", activeConvId, res.data)
         setMessageText("");

        if (res.data) {
          setMessages(prev => [...prev, res.data]);
          setMessageText('');
          setImageLink(null);
        }
    }).catch((err) => {
        console.log(err);
        alert("Something went Wrong");
      });
}


  return (
    <div className="px-5 xl:px-50 py-9 gap-5 w-full mt-5 bg-gray-400">
      <div className="w-full justify-between flex pt-5">
        {/* left side */}

        <div className="w-full md:w-[70%]">
          <Card padding={0}>
            <div className="border-b-1 border-gray-300 px-5 py-2 font-semibold text-lg">
              Messages
            </div>

            <div className="border-b-1 border-gray-300 px-5 py-2">
              <div className="py-1 px-3 cursor-pointer hover:bg-green-900 bg-green-800 font-semibold flex gap-2 w-fit rounded-2xl text-white">
                Focused
                <ArrowDropDownIcon />
              </div>
            </div>

            {/* div for chart */}

            <div className="w-full md:flex">
              <div className="h-[590px] overflow-auto w-full md:w-[50%] border-r-1 border-gray-400">
                {/* for each conversation */}

                {conversations?.map((item, index) => {
                  return (
                    <Conversation
                      activeConvId={activeConvId}
                      handleSelectedConv={handleSelectedConv}
                      item={item}
                      key={index}
                      ownData={ownData}
                    />
                  );
                })}

                {/* <Conversation /> */}
              </div>
              <div className="w-full md:w-[60] border-gray-400">
                <div className="border-gray-300 py-2 px-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedConvDetails?.f_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedConvDetails?.headline}
                    </p>
                  </div>
                  <div>
                    <MoreHorizIcon />
                  </div>
                </div>
                <div className="h-[360px] w-full overflow-auto border-b-1 border-gray-300">
                  <div className="w-full border-b-1 border-gray-300 gap-3 p-4">
                    <img
                      className="rounded-[100%] cursor-pointer w-12 h-13"
                      src={selectedConvDetails?.profilePic}
                    />

                    <div className="my-2">
                      <div className="text-sm">
                        {selectedConvDetails?.f_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedConvDetails?.headline}
                      </div>
                    </div>
                  </div>
                  <div className="w-full">

                    {/* for each message */}

                    {messages.map((item, index) => {
                      return (
                        <div ref={ref}  key={index} className="flex w-full cursor-pointer border-gray-300 gap-3 p-4">
                          <div className="shrink-0">
                            <img
                              className="w-8 h-8 rounded-[100%] cursor-pointer "
                              src={item?.sender?.profilePic}
                            />
                          </div>
                          <div className="mb-2 w-full">
                            <div className="text-sm">
                              {item?.sender?.f_name}
                            </div>

                            <div className="text-xs mt-6 hover:bg-gray-200">
                              {item?.message}
                            </div>
                           {
                            item?.picture &&   <div className="mt-2">
                              <img
                                className="w-[240px] h-[180px] rounded-md"
                                src={item?.picture}
                              />
                            </div>
                           }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2 w-full border-b-1 border-gray-200">
                  <textarea value={ messageText} onChange={(e)=>setMessageText(e.target.value)}
                    row={4}
                    className="bg-gray-200 outline-0 rounded-xl text-sm w-full p-3"
                    placeholder="Write a message..."
                  ></textarea>
                </div>
                <div className="p-3 flex justify-between">
                  <div>
                    <label htmlFor="messageImage" className="cursor-pointer">
                      <ImageIcon />
                    </label>
                    <input id="messageImage" type="file" onChange={handleInputImage} className="hidden" />
                  </div>
                   {
                    !loading && <div onClick={handleSendMessage}   className="px-3 py-1 cursor-pointer rounded-2xl border-1 bg-blue-950 text-white">
                    Send
                  </div>
                   }
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right side */}

        <div className="hidden md:flex md:w-[25%]">
          <div className="sticky top-19">
            <Advertisment />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
