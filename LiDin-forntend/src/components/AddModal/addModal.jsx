import React, {useState} from 'react'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';




function AddModel(props) {

  const [imageUrl , setImageUrl] = useState("");
  const [desc, setDesc] = useState("");

  // cloudname = r7gow40k
  // presetName = meetinProfile
  


  const handlePost = async()=>{
    if(desc.trim().length === 0 & !imageUrl) return toast.error("Please enter field")

      await axios.post('http://localhost:4000/api/post', {desc:desc,imageLink:imageUrl}, {withCredentials:true}).then((res =>{
          window.location.reload();
      })).catch(err =>{
        console.log(err)
      })
  }

  const handleUploadImage = async(e)=>{
    console.log("Upload started");

    
      const files = e.target.files;
      console.log("files:", files);
      
      const data = new FormData(); 
      data.append('file', files[0]);
         data.append("upload_preset", "meetinProfile");

      try {
          
           const response = await axios.post("https://api.cloudinary.com/v1_1/r7gow40k/image/upload", data);
          
          // const  imageUrl = response.data.secure_Url;
          console.log("upload successfully");
          console.log(response.data);
         
          setImageUrl(response.data.secure_url);



      } catch (error) {
        console.log("upload failed")
        console.log(error.response?.data);
        console.log(error.message)
      }
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
        <div className='flex gap-4 items-center'>
            <div className='relative'>
                <img className='w-10 h-10 rounded-full' src={props.personalData?.profilePic}/>
            </div>
            <div className='text-2xl '>{props.personalData?.f_name}</div>
        </div>

        <div className='w-full'>
          <textarea value={desc} onChange={
            (e)=>setDesc(e.target.value)
          } className=' w-full my-3 outline-0 text-xl p-2' cols={50} rows={5} placeholder='What is on your mind?'></textarea>
        </div>
         
         
          {
             imageUrl && (<div>
                <img className='w-20 h-20 rounded-xl' src={imageUrl }  />
          
        </div>
         
        )}
         

                
        <div className='flex  justify-between items-center'>
          <div className= 'my-2 '>
            <label className='cursor-pointer' htmlFor='inputFile'>
              <InsertPhotoIcon />
            </label>
            <input onChange={handleUploadImage} className='hidden' type='file' id='inputFile' />
             
          </div>
          <div className='my-2'>
            <button className='bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600' onClick={handlePost}>
              Post
            </button>
          </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default AddModel