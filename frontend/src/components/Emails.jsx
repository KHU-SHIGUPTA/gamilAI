import React, { useEffect, useState } from 'react'
import Email from './Email'
import useGetAllmails from "../hooks/useGetAllmails";
import { useSelector } from 'react-redux';

const Emails = () => {
 useGetAllmails();
  const {emails, searchText} = useSelector(store=>store.app);
  const [filterEmail, setFilterEmail] = useState(emails);

  useEffect(()=>{
  const filteredEmail = emails.filter((email) => {
      const subject = email.subject || "";
      const to = email.to || "";
      const message = email.message || "";
      const search = searchText?.toLowerCase() || "";

      return (
        subject.toLowerCase().includes(search) ||
        to.toLowerCase().includes(search) ||
        message.toLowerCase().includes(search)
      );
    });
    setFilterEmail(filteredEmail);
  }

  ,[searchText, emails]

  )

  return (
    <div>
      {
        filterEmail && filterEmail?.map((email)=> <Email key={email._id} email={email}/> )
      }
        
    </div>
  )
}

export default Emails