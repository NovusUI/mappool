import React from 'react'

const SwipeCard = ({cardInfo, reject, accept}) => {

    const {id, poolerLoc,location} = cardInfo
  return (
    
    <div className='ride-offers' id={id}>
    <button className='danger-btn' onClick={()=>reject(id)} >x</button>
      {poolerLoc || location}
    <button onClick={()=> accept(cardInfo)}>✔</button>
    </div>
  )
}

export default SwipeCard
