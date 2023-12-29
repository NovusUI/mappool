import React from 'react'

const EventCard = ({event, gotToEvent}) => {
    const timestamp = event.eventDate;
    const date = new Date(timestamp.seconds * 1000);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const shortMonth = date.toLocaleString('en-US', { month: 'short' });
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const year = date.toLocaleString('en-US', { year: 'numeric' });
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    return (
        <div className='event-card' id={event.id} onClick={()=>gotToEvent(event.id)}>
            <div className="event-image">
                <img src="/concert.png"></img>
            </div>
            <div className='event-date'>
             <p className='event-cal-day'>{day}</p>
             <p className='event-cal-month'>{shortMonth}</p>
            </div>
            <div className='event-details'>
                <div className='name-and-date'>
                    <p className='event-card-font-1'>{event.eventName}</p>
                    <p className='event-card-date'>
                        {`${day} ${dayOfWeek}, ${month} ${year}`}
                    </p>
                </div>
                <div className='loc-and-time'>
                    <p className='event-card-loc'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none"  style={{marginRight:"5px"}}>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.886772 4.43869C1.05859 2.35422 2.80049 0.75 4.89205 0.75H5.108C7.19955 0.75 8.94145 2.35422 9.11325 4.43869C9.20575 5.561 8.8591 6.6754 8.14625 7.54715L5.74975 10.4781C5.36225 10.952 4.6378 10.952 4.2503 10.4781L1.85376 7.54715C1.14094 6.6754 0.794262 5.561 0.886772 4.43869ZM5 2.625C3.68833 2.625 2.625 3.68832 2.625 5C2.625 6.3117 3.68833 7.375 5 7.375C6.3117 7.375 7.375 6.3117 7.375 5C7.375 3.68832 6.3117 2.625 5 2.625Z" fill="white"/>
                        </svg>
                        {event.location}
                    </p>
                
                    <p className='event-card-date'>{time}</p>
                </div>
            </div>
        
        </div>
  )
}

export default EventCard
