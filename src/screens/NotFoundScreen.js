import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const NotFoundScreen = () => {

    const {state:{eventsLink}} =useLocation()
    
     
   useEffect(()=>{
    console.log(eventsLink)
   },[])
    const navigate = useNavigate()
  return (
    <div className='container'>
      Resource Not Found
      <button onClick={()=>{eventsLink ? navigate(eventsLink):navigate("/events")}}>go to events</button>
    </div>
  )
}

export default NotFoundScreen
