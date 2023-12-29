import { useEffect, useState } from 'react'
import {collection, where, onSnapshot, setDoc, doc, query, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contextAPI/AuthContext';
import { createRoutesFromChildren, useMatch, useNavigate } from 'react-router-dom';
import SelectedRide from './SelectedRide';
import SwipeCard from '../../components/SwipeCard';
import { useMsg } from '../../contextAPI/MsgContext';
import TinderSwipeCard from '../../components/TinderSwipeCard';
import { useNav } from '../../contextAPI/NavContaxt';

const AvailableRides = ({setSwitchScreen}) => {

  const [eventRideOffers, setEventRideOffers] = useState([])
  const {user,updateRole} = useAuth()
  const [rejectedRides, setRejectedRides] = useState([])
  const [ gottenRejectedRides, setGottenRejectedRides] = useState(false)
  const [selectedRide, setSelectedRide] = useState(null)
  const [rejectedRideCollectionRef, setRejectedRideCollectionRef] = useState(null)
  const eventId  = localStorage.getItem("eventId") ;
  const navigate = useNavigate()
  const {setMsgType} = useMsg()
  const {setTitle} = useNav()


  
   
    
  //get available rides for event


  const getRejectedRides = async()=>{
     setTitle("Choose Pooler")
    if(!eventId){
      navigate("/notfound")
    }
  
    try {
      const userCollectionRef = collection(db,"users")
      const userRef = doc(userCollectionRef,user.id)
      const userEventCollectionRef = collection(userRef,"userevents")
      const userEventRef = doc(userEventCollectionRef,eventId)
      const rejectedRideCollectionRef = collection(userEventRef,"rejectedRides")
      setRejectedRideCollectionRef(rejectedRideCollectionRef)
      const rejectedRidesDocs = await getDocs(rejectedRideCollectionRef)
      
      const rejectedRidesIds = rejectedRidesDocs.docs.map(doc=>doc.id)
      console.log(rejectedRidesIds)
      setRejectedRides(rejectedRidesIds)
      setGottenRejectedRides(true)
      
    } catch (error) {
      console.log(error)
      setMsgType("failure")
    }
    
  }
  useEffect(()=>{
    getRejectedRides()
  },[])
  
  
  useEffect(() => {
     
   
    
    if(!eventId){
      navigate("/notfound")
  }
     if(gottenRejectedRides){
 
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
    
           console.log(requestsData)
          setEventRideOffers(requestsData);
        },
        (error) => {
          console.error('Error fetching requests:', error);
          setMsgType("failure")
        }
      );
   
   

  
    
  return () => unsubscribe();
       }
}, [gottenRejectedRides]);


 const rejectRide = async(rideId)=>{
    setRejectedRides((prev)=>[...prev,rideId])
   
    const remainingOffers = eventRideOffers.filter(doc =>!rejectedRides.includes(doc.id))
    setEventRideOffers(remainingOffers)
    
    const rejectedRideRef = doc(rejectedRideCollectionRef,rideId)
   
   try {
    await setDoc(rejectedRideRef,{id:rejectedRideRef.id})
   } catch (error) {
     console.log(error)
     setMsgType("failure")
   }
 }



 const selectRide = (ride)=>{
    setSelectedRide(ride)
    
 }

  return (
       

      selectedRide ? 
       <SelectedRide selectedRide={selectedRide} setSelectedRide={setSelectedRide} eventId={eventId} setSwitchScreen={setSwitchScreen}/>
        :
         <div className='island'>
          <p className='island-para popping-300-normal'>
            Choose the best or closest pooler to you
            to see more options swipe the poolers
            that is not a match.
          </p>
          
           <div style={{height:"45%", width:"100%"}}>
                      { 
                        eventRideOffers.slice(0,5).map((eventRideOffer)=><SwipeCard id={eventRideOffer.id} cardInfo={eventRideOffer} reject={rejectRide} accept={selectRide}/>)
                        
                      }
                     
                      
            </div>

          
        </div>
  )
}

export default AvailableRides
