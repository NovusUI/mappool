
import { useLocation, useNavigate } from "react-router-dom"
import "../index.css"
import { useEffect, useState } from "react"
import { useAuth } from "../contextAPI/AuthContext"
import SwitchBox from "../components/SwitchBox"

const ContactYourRide = ()=>{

    const location = useLocation()
    const navigate = useNavigate()
    const[requesting, setRequesting] = useState(false)
    const [poolFound, setPoolFound] = useState(false)
    const [poolType, setPoolType] = useState("pool")
    

    const {user, updateRole} = useAuth()
 
    useEffect(()=>{
        const state = location?.state
        setRequesting(state?.requesting)
    },[location])

    return(
     
    requesting ?(
   
     <>
        <div className="container">
        <h3>Request has been saved</h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="49" stroke="#1FD431" stroke-width="2"/>
        </svg>
        
    </div>
    <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button onClick={()=>{setRequesting(false)}}>Next</button>
        <button  className="danger-btn">Go back</button>
    </div>
     </>  
    
    )
     : ( 
    updateRole =="poolee" || (!updateRole && user.role == "poolee") ? (
      poolType == "pool" ? 
        <>
        <div className="container">
            <h3>Contact your ride</h3>
            <button className={poolFound? "group-btn":"inactive"}  disabled={!poolFound}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.184299 19.3314C0.102479 19.6284 0.372969 19.9025 0.671019 19.8247L5.27836 18.6213C6.73272 19.409 8.37012 19.8275 10.0372 19.8275H10.0422C15.5282 19.8275 20.0001 15.3815 20.0001 9.9163C20.0001 7.26735 18.9661 4.77594 17.0864 2.90491C15.2066 1.03397 12.7085 0 10.0421 0C4.55619 0 0.0842292 4.44605 0.0842292 9.9114C0.0835992 11.65 0.542519 13.3582 1.41491 14.8645L0.184299 19.3314ZM2.86104 15.2629C2.96786 14.8752 2.91449 14.4608 2.71293 14.1127C1.97278 12.8348 1.5837 11.3855 1.58423 9.9114C1.58423 5.28158 5.3775 1.5 10.0421 1.5C12.312 1.5 14.4297 2.37698 16.0282 3.96805C17.6249 5.55737 18.5001 7.66611 18.5001 9.9163C18.5001 14.5459 14.7069 18.3275 10.0422 18.3275H10.0372C8.62072 18.3275 7.22875 17.9718 5.99278 17.3023C5.65826 17.1211 5.26738 17.0738 4.89928 17.17L2.13688 17.8915L2.86104 15.2629Z" fill="white"/>
                </svg>
                Join group
            </button>
            <button  className={poolFound? "danger-btn":"inactive"}  disabled={!poolFound}>Reject ride</button>
            {poolFound ? <p>Exciting news!!! We got you a ride.
                Join the group to connect with others.
            </p> : <p>coming soon!</p>}
        </div>
        <SwitchBox type={poolType} setPoolType={setPoolType}/>
        <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button  onClick={()=> navigate("/role")}>Switch Role</button>
        </div> 
    
        </>
        :
        <>
        <div className="container">
            <h3>Contact your pool</h3>
            <button className={poolFound? "group-btn":"inactive"}  disabled={!poolFound}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.184299 19.3314C0.102479 19.6284 0.372969 19.9025 0.671019 19.8247L5.27836 18.6213C6.73272 19.409 8.37012 19.8275 10.0372 19.8275H10.0422C15.5282 19.8275 20.0001 15.3815 20.0001 9.9163C20.0001 7.26735 18.9661 4.77594 17.0864 2.90491C15.2066 1.03397 12.7085 0 10.0421 0C4.55619 0 0.0842292 4.44605 0.0842292 9.9114C0.0835992 11.65 0.542519 13.3582 1.41491 14.8645L0.184299 19.3314ZM2.86104 15.2629C2.96786 14.8752 2.91449 14.4608 2.71293 14.1127C1.97278 12.8348 1.5837 11.3855 1.58423 9.9114C1.58423 5.28158 5.3775 1.5 10.0421 1.5C12.312 1.5 14.4297 2.37698 16.0282 3.96805C17.6249 5.55737 18.5001 7.66611 18.5001 9.9163C18.5001 14.5459 14.7069 18.3275 10.0422 18.3275H10.0372C8.62072 18.3275 7.22875 17.9718 5.99278 17.3023C5.65826 17.1211 5.26738 17.0738 4.89928 17.17L2.13688 17.8915L2.86104 15.2629Z" fill="white"/>
                </svg>
                Create group
            </button>
            <button  className={poolFound? "danger-btn":"inactive"}  disabled={!poolFound}>Not a match</button>
            {poolFound ? <p>We found pool options for you
                .Connect with others to arrange a ride.
            </p> : <p>you'll receive a notification once we find a match for you</p>}
        </div>
        <SwitchBox type={poolType} setPoolType={setPoolType}/>
        <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button  onClick={()=> navigate("/role")}>Switch Role</button>
        </div> 
    
        </>

    )
    :(
        <>
        <div className="container">
            <h3>Contact your ride</h3>
            <button className="social-login-btn" style={{backgroundColor:"#78A9FA"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.184299 19.3314C0.102479 19.6284 0.372969 19.9025 0.671019 19.8247L5.27836 18.6213C6.73272 19.409 8.37012 19.8275 10.0372 19.8275H10.0422C15.5282 19.8275 20.0001 15.3815 20.0001 9.9163C20.0001 7.26735 18.9661 4.77594 17.0864 2.90491C15.2066 1.03397 12.7085 0 10.0421 0C4.55619 0 0.0842292 4.44605 0.0842292 9.9114C0.0835992 11.65 0.542519 13.3582 1.41491 14.8645L0.184299 19.3314ZM2.86104 15.2629C2.96786 14.8752 2.91449 14.4608 2.71293 14.1127C1.97278 12.8348 1.5837 11.3855 1.58423 9.9114C1.58423 5.28158 5.3775 1.5 10.0421 1.5C12.312 1.5 14.4297 2.37698 16.0282 3.96805C17.6249 5.55737 18.5001 7.66611 18.5001 9.9163C18.5001 14.5459 14.7069 18.3275 10.0422 18.3275H10.0372C8.62072 18.3275 7.22875 17.9718 5.99278 17.3023C5.65826 17.1211 5.26738 17.0738 4.89928 17.17L2.13688 17.8915L2.86104 15.2629Z" fill="white"/>
                </svg>
                create group
            </button>
            {/* <button className="danger-btn" >Deactivate ride</button> */}
        </div> 
        <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button onClick={()=> navigate("/role")}>Switch Role</button>
        </div> 
        </>
      )
     )
    )

}

export default ContactYourRide