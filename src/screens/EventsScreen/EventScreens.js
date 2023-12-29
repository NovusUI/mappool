import { collection, doc, getDoc, getDocs} from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation} from 'react-router-dom'
import { db } from '../../firebase/config';
import { useAuth } from '../../contextAPI/AuthContext';
import { useApp } from '../../contextAPI/AppContext';
import { useMsg } from '../../contextAPI/MsgContext';
import DownloadPrompt from '../../components/DownloadPrompt';
import EventLargeCard from "../../components/EventLargeCard"
import { useNav } from '../../contextAPI/NavContaxt';

 const EventScreen =  () => {
    
  const navigate = useNavigate()
  // const [events, setEvents] = useState([])
  const  {user,updateRole} = useAuth()  
  const  {setUserSelectedEvent} =useApp()
  const eventCollection = collection(db, "events")
  const {setMsgType} = useMsg()
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const locationData = useLocation()
  const event = locationData.state.event
  const {setShowNav, setTitle} = useNav()
 
  useEffect(() => {
    setTitle("Event Details")
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default browser prompt
      event.preventDefault();

      // Stash the event so it can be triggered later
      setDeferredPrompt(event);

      // Show the install button
      setShowInstallButton(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

    useEffect(() => {
    
      // setMsgType("success")
      //   const fetchEvents = async () => {
      //     try {
      //       const eventsCollection = await getDocs(collection(db,"events")) 
           
      //       const eventsData = eventsCollection.docs.map(doc =>(
      //           {
      //               id: doc.id,
      //               ...doc.data()
      //           }
               
      //       ));
      //       console.log(eventsData)
      //       setEvents(eventsData);
      //     } catch (error) {
      //       console.error('Error fetching events:', error);
      //       setMsgType("failure")
      //     }
      //   };
    
      //   fetchEvents();

      
        
      }, []);

  const chooseRole = async(eventId) => {
    //store the event chosen in database and local host
    

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
            navigate("/",{state:{userEvent:userEventDocSnapshot.data()}})
        }
    } catch (error) {
        console.error(error)
        setMsgType("failure")
    }
    

    
  }

  return (
    <>
    {showInstallButton && <DownloadPrompt setDeferredPrompt={setDeferredPrompt} deferredPrompt={deferredPrompt} setShowInstallButton={setShowInstallButton}/>}
    {!showInstallButton && <div className='container' id='events'>
           <EventLargeCard eventDate={event.eventDate} eventName={event.eventName}/>
           {/**container for  about and features */}
          <div className='about-and-features'>
             {/**about events */}
           <div className='about-event'>
            <h2 className='poppins-normal'>About this event</h2>
            <p className='inter-light'>
            Available for this evenorem ipsum dolor sit amet, 
            consectetuer adipiscing elit. Aenean commodo
            ligula eget dolor. 
            </p>
           </div>
           {/**event features */}
           <div className='event-features'>
            <h6 className='inter-light'>Available for this event</h6>
            <div className='event-features-container'>
              <div className="event-feature" id={event.id} onClick={()=>chooseRole(event.id)}> 
                <div className='ef-img'>
                  <img src="/carpool.png"></img>
                </div>
                <p className='feature-title'>Carpool</p>
              </div>
              <div className="event-feature" id={event.id} onClick={()=>chooseRole(event.id)}>
                <div className='ef-img'>
                  <img src="/ticket.png"></img>
                </div>
                <p className='feature-title'>Get Ticket</p>
              </div>
              <div className="event-feature" id={event.id} onClick={()=>chooseRole(event.id)}>
                <div className='ef-img'>
                  <img src="/vrhs.png"></img>
                </div>
                <p className='feature-title'>Experience Event</p>
              </div>
            </div>
           
           </div>
          </div> 
           
        
      
    </div>}
    </>
  )
}

export default EventScreen