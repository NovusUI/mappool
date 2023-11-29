
import { useNavigate } from "react-router-dom"
import "../../index.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../contextAPI/AuthContext"
import ContactAsPooler from "./ContactAsPooler"
import ContactAsPoolee from "./ContactAsPoolee"
import { collection, doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import AvailableRides from "../AvailableRIdes/AvailableRides"
import { useApp } from "../../contextAPI/AppContext"
import PermissionCard from "../../components/PermissionCard"
import { useMsg } from "../../contextAPI/MsgContext"



const ContactYourRide = ()=>{


    const navigate = useNavigate()
    const [poolId,setPoolId] = useState(null)
    const [carpoolId, setCarpoolId] = useState(null)
    const [yourPoolId, setYourPoolId] = useState(null)
    const [poolExists, setPoolExist] = useState((carpoolId && carpoolId !== "pending") || (poolId && poolId !== "pending"))
    const [approved,setApproved] = useState(false)
    const {isWaiting, setIsWaiting} = useApp()
    const {setMsgType} = useMsg()
    
    

    const {user, updateRole, setUpdateRole} = useAuth()
    const eventId = localStorage.getItem("eventId")
    // check if any of the context is on defined
    console.log(user.id)

    useState(()=>{
        setMsgType("normal")
        if(!eventId){
            navigate("/notfound")
        }
       
        (async()=>{
            const eventCollectionRef = collection(db,"events")
            const eventDocRef = doc(eventCollectionRef,eventId)
            const eventDoc = await getDoc(eventDocRef)
            if(!eventDoc.exists)
                navigate('/notfound')
                return
        })()

        

    },[])
    
    useEffect(()=>{
        if(carpoolId || poolId ||yourPoolId){
            setIsWaiting(false)
        }

    },[carpoolId,poolId,yourPoolId])
    useEffect(()=>{

        setIsWaiting(true)
        console.log("renderd")

        const getUserEventSnapShot = async() => {
            const usersCollection = collection(db, "users")
            
            const userDoc = doc(usersCollection,user.id)
              
            const userEvents = collection(userDoc,"userevents")
            // check if event id is present in local storage
            const userEventDoc = doc(userEvents,eventId)
            try {
                const userEventDocSnapshot = await getDoc(userEventDoc)
                const userDocSnapshot = await getDoc(userDoc)
                if(!userEventDocSnapshot.exists()){
                    navigate("/events")
                    return
                }
                const {role,poolId,carpoolId,yourPoolId}= userEventDocSnapshot.data()
                const {approved} = userDocSnapshot.data()
                setUpdateRole(role)
                setPoolId(poolId)
                setCarpoolId(carpoolId)
                console.log(approved)
                setApproved(approved)
    
                setYourPoolId(yourPoolId)
                // setIsWaiting(false)
                setPoolExist(((carpoolId && carpoolId !== "pending") || (poolId && poolId !== "pending") ))
                
            } catch (error) {
                 console.log(error)
            }
            
        }
        
        getUserEventSnapShot()

    },[])

    
    

    return(

        updateRole =="poolee" || (!updateRole && user.role == "poolee") ?
        
          
            (isWaiting  && <div>waiting...</div>)
            ||
            (approved && ((poolExists) ? <ContactAsPoolee setSwitchScreen={setPoolExist}/> :<AvailableRides  setSwitchScreen={setPoolExist}/>) || <PermissionCard/>)
 
        :
         (isWaiting && <div>waiting...</div>)
            ||
        (yourPoolId && approved && <ContactAsPooler yourPoolId={yourPoolId}/> || <PermissionCard/>)

    
    )

}

export default ContactYourRide


