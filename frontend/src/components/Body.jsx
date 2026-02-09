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
    // <div>
    //     <Navbar/>
    //       <div className='flex'>   
    //        <SideBar/>
    //        <Outlet/>
          
    //    </div>
    // </div>
    <div className="h-screen flex flex-col overflow-hidden">
  {/* Navbar fixed */}
  <Navbar />

  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar fixed */}
    <SideBar />

    {/* Main content scrolls */}
    <div className="flex-1 overflow-y-auto">
      <Outlet />
    </div>
  </div>
</div>

  )
}
export default Body