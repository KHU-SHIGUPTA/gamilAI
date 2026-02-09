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
      //  navigate(`/mail/${email._id}`);
      //  dispatch(setSelectedEmail(email));

      const mailId = email._id || email.gmailId;

dispatch(setSelectedEmail(email));
navigate(`/mail/${mailId}`);

   }

//    const getPreviewText = (html) => {
//   if (!html) return "";

//   // remove all html tags
//   let text = html.replace(/<[^>]+>/g, "");

//   // convert &nbsp; and entities
//   text = text.replace(/&nbsp;/g, " ");

//   return text.trim();
// };

const getPreviewText = (html, maxLength = 120) => {
  if (!html) return "";

  let text = html.replace(/<[^>]+>/g, "");
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  return text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;
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
   //  <div onClick={openMail} className="flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md">
   <div
  onClick={openMail}
  className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 px-2 md:px-4 py-2 md:py-3 text-sm hover:cursor-pointer hover:shadow-md"
>

          {/* <div className="flex items-center gap-2"> */}
          <div className="flex items-center gap-2 mb-1 md:mb-0">

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

          {/* <div className="flex-1 ml-4">
             
             <p>{getPreviewText(email?.message)}</p>
               {email?.attachments?.length > 0 && (
                  <span className="text-blue-600">< MdPictureAsPdf size={25} color="black"/></span>
               )}
          </div> */}

          <div className="flex-1 ml-4">
  <p
    className="text-gray-600 text-sm overflow-hidden"
    style={{
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    }}
  >
    {getPreviewText(email?.message)}
  </p>

  {email?.attachments?.length > 0 && (
    <span className="text-blue-600">
      <MdPictureAsPdf size={20} color="black" />
    </span>
  )}
</div>

          {/* <div className="flex-none text-gray text-sm"> */}
          <div className="flex-none text-gray text-sm mt-1 md:mt-0 self-end md:self-auto">

            <p>{getTimeAgo(email?.createdAt)}</p>
          </div>
    </div>
   )
}
export default Email;
