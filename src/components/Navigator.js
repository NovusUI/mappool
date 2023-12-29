import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Navigator = ({route}) => {

   const navigate = useNavigate()
 useEffect(()=>{
    navigate(route)
 },[])
  return (
    <div>
      
    </div>
  )
}

export default Navigator
