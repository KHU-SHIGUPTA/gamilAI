import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector} from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setReplyOpen,setSelectedEmail } from "../redux/appSlice";
import { FaCaretDown} from "react-icons/fa";
import { TbArrowBackUp } from "react-icons/tb";
import { IoLink } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { DiGoogleDrive } from "react-icons/di";
import { GrGallery } from "react-icons/gr";
import { BsPenFill } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import Avatar from 'react-avatar';
import { useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaPen } from "react-icons/fa";
import { useParams } from "react-router-dom";
const ReplyEmail = () => {
  const dispatch = useDispatch();
   const [message, setMessage] = useState("");
 const { mailId } = useParams();


  const { replyOpen,selectedEmail,user } = useSelector(
    (store) => store.app
  );

useEffect(() => {
  if (selectedEmail) {
    setMessage("");
    setAiPrompt("");
    setShowAIReply(false);
  }
}, [selectedEmail?._id || selectedEmail?.gamilId]);

//reply ai
const [showAIReply, setShowAIReply] = useState(false);
const [aiPrompt, setAiPrompt] = useState("");
const [aiLoading, setAiLoading] = useState(false);

const handleAIReply = async () => {
  try {
    setAiLoading(true);
  if (!aiPrompt.trim()) {
  toast.error("Please enter a prompt for AI");
  return;
}
  const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
    const res = await axios.post(
      `${BACKEND_URL}/api/ai/reply`,
      {
        prompt: aiPrompt,
        email: {
          subject: selectedEmail.subject,
          message: selectedEmail.message,
          attachments: selectedEmail.attachments
        }
      },
      { withCredentials: true }
    );

    
    if (res.data.success) {
  const aiText = res.data.text;

  // ✅ update state
  setMessage(aiText);
console.log(res.data.text);
  // ✅ update editor UI
  if (textareaRef.current) {
    textareaRef.current.innerHTML = aiText;
  }

  setShowAIReply(false);
  setAiPrompt("");
}

  } catch {
    alert("Failed to generate AI reply");
  } finally {
    setAiLoading(false);
  }
};


useEffect(() => {
  if (!replyOpen) {
    setShowAIReply(false);
    setAiPrompt("");
  }
}, [replyOpen]);

const closeReply = () => {
  setShowAIReply(false);   // ⭐ close AI UI
  setAiPrompt("");         // ⭐ reset prompt
  dispatch(setReplyOpen(false));
};


  //attach
const fileInputRef = useRef(null);
const [attachments, setAttachments] = useState([]);
 useEffect(() => {
  return () => {
    attachments.forEach(file =>
      URL.revokeObjectURL(file)
    );
  };
}, [attachments]);
//file size 
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
//link
const [showLinkPopup, setShowLinkPopup] = useState(false);
const [linkText, setLinkText] = useState("");
const [linkUrl, setLinkUrl] = useState("");
const textareaRef = useRef(null);
const linkPopupRef = useRef(null);
const savedRangeRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      linkPopupRef.current &&
      !linkPopupRef.current.contains(event.target)
    ) {
      setShowLinkPopup(false);
    }
  };

  if (showLinkPopup) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showLinkPopup]);

//for emojii
const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//gallery
const imageInputRef = useRef(null);

const handleImageSelect = (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const editor = textareaRef.current;
  editor.focus();

  files.forEach((file) => {
    // store file so backend can send it
    setAttachments(prev => [...prev, file]);

    const blobUrl = URL.createObjectURL(file);
    const cid = file.name.replace(/\s+/g, "_");

    // insert preview image in editor
    editor.innerHTML += `
  
      <img src="${blobUrl}" 
           data-cid="${cid}"
           style="max-width:50%;max-height:300px;border-radius:8px;margin:8px 0" />
      <br>
    `;
  });

  setMessage(editor.innerHTML);
  e.target.value = "";
};



//message content


  useEffect(() => {
    if (!replyOpen) setMessage("");
  }, [replyOpen]);
 

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
     // let finalMessage = message;

    // let finalMessage = message;
     // 1️⃣ normalize ONLY editor HTML
const tempDiv = document.createElement("div");
tempDiv.innerHTML = message;

const normalizedHtml = tempDiv.innerHTML
  .split(/<br\s*\/?>\s*<br\s*\/?>/gi)
  .map(block => block.trim())
  .filter(Boolean)
  .map(block => `<p>${block}</p>`)
  .join("");

// 2️⃣ assign normalized HTML as body
let finalMessage = normalizedHtml;



const editor = textareaRef.current;
const imgs = editor.querySelectorAll("img");

imgs.forEach(img => {
  const cid = img.getAttribute("data-cid");
  if (!cid) return;

  finalMessage = finalMessage.replace(img.src, `cid:${cid}`);
});

      const form = new FormData();
form.append("to", selectedEmail.to);
form.append("subject", `Re: ${selectedEmail.subject}`);
form.append("message",finalMessage);

attachments.forEach(file => form.append("attachments", file));
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
await axios.post(
  `${BACKEND_URL}/api/email/create`,
  form,
  {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  }
);

      toast.success("Reply sent");
      dispatch(setReplyOpen(false));
      setMessage("");
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };
 if (!replyOpen || !selectedEmail || !user) return null;

  return (
    <div className="flex items-start gap-3 w-full">
    <Avatar
  src={user?.profilePhoto || "https://avatar.iran.liara.run/public/girl"}
  size="35"
  round={true}
  className="shrink-0 mt-2"
/>

   <div className="flex-1  w-full mt-4 shadow-md shadow-slate-600 rounded-t-md bg-white">

  <div className="flex w-full items-center justify-between px-4 py-2">
  
  {/* LEFT */}
  <div className="flex items-center text-sm text-gray-600">
    <div className="flex items-center hover:bg-[#eee] rounded p-2">
      <TbArrowBackUp size={20} />
      <FaCaretDown size={20} />
    </div>
    <span className="ml-2 text-gray-600 text-md hover:bg-white">
      {selectedEmail.to}
    </span>
  </div>

  {/* RIGHT (BUTTON + CROSS) */}
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => setShowAIReply(true)}
      className="flex items-center gap-2 bg-[#C2E7FF] font-bold px-4 py-2 rounded-md hover:bg-white transition"
    >
      <FaPen /> Write with AI
    </button>
   

    <RxCross2
      size={18}
      className="cursor-pointer text-gray-500 hover:text-black"
      onClick={() => dispatch(setReplyOpen(false))}
    />
  </div>
</div>


      {/* Message box */}
      <form onSubmit={submitHandler}>
       
        <div
        ref={textareaRef}
        contentEditable
        className="w-full px-4 py-2 outline-none text-md min-h-[150px] max-h-[300px] overflow-y-auto"
        style={{ whiteSpace: "pre-wrap" }}
        onInput={(e) => setMessage(e.currentTarget.innerHTML)}
      ></div> 
       

       { /*attach*/}
        <input type="file" ref={fileInputRef} className="hidden"
         multiple onChange={(e) => {
           const selectedFiles = Array.from(e.target.files);
           setAttachments((prev) => [...prev, ...selectedFiles]);
          }} />

        {attachments.length > 0 && (
  <div className="px-4 py-2  flex flex-wrap gap-2">
    {attachments.map((file, index) => {
      const fileUrl = URL.createObjectURL(file);

      return (
        <div
          key={index}
          className="flex items-center justify-between gap-2 bg-[#F5F5F5] w-[250px] px-2 py-1 rounded text-md"
        >
          {/* CLICKABLE FILE */}
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold  truncate max-w-[160px]"
          >
            {file.name}
             <span className="text-gray-500">
            ({formatFileSize(file.size)})
          </span>

          </a>

          {/* REMOVE FILE */}
          <RxCross2
            size={12}
            className="cursor-pointer text-gray-500 hover:text-black-500"
            onClick={() =>
              setAttachments((prev) =>
                prev.filter((_, i) => i !== index)
              )
            }
          />
        </div>
      );
    })}
  </div>
)}

{/*link popup ui*/}
{showLinkPopup && (
  <div
    ref={linkPopupRef}
    className="absolute bottom-16 left-32 z-50 bg-white shadow-lg rounded-lg p-4 w-[280px]"
  >
    <div className="mb-3">
      <input
        type="text"
        placeholder="Text"
        value={linkText}
        onChange={(e) => setLinkText(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>

    <div className="mb-3">
      <input
        type="text"
        placeholder="Type or paste a link"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>

    <div className="flex justify-end">
      <button
        className="text-blue-600 font-medium text-sm"
         onClick={() => {
  if (!linkUrl) return;

  const editor = textareaRef.current;
  editor.focus();

  let range = savedRangeRef.current;

  // 🔒 SAFETY: if range is outside editor, fix it
  if (!range || !editor.contains(range.commonAncestorContainer)) {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false); // move cursor to end
  }

  // Remove selected text (if any)
  range.deleteContents();

  // Create link
  const anchor = document.createElement("a");
  anchor.href = linkUrl;
  anchor.textContent = linkText || linkUrl;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.className = "text-blue-600 underline cursor-pointer";
  anchor.contentEditable = "false";       // allow clicking
  anchor.style.pointerEvents = "auto";
  // Insert link INSIDE editor
  range.insertNode(anchor);

  // Move cursor after link
  range.setStartAfter(anchor);
  range.collapse(true);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  // Sync message state
  setMessage(editor.innerHTML);

  setShowLinkPopup(false);
  setLinkText("");
  setLinkUrl("");
}}


      >
        Apply
      </button>
    </div>
  </div>
)}

{/* for emoji */}

{showEmojiPicker && (
  <div className="absolute bottom-14 right-20 left-40 z-50 shadow-lg">
    <EmojiPicker
      onEmojiClick={(emojiData) => {
        const editor = textareaRef.current;
        editor.focus();

        let range = savedRangeRef.current;
        if (!range || !editor.contains(range.commonAncestorContainer)) {
          range = document.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);
        }

        range.deleteContents();

        const textNode = document.createTextNode(emojiData.emoji);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.collapse(true);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        setMessage(editor.innerHTML);
        setShowEmojiPicker(false);
      }}
      searchDisabled={false}
      skinTonesDisabled={false}
      height={350}
      width={300}
    />
  </div>
)}

{/* galleery */}
<input
  type="file"
  ref={imageInputRef}
  accept="image/*"
  multiple
  className="hidden"
  onChange={handleImageSelect}
/>

     {/* {showAIReply && (
  <div className="flex items-center gap-2 ">
    <input
      type="text"
      value={aiPrompt}
      onChange={e => setAiPrompt(e.target.value)}
      placeholder="Tell AI how to reply..."
      className="flex-1 border rounded px-2 py-1 w-full text-sm"
       //className="w-full max-w-[900px]  px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              
    />

    <button
      onClick={handleAIReply}
      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
    >
      {aiLoading ? "Creating..." : "Create"}
    </button>

    <button
      onClick={() => {
        setShowAIReply(false);
        setAiPrompt("");
      }}
      className="text-sm text-gray-600 hover:text-black"
    >
      Cancel
    </button>
  </div>
)} */}
{/* AI Reply Prompt – FULL WIDTH ROW */}
{showAIReply && (
  <div className="px-4 pb-2 w-full">
    <div className="flex items-center gap-3 w-full">
      <input
        type="text"
        value={aiPrompt}
        onChange={e => setAiPrompt(e.target.value)}
        placeholder="Tell AI how to reply…"
        className="flex-1 min-w-0 px-4 py-2 text-sm border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="button"
        onClick={handleAIReply}
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
      >
        {aiLoading ? "Creating..." : "Create"}
      </button>

      <button
      type="button"
        onClick={() => {
          setShowAIReply(false);
          setAiPrompt("");
        }}
        className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:text-black mr-30" 
      >
        Cancel
      </button>
    </div>
  </div>
)}


        {/* Footer toolbar */}
        <div className="flex w-full items-center  px-3 py-2">
          <button
            type="submit"
            className="bg-blue-600 mr-2 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700"
          >
            Send
          </button>
        

          {/* Optional icons (purely visual for now) */}
          <div className="flex items-center gap-3 text-gray-500 font-medium text-bold shrink-0">
            <span className="cursor-pointer rounded-full bg-[#D3E3FD] text-[#444746] font-medium p-2">Aa</span>

            <span className="cursor-pointer "  onClick={() => fileInputRef.current.click()}><IoMdAttach size={18} color="#444746"/></span>

            <span className="cursor-pointer" onClick={() => {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                   savedRangeRef.current = selection.getRangeAt(0);
                 }
                 setShowLinkPopup(true);
              }}><IoLink strokeWidth={2.5} size={18} color="#565857"/></span>

            <span className="cursor-pointer"  onClick={() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0);
    }
    setShowEmojiPicker((prev) => !prev);
  }}><MdOutlineEmojiEmotions size={18} color="#444746"/></span>

            <span className="cursor-pointer"><DiGoogleDrive size={18} color="#444746"/></span>

            <span className="cursor-pointer " onClick={() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0);
    }
    imageInputRef.current.click();
  }} ><GrGallery size={18} color="#444746"/></span>

            <span className="cursor-pointer"><BsPenFill size={18} color="#444746"/></span>

            <span className="cursor-pointer"><BsThreeDotsVertical size={18} color="#444746"/></span>

          </div>
           <div className="ml-auto ">
              <span className="cursor-pointer hover:text-black"
         // onClick={() => dispatch(setReplyOpen(false))}
         onClick={closeReply}
          >
            <RiDeleteBin6Line  size={18} color="#444746"/></span>
          </div>
        </div>
      </form>
    </div>

    </div>
  );

};

export default ReplyEmail;