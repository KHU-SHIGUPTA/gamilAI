import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { TbBulb } from "react-icons/tb";
import { BsDash } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { RiExpandDiagonalSLine } from "react-icons/ri";
import { setOpenAi ,setOpenGen} from "../redux/appSlice";
import { useSelector,useDispatch } from "react-redux";
export default function WriteWithAI() {
   const {openAi,openGen}=useSelector(store=>store.app);
   const dispatch =useDispatch();
  if (!openAi) return null;
    return(
        <div className="bg-white max-w-8xl  shadow-xl shadow-slate-400 rounded-t-md m-5">
          <div className="m-2">
              <div className="flex items-center justify-between text-black text-2xl text-bold bg-gray-200">
                <h1>Write with AI</h1>
                 <div className="flex items-center justify-end gap-3">
                               <BsDash size={18}/>
                               <RiExpandDiagonalSLine size={18}/>
                               <div>
                                 <RxCross2  onClick={()=>dispatch(setOpenAi(false))} size={18}/>
                               </div>
                   </div>
               </div>

               <div className="mt-3 text-[#7F7F7F]">
                 <p>Use AI to generate email.simply describe purpose of writing email and give information related to it and AI will genrate this.</p>
               </div>
               <div className="mt-6 "> 
                <h1 className="pb-3 text-gray-700 text-lg">Enter your prompt </h1>
                <textarea name="prompt"  rows={'10'} cols={'30'} className='outline-none border-2 border-gray-300 w-full text-gray-600' placeholder="write a cold Email to recuiter of xyz company for job ID xyz-123 ">
                </textarea>
               </div>


               
                <div className="flex items-center gap-2 pb-4">
                  <TbBulb size={40}/>
                  <span className="text-sm ">Be specific about details like purpose ,audience and outcome to get the best result</span>
                   <button onClick={()=>dispatch(setOpenGen(true))} className="flex items-center justify-between gap-2 border-2 bg-[#F3EBFC] border-[#AB82EA] text-[#AB82EA] bg-[#DCCAF6] font-bold px-4 py-2 rounded-md hover:bg-[#fff] transition">
                   <FaPen />
                   Generate Email
                   </button>
               </div>

          </div>
             
        </div>
    )
}


