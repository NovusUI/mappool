
import { useLocation, useNavigate } from "react-router-dom"
import "../../index.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../contextAPI/AuthContext"
import ContactAsPooler from "./ContactAsPooler"
import ContactAsPoolee from "./ContactAsPoolee"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase/config"
import AvailableRides from "../AvailableRIdes/AvailableRides"
import { useApp } from "../../contextAPI/AppContext"
import PermissionCard from "../../components/PermissionCard"
import { useMsg } from "../../contextAPI/MsgContext"



const ContactYourRide = ()=>{


    const navigate = useNavigate()
    // const [poolId,setPoolId] = useState(null)
    // const [carpoolId, setCarpoolId] = useState(null)
    // const [yourPoolId, setYourPoolId,carpoolId, setCarpoolId] = useState(null)
    const {yourPoolId, setYourPoolId,poolId,setPoolId,carpoolId, setCarpoolId} = useApp()
    const [poolExists, setPoolExist] = useState((carpoolId && carpoolId !== "pending") || (poolId && poolId !== "pending"))
    const [approved,setApproved] = useState(false)
    const {setEventData} = useApp()
    const [isWaiting, setIsWaiting] = useState(true)
    const {setMsgType} = useMsg()
    
    
    const {user, updateRole, setUpdateRole} = useAuth()
    const eventId = localStorage.getItem("eventId")
    const eventCollectionRef = collection(db,"events")
    const { userEventDocRef,setUserEventDocRef} = useApp()
    const eventDocRef = doc(eventCollectionRef,eventId)
    // check if any of the context is on defined
    
    useState(()=>{
        

    },[])

    useState(()=>{
        setMsgType("normal")
        if(!eventId){
            navigate("/notfound")
        }
       
        (async()=>{
        
            const eventDoc = await getDoc(eventDocRef)
           
            if(!eventDoc.exists)
                navigate('/notfound')
                return
        })()

        

    },[])

    useEffect(()=>{
     
      
        try {
         
        const unsubscribeEventSnapShop = onSnapshot(eventDocRef,(snapshot)=>{
            if(snapshot.exists()){
              const eventData = {
                eventId,
                ...snapshot.data()
              }
              setEventData(eventData)
              
            }else{
               setMsgType("failure")
            }
        },(error)=>{
           console.log(error)
           setMsgType("failure")
        })
    
        return()=> unsubscribeEventSnapShop()
        } catch (error) {
          console.log(error)
          setMsgType("failure")
        }
    
        
    },[])

   
 
    useEffect(()=>{


         setIsWaiting(true)


        const getUserEventSnapShot = async() => {
            
            try {
                
                
                const usersCollection = collection(db, "users")
                const userDoc = doc(usersCollection,user.id)
                const userEvents = collection(userDoc,"userevents")
                const userEventDoc = doc(userEvents,eventId)
                 setUserEventDocRef(userEventDoc)
                const userEventDocSnapshot =  await getDoc(userEventDoc)
          
                // const userDocSnapshot = await getDoc(userDoc)
                if(!userEventDocSnapshot.exists()){
                    navigate("/notfound")
                    return
                }
                const {role,poolId,carpoolId,yourPoolId}= userEventDocSnapshot.data()
                // const {approved} = userDocSnapshot.data()
                const {approved} = user
                setUpdateRole(role)
                setPoolId(poolId)
                setCarpoolId(carpoolId)
                console.log(approved)
                setApproved(approved)
    
                setYourPoolId(yourPoolId)
                // setIsWaiting(false)
                setPoolExist(((carpoolId && carpoolId !== "pending") || (poolId && poolId !== "pending") ))
                if((carpoolId  || poolId  || yourPoolId ))
                    setIsWaiting(false)
                
            } catch (error) {
                 console.log(error)
            }
            
        }
        
        getUserEventSnapShot()

    },[])


    useEffect(()=>{
      console.log("working")
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


