import "../index.css"
import { db } from "../firebase/config"
import { useAuth } from "../contextAPI/AuthContext"
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const Role = ()=>{
   
    const { user, updateRole, setUpdateRole} = useAuth()
    const navigate = useNavigate()
    // update user with the role 

    

    useEffect(()=>{
        setUpdateRole(
            user.role
        )
    },[])

    console.log(updateRole)

    const setRole = (role) =>{

        setUpdateRole(role)
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

    return<>
        <div className="container">
            <h3>Choose Role</h3>
            <button onClick={()=>setRole("pooler")}>Pooler</button>
            <button onClick={()=>setRole("poolee")}>Poolee</button>
        </div>
        <div  className="container" style={{backgroundColor:"#2F2F2F"}}>
            <button onClick={()=>next()}>Next</button>
        </div>
    </>
}

export default Role


// todo:
// UI
// 1. based on the role highlight role button