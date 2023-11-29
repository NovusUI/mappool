import React, { useEffect, useState } from 'react'
import { useMsg } from '../contextAPI/MsgContext'

const MessageBox = () => {

  const {msgType,setMsgType} =  useMsg()
  const [msg, setMsg] = useState("")

  useEffect(()=>{
     if(msgType){
    if(msgType === "success"){
        setMsg("✔ Success")

        setTimeout(() => {
            setMsgType("normal")
        }, 3000);
    }else if(msgType === "failure"){
        console.log(msgType)
        setMsg("Drag down to refresh")
      
    }else if(msgType === "normal"){
         setMsg("Drag down to refresh")
    }
   }

  },[msgType])

  return (
    <div className='message-box' style={msgType==="success" && {borderColor:"#1fb441", color:"#1fb441"} || (msgType==="failure" && {borderColor:"#ff3a3a", color:"#ff3a3a"}) || {borderColor:"#4A4A4A"}}>
     {msg}
    </div>
  )
}

export default MessageBox
