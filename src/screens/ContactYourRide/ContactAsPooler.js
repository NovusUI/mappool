
import { useEffect, useState } from "react"
import "../../index.css"
import { useNavigate } from "react-router-dom"
import { db } from "../../firebase/config"
import { collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore"
import { useAuth } from "../../contextAPI/AuthContext"
import Hailers from "../../components/ContactAsPooler/Hailers"
import PoolerHS from "../../components/ContactAsPooler/PoolerHS"


const ContactAsPooler = ({yourPoolId:poolId})=>{
    
  
    const navigate = useNavigate()
    const {user} = useAuth()
    const [hailers, setHailer] = useState([])
    const [passengers, setPassengers] = useState([])
   
    const [rejectedPassengers, setRejectedPassengers] = useState([])
    const [viewHailers, setViewHailers] = useState(true)
    const [poolStatus, setPoolStatus] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)
    const poolCollection = collection(db,"pool")
    const poolDoc = doc(poolCollection,poolId)
    const poolHailersSubcollection = collection(poolDoc, 'poolHailers') 

    const [isWaiting, setIsWaiting] = useState(true)

   
    
    useEffect(()=>{
       console.log(poolId)
      if(poolId){
        
        (async function(){
        
          try {
            const poolData = await getDoc(poolDoc)

            if(!poolData.exists()){
              navigate("/events")
              return
            }
        
            setPoolStatus(poolData.data().status)
            console.log(poolData.data().status)
          
      
            const poolHailerData = await getDocs(poolHailersSubcollection)
        
            const passengers = poolHailerData.docs.filter(data=> data.data().poolHailerStatus === "accepted")
            console.log(passengers)
            if(passengers.length > 0){
              setViewHailers(false)
            }
          } catch (error) {
            console.log(error)
          }
          setIsWaiting(false)
          
        })()
       
 
      }
 
    
    },[poolId])



    useEffect(()=>{
     
          const unsubscribeHaillers = onSnapshot(poolHailersSubcollection, (snapshot) => {
            
            setRejectedPassengers([])
            setHailer([])
            setPassengers([])
            
            snapshot.docs.forEach((change) => {
              // Handle changes (added, modified, removed)
              const data = change.data()
              console.log(data)
              const hailerData = {
                id:change.id,
                ...data
              }
              if(data.poolHailerStatus === "accepted"){
                setPassengers((prev)=>[...prev,hailerData])

              }else if( data.poolHailerStatus === "rejected"){
                setRejectedPassengers((prev)=>[...prev,hailerData])
              }else{
                setHailer((prev)=>[...prev,hailerData])
              }
              
            });
          });
          return () => unsubscribeHaillers();
  
    },[poolId])

   const addNewPassenger = async (hailer) => {
      // change status of hailer to accepted
    
      const remainingHailer = hailers.filter(h=> h.id !== hailer.id)

      setHailer(remainingHailer)
      const hailerRef = doc(poolHailersSubcollection,hailer.id)
      try {
       
        await updateDoc(hailerRef,{poolHailerStatus:"accepted"})
      } catch (error) {
        console.log(error)
      }
    
      
   }

   const rejectHailer = async(hailerId)=>{
 
      //update hailers status to rejected 
      const remainingHailer = hailers.filter(h=> h.id !== hailerId)
      setHailer(remainingHailer)

      const remainingPassenger = passengers.filter(p=> p.id !== hailerId)
      setPassengers(remainingPassenger)
      const hailerRef = doc(poolHailersSubcollection,hailerId)
      try {
       
        await updateDoc(hailerRef,{poolHailerStatus:"rejected"})
      } catch (error) {
        console.log(error)
       
      }
   }

   const cancelPool = async()=>{
    setIsDisabled(true)
    try {
      await updateDoc(poolDoc,{status:"cancelled"})
      setPoolStatus("cancelled")
    } catch (error) {
      setIsDisabled(false)
    }
    setIsDisabled(false)
   }

   const reopen = async()=>{
    setIsDisabled(true)
    try {
      await updateDoc(poolDoc,{status:"created"})
      setPoolStatus("created")
    } catch (error) {
      console.log(error)
      setIsDisabled(false)
    }
    setIsDisabled(false)
   }

    return(
        <>
       
      {
        isWaiting &&
        <div>Waiting...</div>
       ||
       (poolStatus === "cancelled" && 
       <div className="container">
          <button className={isDisabled && "inactive"} onClick={reopen} disabled={isDisabled}>REOPEN</button>
          <button className={isDisabled && "inactive"} disabled={isDisabled} onClick={()=>navigate('/events')}>Cancel</button>
       </div>
       ||
      viewHailers && 
        
          <Hailers hailers={hailers} addNewPassenger={addNewPassenger} setViewHailers={setViewHailers} passengers={passengers} rejectPassenger={rejectHailer} isDisabled={isDisabled} />
       ||
       
         <PoolerHS passengers={passengers} setViewHailers={setViewHailers} hailerCount={hailers.length} cancelPool={cancelPool} rejectPassenger={rejectHailer} isDisabled={isDisabled} poolDocRef={poolDoc} poolId={poolId} />
       )
        }
        </>
    )
}

export default ContactAsPooler