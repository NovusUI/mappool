import { collection, doc, getDoc, getDocs} from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase/config';
import { useAuth } from '../../contextAPI/AuthContext';
import { useApp } from '../../contextAPI/AppContext';
import { useMsg } from '../../contextAPI/MsgContext';
import DownloadPrompt from '../../components/DownloadPrompt';
import EventCard from '../../components/EventCard';
import { useNav } from '../../contextAPI/NavContaxt';

 const EventsScreen =  () => {
    
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const  {setUserSelectedEvent} =useApp()
  const eventCollection = collection(db, "events")
  const {setMsgType} = useMsg()
  const  {user,updateRole} = useAuth()
  const {setShowNav} = useNav()
 
useEffect(() => {
    setShowNav(false)
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

  const gotToEvent = async(eventId) => {
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
      setShowNav(true)
      navigate("/event-page",{state:{event}})
    } catch (error) {
        console.error(error)
        setMsgType("failure")
    }
    

    
  }

  return (
    <>
   <div className='search'>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3851 15.4458C11.7348 17.5685 7.85535 17.4014 5.39857 14.9446C2.76253 12.3086 2.76253 8.0347 5.39857 5.39866C8.03461 2.76262 12.3085 2.76262 14.9445 5.39866C17.4013 7.85544 17.5684 11.7349 15.4457 14.3852L20.6013 19.5408C20.8942 19.8337 20.8942 20.3086 20.6013 20.6015C20.3085 20.8944 19.8336 20.8944 19.5407 20.6015L14.3851 15.4458ZM6.45923 13.884C4.40898 11.8337 4.40898 8.50957 6.45923 6.45932C8.50948 4.40907 11.8336 4.40907 13.8839 6.45932C15.9326 8.50807 15.9341 11.8288 13.8884 13.8795C13.8868 13.881 13.8853 13.8824 13.8838 13.884C13.8823 13.8855 13.8808 13.887 13.8793 13.8885C11.8287 15.9342 8.50798 15.9327 6.45923 13.884Z" fill="#A0A3AF"/>
    </svg>
    <input placeholder='Search event'/>
   </div>
   <div className='container' id='events'>
       
        {
            events.map(event=><EventCard event={event} gotToEvent={gotToEvent}/>)
        }
    
    </div>
    </>
  )
}

export default EventsScreen