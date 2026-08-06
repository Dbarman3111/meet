import React, {useState ,useEffect} from "react";

function Conversation({item, ownData,  handleSelectedConv, activeConvId}) {
 
const [ memberData, setMemberData] = useState(null)

useEffect(()=>{
  let ownId = ownData?._id;
  let members = item?.member || [];
  let otherUsers = members.filter((it) => it._id !== ownId);
  setMemberData(otherUsers[0] || null);
}, [item, ownData])

const handleClickFunc = async()=>{
   handleSelectedConv(item?._id, memberData)
}

  return (
    <div onClick = {handleClickFunc}
    className=  {`flex items-center w-full cursor-pointer border-b-1 border-gray-300 gap-3 p-4 hover:bg-gray-200 ${activeConvId=== item?._id?'bg-gray-400':null }`} >
      <div className="shrink-0">
        <img
          className="w-12 h-12 rounded-[100%] cursor-pointer"
          src={memberData?.profilePic} />
      </div>
      <div>
        <div className="text-md ">{memberData?.f_name}</div>
        <div className="text-sm text-gray-500 ">{memberData?.headline}</div>
      </div>
    </div>
  );
}

export default Conversation;
