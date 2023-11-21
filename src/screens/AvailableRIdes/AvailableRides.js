import { useEffect, useState } from 'react'
import {collection, where, onSnapshot, setDoc, doc, query, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contextAPI/AuthContext';
import { useNavigate } from 'react-router-dom';
import SelectedRide from './SelectedRide';
import SwipeCard from '../../components/SwipeCard';

const AvailableRides = ({setSwitchScreen}) => {

  const [eventRideOffers, setEventRideOffers] = useState([])
  const {user,updateRole} = useAuth()
  const [rejectedRides, setRejectedRides] = useState([])
  const [selectedRide, setSelectedRide] = useState(null)
  const eventId  = localStorage.getItem("eventId") ;
  const navigate = useNavigate()


   const userCollectionRef = collection(db,"users")
   const userRef = doc(userCollectionRef,user.id)
   const userEventCollectionRef = collection(userRef,"userevents")
   const userEventRef = doc(userEventCollectionRef,eventId)
   const rejectedRideCollectionRef = collection(userEventRef,"rejectedRides")

  //get available rides for event


  const getRejectedRides = async()=>{
  
    try {
      const rejectedRidesDocs = await getDocs(rejectedRideCollectionRef)

      const rejectedRidesIds = rejectedRidesDocs.docs.map(doc=>doc.id)
     
      setRejectedRides(rejectedRidesIds)
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
   
    
    if(!eventId){
        navigate("/events")
    }
    getRejectedRides()
 
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'pool'),
          where('eventId', '==', eventId),
          where('poolAdmin', '!=', user.id),
          where('poolType', 'in', ['carpoolOffer', 'pool']),
          where('status',"in",["created","open"])
        ),
        (snapshot) => {
    
          const requestsData = snapshot.docs
                                    .filter(doc =>!rejectedRides.includes(doc.id) )
                                    .map(doc=>{
                                        return {
                                        ...doc.data(),
                                        id: doc.id,
                                        
                                    }
                                });
    
    
          setEventRideOffers(requestsData);
        },
        (error) => {
          console.error('Error fetching requests:', error);
        }
      );
   
   

  
    
  return () => unsubscribe();
}, [user.Id,rejectedRides]);


 const rejectRide = async(rideId)=>{
    setRejectedRides((prev)=>[...prev,rideId])

    const remainingOffers = eventRideOffers.filter(doc =>!rejectedRides.includes(doc.id))
    setEventRideOffers(remainingOffers)

    const rejectedRideRef = doc(rejectedRideCollectionRef,rideId)
   
   try {
    await setDoc(rejectedRideRef,{id:rejectedRideRef.id})
   } catch (error) {
     console.log(error)
   }
 }

 const selectRide = (ride)=>{
    setSelectedRide(ride)
    
 }

  return (
      selectedRide ? 
       <SelectedRide selectedRide={selectedRide} setSelectedRide={setSelectedRide} eventId={eventId} setSwitchScreen={setSwitchScreen}/>
        :
        <div className='container'>
            {
                eventRideOffers.map(offer=>{
                return(
                    <>
                      <SwipeCard cardInfo={offer} reject={rejectRide} accept={selectRide}/>
                    </>
                )
                })
               
            }
             <button  onClick={()=>navigate("/events")}>Cancel request</button>
        </div>
  )
}

export default AvailableRides
