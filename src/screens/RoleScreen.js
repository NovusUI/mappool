import "../index.css"
import { useAuth } from "../contextAPI/AuthContext"
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const Role = ()=>{
   
    const { updateRole, setUpdateRole} = useAuth()
    const navigate = useNavigate()
    // update user with the role 

    

    useEffect(()=>{

        const role = localStorage.getItem("updateRole")
        setUpdateRole(
           role
        )
        
    },[])

    console.log(updateRole)

    const setRole = (role) =>{

        setUpdateRole(role)
        localStorage.setItem("updateRole",role)
       
    }
   
    // go to the next page [userscreen]
    const next = ()=>{

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
        <h3>{localStorage.getItem("eventName")}</h3>
        <div className="container">
            <h3>Choose Role</h3>
            <button onClick={()=>setRole("pooler")} className={updateRole === "pooler" ?  "onselect": "group-btn"}>Pooler</button>
            <button onClick={()=>setRole("poolee")} className={updateRole === "poolee" ?  "onselect": "group-btn"} >Poolee</button>
        </div>
        <div  className="container" style={{backgroundColor:"#2F2F2F"}}>
            <button onClick={()=>next()}>Next</button>
            <button onClick={()=>goToEvents()}>Change Event</button>
        </div>
    </>
}

export default Role


// todo:
// UI
// 1. based on the role highlight role button