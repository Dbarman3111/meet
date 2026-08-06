import React ,{useState, useEffect} from 'react'
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';




function ImageModel({isCircular, selfData, handleEditFunc}) {

  const[imgLink, setImageLink] = useState(isCircular?selfData?.profilePic:selfData?.cover_pic);

  const [loading, setLoading] = useState(false)

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



const handleSubmitBtn = async(e)=>{
  e.preventDefault();
  const data = {...selfData};
  const updatedData = isCircular
    ? {...data, profilePic: imgLink}
    : {...data, cover_pic: imgLink};
  handleEditFunc(updatedData)
}

  return (
    <div className='p-5 relative flex items-center justify-between flex-col w-full min-h-[310px] '>
      {
      isCircular ? (
        <img  className='w-[150px] h-[150px] rounded-full' src={imgLink}/>
      ):(
           <img className='rounded-xl w-full h-[200px] object-cover' src={imgLink}/>
      )
    }
    
    <div> 
      <label htmlFor='btn-submit' className='absolute p-3 left-0 bottom-0  bg-blue-900 text-white rounded-2xl cursor-pointer'>Upload</label>
      <input onChange={handleInputImage} type='file' className='hidden' id='btn-submit'/>

       {
            loading ?  <Box sx={{ display: 'flex' }}>
               <CircularProgress aria-label="Loading…" />
             </Box> :<div className="absolute bottom-0 right-0 p-3 bg-blue-900 text-white rounded-2xl cursor-pointer" onClick={handleSubmitBtn}>Submit</div>
       }



          
    </div>
    </div>
  )
}

export default ImageModel
