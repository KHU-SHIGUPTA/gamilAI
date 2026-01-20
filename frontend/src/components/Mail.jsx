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
import { useSelector,useDispatch } from "react-redux";
import store from "../redux/store";
import axios from "axios";
import { setReplyOpen } from "../redux/appSlice";
import toast from "react-hot-toast";

const Mail=()=>{
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const {selectedEmail,user}=useSelector(store=>store.app);
   
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

  // const deleteHandler=async(e)=>{
  //   try {
  //     const res=await axios.delete(`http://localhost:8080/api/email/${params.id}`,{
  //       withCredentials:true
  //     })

  //     toast.success(res.data.message);
  //     navigate("/")
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  const deleteHandler = async () => {
  try {
    // ⭐ Manual DB email
    if (selectedEmail?._id) {
      const res = await axios.delete(
        `http://localhost:8080/api/email/${selectedEmail._id}`,
        { withCredentials: true }
      );

      toast.success(res.data.message);
      navigate("/");
      return;
    }

    // ⭐ Gmail Email
    if (selectedEmail?.gmailId) {
      const res = await axios.delete(
        `http://localhost:8080/api/email/none`,
        {
          withCredentials: true,
          data: {
            gmailId: selectedEmail.gmailId
          }
        }
      );

      toast.success(res.data.message);
      navigate("/");
      return;
    }

    toast.error("Email ID missing");

  } catch (err) {
    console.log("DELETE ERROR", err);
    toast.error("Failed to delete email");
  }
};


 const BASE_URL = "http://localhost:8080";

let emailHTML = selectedEmail?.message || "";

// replace cid with file URL
if (selectedEmail?.attachments?.length) {
  selectedEmail.attachments.forEach(file => {
    const cid = file.filename.replace(/\s+/g, "_");
    const fileUrl = `${BASE_URL}/${file.path}`;

    emailHTML = emailHTML.replaceAll(`cid:${cid}`, fileUrl);
  });
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
      {/* <h1 className="text-black font-semibold">
            {selectedEmail?.from || selectedEmail?.to}
            
      </h1>
      <div className="text-gray-500 flex items-center gap-2">
            <span>
    to {selectedEmail?.to && selectedEmail?.from ? "me" : selectedEmail?.to}
    
  </span>
           <FaCaretDown size={15} />
      </div>
       */}
<h1 className="text-black font-semibold">
   
  {selectedEmail?.from}
</h1>

<div className="text-gray-500 flex items-center gap-2">
  <span>
    {/* to {selectedEmail?.sender === selectedEmail?.from
      ? selectedEmail?.to
      : "me"} */}

      to {selectedEmail.mailType === "sent" ? selectedEmail.to : "me"}

  </span>
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
         <TbArrowBackUp size={18}  className="cursor-pointer hover:text-blue-600"
  onClick={() => dispatch(setReplyOpen(true))}/>
         <BiDotsVerticalRounded  size={18}/>
      </div>
      </div>
   </div>
   {/* <div className="my-10">
      <p>{selectedEmail?.message}</p>
   </div> */}

   <div className="my-10">

  {/* EMAIL BODY */}

  {/* <div
    dangerouslySetInnerHTML={{ __html: selectedEmail?.message }}
    className="text-[15px] leading-relaxed"
  /> */}

 <div
  dangerouslySetInnerHTML={{ __html: emailHTML }}
  className="text-[15px] leading-relaxed"
/>


  {/* ATTACHMENTS SECTION */}
  {selectedEmail?.attachments?.length > 0 && (
    <div className="mt-6">
      <h3 className="text-gray-700 mb-2 font-medium">
        Attachments ({selectedEmail.attachments.length})
      </h3>

      <div className="flex gap-4 flex-wrap">
        {selectedEmail.attachments.map((file, index) => {
          const url = `http://localhost:8080/${file.path}`;

          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="border border-gray-300 rounded-lg p-3  shadow-sm bg-gray-50 hover:bg-gray-100 
                        transition flex flex-col items-center w-[160px]"
            >

              {/* PDF PREVIEW */}
              {file.filename.endsWith(".pdf") && (
                <>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                    alt="pdf"
                    className="w-12 m-2"
                  />
                  <span className="text-sm text-gray-700 text-center truncate">
                    {file.filename}
                  </span>
                </>
              )}

              {/* IMAGE PREVIEW */}
              {file.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                <>
                  <img
                    src={url}
                    alt="img"
                    className="w-full h-[120px] object-cover rounded"
                  />
                  <span className="text-sm mt-1 text-gray-700 truncate">
                    {file.filename}
                  </span>
                </>
              )}

              {/* OTHER FILES */}
              {!file.filename.match(/\.(pdf|jpg|jpeg|png|gif|webp)$/i) && (
                <span className="text-sm text-gray-700 truncate">
                  {file.filename}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  )}
</div>

   </div>
</div>

  )
}
export default Mail;