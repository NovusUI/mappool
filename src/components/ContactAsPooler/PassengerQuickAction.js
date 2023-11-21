import React from 'react'

const PassengerQuickAction = ({passengers,rejectPassenger,setOpenPassengerQA}) => {
  return (
    <div className='passenger-quick-action'>
        <button className='x-cancel-btn' onClick={()=>setOpenPassengerQA(false)}>X</button>
        {
            passengers.map(passenger=>(
                <div className='passenger'>
                <p>{passenger.username}</p>
                <button onClick={()=>rejectPassenger(passenger.id)}>remove</button>
                </div>
            ))
        }
    
        
    </div>
  )
}

export default PassengerQuickAction
