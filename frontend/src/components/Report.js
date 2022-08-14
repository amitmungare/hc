import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Report =()=>{
  const id = localStorage.getItem("userId");
  console.log(id);
  const [reports, setReports] = useState();
  

  useEffect(()=>{
    const sendRequest = async ()=>{
      const {data} = await axios.post(`http://localhost:4000/api/v1/me/allreport`, {id})
      setReports(data.report)
    }
    sendRequest();
  },[])
  console.log(" report ddd",reports)
  return (
    <div>
      {
        JSON.stringify(reports)
      }
    </div>
  )
}

export default Report