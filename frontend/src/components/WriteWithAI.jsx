

// export default function WriteWithAI() {
//    const {openAi,openGen}=useSelector(store=>store.app);
//    const dispatch =useDispatch();
  
//   if (!openAi) return null;
  
//     return(
//         <div className="bg-white max-w-8xl  shadow-xl shadow-slate-400 rounded-t-md m-5">
//           <div className="m-2">
//               <div className="flex items-center justify-between text-black text-2xl text-bold bg-gray-200">
//                 <h1>Write with AI</h1>
//                  <div className="flex items-center justify-end gap-3">
//                                <BsDash size={18}/>
//                                <RiExpandDiagonalSLine size={18}/>
//                                <div>
//                                  <RxCross2  onClick={()=>dispatch(setOpenAi(false))} size={18}/>
//                                </div>
//                    </div>
//                </div>

//                <div className="mt-3 text-[#7F7F7F]">
//                  <p>Use AI to generate email.simply describe purpose of writing email and give information related to it and AI will genrate this.</p>
//                </div>
//                <div className="mt-6 "> 
//                 <h1 className="pb-3 text-gray-700 text-lg">Enter your prompt </h1>
//                 <textarea name="prompt"  rows={'10'} cols={'30'} 
//                  value={prompt}
//                  onChange={(e) => setPrompt(e.target.value)}
//                 className='outline-none border-2 border-gray-300 w-full text-gray-600' placeholder="write a cold Email to recuiter of xyz company for job ID xyz-123 ">
//                 </textarea>
//                </div>


               
//                 <div className="flex items-center gap-2 pb-4">
//                   <TbBulb size={40}/>
//                   <span className="text-sm ">Be specific about details like purpose ,audience and outcome to get the best result</span>
//                    <button onClick={()=>dispatch(setOpenGen(true))} className="flex items-center justify-between gap-2 border-2 bg-[#F3EBFC] border-[#AB82EA] text-[#AB82EA] bg-[#DCCAF6] font-bold px-4 py-2 rounded-md hover:bg-[#fff] transition">
//                    <FaPen />
//                    Generate Email
//                    </button>
//                </div>

//           </div>
             
//         </div>
//     )
// }

import React, { useState,useEffect} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPen } from "react-icons/fa";
import { TbBulb } from "react-icons/tb";
import { BsDash } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { RiExpandDiagonalSLine } from "react-icons/ri";
import { setOpenAi ,setOpenGen, setAiSubject,
  setAiMessage} from "../redux/appSlice";
import { useSelector,useDispatch } from "react-redux";
export default function WriteWithAI() {
  const { openAi} = useSelector((store) => store.app);
  const dispatch = useDispatch();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!openAi) {
    setPrompt("");   // 🔥 CLEAR PROMPT WHEN CLOSED
  }
}, [openAi]);

  if (!openAi) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/ai/generate", // backend endpoint you just created
        { prompt },
        { withCredentials: true } // important: cookies for isAuthenticated
      );

      const full = res.data.generatedEmail || "";

      // SIMPLE SPLIT: first line = Subject, rest = body
      const lines = full.split("\n");
      const firstLine = lines[0] || "";
      const rest = lines.slice(1).join("\n").trim();

      const subject = firstLine.replace(/^Subject:\s*/i, "").trim();
      const message = rest || full; // fallback if nothing else

      // Save to Redux so other components can use it
      dispatch(setAiSubject(subject));
      dispatch(setAiMessage(message));

      // Open GenEmail dialog
      dispatch(setOpenGen(true));
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to generate email with AI"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-8xl shadow-xl shadow-slate-400 rounded-t-md m-5">
      <div className="m-2">
        <div className="flex items-center justify-between text-black text-2xl font-bold bg-gray-200 p-2">
          <h1>Write with AI</h1>
          <div className="flex items-center justify-end gap-3">
            <BsDash size={18} />
            <RiExpandDiagonalSLine size={18} />
            <div>
              <RxCross2 onClick={() => dispatch(setOpenAi(false))} size={18} />
            </div>
          </div>
        </div>

        <div className="mt-3 text-[#7F7F7F]">
          <p>
            Use AI to generate an email. Describe the purpose and give details;
            AI will write the email for you.
          </p>
        </div>

        <div className="mt-6">
          <h1 className="pb-3 text-gray-700 text-lg">Enter your prompt</h1>
          <textarea
            name="prompt"
            rows={10}
            cols={30}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Write a cold email to a recruiter at XYZ company for job ID xyz-123..."
            className="w-full border border-gray-300 rounded-md p-2 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pb-4 mt-4">
          <TbBulb size={40} />
          <span className="text-sm">
            Be specific about details like purpose, audience, and desired
            outcome to get the best result.
          </span>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="ml-auto flex items-center justify-center gap-2 bg-[#C2E7FF] text-blue-700 font-bold px-4 py-2 rounded-md hover:bg-white transition border border-blue-300"
          >
            <FaPen />
            {loading ? "Generating..." : "Generate Email"}
          </button>
        </div>
      </div>
    </div>
  );
}



