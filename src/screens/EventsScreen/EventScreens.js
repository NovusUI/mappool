import { collection, doc, getDoc, getDocs} from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase/config';
import { useAuth } from '../../contextAPI/AuthContext';
import { useApp } from '../../contextAPI/AppContext';

 const EventScreen =  () => {
    
    const nagivate = useNavigate()
    const [events, setEvents] = useState([])
    const  {user} = useAuth()
    const  {setUserSelectedEvent} =useApp()

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const eventsCollection = await getDocs(collection(db,"events")) 
           
            const eventsData = eventsCollection.docs.map(doc =>(
                {
                    id: doc.id,
                    ...doc.data()
                }
               
            ));
            console.log(eventsData)
            setEvents(eventsData);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        };
    
        fetchEvents();
        
      }, []);

  const chooseRole = async(eventId) => {
    //store the event chosen in database and local host
    const event = events.find(event=> event.id === eventId)
    localStorage.setItem("eventName",event.eventName)
    localStorage.setItem("eventId",event.id)

    const usersCollection = collection(db, "users")
    const userDoc = doc(usersCollection,user.id)

    const userEvents = collection(userDoc,"userevents")
    const userEventDoc = doc(userEvents,event.id)
    const userEventDocSnapshot = await getDoc(userEventDoc)
    
    setUserSelectedEvent(userEventDocSnapshot)
    
    if(!userEventDocSnapshot.exists()){
        nagivate("/role")
    }else{
        //save role to local host if role exists
        nagivate("/")
    }
  }

  return (
    <div className='container'>
        <h1>Events</h1>
        {
            events.map(event=><button id={event.id} onClick={()=>chooseRole(event.id)}>{event.eventName}</button>)
        }
      
    </div>
  )
}

export default EventScreen