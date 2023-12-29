import {  collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useAuth } from "../../contextAPI/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useMsg } from "../../contextAPI/MsgContext"
import { useApp } from "../../contextAPI/AppContext"




const SelectedRide = ({selectedRide,setSelectedRide,eventId,setSwitchScreen,poolHailerStatus}) => {

    const {user} =useAuth()
    const [isDisabled, setIsDisabled] = useState(false)
    const {setMsgType} = useMsg()
    const [disableBackBtn, setDisableBackBtn] = useState(false)
    const poolRef = doc(db, 'pool', selectedRide.id);
    // Reference to the subcollection 'poolHailers' under the existing document
    const poolHailersSubcollection = collection(poolRef, 'poolHailers')
    const navigate = useNavigate()
    const {setCarpoolId, setPoolId} = useApp()


   useEffect(()=>{
     //get the previous doc and check if it exists 
     try {
        (async()=>{
            const hailerDocRef = doc(poolHailersSubcollection,user.id)
            const prevHailerDoc = await getDoc(hailerDocRef)
            if(prevHailerDoc.exists()){
                setSwitchScreen(true)
            }
        })()
     } catch (error) {
        console.log(error)
        setMsgType("failure")
     }
     

   },[])

  const secureRide = async()=>{

     // if status is created change request status to open,  chnage userevent poolId or carpoolId depending
     //on the poolType
     //if status is open, chnage userevent poolId or carpoolId depending on the poolType
    
     if(selectedRide.status === "created"){

        setIsDisabled(true)
        setDisableBackBtn(true)
           // update request status to open


        try {

            const usersCollection = collection(db, "users")
            const userDoc = doc(usersCollection,user.id)

            const userEvents = collection(userDoc,"userevents")
            const userEventDoc = doc(userEvents,eventId)
            
            console.log(selectedRide.poolType)

            const rideCollectionRef = collection(db,"pool")
            const rideDocRef = doc(rideCollectionRef, selectedRide.id)
            const selectedRideDoc = await getDoc(rideDocRef)
            const selectedRideData = selectedRideDoc.data()

            if(selectedRideData.status === "cancelled"){
                setSelectedRide(prev=>({...prev,status:"cancelled"}))
                setDisableBackBtn(false)
                return
            }
            if(selectedRideData.status === "closed"){
                setSelectedRide(prev=>({...prev,status:"closed"}))
                setDisableBackBtn(false)
                return
            }


            if(selectedRide.poolType === "pool"){
                await updateDoc(userEventDoc,{poolId:selectedRide.id})
                setPoolId(selectedRide.id)
            }else if(selectedRide.poolType === "carpoolOffer"){
                await updateDoc(userEventDoc,{carpoolId:selectedRide.id})
                setCarpoolId(selectedRide.id)
            }


            const newHailerDocRef = doc(poolHailersSubcollection, user.id);
            
           
            //create data for hailer

            const hailerData = {
                username: user.displayName || "unknown",
                phoneNumber: user.waNum,
                location: user.location,
                poolHailerStatus: "created"
            }

            console.log(hailerData)

            await setDoc(newHailerDocRef, hailerData,{ merge: true })
            

        } catch (error) {
            console.log(error)
            setMsgType("failure")
            setIsDisabled(false)
        }

        
        setSwitchScreen(true)
       setIsDisabled(false)
       
     }

     

  }

  return (
    <div className="container">
    <h3>Contact pool</h3>
 
        <>
        <button 
            className={(selectedRide.status !== "created" || isDisabled) && "inactive" || "group-btn"}   
            disabled={(selectedRide.status !== "created" || isDisabled)}
            onClick={()=>{secureRide()}}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.184299 19.3314C0.102479 19.6284 0.372969 19.9025 0.671019 19.8247L5.27836 18.6213C6.73272 19.409 8.37012 19.8275 10.0372 19.8275H10.0422C15.5282 19.8275 20.0001 15.3815 20.0001 9.9163C20.0001 7.26735 18.9661 4.77594 17.0864 2.90491C15.2066 1.03397 12.7085 0 10.0421 0C4.55619 0 0.0842292 4.44605 0.0842292 9.9114C0.0835992 11.65 0.542519 13.3582 1.41491 14.8645L0.184299 19.3314ZM2.86104 15.2629C2.96786 14.8752 2.91449 14.4608 2.71293 14.1127C1.97278 12.8348 1.5837 11.3855 1.58423 9.9114C1.58423 5.28158 5.3775 1.5 10.0421 1.5C12.312 1.5 14.4297 2.37698 16.0282 3.96805C17.6249 5.55737 18.5001 7.66611 18.5001 9.9163C18.5001 14.5459 14.7069 18.3275 10.0422 18.3275H10.0372C8.62072 18.3275 7.22875 17.9718 5.99278 17.3023C5.65826 17.1211 5.26738 17.0738 4.89928 17.17L2.13688 17.8915L2.86104 15.2629Z" fill="white"/>
        </svg>
            { selectedRide.status === "created" &&"Secure your seat"}
            { selectedRide.status === "cancelled" &&"Ride cancelled"}
            { selectedRide.status === "closed" &&"Ride closed"}
        </button>
        <button 
            className={(disableBackBtn) && "inactive"}   
            disabled={(disableBackBtn) && "true"}
            onClick={()=>setSelectedRide(null)}
         >
            Cancel
        </button>
        </>
    </div>
  )
}

export default SelectedRide
