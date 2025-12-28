import {createSlice} from "@reduxjs/toolkit"

const appSlice =createSlice({
    name:"app",
    initialState:{
        open:false,
        openAi:false,
        openGen:false,
        user: null,
        emails: [],
        selectedEmail: null,
        searchText:"",
         aiSubject: "",    // ⬅️ NEW
         aiMessage: "", 
         replyOpen: false,
    },
    reducers:{
        setOpen:(state,action)=>{
            state.open=action.payload
        }
        ,
        setOpenAi:(state,action)=>{
            state.openAi=action.payload
        },
        setOpenGen:(state,action)=>{
            state.openGen=action.payload
        }
        ,
         setAuthUser:(state,action)=>{
              state.user=action.payload;
        }
        ,setEmails:(state,action)=>{
           state.emails=action.payload; 
        },
        setSelectedEmail:(state,action)=>{
            state.selectedEmail=action.payload;
        },
        setSearchText:(state,action)=>{
            state.searchText=action.payload
        },
         setAiSubject:(state, action)=>{
        state.aiSubject = action.payload;
    },
    setAiMessage:(state, action)=>{
        state.aiMessage = action.payload;
    },
    setReplyOpen:(state, action)=>{
        state.replyOpen = action.payload;
      },
      
    },
})
export const{setOpen,setOpenAi,setOpenGen,setAuthUser,setEmails,setSelectedEmail,setSearchText,setAiSubject,      // ⬅️ NEW
  setAiMessage,setReplyOpen}=appSlice.actions;
export default appSlice.reducer;