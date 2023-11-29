import { collection, doc, getDoc, getDocs} from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase/config';
import { useAuth } from '../../contextAPI/AuthContext';
import { useApp } from '../../contextAPI/AppContext';
import { useMsg } from '../../contextAPI/MsgContext';

 const EventScreen =  () => {
    
    const navigate = useNavigate()
    const [events, setEvents] = useState([])
    const  {user,updateRole} = useAuth()
    
    const  {setUserSelectedEvent} =useApp()

    const eventCollection = collection(db, "events")
   
    const {setMsgType} = useMsg()

    useEffect(() => {
      setMsgType("success")
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
            setMsgType("failure")
          }
        };
    
        fetchEvents();
        
      }, []);

  const chooseRole = async(eventId) => {
    //store the event chosen in database and local host
    const event = events.find(event=> event.id === eventId)

    //check if event exists //later check for event status too
    try {
    const eventDocRef = doc(eventCollection,eventId)
    const eventDoc = await getDoc(eventDocRef)
    console.log(eventDoc.exists())
   
    if(!eventDoc.exists()){
      
        if(updateRole){
            navigate("/notfound",{state:{eventsLink:"/events"}})
        }else{
            navigate("/notfound",{state:{eventsLink:"/"}})
        }
       
        return
    }
        
   
    localStorage.setItem("eventName",event.eventName)
    localStorage.setItem("eventId",event.id)
    //setChosenEvent(eventDoc)

    const usersCollection = collection(db, "users")
    const userDoc = doc(usersCollection,user.id)
    const userEvents = collection(userDoc,"userevents")
    const userEventDoc = doc(userEvents,event.id)


    
   
        const userEventDocSnapshot = await getDoc(userEventDoc)
        setUserSelectedEvent(userEventDocSnapshot)
        console.log(userEventDocSnapshot.data())
        if(!userEventDocSnapshot.exists() || !updateRole){
            navigate("/role")
        }else{
            //save role to local host if role exists
            navigate("/")
        }
    } catch (error) {
        console.error(error)
        setMsgType("failure")
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