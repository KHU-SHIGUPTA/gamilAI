import React ,{useState}from "react";
import { FaPen } from "react-icons/fa";
import { setOpenGen } from "../redux/appSlice";
import { useSelector,useDispatch } from "react-redux";
const GenEmail=()=>{
    const [useSubject, setUseSubject] = useState(false);
     const {openGen}=useSelector(store=>store.app);
   const dispatch =useDispatch();
  if (!openGen) return null;
    return (
         <div className="bg-white max-w-8xl  shadow-xl shadow-slate-400 rounded-t-md ">

            <div className="p-2">
             
              <div className="flex items-center justify-between text-black text-2xl text-bold bg-gray-200">
                  <h1>Write with AI</h1>
             </div>
             
             <div className="mt-4 ml-2">
                <h1 className="text-xl mb-2 text-gray-600">Email Subject</h1>
                <input  type="text" name="subject" className="outline-none border-2 border-gray-300 rounded-md text-gray-600 text-xl p-1 w-full"/>
             </div>

             <div className="mt-3 ml-2">
                <h1 className="text-xl mb-2 text-gray-600">Email body</h1>
                <textarea className="border-2 border-gray-300 p-2 outline-none overflow-auto resize-none rounded-md" rows={10} cols={80}></textarea>
             </div>
             
             <div className="flex items-center gap-2">
                <input type="text" name="update" placeholder="Make some modifications" className="outline-none rounded-lg border-2 border-gray-300 w-[75%] p-2 ml-2"/>
                   <button className="flex items-center justify-between gap-2 border-2 bg-[#F3EBFC] border-[#AB82EA] text-[#AB82EA] bg-[#DCCAF6] font-bold px-2 py-2 rounded-md hover:bg-[#fff] transition ">
                        <FaPen />
                        Regenerate Email
                    </button>
             </div>

             <div className="flex items-center justify-end gap-3 mt-4">
                   <div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="useSubject"
    checked={useSubject}
    onChange={(e) => setUseSubject(e.target.checked)}
    className="w-4 h-4 accent-blue-500 cursor-pointer"
  />
  <label
    htmlFor="useSubject"
    className="text-black text-base cursor-pointer select-none"
  >
    Use Subject
  </label>
</div>

                <button className="px-3 py-2 text-gray-700 text-lg rounded-md border-2 border-gray-300 hover:bg-gray-700 hover:text-white">Cancel</button>
                <button onClick={()=>dispatch(setOpenGen(false))}className="px-3 py-2 text-white text-lg rounded-md bg-blue-700 hover:bg-white hover:text-blue-700">Use Email</button>
             </div>
            </div>
        </div>
    )
}
export default GenEmail