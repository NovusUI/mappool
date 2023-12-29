import React from 'react'
import TinderCard from 'react-tinder-card'

const SwipeCard = ({cardInfo, reject, accept,type}) => {

    const {id, poolerLoc,location,eventLocation, adminName,time,convPULoc,username, displayName,shortMsg} = cardInfo

     console.log()
    const onSwipe = (direction) => {
      console.log('You swiped: ' + direction)
        reject(id)
     
    }
    
    const onCardLeftScreen = (myIdentifier) => {
      console.log(myIdentifier + ' left the screen')
    }
   
  return (
    <TinderCard  onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')}  >
    <div className='swipe-card' id={id} onClick={()=>accept(cardInfo)}>
      <div className='swipe-card-profile'></div>
      <div  className="swipecard-detail-1" >
        <h4>{adminName || username }</h4>
        
        {type == "hailers" && <p>location: {location}</p> ||<p> {poolerLoc||location} to {eventLocation} eventlocation </p>}
      </div>
     
       <div className="swipecard-detail-2" style={{display:'flex'}}>
        <h4>2000-3700</h4>
         <p> EST 30min</p>
      </div>
        
   
    </div>
    </TinderCard>
  )
}

export default SwipeCard
