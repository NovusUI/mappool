
import { useLocation, useNavigate } from "react-router-dom"
import "../../index.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../contextAPI/AuthContext"
import SwipeableContactYourRide from "./SwipeableContactYourRide"
import ContactAsPooler from "./ContactAsPooler"
import ContactAsPoolee from "./ContactAsPoolee"
import { collection, doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import AvailableRides from "../AvailableRIdes/AvailableRides"



const ContactYourRide = ()=>{

    const location = useLocation()
    const navigate = useNavigate()
    const[requesting, setRequesting] = useState(false)
    const [poolId,setPoolId] = useState(null)
    const [carpoolId, setCarpoolId] = useState(null)
    const [yourPoolId, setYourPoolId] = useState(null)
     


    const {user, updateRole, setUpdateRole} = useAuth()
 
    useEffect(()=>{
        const state = location?.state
        setRequesting(state?.requesting)

        const getUserEventSnapShot = async() => {
            const usersCollection = collection(db, "users")
            const userDoc = doc(usersCollection,user.id)

            const userEvents = collection(userDoc,"userevents")
            const userEventDoc = doc(userEvents,localStorage.getItem("eventId"))
            const userEventDocSnapshot = await getDoc(userEventDoc)
            const {role,poolId,carpoolId,yourPoolId}= userEventDocSnapshot.data()
            setUpdateRole(role)
            setPoolId(poolId)
            setCarpoolId(carpoolId)
    
            setYourPoolId(yourPoolId)
      
        }
        
        getUserEventSnapShot()

    },[location])

    
    const poolExists =  ((carpoolId && carpoolId !== "pending") || (poolId && poolId !== "pending") )

    return(

        updateRole =="poolee" || (!updateRole && user.role == "poolee") ?
        <>
          {
            poolExists ? <ContactAsPoolee/> :<AvailableRides/>
          
          }
        </>
        :
        yourPoolId && <ContactAsPooler yourPoolId={yourPoolId}/>

    
    )

}

export default ContactYourRide


