import React, { useEffect, useRef, useState } from 'react'
import FormElement1 from '../../components/FormElements/FormElement1'
import FormElement2 from '../../components/FormElements/FormElement2'
import "./StyleSheet.css"
import FormTypeE from '../../components/FormElements/FormTypeE'
import EventFeatures from '../../components/EventFeatures/EventFeatures'
import { useNavigate } from 'react-router-dom'
import { useNav } from '../../contextAPI/NavContaxt'
import CalenderForm from '../../components/FormElements/CalenderForm'
import TimeForm from '../../components/FormElements/TimeForm'
import DropDownForm from '../../components/FormElements/DropDownForm'
import MapForm from '../../components/FormElements/MapForm'
import { useAuth } from '../../contextAPI/AuthContext'
import { validateDate, validateDescription, validateEndTIme, validateEventName, validateLocation, validateStartTime } from './formValidation'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { firebaseTimeStampFormatter } from './utills'

const CreateEvent = () => {

  const navigate = useNavigate()
  const {setTitle} = useNav()
  const [featuresSelected, setFeaturesSelected] = useState([])
  const [isDisabled, setIsDisabled] = useState(false)
  const [eventId, setEventId] = useState(null)
  const {user} = useAuth()
  const eventNameRef= useRef()
  const eventLocationRef= useRef()
  const eventDescriptionRef= useRef()
  const eventDateRef = useRef()
  const eventStartTimeRef = useRef()
  const eventEndTimeRef = useRef()
  const eventRepeatTypeRef = useRef()
  

  // error usestate

  const [eventNameErr, setEventNameErr] = useState(null)
  const [eventLocationErr, setEventLocationErr] = useState(null)
  const [eventDescriptionErr, setDescriptionErr] = useState(null)
  const [eventDateErr, setEventDateErr] = useState(null)
  const [eventSTErr, setEventSTErr] = useState(null)
  const [eventETErr, setEventETErr] = useState(null)
 


  const onCreateEvent = async()=> {
    setIsDisabled(true)
    console.log(eventDateRef.current.value, eventStartTimeRef.current.value, eventDescriptionRef.current.value, eventEndTimeRef.current.value, eventLocationRef.current.value,eventNameRef.current.value, eventRepeatTypeRef.current.value, featuresSelected)

    const eventLocationErr = validateLocation(eventLocationRef.current.value)
    setEventLocationErr(eventLocationErr)

    const eventDescriptionErr = validateDescription(eventDescriptionRef.current.value)
    setDescriptionErr(eventDescriptionErr)

    const eventNameErr = validateEventName(eventNameRef.current.value)
    setEventNameErr(eventNameErr)

    const eventDateErr = validateDate(eventDateRef.current.value)
    setEventDateErr(eventDateErr)

    const eventSTErr = validateStartTime(eventStartTimeRef.current.value)
    setEventSTErr(eventSTErr)

    const eventETErr = validateEndTIme(eventStartTimeRef.current.value,eventEndTimeRef.current.value)
    setEventETErr(eventETErr)

    if (eventLocationErr || eventDescriptionErr || eventNameErr || eventDateErr || eventSTErr || eventETErr) {
      console.log("sjnds")
      setIsDisabled(false)
      return
    }

    // save to db
    const eventData = {
      eventName:eventNameRef.current.value,
      location: eventLocationRef.current.value,
      eventDate: firebaseTimeStampFormatter(eventDateRef.current.value, eventStartTimeRef.current.value),
      ends: firebaseTimeStampFormatter(eventDateRef.current.value, eventEndTimeRef.current.value),
      description: eventDescriptionRef.current.value,
      repeat: eventRepeatTypeRef.current.value,
      createdBy: user.id,
      featureAvailable: featuresSelected
    }

    console.log(eventData)
    const eventCollectionRef = collection(db, "events")
    const eventRef = eventId ? doc(eventCollectionRef, eventId) : doc(eventCollectionRef)
   
      await setDoc(eventRef, eventData)
    
    setIsDisabled(false)
    setEventId(eventRef.id)
    setTitle("Update Event")
  }

  useEffect(()=>{
    setTitle("Create Event")
  },[])
  return (
    <div className='container'> 
    <div className='event-card'>
      <div className='event-image'>
      <img src="/eventpic2.png"></img>
      </div>
    </div>
      <div className='event-form'>
        <div>
        <FormElement1 title="Add event name" placeHolder="Event Name" inputRef={eventNameRef} error={eventNameErr}/>
        </div>
        <div className='flex-row'>
          <CalenderForm title="Set Date" inputRef={eventDateRef} error={eventDateErr}></CalenderForm>
          <TimeForm title="Start Time" placeHolder="10:00 AM" inputRef={eventStartTimeRef} error={eventSTErr}></TimeForm>
        </div>
        <div className='flex-row' style={{padding: "20px 0"}}>
        <DropDownForm title="Repeat" placeHolder="Once" inputRef={eventRepeatTypeRef}/>
        <TimeForm title="End Time" placeHolder="10:00 PM" inputRef={eventEndTimeRef} error={eventETErr}></TimeForm>
        </div>
        <MapForm title="Set location" placeHolder="Eko Hotel" inputRef={eventLocationRef} error={eventLocationErr}/>
        <FormTypeE title="Add Description" placeHolder="Available for this evenorem ipsum dolor sit amet, 
consectetuer adipiscing elit. Aenean commodo
ligula eget dolor. Aenean massa. Cum sociis 
natoque penatibus et magnis dis parturient 
montes, nascetur ridiculus mus.t " inputRef={eventDescriptionRef} error={eventDescriptionErr}/>
      </div>
      
      <div className='event-features'>
        <h6 className='poppins-heavy'>Make available for event</h6>
          <div className='event-features-container'>
          <EventFeatures  handleClick={()=>alert("carpool available")} featureType="carpool" isEditEvent={true} featuresSelected={featuresSelected} setFeaturesSelected={setFeaturesSelected}/>
          <EventFeatures handleClick={()=>navigate("/comingsoon")} featureType="getTicket" isEditEvent={true} />
          <EventFeatures  handleClick={()=>navigate("/comingsoon")} featureType="experienceEvent" isEditEvent={true} />
          </div>
      </div>
      <div style={{width:"100%"}}>
      <button className={isDisabled ? "inactive full-screen-btn":'purple-btn full-screen-btn'} onClick={onCreateEvent} disabled={isDisabled}  >{eventId ? "Update Event":"Create Event"}</button>
      </div>
    </div>
  )
}

export default CreateEvent
