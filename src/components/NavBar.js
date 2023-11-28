import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'



const NavBar = () => {

    const [showNavMenu,  setShowNavMenu] = useState(false)

    const navigate = useNavigate()

    const navmenuAction = async(type)=>{
        
        switch(type){
            case "events":{
                setShowNavMenu(false)
                navigate("/events")
            }
        }
    }
  return (
    <>
       <nav id='top-bar'>
          <div className='three-dot-menu' onClick={()=>setShowNavMenu((prev)=>!prev)}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </nav>
        { showNavMenu &&
        <div className='menu'>
            <div>Profile</div>
            <div>Notification</div>
            <div>History</div>
            <div onClick={()=>navmenuAction("events")}>Events</div>
            <div>Logout</div>
        </div>
        }   
    </>
  )
}

export default NavBar
