import React, { useEffect, useState ,useRef} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoSearchSharp } from "react-icons/io5";
import { LuSlidersHorizontal } from "react-icons/lu";
import { GoQuestion } from "react-icons/go";
import { IoMdSettings } from "react-icons/io";
import { SiGooglegemini } from "react-icons/si";
import { TbGridDots } from "react-icons/tb";
import Avatar from 'react-avatar';
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setSearchText } from "../redux/appSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
export default function Navbar({ onMenuClick }){
  const [text,setText]=useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {user} =useSelector(store=>store.app);
  const dispatch=useDispatch();
  const dropdownRef = useRef();
  const navigate=useNavigate();
  const logoutHandler=async()=>{
    try {
       const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res=await axios.get(`${BACKEND_URL}/api/user/logout`);
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
      navigate('/login')
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
     dispatch(setSearchText(text))
  },[text])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    return (
      <div className='bg-[#f9f9f9] sticky top-0 z-50 shadow'>
       {/* <div className="flex items-center justify-between mx-3 h-16 "> */}
       <div className="flex items-center justify-between mx-2 md:mx-3 h-16">

            {/* <div className="flex items-center gap-10"> */}
            <div className="flex items-center gap-3 md:gap-10">

                  {/* <div className="flex items-center gap-2"> */}
                  <div className="flex items-center gap-1 md:gap-2">

                    {/* <div className='p-3 hover:bg-gray-200 rounded-full cursor-pointer'>
                        <RxHamburgerMenu size={20} />   
                    </div> */}

                    <div
  className="p-3 hover:bg-gray-200 rounded-full cursor-pointer md:hidden"
  onClick={onMenuClick}
>
  <RxHamburgerMenu size={20} />
</div>

                    <img className='w-8 h-8 object-contain' src="https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png" alt="logo" />
                    <h1 className='text-2xl text-gray-500 font-medium'>Gmail</h1>
                  </div>
            </div>
             {
              user&&( 
              <>
              {/* <div className="w-[50%] mr-60"> */}
              <div className="hidden md:block md:w-[50%] md:mr-60">

                <div className="flex items-center bg-[#E9EEF6] px-2 py-3 rounded-full gap-3">
                 <div className="ml-3">
                   <IoSearchSharp size={20} color="#555555"/>
                </div>
                <input value={text} onChange={(e)=>{
                  setText(e.target.value)
                }} className="rounded-full w-full bg-transparent px-1 outline-none" type="text" placeholder="Search Mail" />
                <div className="mr-3 text-bold">
                    <LuSlidersHorizontal size={20} />
                </div>
                </div>
             </div>
  <div className="flex items-center gap-2">
              <div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer">
                <GoQuestion size={24} color="#3c4043"/>
              </div>

              <div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer">
                <IoMdSettings size={24} color="#3c4043"/>
              </div>

              <div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer">
                <SiGooglegemini size={24} color="#3c4043"/>
              </div>

              <div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer">
                <TbGridDots size={24} color="#3c4043"/>
              </div>

              <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <Avatar src={user.profilePhoto} size="35" round={true} />
              </div>
               {isDropdownOpen && (
  <div
    ref={dropdownRef}
    className="absolute right-0 top-14 w-80 bg-[#E9EEF6] rounded-2xl shadow-lg border p-4 z-50"
  >
    {/* Header: email + close button */}
  <div className="relative flex items-center justify-center mb-3">
  {/* Centered email */}
  <p className="absolute left-1/2 -translate-x-1/2 text-sm text-gray-700 font-medium truncate">
    {user.fullname
      ? user.email
      : user.googleEmail || user.email}
  </p>

  {/* Cross button on right end */}
  <button
    onClick={() => setIsDropdownOpen(false)}
    className="absolute right-2 p-1 hover:bg-gray-300 rounded-full transition"
    title="Close"
  >
    <RxCross1 size={18} />
  </button>
</div>


    {/* Profile section */}
    <div className="flex flex-col items-center text-center">
      <Avatar src={user.profilePhoto|| user.googleAvatar} size="60" round={true} />
      <p className="font-semibold text-gray-800 mt-2">
        Hi, {user.fullname || user.googleName||"User"}!
      </p>
      <button
        onClick={() => alert("Manage Account Clicked")}
        className="text-blue-500 hover:underline text-sm mt-1"
      >
        Manage your Account
      </button>
    </div>

    <hr className="my-4 border-gray-300" />

    {/* Logout button */}
  
    <button
  onClick={logoutHandler}
  className="relative flex items-center justify-center w-full h-[30px] bg-gray-100 hover:bg-gray-500 py-2 rounded-lg text-gray-700 font-medium transition"
>
  <span className="absolute left-1/2 -translate-x-1/2">Signout</span>
  <PiSignOutBold className="absolute right-4" size={20} />
</button>
   
  </div>
)}

             </div>
              </>
              )
             }
 
           </div>  
        </div>
    )
}