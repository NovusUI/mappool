import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const NotFoundScreen = () => {

    const {state} =useLocation()
    const [eventLink, setEventLink] = useState(null)
     
   useEffect(()=>{
 
    if(state){
        setEventLink(state.eventLink)
    }
   },[])
    const navigate = useNavigate()
  return (
    <div className='container'>
      Resource Not Found
      <button onClick={()=>{eventLink ? navigate(eventLink):navigate("/events")}}>go to events</button>
    </div>
  )
}

export default NotFoundScreen
