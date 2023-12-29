import React from 'react'

const EventLargeCard = ({eventDate,eventName}) => {
    const timestamp = eventDate;
    const date = new Date(timestamp.seconds * 1000);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const shortMonth = date.toLocaleString('en-US', { month: 'short' });
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const year = date.toLocaleString('en-US', { year: 'numeric' });
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
  return (
    <div className='event-large-card'>
            <div className="event-image">
                <img src="/concert.png"></img>
            </div>
            <div className='event-large-content'>
            <div className='event-large-card-date'>
                <h6 className='inter-purple'>{`${day} ${shortMonth} ${year}`}</h6>
                <h6 className='inter-purple'>{time}</h6>
            </div>
            <div className='event-large-card-title'>
               <h2 className='poppins-normal'>{eventName}</h2>
            </div>
            </div>
    </div>
  )
}

export default EventLargeCard
