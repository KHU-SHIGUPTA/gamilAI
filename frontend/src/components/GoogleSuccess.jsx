import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/appSlice";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    
    axios.get(
      // "http://localhost:8080/api/email/getAllEmail"
      "http://localhost:8080/api/auth/me"
      , {
      withCredentials: true
    })
    .then(res => {
      // User is authenticated if this worked
      // dispatch(setAuthUser({email:"google-user"}));
      dispatch(setAuthUser(res.data.user));
      navigate("/");
    })
    .catch(() => navigate("/login"));
  }, []);

  return <h1 className="text-center text-2xl top-200">Logging you in...</h1>;
}
