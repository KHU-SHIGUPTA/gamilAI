import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BiArchiveIn } from "react-icons/bi";
import { MdOutlineReport } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineMarkEmailUnread ,MdOutlineStarOutline } from "react-icons/md";
import { MdOutlineDriveFileMove } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { GrKeyboard } from "react-icons/gr";
import { FaCaretDown,FaRegSmile } from "react-icons/fa";
import { BiPrinter } from "react-icons/bi";
import { TfiNewWindow } from "react-icons/tfi";
import { TbArrowBackUp } from "react-icons/tb";
import { useSelector } from "react-redux";
import store from "../redux/store";
import axios from "axios";
import toast from "react-hot-toast";

const Mail=()=>{
  const navigate=useNavigate();
  const {selectedEmail}=useSelector(store=>store.app);
  const params=useParams();
  const getTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (let [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};
  const deleteHandler=async(e)=>{
    try {
      const res=await axios.delete(`http://localhost:8080/api/email/${params.id}`,{
        withCredentials:true
      })
      toast.success(res.data.message);
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
  return(
    <div className="flex-1 bg-white rounded-xl mx-5">
      <div className="flex items-center justify-between px-4">
       <div className="flex items-center gap-2 text-gray-700 py-4">
         <div onClick={()=>{
           navigate("/")
         }} className="p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer">
          <FaArrowLeft size={15}/>
         </div>

          <div className="p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer">
          <BiArchiveIn size={18}/>
         </div>

          <div className="p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer">
          <MdOutlineReport size={18}/>
         </div>
          <div onClick={deleteHandler} className="p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer">
          < RiDeleteBin6Line size={18}/>
         </div>

          <div className="h-6 border-l border-gray-200 mx-2"></div>


          <div className="p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer">
          <MdOutlineMarkEmailUnread  size={18}/>
         </div>
          <div className="p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer">
          <MdOutlineDriveFileMove size={18}/>
         </div>
          <div className="p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer">
          <BiDotsVerticalRounded  size={18}/>
         </div>

       </div>

       <div className="text-gray-700 flex items-center gap-2">
               <span className="text-gray-700">1 to 50</span>
                 <MdKeyboardArrowLeft size="24px" />
                 <MdKeyboardArrowRight size="24px" />
                 <GrKeyboard size={18} />
                  <FaCaretDown size={15} />
        </div>
    </div>


   <div className="h-[90vh] overflow-y-auto p-4">
    <div className="flex items-center justify-between bg-white gap-1">
      <div className="flex items-center gap-3">
          <h1 className="text-xl font-medium">{selectedEmail?.subject}</h1>
          <div className="flex items-center gap-1  bg-gray-200 rounded mt-1 ">
            <span className="text-xs hover:bg-gray-600 pl-1 pb-1 pr-1 hover:text-white">Inbox</span>
            <p className="text-xs  pb-1 pr-1 hover:bg-gray-600 hover:text-white">x</p>
          </div>
      </div>
       <div className="text-gray-700 flex items-center gap-4 hover:bg-gray-300 hover:roundedfull">
             <BiPrinter size={18}/>
             <TfiNewWindow size={18}/>
          </div>
    </div>
   
   <div className="text-black text-sm mt-4 flex justify-between items-center ">
     
     <div>
       <h1 className="text-black font-semibold">{selectedEmail?.to}</h1>
      <div className="text-gray-500 flex items-center gap-2">
           <span>to me</span>
           <FaCaretDown size={15} />
      </div>
      </div>

     
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-500">
        {getTimeAgo(selectedEmail?.createdAt)}
      </div>

      <div className="flex items-center gap-4">
        <MdOutlineStarOutline size={18}/>
        <FaRegSmile size={15}/>
         <TbArrowBackUp size={18}/>
         <BiDotsVerticalRounded  size={18}/>
      </div>
      </div>
   </div>
   <div className="my-10">
      <p>{selectedEmail?.message}</p>
   </div>
   </div>
</div>

  )
}
export default Mail;