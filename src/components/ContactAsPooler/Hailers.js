import React from 'react'
import SwipeCard from '../SwipeCard'

const Hailers = ({hailers,addNewPassenger,rejectPassenger, setViewHailers, isDisabled}) => {

  return (
    <>
      <h2>Swipe</h2>
      <div style={{color:"white", position:"relative", height:"40vh", width:"80vw", marginBottom:"50px"}}>
    {
      hailers.map(hailer=><SwipeCard cardInfo={hailer} accept={addNewPassenger} reject={rejectPassenger} type="hailers"/>)
    }
    </div>
  <button className={isDisabled && "inactive"} onClick={()=>setViewHailers(false)} disabled={isDisabled}>go to chat</button>
  </>
  )
}

export default Hailers
