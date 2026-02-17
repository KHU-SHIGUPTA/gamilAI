import React,{useState} from "react";
import { useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux"
import {Link} from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import axios from "axios"
import toast from "react-hot-toast";
import { setAuthUser } from "../redux/appSlice";
//old
 const Login=()=>{
    const [input,setInput]=useState({
        email:"",
        password:""
    });
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const changeHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value});
    }
    const submitHandler= async(e)=>{
        e.preventDefault();
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const res=await axios.post(`${BACKEND_URL}/api/user/login`,input,{
                headers:{
                   'Content-Type': "application/json"
                },
                withCredentials:true
            } );
            if(res.data.success){
               dispatch(setAuthUser(res.data.user))
               navigate('/');
               toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    //login with login
    const loginWithGoogle = () => {
          const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
       window.location.href = `${BACKEND_URL}/auth/google`;
    };

     return(
        <div className="flex items-center justify-center w-screen pt-20">
             {/* <form onSubmit={submitHandler} className="flex flex-col gap-3 bg-white p-3 w-[20%] bottom-3"> */}
             <form
  onSubmit={submitHandler}
  className="flex flex-col gap-3 bg-white p-4 w-full max-w-[380px]"
>

                <h1 className="font-bold text-2xl uppercase my-2 text-center">Login </h1>
                 <button type="button" onClick={loginWithGoogle} className="border border-gray-700 rounded-md flex items-center gap-2 px-4 py-1 ">
                    <FcGoogle size={35} className="left-3 top-8"/>
                     <span>Sign in with Google</span>
                 </button>

                <div className="flex items-center gap-3">
                     <hr className="flex-1 border-t border-gray-700" />
                     <p className="text-xl text-center whitespace-nowrap">or</p>
                     <hr className="flex-1 border-t border-gray-700" />
                </div>

                 <input onChange={changeHandler} value={input.email} name="email" type="email" placeholder="Email" className="border border-gray-400 rounded-md px-2 py-1"/>
                  <input onChange={changeHandler} value={input.password} name="password" type="password" placeholder="Password" className="border border-gray-400 rounded-md px-2 py-1"/>
                  <button type="submit" className="bg-gray-800 p-2 text-white my-2 rounded-md">Login</button>
                   <p>Don't have an account?<Link to={"/signup"} className="text-blue-600 ">Signup</Link></p>
             </form>
        </div>
    )
}
export default Login