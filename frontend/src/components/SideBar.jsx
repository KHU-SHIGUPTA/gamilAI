import React from "react";
import { MdInbox } from "react-icons/md";
import { LuPencil } from "react-icons/lu";
import { IoMdStar } from 'react-icons/io';
import { TbSend2 } from 'react-icons/tb';
import { MdMore, MdOutlineDrafts, MdOutlineKeyboardArrowDown, MdOutlineWatchLater } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useDispatch } from "react-redux";
import { setOpen } from "../redux/appSlice";

const SideBar=()=>{
  const sidebarItems = [
    {
        icon: <MdInbox size={'20px'} />,
        text: "Inbox"
    },
    {
        icon: <IoMdStar size={'20px'} />,
        text: "Starred"
    },
    {
        icon: <MdOutlineWatchLater size={'20px'} />,
        text: "Snoozed"
    },
    {
        icon: <TbSend2 size={'20px'} />,
        text: "Sent"
    },
    {
        icon: <MdOutlineDrafts size={'20px'} />,
        text: "Drafts"
    },
    {
        icon: <MdOutlineKeyboardArrowDown size={'20px'} />,
        text: "More"
    },
]
const dispatch=useDispatch();
    return(
        <div className="w-[15%] ">

           <div className="p-3">
            <button onClick={()=>dispatch(setOpen(true))}className="flex items-center gap-2 bg-[#C2E7FF] p-4 rounded-2xl hover:shadow-md m-2 font-medium"><LuPencil size={24}/>
            Compose
            </button> 
           </div>

           <div className="text-gray-600">
            {
                    sidebarItems.map((item, index) => {
                        return (
                            <div className='flex items-center pl-6 py-1 rounded-r-full gap-4 my-2 hover:cursor-pointer hover:bg-gray-200'>
                                   {item.icon}
                                <p>{item.text}</p>
                            </div>
                        )
                    })
                }
              
           </div>

           <div className="flex items-center p-3 ml-4 gap-2"> 
            <p className="font-medium text-lg">Lables</p>
            <div className="ml-15 hover:cursor-pointer hover:bg-gray-200 hover:rounded-full p-2">
                 <GoPlus size={20} color="gray"/>
            </div>
           </div>
        </div>
        
    )
}
export default SideBar;