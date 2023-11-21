import React, { useState } from 'react'
import PassengerQuickAction from './PassengerQuickAction'

const PoolerHS = ({passengers,setViewHailers,hailerCount,cancelPool,rejectPassenger,isDisabled}) => {


    const [openPassengerQA, setOpenPassengerQA] = useState(false)
  return (
    openPassengerQA &&
    <PassengerQuickAction passengers={passengers} rejectPassenger={rejectPassenger} setOpenPassengerQA={setOpenPassengerQA}/>
       
   
    ||
    <div>
        <div className='quick-action'>
            <button className={hailerCount === 0 && "inactive"} onClick={()=>setViewHailers(true)} disabled={hailerCount === 0}>View {hailerCount} Hailers</button>
            <button onClick={()=>setOpenPassengerQA(true)}>passengers</button>
        </div>
    <div className='container'>
        {
          passengers.map(p=><p>{p.status}</p>)
        } 

     
     <button className={isDisabled && "inactive"} disabled={isDisabled}>Join chat</button>
     <button className={isDisabled && "inactive" || 'danger-btn'} onClick={cancelPool} disabled={isDisabled}>Cancel Pool</button>
    </div>
    </div>
  )
}

export default PoolerHS
