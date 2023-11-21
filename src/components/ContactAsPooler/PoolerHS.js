import React, { useState } from 'react'

const PoolerHS = ({passengers,setViewHailers,hailerCount,cancelPool,rejectPassenger}) => {


    const [openPassengerQA, setOpenPassengerQA] = useState(false)
  return (
    openPassengerQA &&
    <div>
       {
        passengers.map(passenger=><div>
            <p>{passenger.username}</p>
            <button onClick={()=>rejectPassenger(passenger.id)}>remove</button>
        </div>)
       }
    </div>
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

     
     <button>Join chat</button>
     <button className='danger-btn' onClick={cancelPool}>Cancel Pool</button>
    </div>
    </div>
  )
}

export default PoolerHS
