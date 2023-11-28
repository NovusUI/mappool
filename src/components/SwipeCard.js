import React from 'react'

const SwipeCard = ({cardInfo, reject, accept, undecided,type}) => {

    const {id, poolerLoc,location,eventLocation, adminName,time,convPULoc,username,shortMsg} = cardInfo

    console.log(cardInfo)
  return (
    
    <div className='swipe-card' id={id}>
      <div className='profile-image'></div>
      <div style={{paddingBottom:"15px"}}>
        <h4>{adminName || username}</h4>
        {type == "hailers" && <p>location: {location}</p> ||<p>pooling from {poolerLoc||location} to {eventLocation} </p>}
      </div>
     { 
     type == "hailers" && <p style={{fontSize:"small", lineHeight:"20px"}}>{shortMsg}</p> ||
     <div style={{display:'flex'}}>
        <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M12 2a5 5 0 0 1 5 5c0 7-5 13-5 13s-5-6-5-13a5 5 0 0 1 5-5z" />
        </svg>

        </div>
        <div style={{color:"#4185fa",margin:"0 5px"}}>{time}</div>
        <div>Meet-up points: {convPULoc}</div>
        </div>
        }
      <div className='swipe-card-button-container'>
        <button className='danger-btn' onClick={()=>reject(id)}>x</button> 
        <button className='danger-btn'>emoji</button>
        <button onClick={()=> accept(cardInfo)}>✔</button>
      </div>
    </div>
  )
}

export default SwipeCard
