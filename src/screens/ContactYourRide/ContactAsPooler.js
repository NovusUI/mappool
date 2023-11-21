
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
 
    const poolCollection = collection(db,"pool")
    const poolDoc = doc(poolCollection,poolId)
    const poolHailersSubcollection = collection(poolDoc, 'poolHailers') 

      useEffect(()=>{
     
       if(poolId){ 

        (async function(){
          console.log(poolId)
          const poolData = await getDoc(poolDoc)
          setPoolStatus(poolData.data().status)
          console.log(poolData.data().status)
          const poolHailerData = await getDocs(poolHailersSubcollection)
        
          const passengers = poolHailerData.docs.filter(data=> data.data().poolHailerStatus === "accepted")
          console.log(passengers)
          if(passengers.length > 0){
            setViewHailers(false)
          }
          
        })()
 
      }
 
    
    },[poolId])



    useEffect(()=>{
        if(poolId){
              
      

          const unsubscribeHaillers = onSnapshot(poolHailersSubcollection, (snapshot) => {
            
              
            
            snapshot.docs.forEach((change) => {
              // Handle changes (added, modified, removed)
              const data = change.data()
              
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
        }
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
    await updateDoc(poolDoc,{status:"cancelled"})
    setPoolStatus("cancelled")
   }

   const reopen = async()=>{
    await updateDoc(poolDoc,{status:"created"})
    setPoolStatus("created")
   }

    return(
        <>
       
      {
       poolStatus === "cancelled" && 
       <div className="container">
          <button onClick={reopen}>REOPEN</button>
          <button>Cancel</button>
       </div>
       ||
      viewHailers && 
        
          <Hailers hailers={hailers} addNewPassenger={addNewPassenger} setViewHailers={setViewHailers} passengers={passengers} rejectPassenger={rejectHailer} />
       ||
       
         <PoolerHS passengers={passengers} setViewHailers={setViewHailers} hailerCount={hailers.length} cancelPool={cancelPool} rejectPassenger={rejectHailer}/>
       
        }
        </>
    )
}

export default ContactAsPooler