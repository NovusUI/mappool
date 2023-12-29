import React, { useEffect, useRef, useState } from 'react'
import PassengerQuickAction from './PassengerQuickAction'
import ChatApp from '../ChatApp'
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useMsg } from '../../contextAPI/MsgContext'
import { useApp } from '../../contextAPI/AppContext'
import { useAuth } from '../../contextAPI/AuthContext'
import { useNav } from '../../contextAPI/NavContaxt'


const PoolerHS = ({passengers,setViewHailers,hailerCount,cancelPool,rejectPassenger,isDisabled,poolDocRef,poolId,setIsDisabled,poolData}) => {

  
   const poolMsgsRef = collection(poolDocRef,"poolMessages")
   const [openPassengerQA, setOpenPassengerQA] = useState(false)
   const [poolMsgs, setPoolMsgs] = useState([])
   const [openChat, setOpenChat] = useState(false)
  //  const [eventData, setEventData] = useState(null)
   const [returnTripSurvey,setReturnTripSurvey] = useState(null)
   const eventId = localStorage.getItem("eventId")
   const eventCollectionRef = collection(db,"events")
   const eventDocRef = doc(eventCollectionRef,eventId)
   const [showChangeLoc, setShowChangeLoc] = useState(false)
   const {setMsgType} = useMsg()
   const {eventData} = useApp()
   const changeLocationRef = useRef(null)
   const {user} = useAuth()
   const {setTitle} = useNav()
  //  useEffect(()=>{

  //   try {
     
  //   const unsubscribeEventSnapShop = onSnapshot(eventDocRef,(snapshot)=>{
  //       if(snapshot.exists()){
  //         const eventData = {
  //           eventId,
  //           ...snapshot.data()
  //         }
  //         setEventData(eventData)
  //         if((eventData.ends.seconds - (Math.floor(Date.now() / 1000))) <= 1800 && !poolData.returnTripSurvey ){
  //           setReturnTripSurvey(true)
  //           setIsDisabled(true)
  //         }else{
  //           setReturnTripSurvey(false)
  //           setIsDisabled(false)
  //         }
  //       }else{
  //          setMsgType("failure")
  //       }
  //   },(error)=>{
  //      console.log(error)
  //      setMsgType("failure")
  //   })

  //   return()=> unsubscribeEventSnapShop()
  //   } catch (error) {
  //     console.log(error)
  //     setMsgType("failure")
  //   }
    
  //  },[])
  useEffect(()=>{
    setTitle("Contact Poolees")
  
    if((eventData.ends.seconds - (Math.floor(Date.now() / 1000))) <= 1800 && !poolData.returnTripSurvey ){
      setReturnTripSurvey(true)
      setIsDisabled(true)
    }else{
      setReturnTripSurvey(false)
      setIsDisabled(false)
    }
  


},[])
   
   useEffect(()=>{

    try {
      
     

      const poolMsgsUnsubscribe = onSnapshot(poolMsgsRef,(snapshot)=>{
       
      setPoolMsgs([])
      const sortedMgs =snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      })).sort((a,b)=>(a.time - b.time))

      setPoolMsgs(sortedMgs)
      
    },(error)=>{
      console.log(error)
      setMsgType("failure")
    })
     
    return()=> poolMsgsUnsubscribe()
      
    } catch (error) {
      console.log(error)
      setMsgType("failure")
    }
    
    
     
   },[])

   const updateReturnTrip = async(status)=> {
     

    try {
      
      if(status === "same"){
        await updateDoc(poolDocRef,{
          returnTripSurvey:{
          status:true,
          formerLoc: poolData.poolerLoc,
          locationChanged: false,
          time: new Date().getTime()
        }
      })
       setIsDisabled(false)
       setReturnTripSurvey(false)
      }else if(status==="change"){
        if(showChangeLoc){
           
          await updateDoc(poolDocRef,{
            poolerLoc:changeLocationRef.current.value,
            returnTripSurvey:{
            status:true,
            formerLoc: poolData.poolerLoc,
            locationChanged: true,
            time: new Date().getTime()
          }
          })

       
          setShowChangeLoc(false)
          setIsDisabled(false)
          setReturnTripSurvey(false)
        }else{
          setShowChangeLoc(true)
        }
        
      }
    } catch (error) {
      console.log(error)
      setMsgType("failure")
    }
       
   }

  return (
  
    openPassengerQA &&

     <PassengerQuickAction passengers={passengers} rejectPassenger={rejectPassenger} setOpenPassengerQA={setOpenPassengerQA}/>
    
    ||
    
      <>
      {
        openChat 
          &&  
          <div className='nav-block alt-nav-pooler' onClick={()=>setOpenChat(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8.00006 6.93945L1.6361 0.575439L0.575439 1.6361L6.93936 8.00005L0.575439 14.364L1.6361 15.4247L8.00006 9.06075L14.3641 15.4247L15.4247 14.364L9.06076 8.00005L15.4247 1.6361L14.3641 0.575439L8.00006 6.93945Z" fill="white"/>
            </svg>
          </div>

       }
       
      { 
   
        <div className='island'> 
         <div className='quick-action island-top'>
            <button className={hailerCount === 0 && "inactive" || "purple-outline-btn"} onClick={()=>setViewHailers(true)} disabled={hailerCount === 0 || isDisabled}>View {hailerCount} Hailers</button>
            <button className={isDisabled && "inactive" || "lilac-btn"} onClick={()=>setOpenPassengerQA(true)} disabled={isDisabled}>passengers</button>
        </div>
        <div className="message-div">
            <h4 className="page-title" style={{fontSize:"15px"}}>{`Hi ${user.displayName},`}</h4>
            <p className="popping-300-normal">Send a message to your poolees</p>
            <button style={{width:"100%"}} className="purple-btn" onClick={()=>setOpenChat(true)}>open chat</button>
         </div>

          <button className={isDisabled && "inactive" || 'danger-btn'} onClick={cancelPool} disabled={isDisabled}>Cancel Pool</button>
        </div> 
      }
      {
        openChat && 
        <ChatApp poolMsgsRef={poolMsgsRef} poolMsgs={poolMsgs} setOpenChat={setOpenChat} poolId={poolId}/>
      }
      {
        returnTripSurvey &&
       ( !showChangeLoc &&
        <div className='survey'>
          <h3>open ride for return journey?</h3>
          <div onClick={()=>updateReturnTrip("same")}>Yes, same destination ({poolData.poolerLoc})</div>
          <div onClick={()=>updateReturnTrip("change")}>Yes, but change location</div>
          <div onClick={()=>cancelPool()}>Cancel ride</div>
        </div>
        ||
        <div className='survey'>
          <h3>New location?</h3>
          <input defaultValue={poolData.poolerLoc} ref={changeLocationRef}/>
          <button onClick={()=>updateReturnTrip("change")}>change location</button>
          <button onClick={()=>setShowChangeLoc(false)}>cancel</button>
        </div>
       )
      }
      </>
    
     
   
  )
}

export default PoolerHS
