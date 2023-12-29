import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contextAPI/AuthContext'
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import ScrollToBotttomBtn from './ScrollToBotttomBtn'
import { useMsg } from '../contextAPI/MsgContext'
import { useNav } from '../contextAPI/NavContaxt'

const ChatApp = ({poolMsgsRef, poolMsgs,setOpenChat,poolId}) => {

    const [filteredMsg, setFilteredMsg] = useState([])
    const [isFiltered, setIsfiltered] = useState(false)
    const [chatValue, setChatValue] = useState("")
    const [passengers,setPassengers] = useState([])
    const [admin, setAdmin] = useState(null)
    const [isInfoMsg, setIsInfoMsg] = useState(false)
    const [directedTo, setDirectedTo] = useState([])
    const {setMsgType} = useMsg()
    const chatAreaRef = useRef()
    const [instruction, setInstruction] = useState([])
    const {setShowNav} = useNav()

    const preSetMessages = [
        "@info should be used at the beginning of  your message to set message in the 'i' filter",
        "use @poolee's Name to mention a poolee in your message. All your mentions are seen in the '@' filter",
        "use @admin at the beginning of your message to mention pool admin in your message",
        "it is advisable to agree upon a passphrase for this pool, for safety reasons",
        "to delete these messages use the cancel button on the right"
    ]

    useEffect(()=>{
        if(localStorage.getItem("instructions") ){
            setInstruction(JSON.parse(localStorage.getItem("instructions")))
        }else{
            localStorage.setItem("instructions", JSON.stringify(preSetMessages))
            setInstruction(preSetMessages)
        }
    },[])

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
                    setMsgType("failure")
                }
                
            // const chatInputRef = useRef()
         })()
        }

    },[poolId])

    const {user} = useAuth()

    const sendMsg = async()=>{
        setChatValue("")
        try {
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
            

        
            await setDoc(chatMsgRef,msg)

            
        } catch (error) {
            console.log(error)
            setMsgType("failure")
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

    const deleteMsg =(msgIdx)=>{
          
        const filteredMsg = instruction.filter((msg,index)=>index !==msgIdx)
        setInstruction(filteredMsg)
        localStorage.setItem("instructions", JSON.stringify(filteredMsg))

    }

   
   

  return (
    <div id='chat-view' >
      
      {/* <div id="utility-bar">
        <button class='round-btn' onClick={filterByInfo}>i</button>
        <button class='round-btn' onClick={filterByMsgToYou}>@</button>
      </div> */}
      <div id='chat-area' ref={chatAreaRef}>
        {
            instruction.map((msg,index)=>{
                return(
                <div id={index} className='instruction' >
                    <div>
                        <h3>bot</h3>
                        <p>{msg}</p>
                    </div>
                    <div onClick={()=>deleteMsg(index)}>X</div>
                </div>
                )
            })
        }
        {  isFiltered &&
          
            filteredMsg.map((msg,index)=>{
                return(
                <div id={index} className={msg.sender.id === user.id && "my-chat" || "your-chat"}>
                    <div className='swipe-card-profile'></div>
                    <div className='sswipecard-detail-1'>
                    <h3 className='poppins-black-medium'>{msg.sender.name || "unknown"}</h3>
                    <p className='poppins-black-small'>{msg.chat}</p>
                    </div>
                </div>
                )
            })
            ||
            poolMsgs.map((msg,index)=>{
                return(
                <div id={index} className={msg.sender.id === user.id && "my-chat" || "your-chat"}>
                    <div className='swipe-card-profile'></div>
                    <div className='sswipecard-detail-1'>
                    <h3 className='poppins-black-medium'>{msg.sender.name || "unknown"}</h3>
                    <p className='poppins-black-small'>{msg.chat}</p>
                    </div>
                </div>
                )
            })
        }
        
       <ScrollToBotttomBtn chatAreaRef={chatAreaRef}/>
      </div>
      {/* <div className='mention-suggestion' >
        <div>@info</div>
        {
            passengers.map(p=><div>{p.name}</div>)
        }
      </div> */}
      <div id='chat-input-div'>
        <input id='chat-input' placeholder='your message' value={chatValue} onChange={handleChatInput} />
        <button class='round-btn send-btn' onClick={sendMsg}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <g clip-path="url(#clip0_531_2224)">
                    <path d="M7.03337 8.96383L9.53216 1.6341C9.78204 0.926111 9.07404 0.218126 8.36608 0.468003L1.03633 2.96678C0.203406 3.2583 0.203406 4.42437 1.07798 4.67429L3.5351 5.34062C4.07651 5.50721 4.53462 5.92367 4.65954 6.46504L5.32587 8.92216C5.57579 9.79675 6.74187 9.79675 7.03337 8.96383Z" fill="white"/>
                </g>
                <defs>
                    <clipPath id="clip0_531_2224">
                        <rect width="10" height="10" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </button>
      </div>
    </div>
  )
}

export default ChatApp
