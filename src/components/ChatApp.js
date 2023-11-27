import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contextAPI/AuthContext'
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const ChatApp = ({poolMsgsRef, poolMsgs,setOpenChat,poolId}) => {

    const [filteredMsg, setFilteredMsg] = useState([])
    const [isFiltered, setIsfiltered] = useState(false)
    const [chatValue, setChatValue] = useState("")
    const [passengers,setPassengers] = useState([])
    const [admin, setAdmin] = useState(null)
    const [isInfoMsg, setIsInfoMsg] = useState(false)
    const [directedTo, setDirectedTo] = useState([])

    useEffect(()=>{
        
        console.log(poolId)
        if(poolId){

            (async()=>{
                try {
                    const poolCollection = collection(db,"pool")
                const poolDoc = doc(poolCollection,poolId)
            
                const poolData = await getDoc(poolDoc)
                setAdmin(poolData.data().poolAdmin)
                const poolHailersSubcollection = collection(poolDoc, 'poolHailers') 
            
                const unSubscribePoolHailer = onSnapshot(poolHailersSubcollection,snapshot=>{
                setPassengers([])
                
                snapshot.docs.forEach(doc=> {
                   
                    setPassengers(prev=>[...prev,{id:doc.id,name:((doc.data().username).split(' '))[0]}])
                })
                })
            
                return()=>unSubscribePoolHailer()
                } catch (error) {
                    console.log(error) 
                }
                
            // const chatInputRef = useRef()
         })()
        }

    },[poolId])

    const {user} = useAuth()
    const sendMsg = async()=>{
       
        const chatMsgRef = doc(poolMsgsRef)
        const msg = {
            sender: {
                name: user.displayName,
                id: user.id,
            },
            chat: chatValue,
            time: new Date().getTime()
        }
  
        if(isInfoMsg){
            msg.type = "info"

        }else if(directedTo.length > 0){
            console.log(passengers[0].name, directedTo[0])
            const filteredDirectedTo = passengers.filter(passenger=>directedTo.includes(passenger.name) ).map(passengers=>passengers.id)
            const regex = /^@info/;
            const regex3 = /^@admin/;
            if(regex3.test(chatValue) && !regex.test(chatValue)){
                filteredDirectedTo.push(admin)
            }
           
                

            if(filteredDirectedTo.length >0)
                msg.to = filteredDirectedTo
        }
            

        try {
            await setDoc(chatMsgRef,msg)

            setChatValue("")
        } catch (error) {
            console.log(error)
            setChatValue("")
        }
   
    }

    const filterByInfo = ()=>{
        const filteredMsg = poolMsgs.filter(msg=>msg.type === "info")
        setFilteredMsg(filteredMsg)
        setIsfiltered(true)
    }

    const filterByMsgToYou= ()=>{
      
        const filteredMsg = poolMsgs.filter(msg=>msg.to?.includes(user.id))
        console.log(filteredMsg)
        setFilteredMsg(filteredMsg)
        setIsfiltered(true)
    }

    const handleChatInput = (e)=>{

        const regex = /^@info/;
        const regex2 = /@\w+/g;
        

        const inputString = e.target.value
        const matches = (inputString.match(regex2) || []).map(match => match.slice(1))
        
        if(isInfoMsg &&!regex.test(inputString)){
            setIsInfoMsg(false)
        }
        
        if(regex.test(inputString)) {
            setIsInfoMsg(true)
        }else if(matches.length > 0){
            setDirectedTo(matches)

        }
        
     
        console.log(inputString)
        setChatValue(inputString)
        setIsfiltered(false)
    }
   

  return (
    <div id='chat-view'>
      <button className='x-cancel-btn' onClick={()=>setOpenChat(false)}>x</button>
      <div id="utility-bar">
        <button class='round-btn' onClick={filterByInfo}>i</button>
        <button class='round-btn' onClick={filterByMsgToYou}>@</button>
      </div>
      <div id='chat-area'>
        {  isFiltered &&
            filteredMsg.map((msg,index)=>{
                return(
                <div id={index} className={msg.sender.id === user.id && "my-chat" || "your-chat"}>
                    <h3>{msg.sender.name || "unknown"}</h3>
                    <p>{msg.chat}</p>
                </div>
                )
            })
            ||
            poolMsgs.map((msg,index)=>{
                return(
                <div id={index} className={msg.sender.id === user.id && "my-chat" || "your-chat"}>
                    <h3>{msg.sender.name || "unknown"}</h3>
                    <p>{msg.chat}</p>
                </div>
                )
            })
        }
      </div>
      <div id='chat-input-div'>
        <input id='chat-input' placeholder='your message' value={chatValue} onChange={handleChatInput} />
        <button class='round-btn' onClick={sendMsg}></button>
      </div>
    </div>
  )
}

export default ChatApp
