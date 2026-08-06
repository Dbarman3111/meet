import React,{useState, useEffect} from "react";
import Card from "../Card/card";

function Advertisment() {

  const [userData , setUserData]= useState(null)

  useEffect(()=>{
    let userData = localStorage.getItem('userInfo')
    setUserData(userData? JSON.parse(userData):null)
  }, [])
  
  return (
    <div className="sticky top-18">
      <Card padding={0}>
        <div className="relative h-25">
          <div className="relative w-full h-22 rounded-md">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/007/073/820/small/wooden-table-and-blur-of-beauty-sunset-sky-and-mountains-as-background-free-photo.jpg"
              className="rounded-t-md h-full w-full"
            />
          </div>
          <div className="absolute top-14 left-27 z-10">
            <img
              src={userData?.profilePic}
              className="rounded-full border-2 h-14 w-14 border-white cursor-pointer"
            />
          </div>
        </div>
        <div className="px-5 my-5 mx:auto">
            <div className="text-sm font-semibold text-center">{userData?.f_name}</div>
            <div className="text-sm my-3 text-center">Get the leatest news and job opening</div>
            <div className="text-sm my-1 border-1 text-center p-2 rounded-2xl font-bold text-white border-blue-700 bg-blue-600 cursor-pointer">Explore</div>
        </div>
      </Card>
    </div>
  );
}

export default Advertisment;
