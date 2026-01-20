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
                const res=await axios.get("http://localhost:8080/api/email/getAllEmail",{
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