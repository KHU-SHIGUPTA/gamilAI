import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa";
import { GrFormRefresh } from "react-icons/gr";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdInbox,MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FiTag } from "react-icons/fi";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";
import Emails from "./Emails";
import { GrKeyboard } from "react-icons/gr";
  const mailType=[
        {
            icon: <MdInbox size={'20px'} />,
            text:'Primary'
        },
         {
            icon: <FiTag  size={'20px'} />,
            text:'Promotions'
        },
         {
            icon: <MdOutlinePeopleOutline size={'20px'} />,
            text:'Social'
        },
        {
            icon: <IoInformationCircleOutline size={'20px'} />,
            text:'Updates'
        }
    ]

const  Inbox=()=>{
    const [selected,setSelected]=useState(0);
  return(
    <div className="flex-1 bg-white rounded-xl mx-5">
     <div className="flex items-center justify-between px-4 my2">

        <div className="flex items-center ">
         <div className="flex items-center gap-1 m-4 text-gray-500">
            <FaRegSquare size={15}/>
             <FaCaretDown size={20}/>
        </div>
        <div className="text-gray-500 p-2 rounded-full hover:bg-gray-200 cursor-pointer">
            <GrFormRefresh size={20}/>
        </div>

         <div className="text-gray-500 p-2 rounded-full hover:bg-gray-200 cursor-pointer">
            <BiDotsVerticalRounded size={20}/>
        </div>
       </div>

       <div className="text-gray-500 flex items-center gap-2">
        <span className="text-gray-700">1 to 50</span>
          <MdKeyboardArrowLeft size="24px" />
          <MdKeyboardArrowRight size="24px" />
          <GrKeyboard size="18px" color="black"/>
           <FaCaretDown size={15} color="black"/>
       </div>
     </div>

     <div className="h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-1 text-gray-700">
             {
                mailType.map((item,index)=>{
                    return(
                        <button onClick={() => setSelected(index)} className={` ${selected === index ? "border-b-4 border-b-blue-600 text-blue-600" : "border-b-4 border-b-transparent"} flex items-center gap-5 p-4 w-52 hover:bg-gray-100`}>
                            {item.icon}
                            <span>{item.text}</span>
                        </button>
                    )
                })
             } 
        </div>
        <Emails/>
     </div>
    </div>
  )
}
export default  Inbox;