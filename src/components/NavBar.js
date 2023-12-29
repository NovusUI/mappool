import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contextAPI/AuthContext'
import { useNav } from '../contextAPI/NavContaxt';



const NavBar = () => {

    const [showNavMenu,  setShowNavMenu] = useState(false)
    const {logout} = useAuth()
    const navigate = useNavigate()
    const {showNav, title} = useNav() 

 
    const navmenuAction = async(type)=>{
        
        switch(type){
            case "events":{
                setShowNavMenu(false)
                navigate("/events")
            }
        }
    }

    const onLogout = ()=>{
      logout()
      navigate("/")
    }

    const onClickMenu = ()=>{
      setShowNavMenu(prev=>!prev)
      // if(showNavMenu){
      //    setShowNav(false)
      // }else{
         
      // }
    }
  return (
    <>
       <nav id='top-bar'>
         {showNav && <div className='nav-block' onClick={()=> navigate(-1)}>
        
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="18" viewBox="0 0 11 18" fill="none">
            <path d="M3.41422 8.9999L10.4142 1.9999L9 0.585693L0.585785 8.9999L9 17.4141L10.4142 15.9999L3.41422 8.9999Z" fill="white"/>
          </svg>
          
         </div>}
         <h3 className='page-title'>
          {title}
         </h3>
         <div className='nav-block'>
           <div className='three-dot-menu' onClick={()=>onClickMenu()}>
           {showNavMenu &&
           <img src='X.svg'></img>
          ||
           <img src='/Menu.svg'></img>
          }
          </div>
          
         </div>
          
        </nav>
        { showNavMenu &&
        <div className='menu'>
            {/* <div>Profile</div>
            <div>Notification</div>
            <div>History</div> */}
            <div onClick={()=>navmenuAction("events")}>Events</div>
            <div>Create event</div>
            <div>Profile</div>
            <div>Settings</div>
            <div onClick={()=>onLogout()}>Logout</div>
        </div>
        }   
    </>
  )
}

export default NavBar
