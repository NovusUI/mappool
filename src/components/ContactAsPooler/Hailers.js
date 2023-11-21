import React from 'react'
import SwipeCard from '../SwipeCard'

const Hailers = ({hailers,addNewPassenger,rejectPassenger, setViewHailers, passengers, isDisabled}) => {

  return (
    <div>
    {
      hailers.map(hailer=><SwipeCard cardInfo={hailer} accept={addNewPassenger} reject={rejectPassenger}/>)
    }

  <button className={isDisabled && "inactive"} onClick={()=>setViewHailers(false)} disabled={isDisabled}>go to chat</button>
  </div>
  )
}

export default Hailers
