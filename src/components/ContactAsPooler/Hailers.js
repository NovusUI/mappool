import React from 'react'
import SwipeCard from '../SwipeCard'

const Hailers = ({hailers,addNewPassenger,rejectPassenger, setViewHailers, passengers}) => {

  return (
    <div>
    {
      hailers.map(hailer=><SwipeCard cardInfo={hailer} accept={addNewPassenger} reject={rejectPassenger}/>)
    }

    {passengers.length >0 &&<button onClick={()=>setViewHailers(false)}>go to chat</button>}
  </div>
  )
}

export default Hailers
