import './App.css'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import Inbox from './components/Inbox'
import Body from './components/Body'
import { Children, useEffect } from 'react'
import Email from './components/Email'
import Mail from './components/Mail'
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import SendEmail from './components/SendEmail'
import Login from './components/Login'
import Signup from './components/Signup'
import  { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux'
import WriteWithAI from './components/WriteWithAI'
import GenEmail from './components/GenEmail'
import ReplyEmail from './components/ReplyEmail'

const appRouter = createBrowserRouter ([
 {
    path:"/",
    element:<Body/>,
    children:[
     {
       path:"/",
       element:<Inbox/>,
     },
     {
       path:"/mail/:id",
       element:<Mail/>,
     }
    ]
  },
  {
    path:'/login',
    element:<Login/>

  },
  {
    path:'/signup',
    element:<Signup/>

  },
 {
  path:'/genai',
  element:<GenEmail/>
 }
])
function App() {
  return (
   <div className='h-screen bg-[#F6F8FC]'>
       <RouterProvider router={appRouter}/>
       <div className='w-[30%] absolute bottom-0 right-8 z-10'>
         <SendEmail/>
         <WriteWithAI/>
       </div>
       <div className="absolute bottom-15 left-75  z-10 right-15">
           <ReplyEmail />
      </div>

       <div className='absolute w-[40%] left-90 top-30 z-10'>
        <GenEmail/>
       </div>
       <Toaster/>
   </div>
  )


}

export default App
