import React, { useEffect } from "react";
import SideBar from "./SideBar";
import Inbox from "./Inbox";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar"
const Body=()=>{
  const {user}=useSelector(store=>store.app)
    const navigate=useNavigate();
   useEffect(()=>{
     if(!user){
      navigate('/login')
     }
   },[])
  return(
    <div>
        <Navbar/>
          <div className='flex'>   
           <SideBar/>
           <Outlet/>
          
       </div>
    </div>
  )
}
export default Body