import { useEffect, useState } from 'react'
import {collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contextAPI/AuthContext';
import { useNavigate } from 'react-router-dom';
import SelectedRide from './SelectedRide';

const AvailableRides = () => {

  const [eventRideOffers, setEventRideOffers] = useState([])
  const {user} = useAuth()
  const [rejectedRides, setRejectedRides] = useState([])
  const [selectedRide, setSelectedRide] = useState(null)
  
  const navigate = useNavigate()
  //get available rides for event
  useEffect(() => {
    const eventId  = localStorage.getItem("eventId") ;
   

   
    const unsubscribe = onSnapshot(
    query(
      collection(db, 'pool'),
      where('eventId', '==', eventId),
      where('requesterId', '!=', user.id),
      where('poolType', 'in', ['carpoolOffer', 'pool'])
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
}, [user.Id]);


 const rejectRide = (rideId)=>{
    setRejectedRides((prev)=>[...prev,rideId])

    const remainingOffers = eventRideOffers.filter(doc =>!rejectedRides.includes(doc.id))
    setEventRideOffers(remainingOffers)

 }

 const selectRide = (ride)=>{
    setSelectedRide(ride)
    
 }

  return (
      selectedRide ? 
       <SelectedRide selectedRide={selectedRide} setSelectedRide={setSelectedRide}/>
        :
        <div className='container'>
            {
                eventRideOffers.map(offer=>{
                return(
                    <>
                   
                        <div className='ride-offers' id={offer.id}>
                            <button onClick={()=>rejectRide(offer.id)} >x</button>
                                {offer.poolerLoc}
                            <button onClick={()=> selectRide(offer)}>✔</button>
                        </div>
                    
                    </>
                )
                })
               
            }
             <button  onClick={()=>navigate("/events")}>Cancel request</button>
        </div>
  )
}

export default AvailableRides
