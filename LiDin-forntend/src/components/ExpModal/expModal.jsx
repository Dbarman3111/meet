import React,{useState} from 'react'

function ExpModal({handleEditFunc, selfData, closeModal , updateExp, setUpdateExp}) {

    const [data, setData] = useState({designation: updateExp?.clicked ? updateExp?.datas?.designation : "",
         company_name: updateExp?.clicked ? updateExp?.datas?.company_name : "",
          duration: updateExp?.clicked ? updateExp?.datas?.duration : "", 
          location: updateExp?.clicked ? updateExp?.datas?.location : ""});
    const onChangeHandle =  (event , key)=>{
        setData({...data, [key]:event.target.value})
    }



    const updateExpSave = async()=>{
        const currentId = updateExp?.datas?._id;
        const updatedItem = currentId ? {...data, _id: currentId} : data;
        let newFilteredData = selfData?.experience.filter((item) => item._id !== currentId);
        let newExpArr = [...newFilteredData, updatedItem];
        let newData = { ...selfData, experience: newExpArr};
        await handleEditFunc(newData);
        if (closeModal) closeModal();
        setUpdateExp({clicked: "", id: "", datas:{}})
    }

    const handleOnSave = async()=>{
        if(updateExp?.clicked) return updateExpSave();
        let expArr = [...selfData?.experience || [], data];
        let newData = { ...selfData, experience: expArr};
        await handleEditFunc(newData);
        if (closeModal) closeModal();
    }

 const handleOnDelete = async()=>{
    if(!updateExp?.clicked) return;
    const currentId = updateExp?.datas?._id;
    let newFilteredData = selfData?.experience.filter((item) => item._id !== currentId);
    let newData = { ...selfData, experience: newFilteredData};
    await handleEditFunc(newData);
    if (closeModal) closeModal();
    setUpdateExp({clicked: "", id: "", datas:{}})
 }      





  return (
        <div className='mt-5 w-full h-[260px] overflow-y-auto'>
        <div className="w-full mb-4">
            <label >Role*</label>
            <br/>
            <input type="text" value={data.designation} onChange={(e) => setData({...data, designation: e.target.value})} className='p-2 mt-1 w-full border-1 rounded-md ' placeholder='Enter Role' />
        </div>

        <div className="w-full mb-4">
            <label >Company*</label>
            <br/>
            <input type="text" value={data.company_name} onChange={(e) => setData({...data, company_name: e.target.value})} className='p-2 mt-1 w-full border-1 rounded-md ' placeholder='Enter company name' />
        </div>
        <div className="w-full mb-4">
            <label >Duration*</label>
            <br/>
            <input type="text" value={data.duration} onChange={(e) => setData({...data, duration: e.target.value})} className='p-2 mt-1 w-full border-1 rounded-md ' placeholder='Enter Duration' />
        </div>
        <div className="w-full mb-4">
            <label >Place*</label>
            <br/>
            <input type="text" value={data.location} onChange={(e) => setData({...data, location: e.target.value})} className='p-2 mt-1 w-full border-1 rounded-md ' placeholder='Enter Place' />
        </div>
          <div className = 'flex  justify-between '>
            <div className="bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl" onClick={handleOnSave}>Save</div>
            {
                updateExp?.clicked && <div className="bg-red-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl" onClick={handleOnDelete}>Delete</div>
            }
          </div>
        </div>
  )
}

export default ExpModal