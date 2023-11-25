import React, { useState } from 'react'
import PassengerQuickAction from './PassengerQuickAction'
import ChatApp from '../ChatApp'
import { collection, onSnapshot } from 'firebase/firestore'

const PoolerHS = ({passengers,setViewHailers,hailerCount,cancelPool,rejectPassenger,isDisabled,poolDocRef,poolId}) => {

  
   const poolMsgsRef = collection(poolDocRef,"poolMessages")
   const [openPassengerQA, setOpenPassengerQA] = useState(false)
   const [poolMsgs, setPoolMsgs] = useState([])
   const [openChat, setOpenChat] = useState(false)
   useState(()=>{
     
    const poolMsgsUnsubscribe = onSnapshot(poolMsgsRef,(snapshot)=>{
       
     
      setPoolMsgs([])
      const sortedMgs =snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
     })).sort((a,b)=>(a.time - b.time))

     setPoolMsgs(sortedMgs)
      
    })
     
    return()=> poolMsgsUnsubscribe()
     
   },[])

  return (
    openPassengerQA &&
    <PassengerQuickAction passengers={passengers} rejectPassenger={rejectPassenger} setOpenPassengerQA={setOpenPassengerQA}/>
       
   
    ||
    <div>
        <div className='quick-action'>
            <button className={hailerCount === 0 && "inactive"} onClick={()=>setViewHailers(true)} disabled={hailerCount === 0}>View {hailerCount} Hailers</button>
            <button onClick={()=>setOpenPassengerQA(true)}>passengers</button>
        </div>
    { !openChat && <div className='container'> 
     <button className={isDisabled && "inactive"} disabled={isDisabled} onClick={()=>setOpenChat(true)}>Join chat</button>
     <button className={isDisabled && "inactive" || 'danger-btn'} onClick={cancelPool} disabled={isDisabled}>Cancel Pool</button>
    </div> }
        {openChat && <ChatApp poolMsgsRef={poolMsgsRef} poolMsgs={poolMsgs} setOpenChat={setOpenChat} poolId={poolId}/>}
    </div>

  )
}

export default PoolerHS
