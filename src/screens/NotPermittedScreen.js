import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotPermittedScreen = () => {

    const navigate = useNavigate()
  return (
    <div className='container'>
      <h2>Not Authorized</h2>
    
    <button onClick={()=>navigate("/")}>Home</button>
    <p>you are not authorized to view this page</p>
    </div>
  )
}

export default NotPermittedScreen
