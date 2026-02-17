import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setEmails } from "../redux/appSlice"
import store from "../redux/store"
const useGetAllmails=()=>{
    const dispatch=useDispatch();
    const {emails}=useSelector(store=>store.app)
    useEffect(()=>{
        const fetchEmails=async()=>{
            try {
                const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
                const res=await axios.get(`${BACKEND_URL}/api/email/getAllEmail`,{
                    withCredentials:true 
                });
                

                dispatch(setEmails(res.data.emails))
            } catch (error) {
                console.log(error);
            }
        }
        fetchEmails();
    },[])
}
export default useGetAllmails;