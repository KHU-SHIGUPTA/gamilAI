import React, { useEffect,useState } from "react";
import SideBar from "./SideBar";
import Inbox from "./Inbox";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar"
const Body=()=>{
  const {user}=useSelector(store=>store.app)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate=useNavigate();
   useEffect(()=>{
     if(!user){
      navigate('/login')
     }
   },[])
  return(
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-[240px]
            transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:static md:translate-x-0
          `}
        >
          <SideBar />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto md:ml-0">
          <Outlet />
        </div>
      </div>
    </div>


  )
}
export default Body