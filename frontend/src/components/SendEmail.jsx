import React, { useState, useEffect } from "react";
import { BsDash } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { RiExpandDiagonalSLine } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setEmails, setOpen, setOpenAi,setAiSubject,
  setAiMessage,} from "../redux/appSlice";
import toast from "react-hot-toast";
import axios from "axios";
import WriteWithAI from "./WriteWithAI";
import { IoLink } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { DiGoogleDrive } from "react-icons/di";
import { GrGallery } from "react-icons/gr";
import { BsPenFill } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRef } from "react";
import EmojiPicker from "emoji-picker-react";


const initialFormData = {
  to: "",
  subject: "",
  message: "",
};

const SendEmail = () => {
  const { open, emails,aiSubject, aiMessage } = useSelector(
    (store) => store.app
  );
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
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
  
  
  

 //form data
  const [formData, setFormData] = useState(initialFormData);

  // When compose opens and we have AI-generated text, pre-fill subject & message
 useEffect(() => {
  if (open && (aiSubject || aiMessage)) {

    setFormData((prev) => ({
      ...prev,
      subject: aiSubject || prev.subject,
      message: aiMessage || prev.message,
    }));

    // 👇 THIS is the missing magic
    if (textareaRef?.current) {
      textareaRef.current.innerHTML = aiMessage || "";
    }
  }
}, [open, aiSubject, aiMessage]);


  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Close compose and clear form
 const handleClose = () => {
  setFormData(initialFormData);
  // 🔴 clear AI-generated content from Redux so it won’t auto-fill next time
  dispatch(setAiSubject(""));

  dispatch(setAiMessage(""));
  dispatch(setOpen(false));
  dispatch(setOpenAi(false)); 
  // CLEAR EDITOR UI
if (textareaRef.current) {
  textareaRef.current.innerHTML = "";
}

// CLEAR ATTACHMENTS
setAttachments([]);

// CLOSE POPUPS
setShowEmojiPicker(false);
setShowLinkPopup(false);

};


  const submitHandler = async (e) => {
  e.preventDefault();
  const editor = textareaRef?.current;
  const htmlBody = editor?.innerHTML || "";
 const textBody =
    editor?.innerText?.replace(/\u200B/g, "") // zero-width fix
      ?.replace(/&nbsp;/g, " ")
      ?.trim() || "";

  
  if (!formData.to || !formData.subject || !textBody) {
    toast.error("All fields are required");
    return;
  }


  try {
    let finalMessage = htmlBody || aiMessage || message;


    const editor = textareaRef.current;
    const imgs = editor.querySelectorAll("img");

    imgs.forEach(img => {
      const cid = img.getAttribute("data-cid");
      if (!cid) return;
      finalMessage = finalMessage.replace(img.src, `cid:${cid}`);
    });

    const form = new FormData();
    form.append("to", formData.to);
    form.append("subject", formData.subject);
    form.append("message", finalMessage);

    attachments.forEach(file => form.append("attachments", file));

    console.log("FINAL MESSAGE BEFORE SEND ===>", finalMessage);
for (let p of form.entries()) console.log("FORM DATA ===>", p);

    const res = await axios.post(
      "http://localhost:8080/api/email/create",
      form,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (res.data?.email) {
      dispatch(setEmails([...emails, res.data.email]));
    }

    toast.success("Email sent");

    // clear
    setFormData(initialFormData);
    setMessage("");
    dispatch(setAiSubject(""));
    dispatch(setAiMessage(""));
    dispatch(setOpen(false));
    dispatch(setOpenAi(false));

    // CLEAR EDITOR UI
if (textareaRef.current) {
  textareaRef.current.innerHTML = "";
}

// CLEAR ATTACHMENTS
setAttachments([]);

// CLOSE POPUPS
setShowEmojiPicker(false);
setShowLinkPopup(false);

  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || "Failed to send email");
  }
};


  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } bg-white max-w-6xl shadow-xl shadow-slate-600 rounded-t-md`}
    >
      <div className="bg-gray-200 flex items-center justify-between p-2">
        <h1 className="font-semibold">New Message</h1>
        <div className="flex items-center gap-3">
          <BsDash size={18} />
          <RiExpandDiagonalSLine size={18} />

          <div
            onClick={handleClose} // ⬅️ just close & clear, no refresh
            className="cursor-pointer"
          >
            <RxCross2 size={18} />
          </div>
        </div>
      </div>

      <form
        onSubmit={submitHandler}
        className="flex flex-col p-3 gap-2  relative z-10"
        // ⚠️ Make sure there is NO "action" attr here
      >
       
        <input
          name="to"
          onChange={changeHandler}
          value={formData.to}
          type="text"
          placeholder="Recipients"
          className="outline-none py-1"
        />
        <hr className="border-t border-gray-300 gap-2" />

        <input
          name="subject"
          onChange={changeHandler}
          value={formData.subject}
          type="text"
          placeholder="Subject"
          className="outline-none py-1"
        />
        <hr className="border-t border-gray-300 gap-2" />

        <div className="flex justify-end mt-2">
          <button
            type="button" // ⬅️ important so it doesn't submit the form
            onClick={() => {
              dispatch(setOpenAi(true));
              dispatch(setOpen(false));
            }}
            className=" flex items-center justify-center gap-2 bg-[#C2E7FF] font-bold px-4 py-2 rounded-md hover:bg-[#fff] transition"
          >
            <FaPen /> Write with AI
          </button>
        </div>

        
         <div
        ref={textareaRef}
        contentEditable
        className="w-full px-4 py-2 outline-none text-md min-h-[150px]  max-h-[300px]  overflow-y-auto"
        style={{ whiteSpace: "pre-wrap" }}
        onInput={(e) => setMessage(e.currentTarget.innerHTML)}
      ></div>


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

        
          {/* Footer toolbar */}
                <div className="flex w-full items-center  px-3 py-2">
                  <button
                    type="submit"
                    className="bg-blue-600 mr-2 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700"
                  >
                    Send
                  </button>
        
                  {/* Optional icons (purely visual for now) */}
                  <div className="flex items-center gap-3 text-gray-500 font-medium text-bold">
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
                   <div className="ml-auto">
                      <span className="cursor-pointer hover:text-black"
                     onClick={()=>{
                      setOpen(false);
                      handleClose();
                     }}><RiDeleteBin6Line  size={18} color="#444746"/></span>
                  </div>

                </div>


      </form>

      {/* keep this if you mount WriteWithAI here */}
      {/* <WriteWithAI /> */}
    </div>
  );
};

export default SendEmail;
