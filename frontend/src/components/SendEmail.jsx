import React, { useState } from "react";
import { BsDash } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { RiExpandDiagonalSLine } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import{ useDispatch, useSelector} from 'react-redux'
import store from "../redux/store";
import { setEmails, setOpen,setOpenAi } from "../redux/appSlice";
import toast from "react-hot-toast";
import axios from "axios";
import WriteWithAI from "./WriteWithAI";
const SendEmail=()=>{
  const {open,emails,openAi}=useSelector(store=>store.app);
  const dispatch =useDispatch();
  const [formData,setFormData]=useState({
    to:"",
    subject:"",
    message:""
  })
  const changeHandler=(e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
  }
  const submitHandler=async(e)=>{
    e.preventDefault();
    try {
      const res=await axios.post("http://localhost:8080/api/email/create",formData,{
        headers:{
          'Content-Type':"application/json"
        },
        withCredentials:true
      });
      dispatch(setEmails([...emails,res.data.email]))
      //console.log(res.data);
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
    dispatch(setOpen(false));
  }
 

  return(
    <div className={`${open ? 'block' : 'hidden'} bg-white max-w-6xl shadow-xl shadow-slate-600 rounded-t-md`}>
        <div className="bg-gray-200 flex items-center justify-between p-2">
            <h1 className="font-semibold">New Message</h1>
            <div className="flex items-center gap-3">
               <BsDash size={18}/>
               <RiExpandDiagonalSLine size={18}/>
               <div onClick={()=>dispatch(setOpen(false))}>
                 <RxCross2 size={18}/>
               </div>
            </div>
        </div>


          <form onSubmit={submitHandler} className='flex flex-col p-3 gap-2'>
             <input onChange={changeHandler} value={formData.to} name="to" type="text" placeholder='Recipients' className='outline-none py-1'/>
             <hr className="border-t border-gray-300 gap-2" />
             <input onChange={changeHandler} value={formData.subject} name="subject" type="text" placeholder='Subject' className='outline-none py-1'/>
             <hr className="border-t border-gray-300 gap-2" />
             <div className="flex justify-end mt-2">
              <button
               type="button" onClick={()=>{dispatch(setOpenAi(true));
                dispatch(setOpen(false))
               }} 
               className="flex items-center justify-center gap-2 border-2 bg-[#F3EBFC] border-[#AB82EA] text-[#AB82EA] bg-[#DCCAF6] font-bold px-4 py-2 rounded-md hover:bg-[#fff] transition"
              >
              <FaPen /> Write with AI
              </button>
              </div>

             <textarea onChange={changeHandler} value={formData.message}  name="message"  rows={'10'} cols={'30'} className='outline-none py-1'>
             </textarea>
             <button type='submit' className='bg-blue-700 rounded-full px-5 py-1 w-fit text-white'>Send</button>
            </form>
           
    </div>
  )
}
export default SendEmail