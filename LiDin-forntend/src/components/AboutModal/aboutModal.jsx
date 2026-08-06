import React ,{useState} from 'react'
import axios from 'axios';

function AboutModal({handleEditFunc, selfData, closeModal }) {

  const [data , setData] = useState({about: selfData?.about || "", skillInp: selfData?.skills?.join(",")|| "", resume: selfData?.resume || selfData?.job || ""});
    const [loading, setLoading] = useState(false)

   const onChangeHandle =  (event , key)=>{
        setData({...data, [key]:event.target.value})
    }


    const handleInputImage = async(e)=>{
      console.log("Upload started"); 
      const files = e.target.files;
      console.log("files:", files);
      
      const formData = new FormData(); 
      formData.append('file', files[0]);
      formData.append("upload_preset", "meetinProfile");
      setLoading(true)

      try {
          
           const response = await axios.post("https://api.cloudinary.com/v1_1/r7gow40k/image/upload", formData);
          
          const  imageUrl = response.data.secure_url;
          console.log("upload successfully");
          console.log(response.data);
         
        

          setData(prevData => ({...prevData , resume:imageUrl }))

      } catch (error) {
        console.log("upload failed")
        console.log(error.response?.data);
        console.log(error.message)
      }
      finally{
        setLoading(false)
      }
}


const handleOnSave = async()=>{
  const skillString = data?.skillInp || "";
  let arr = skillString?.split(",").map(skill => skill.trim()).filter(Boolean);
       
     console.log(data);
     console.log(data.skillInp);

  let newData = { ...selfData, about:data.about, skills: arr, resume:data.resume, job:data.resume};
  await handleEditFunc(newData);
  if (closeModal) closeModal();
}


  return (
    <div className='my-8'>
         <div className="w-full  mb-2 ">
            <label className='mt-3 top-2'>About</label>
            <br/>
            <textarea value={data.about} onChange={(e)=>onChangeHandle(e,'about')}   className='p-1 mt-1 w-full border-1 rounded-md '  cols={10} row={3}></textarea>
        </div>
         <div className="w-full  mb-19">
            <label >Skills*(Add by seperating comma)</label>
            <br/>
            <textarea value={data.skillInp} onChange={(e)=>onChangeHandle(e,'skillInp')}   className='p-1 mt-1 w-full border-1 rounded-md '  cols={10} row={3}></textarea>
        </div>
         <div className="w-full mb-2">
             <label htmlFor='resumeUpload' className='p-1 bg-blue-800 text-white rounded-lg cursor-pointer'>Resume Upload</label>
             <input onChange={handleInputImage} type='file' className='hidden ' id='resumeUpload' /> 
             
                {
                  data.resume &&  <div className='my-2'>{data.resume }</div>
                }
             
             <div className=" my-2 bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl" onClick={handleOnSave}>Save</div>

        </div>
    
    </div>
  )
}

export default AboutModal
