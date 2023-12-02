
import { useLocation, useNavigate } from "react-router-dom"
import "../../index.css"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../contextAPI/AuthContext"
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useApp } from "../../contextAPI/AppContext"
import ChatApp from "../../components/ChatApp"
import { useMsg } from "../../contextAPI/MsgContext"

const Contact = ({setSwitchScreen})=>{

    const location = useLocation()
    const[requesting, setRequesting] = useState(false)
    const [poolId, setPoolId] = useState(null)
    const [poolRef, setPoolRef] = useState(null)
    const {user, updateRole} = useAuth() 
    const [poolType, setPoolType] = useState(null)
    const [validate, setValidate] = useState(false)
    const [validateMessage, setValidateMessage] = useState("")
    const [pool, setPool] = useState(null)
    const [eventDocRef, seteventDocRef] = useState(null)
    const [confirmedReject, setConfirmedReject] = useState(true)
    const [leaveAMsg,setLeaveAMsg] = useState(false)
    const [showTextArea, setShowTextArea] = useState(false)
    const [textareaValue, setTextareaValue] = useState('');
    const [buttonMsg, setButtonMsg] = useState("Too short")
    const [poolHailerRef, setPoolHailerRef] = useState(null)
    const [poolHailer, setPoolHailer] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)
    const [eventData, setEventData] = useState(null)
    const [poolMsgsRef, setPoolMgsRef] = useState(null)
    const [poolMsgs, setPoolMsgs] = useState([])
    const [openChat, setOpenChat] = useState(false)
    const [firstSurvey,setFirstSurvey] = useState(false)
    const [firstSurveyAnswer, setFirstSurveyAnswer] = useState(null)
    const [firstSurveyMessage, setFirstSurveyMessage] = useState(null)
    const [secondSurvey, setSecondSurvey] = useState(false)
    const eventId = localStorage.getItem("eventId")
    const eventCollectionRef = collection(db,"events")
    
    const firstSurveyRef = useRef()
    const navigate = useNavigate()
    const {setMsgType} = useMsg()
   

   
 
    useEffect(()=>{
      if(!eventId){
        navigate("/notfound")
      }
     
    },[])
   

   useEffect(()=>{

    if(eventDocRef && poolHailer && pool){
    try {
      const eventDocRef = doc(eventCollectionRef,eventId)
    const unsubscribeEventSnapShop = onSnapshot(eventDocRef,(snapshot)=>{
        if(snapshot.exists()){
          const eventData = {
            eventId,
            ...snapshot.data()
          }
          setEventData(eventData)
           console.log(pool.status)
          if((eventData.eventDate.seconds - (Math.floor(Date.now() / 1000))) <= 1200 && !poolHailer.startOfEventSurvey && pool.status !== "cancelled"){
            setFirstSurvey(true)
            setIsDisabled(true)
          }else{
            setFirstSurvey(false)
          }
        }else{
          setMsgType("failure")
        }
    },(error)=>{
      console.log(error)
      setMsgType("failure")
    })

    return()=> unsubscribeEventSnapShop()
    } catch (error) {
      console.log(error)
    }
   }
   },[eventDocRef,poolHailer,pool])


    useEffect(()=>{
      
      try {
        
      if(poolRef){
      const poolMsgsRef = collection(poolRef,"poolMessages")
      setPoolMgsRef(poolMsgsRef)
      
      const poolMsgsUnsubscribe = onSnapshot(poolMsgsRef,(snapshot)=>{
      
      
       setPoolMsgs([])
       const sortedMgs =snapshot.docs.map(doc=>({
          id:doc.id,
          ...doc.data()
       })).sort((a,b)=>(a.time - b.time))

       setPoolMsgs(sortedMgs)
      
     },(error)=>{
        console.log(error)
        setMsgType("failure")
     })
      
     return()=> poolMsgsUnsubscribe()
    }
    } catch (error) {
        setMsgType("failure")
    }
      
    },[poolRef])

    
    
    const [isWaiting, setIsWaiting] = useState(true)
    
    
    
    useEffect(()=>{
        if(pool && pool.status)
          setIsWaiting(false)
    },[pool])

   
    useEffect(()=>{
      
      if(!eventId){
        navigate("/notfound")
      }
      
      setIsWaiting(true)
     
      const getEventDoc = async()=>{
          
        try {
        
          const usersCollection = collection(db, "users")
          const userDoc = doc(usersCollection,user.id)
          const userEvents = collection(userDoc,"userevents")
          const userEventDoc = doc(userEvents,eventId)

          seteventDocRef(userEventDoc)
          const userEventDocData= await getDoc(userEventDoc)
      
          if(userEventDocData.exists()){
            const data = userEventDocData.data()
            const poolStatus = data.poolId;
            const carPoolStatus = data.carpoolId;
           
            if (poolStatus && poolStatus !== 'pending') {
              // Handle the case where the "status" field changes from "pending"
              setPoolType("pool")
              setPoolId(poolStatus)

            }
            else if( carPoolStatus && carPoolStatus !== "pending"){
              setPoolType("carpool")
              setPoolId(carPoolStatus)
            }

          }else{
              console.log('Document does not exist');
              navigate("/notfound")
            }
          } catch (error) {
            console.log(error)
            setMsgType("failure")
          }

      }
    
      getEventDoc()
        
  
      
   
    },[])


   useEffect(()=>{
       //listen to update in pool collection
   
      if(poolId && poolHailer){ 
  
        const poolCollection = collection(db,"pool")
        const poolDoc = doc(poolCollection,poolId)
     
       setPoolRef(poolDoc)
       const  unsubscribePool = onSnapshot(poolDoc,(docSnapshot)=>{

         if(docSnapshot.exists()){
        
           const data  = docSnapshot.data()
           setPool(data)
           if(data.returnTripSurvey && !poolHailer.endOfEventSurvey && data.status !== "cancelled"){
              setSecondSurvey(true)
              setIsDisabled(true)
           }else{
            setSecondSurvey(false)
           
         
           }
          //  setPoolStatus(poolStatus)
           if((data.status === "created" || data.status === "closed") && poolHailer.poolHailerStatus === "accepted" ){
              setValidate(true)
              setLeaveAMsg(false)
           }
           else if(poolHailer.poolHailerStatus === "rejected"){
            setValidate(false)
            setLeaveAMsg(false)
            setValidateMessage("Pooler rejected your offer! Maybe not a macth")
           }else if(data.status === "created" && poolHailer.poolHailerStatus === "cancelled"){
             setValidate(true)
             setLeaveAMsg(false)
          
           }else if(poolHailer.poolHailerStatus === "removed"){
            setValidate(false)
            setLeaveAMsg(false)
             setValidateMessage("pool is closed or cancelled")

           }
           else if(data.status == "created"){
            setValidate(true)
            setLeaveAMsg(true)

           }

           else{
            setValidate(false)
            setLeaveAMsg(false)
            setValidateMessage("pool is closed or cancelled")
           }

         }else{
          setValidate(false)
          setLeaveAMsg(false)
          setValidateMessage("pool is closed or cancelled")
         }
        
       },(error)=>{
        console.log(error)
        setMsgType("failure")
       })
  
       
        
       return ()=> unsubscribePool()
      
      }
      
      
   
   },[poolId,poolHailer])


   useEffect(()=>{

    if(poolId){
      
      try {
        const poolCollection = collection(db,"pool")
        const poolDoc = doc(poolCollection,poolId)
        const poolHailersSubcollection = collection(poolDoc, 'poolHailers') 
        const poolHailerDoc = doc(poolHailersSubcollection, user.id)
     
      
     
      setPoolHailerRef(poolHailerDoc)
        const unsubscribeHaillers = onSnapshot(poolHailerDoc,(snapshot)=>{
          
          if(snapshot.exists()){
            const data  = snapshot.data()
            setPoolHailer(data)
          }

        },(error)=>{
          console.log(error)
          setMsgType("failure")
        })

        
       return ()=> unsubscribeHaillers()
      } catch (error) {

        setMsgType("failure")
      }
    }


   },[poolId])


   const joinCarpoolGroup = async()=>{
     if(leaveAMsg){
        setShowTextArea(true)
     }else{
      setOpenChat(true)
      if(poolHailer.poolHailerStatus === "cancelled"){
        await updateDoc(poolHailerRef,{
          poolHailerStatus:"accepted"
        })
      }
      
     }
     
  };

  const cancelRide = async() => {
     
    setIsDisabled(true)
     const poolStatus= poolType === "carpool" && {carpoolId: "pending"} || {poolId: "pending"}
     const poolCollection = collection(db,"pool")
     const poolDoc = doc(poolCollection,poolId)
     const poolHailersSubcollection = collection(poolDoc, 'poolHailers') 
     const poolHailerDocREf = doc(poolHailersSubcollection,user.id)
     
     try {
     
      
      

     if(poolType){
        if(validate){
            if(confirmedReject){
           console.log(poolHailer.poolHailerStatus)
              if(poolHailer.poolHailerStatus !== "created"){
                await updateDoc(poolHailerDocREf,{
                  poolHailerStatus: "rejected"
                  })
               
                // rejected when the ride is still opem
                await updateDoc(eventDocRef,poolStatus)
                const eventRejectedRidesRef = collection(eventDocRef,"rejectedRides")
                const eventRejectedRideDocRef = doc(eventRejectedRidesRef,poolId)
                await setDoc(eventRejectedRideDocRef,{id:poolId, reason:"unknown"})
              }
             
                
                
            }
        }else{
          if(poolHailer.poolHailerStatus === "accepted"){
            await updateDoc(poolHailerDocREf,{
              poolHailerStatus: "cancelled"
              })
          }
          //rejected by poolee when the pooler removes or reject you 
          await updateDoc(eventDocRef,poolStatus)
          const eventRejectedRidesRef = collection(eventDocRef,"rejectedRides")
          const eventRejectedRideDocRef = doc(eventRejectedRidesRef,poolId)

          if(poolHailer.poolHailerStatus === "rejected"){
             
            await setDoc(eventRejectedRideDocRef,{id:poolId, reason: "rejected"})
          }else if(poolHailer.poolHailerStatus === "removed"){
            await setDoc(eventRejectedRideDocRef,{id:poolId, reason: "removed"})
          }
          
       }
       
     }
     setSwitchScreen(false)
     
      
     } catch (error) {
       console.error(error)
       setMsgType("failure")
       setIsDisabled(false)

     }  

  }

  const onChangeTextArea = (e)=>{

    setTextareaValue(e.target.value);
   
    if(e.target.value.length < 10){
      setButtonMsg("too short")
    }
    else if(e.target.value.length > 50){
      setButtonMsg("it's getting too looooooooong")
    }
    else{
      setButtonMsg("looking good")
    }


  }

  const saveShortMsg = async(e) => {
    console.log(textareaValue.length > 10, textareaValue.length < 50)
    if(textareaValue.length > 10 && textareaValue.length <= 50){
      setIsDisabled(true)
     
      const poolHailersSubcollection = collection(poolRef, 'poolHailers')
      const newHailerDocRef = doc(poolHailersSubcollection, user.id);

      
  
              //create data for hailer
  
      const hailerData = {
        shortMsg: textareaValue
      }
      
      console.log(hailerData)
      
      try {
        await updateDoc(newHailerDocRef, hailerData)
      } catch (error) {
        console.error(error)
        setMsgType("failure")
        setIsDisabled(false)
      
      }
      
      setIsDisabled(false)
   
       
       setShowTextArea(false)
    }
     
   

  }

  const endOfEventSurvey = async(status)=>{
    try {
    
     if(status){
        await updateDoc(poolHailerRef,{
          endOfEventSurvey: {
            status: true,
            option: "yes"
          }
      })
      setSecondSurvey(false)
      setIsDisabled(false)
      
     }else{
      await updateDoc(poolHailerRef,{
        endOfEventSurvey: {
          status: true,
          option: "no"
        }
      })
      setSecondSurvey(false)
      cancelRide()
     }
    } catch (error) {
      console.log(error)
      setMsgType("failure")
    }
  }

  const startOfEventSurvey = async(poolType)=>{
      console.log(isDisabled)
    switch(poolType){
      case 1:{
        setFirstSurveyAnswer({
          answerType: "yes, but i went alone"
        })
        setFirstSurveyMessage("Any comments?")

      }
      break;
      case 2:{
        setFirstSurveyAnswer({
          answerType: "yes, followed ride"
        })
        setFirstSurveyMessage("Any comments?")
      }
      break;
      case 3:{
        setFirstSurveyAnswer({
          answerType: "waiting for ride"
        })
        setFirstSurveyMessage("Any comments?")
      }
      break;
      case 4:{
        setFirstSurveyAnswer({
          answerType: "on my way with ride"
        })
        setFirstSurveyMessage("Any comments?")
      }
      break;
      case 5:{
        setFirstSurveyAnswer({
          answerType: "on my way"
        })
        setFirstSurveyMessage("Any comments?")
      }
      break;
      case 6:{
        setFirstSurveyAnswer({
          answerType: "not going"
        })
        setFirstSurveyMessage("Any comments?")
      }
      break;
    }
  }

  const submitFirstSurvey = async()=>{
    try {
      await updateDoc(poolHailerRef,{
       startOfEventSurvey: {
           ...firstSurveyAnswer,
           comment: firstSurveyRef.current.value
        }
      })
      setFirstSurveyMessage(null)
      setFirstSurvey(null)
      setIsDisabled(false)
    } catch (error) {
      console.log(error)
      setMsgType("failure")
    }
  }


    return(

      
      isWaiting && <div>Waiting...</div> ||
       
     <>
     { !openChat &&
      <div className="container">
      <h3>Contact your {poolType === 'carpool' ? 'ride' : 'pool group'}</h3>
   
       {
        showTextArea &&
         <>
         <textarea value={textareaValue} onChange={onChangeTextArea} className="leave-a-msg" placeholder="I can meet you at Berger busstop"></textarea>

         </>
         ||
         <>
         <button className={ !validate || isDisabled ? "inactive":"group-btn"} onClick={joinCarpoolGroup} disabled={!validate || isDisabled } >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
           <path fill-rule="evenodd" clip-rule="evenodd" d="M0.184299 19.3314C0.102479 19.6284 0.372969 19.9025 0.671019 19.8247L5.27836 18.6213C6.73272 19.409 8.37012 19.8275 10.0372 19.8275H10.0422C15.5282 19.8275 20.0001 15.3815 20.0001 9.9163C20.0001 7.26735 18.9661 4.77594 17.0864 2.90491C15.2066 1.03397 12.7085 0 10.0421 0C4.55619 0 0.0842292 4.44605 0.0842292 9.9114C0.0835992 11.65 0.542519 13.3582 1.41491 14.8645L0.184299 19.3314ZM2.86104 15.2629C2.96786 14.8752 2.91449 14.4608 2.71293 14.1127C1.97278 12.8348 1.5837 11.3855 1.58423 9.9114C1.58423 5.28158 5.3775 1.5 10.0421 1.5C12.312 1.5 14.4297 2.37698 16.0282 3.96805C17.6249 5.55737 18.5001 7.66611 18.5001 9.9163C18.5001 14.5459 14.7069 18.3275 10.0422 18.3275H10.0372C8.62072 18.3275 7.22875 17.9718 5.99278 17.3023C5.65826 17.1211 5.26738 17.0738 4.89928 17.17L2.13688 17.8915L2.86104 15.2629Z" fill="white"/>
           </svg>
           {validate &&  leaveAMsg && "Leave a message" } 
           {validate && !leaveAMsg && "Join group"}
           {!validate && "oops"}
         </button>

         </>
 
       }
       {
        showTextArea &&
         <button className={(isDisabled || textareaValue.length <10 || textareaValue.length>50) && "inactive"} onClick={saveShortMsg} disabled={textareaValue.length <10 || textareaValue.length>50 || isDisabled}>{buttonMsg}</button>
         ||
         <>
         <button className={isDisabled && "inactive" || "danger-btn"} onClick={cancelRide}  disabled={!poolId || isDisabled}>
             { !validate && "Back to Rides"}
             {validate && poolHailer.poolHailerStatus === "created" && "Back to Rides"}
             {validate && poolHailer.poolHailerStatus !== "created" && "Cancel Ride"}
         </button>
   
         </>
 
       }
       
       {
         !validate && !showTextArea &&
         <p>{validateMessage}</p>
       }
       {
        validate && !showTextArea && poolHailer.poolHailerStatus == "created" && <p>Request sent to pooler! Send them a short message or go back to pick other rides</p>
       }
       {validate && !showTextArea && poolHailer.poolHailerStatus !== "created" && <p>Pooler has accepted your request! you can now join the group</p>}

       {
        showTextArea &&
        <p>You can leave a message for the pooler to stand a better chance of being picked. The shorter the better</p>
       }

      </div>
      }
      {
        openChat && <ChatApp poolMsgs={poolMsgs} poolMsgsRef={poolMsgsRef} setOpenChat={setOpenChat} poolId={poolId}/>
      } 
      {
        secondSurvey && 
        <div className='survey'>
           <h3>This ride is open for return
             journey, will you like to join in?</h3>
          <div onClick={()=>endOfEventSurvey(true)}>Yes, i'm in</div>
          <div onClick={()=>endOfEventSurvey(false)}>No, cancel ride</div>

        </div>
      }
      {
        firstSurvey &&
        (
          !firstSurveyMessage &&
        <div className='survey'>
          <h3>Are you at the event?</h3>
          <div onClick={()=>startOfEventSurvey(1)}>Yes, but did not follow ride</div>
          <div onClick={()=>startOfEventSurvey(2)}>Yes, I followed ride</div>
          <div onClick={()=>startOfEventSurvey(3)}>waiting for ride</div>
          <div onClick={()=>startOfEventSurvey(4)}>on my way with ride</div>
          <div onClick={()=>startOfEventSurvey(5)}>on my way</div>
          <div onClick={()=>startOfEventSurvey(6)}>not going</div>
        </div>
         ||
         <div className="survey">
            <button className="x-cancel-btn" onClick={()=>setFirstSurveyMessage(null)}>X</button>
            <h3>{firstSurveyMessage}</h3>
            <input placeholder="submit blank if no comment" ref={firstSurveyRef}></input>
            <button onClick={submitFirstSurvey}>Submit</button>
         </div>
        )
      }
      
      </>
    )

}

export default Contact