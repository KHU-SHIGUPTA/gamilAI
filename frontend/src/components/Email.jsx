import React from "react";
import { FaRegSquare } from "react-icons/fa";
import { MdOutlineStarOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedEmail } from "../redux/appSlice";
import { MdPictureAsPdf } from "react-icons/md";
const Email=({email})=>{
   const navigate=useNavigate();
   const dispatch=useDispatch();
   const openMail=()=>{
      dispatch(setSelectedEmail(email));
       navigate(`/mail/${email._id}`);
   }

   const getPreviewText = (html) => {
  if (!html) return "";

  // remove all html tags
  let text = html.replace(/<[^>]+>/g, "");

  // convert &nbsp; and entities
  text = text.replace(/&nbsp;/g, " ");

  return text.trim();
};


   // utils/date.js
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

   return (
    <div onClick={openMail} className="flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md">
          <div className="flex items-center gap-2">
             <div className="text-gray-500">
                 <FaRegSquare size={15}/>
             </div>
              <div className="text-gray-500">
                 <MdOutlineStarOutline size={18}/>
             </div>
             <div className="font-semibold">
                <h1>{email?.subject}</h1>
             </div>
          </div>

          <div className="flex-1 ml-4">
             {/* <p>{email?.message}</p> */}
             <p>{getPreviewText(email?.message)}</p>
               {email?.attachments?.length > 0 && (
                  <span className="text-blue-600">< MdPictureAsPdf size={25} color="black"/></span>
               )}
          </div>
          <div className="flex-none text-gray text-sm">
            <p>{getTimeAgo(email?.createdAt)}</p>
          </div>
    </div>
   )
}
export default Email;
