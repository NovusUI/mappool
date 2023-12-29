import "../index.css"
import { useAuth } from "../contextAPI/AuthContext"
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useNav } from "../contextAPI/NavContaxt";

const Role = ()=>{
   
    const { updateRole, setUpdateRole} = useAuth()
    const {setTitle} = useNav()
    const navigate = useNavigate()
    // update user with the role 

    

    useEffect(()=>{
         setTitle("Choose Role")
        const role = localStorage.getItem("updateRole")
        setUpdateRole(
           role
        )
        
    },[])

    const getButtonClass = (role) => `purple-btn ${updateRole === role ? "purple-btn-selected" : ""} btn-text`;

    const setRole = (role) =>{

        setUpdateRole(role)
        localStorage.setItem("updateRole",role)
       
    }
   
    // go to the next page [userscreen]
    const next = (role)=>{
         
        setRole(role)
        if(updateRole){
            //navigate to userscreen

            navigate("/userinfo")
            
        }else{
            console.log("choose a Role")
        }
    }

    const goToEvents = ()=>{

        updateRole ? navigate("/events") : navigate("/")
    }

    

    return<>
        
        <div className="island">
        <h3 className="page-sub-title island-title">{localStorage.getItem("eventName")}</h3>
        <button onClick={() => next("pooler")} className={getButtonClass("pooler")}>Pooler</button>
        <button onClick={() => next("poolee")} className={getButtonClass("poolee")}>Poolee</button>
        <div className="role-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 10.75C12.4142 10.75 12.75 11.0858 12.75 11.5V16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5V11.5C11.25 11.0858 11.5858 10.75 12 10.75Z" fill="white"/>
                <path d="M12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 12C3.25 7.16751 7.16751 3.25 12 3.25C16.8325 3.25 20.75 7.16751 20.75 12C20.75 16.8325 16.8325 20.75 12 20.75C7.16751 20.75 3.25 16.8325 3.25 12ZM12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75Z" fill="white"/>
            </svg>
            <p className="info">
                Select if you would like to pool or  
                looking for a pooler on this event <span className="learn-more">Learn more.</span> 
            </p>
        </div>
        </div>
       
    </>
}

export default Role


// todo:
// UI
// 1. based on the role highlight role button