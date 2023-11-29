import React, { useEffect, useRef, useState } from 'react'
import PassengerQuickAction from './PassengerQuickAction'
import ChatApp from '../ChatApp'
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useMsg } from '../../contextAPI/MsgContext'


const PoolerHS = ({passengers,setViewHailers,hailerCount,cancelPool,rejectPassenger,isDisabled,poolDocRef,poolId,setIsDisabled,poolData}) => {

  
   const poolMsgsRef = collection(poolDocRef,"poolMessages")
   const [openPassengerQA, setOpenPassengerQA] = useState(false)
   const [poolMsgs, setPoolMsgs] = useState([])
   const [openChat, setOpenChat] = useState(false)
   const [eventData, setEventData] = useState(null)
   const [returnTripSurvey,setReturnTripSurvey] = useState(null)
   const eventId = localStorage.getItem("eventId")
   const eventCollectionRef = collection(db,"events")
   const eventDocRef = doc(eventCollectionRef,eventId)
   const [showChangeLoc, setShowChangeLoc] = useState(false)
   const {setMsgType} = useMsg()
 
   const changeLocationRef = useRef(null)

   useEffect(()=>{

    try {
     
    const unsubscribeEventSnapShop = onSnapshot(eventDocRef,(snapshot)=>{
        if(snapshot.exists()){
          const eventData = {
            eventId,
            ...snapshot.data()
          }
          setEventData(eventData)
          if((eventData.ends.seconds - (Math.floor(Date.now() / 1000))) <= 1800 && !poolData.returnTripSurvey ){
            setReturnTripSurvey(true)
            setIsDisabled(true)
          }else{
            setReturnTripSurvey(false)
            setIsDisabled(false)
          }
        }else{
           setMsgType("failure")
        }
    },(error)=>{
       console.log(error)
       setMsgType("failure")
    })

    return()=> unsubscribeEventSnapShop()
    } catch (error) {
      console.log(error)
      setMsgType("failure")
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
        <div className='quick-action'>
            <button className={hailerCount === 0 && "inactive"} onClick={()=>setViewHailers(true)} disabled={hailerCount === 0 || isDisabled}>View {hailerCount} Hailers</button>
            <button className={isDisabled && "inactive"} onClick={()=>setOpenPassengerQA(true)} disabled={isDisabled}>passengers</button>
        </div>
      { 
        !openChat && 
        <div className='container'> 
          <button className={isDisabled && "inactive"} disabled={isDisabled} onClick={()=>setOpenChat(true)}>Join chat</button>
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
