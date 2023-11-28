import React from 'react'
import SwipeCard from '../SwipeCard'

const Hailers = ({hailers,addNewPassenger,rejectPassenger, setViewHailers, passengers, isDisabled}) => {

  return (
    <>
      <div style={{color:"green", position:"relative", height:"40vh", width:"80vw"}}>
    {
      hailers.map(hailer=><SwipeCard cardInfo={hailer} accept={addNewPassenger} reject={rejectPassenger} type="hailers"/>)
    }
    </div>
  <button className={isDisabled && "inactive"} onClick={()=>setViewHailers(false)} disabled={isDisabled}>go to chat</button>
  </>
  )
}

export default Hailers
