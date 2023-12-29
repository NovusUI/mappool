
import { useLocation, useNavigate } from "react-router-dom"
import "../../index.css"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../contextAPI/AuthContext"
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useApp } from "../../contextAPI/AppContext"
import ChatApp from "../../components/ChatApp"
import { useMsg } from "../../contextAPI/MsgContext"
import { useNav } from "../../contextAPI/NavContaxt"


const Contact = ({setSwitchScreen})=>{

    const location = useLocation()
    const[requesting, setRequesting] = useState(false)
    // const [poolId, setPoolId] = useState(null)
    const [poolRef, setPoolRef] = useState(null)
    const {user, updateRole} = useAuth() 
    const [poolType, setPoolType] = useState(null)
    const [validate, setValidate] = useState(false)
    const [validateMessage, setValidateMessage] = useState("Send a message to your pooler")
    const [pool, setPool] = useState(null)
    const {userEventDocRef,setUserEventDocRef} = useApp()
    const [confirmedReject, setConfirmedReject] = useState(true)
    const [leaveAMsg,setLeaveAMsg] = useState(false)
    const [showTextArea, setShowTextArea] = useState(false)
    const [textareaValue, setTextareaValue] = useState('');
    const [buttonMsg, setButtonMsg] = useState("Too short")
    const [poolHailerRef, setPoolHailerRef] = useState(null)
    const [poolHailer, setPoolHailer] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)
    // const [eventData, setEventData] = useState(null)
    const [poolMsgsRef, setPoolMgsRef] = useState(null)
    const [poolMsgs, setPoolMsgs] = useState([])
    const [openChat, setOpenChat] = useState(false)
    const [firstSurvey,setFirstSurvey] = useState(false)
    const [firstSurveyAnswer, setFirstSurveyAnswer] = useState(null)
    const [firstSurveyMessage, setFirstSurveyMessage] = useState(null)
    const [secondSurvey, setSecondSurvey] = useState(false)
    const eventId = localStorage.getItem("eventId")
    const eventCollectionRef = collection(db,"events")
    const {eventData} = useApp()
    const {yourPoolId, setYourPoolId,poolId,setPoolId,carpoolId, setCarpoolId} = useApp()
    const [poolingId, setPoolingId] = useState(null)
    const firstSurveyRef = useRef()
    const navigate = useNavigate()
    const {setMsgType} = useMsg()
    const {setTitle, setShowNav} = useNav()

   
 
    useEffect(()=>{
      setTitle("Contact Pooler")
      if(!eventId){
        navigate("/notfound")
      }
     
    },[])
   

  //  useEffect(()=>{

  //   if(eventDocRef && poolHailer && pool){
  //   try {
  //     const eventDocRef = doc(eventCollectionRef,eventId)
  //   const unsubscribeEventSnapShop = onSnapshot(eventDocRef,(snapshot)=>{
  //       if(snapshot.exists()){
  //         const eventData = {
  //           eventId,
  //           ...snapshot.data()
  //         }
  //         setEventData(eventData)
  //          console.log(pool.status)
  //         if((eventData.eventDate.seconds - (Math.floor(Date.now() / 1000))) <= 1200 && !poolHailer.startOfEventSurvey && pool.status !== "cancelled"){
  //           setFirstSurvey(true)
  //           setIsDisabled(true)
  //         }else{
  //           setFirstSurvey(false)
  //         }
  //       }else{
  //         setMsgType("failure")
  //       }
  //   },(error)=>{
  //     console.log(error)
  //     setMsgType("failure")
  //   })

  //   return()=> unsubscribeEventSnapShop()
  //   } catch (error) {
  //     console.log(error)
  //   }
  //  }
  //  },[eventDocRef,poolHailer,pool])

  useEffect(()=>{

    if(eventData && poolHailer && pool){


           console.log(pool.status)
          if((eventData.eventDate.seconds - (Math.floor(Date.now() / 1000))) <= 1200 && !poolHailer.startOfEventSurvey && pool.status !== "cancelled"){
            setFirstSurvey(true)
            setIsDisabled(true)
          }else{
            setFirstSurvey(false)
          }
       
   }
   },[eventData,poolHailer,pool])

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
      console.log(pool)
        if(pool && pool.status){
          
            setIsWaiting(false)
        }
    },[pool])

   
    useEffect(()=>{
      
      if(!eventId){
        navigate("/notfound")
      }
      
      setIsWaiting(true)
     if(poolId || carpoolId){
      // const getEventDoc = async()=>{
          
      //   try {
        
      //     const usersCollection = collection(db, "users")
      //     const userDoc = doc(usersCollection,user.id)
      //     const userEvents = collection(userDoc,"userevents")
      //     const userEventDoc = doc(userEvents,eventId)

      //     seteventDocRef(userEventDoc)
      //     const userEventDocData= await getDoc(userEventDoc)
      
      //     if(userEventDocData.exists()){
      //       const data = userEventDocData.data()
      //       const poolStatus = data.poolId;
      //       const carPoolStatus = data.carpoolId;
           
            if (poolId && poolId!== 'pending') {
              // Handle the case where the "status" field changes from "pending"
              setPoolType("pool")
              setPoolingId(poolId)
            }
            else if( carpoolId && carpoolId!== "pending"){
              setPoolType("carpool")
              setPoolingId(carpoolId)
            }

      //     }else{
      //         console.log('Document does not exist');
      //         navigate("/notfound")
      //       }
      //     } catch (error) {
      //       console.log(error)
      //       setMsgType("failure")
      //     }

      // }

          } 
    
      // getEventDoc()
        
  
      
   
    },[poolId, carpoolId])


   useEffect(()=>{
       //listen to update in pool collection
       
       
      if(poolingId && poolHailer){ 
         
        
        
        const poolCollection = collection(db,"pool")
        const poolDoc = doc(poolCollection,poolingId)
     
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
              setValidateMessage("Send a message to your pooler")
           }
           else if(poolHailer.poolHailerStatus === "rejected"){
            setValidate(false)
            setLeaveAMsg(false)
            setValidateMessage("Pooler rejected your offer! Maybe not a macth")
           }else if(data.status === "created" && poolHailer.poolHailerStatus === "cancelled"){
             setValidate(true)
             setLeaveAMsg(false)
             setValidateMessage("Send a message to your pooler")
           }else if(poolHailer.poolHailerStatus === "removed"){
            setValidate(false)
            setLeaveAMsg(false)
             setValidateMessage("pool is closed or cancelled")

           }
           else if(data.status == "created"){
            setValidate(true)
            setLeaveAMsg(true)
            setValidateMessage("Send a message to your pooler")
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
      
      
   
   },[poolingId,poolHailer])


   useEffect(()=>{
    
    if(poolingId){
      
      try {
        const poolCollection = collection(db,"pool")
        const poolDoc = doc(poolCollection,poolingId)
        console.log(poolDoc)
        const poolHailersSubcollection = collection(poolDoc, 'poolHailers') 
        const poolHailerDoc = doc(poolHailersSubcollection, user.id)
     
      
     
        setPoolHailerRef(poolHailerDoc)
        const unsubscribeHaillers = onSnapshot(poolHailerDoc,(snapshot)=>{
          
          if(snapshot.exists()){
            const data  = snapshot.data()
            setPoolHailer(data)
          }else{
            navigate("/notfound")
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


   },[poolingId])


   // opens chat area
   const joinCarpoolGroup = async()=>{
   
      setOpenChat(true)
      // setShowNav(false)

      if(poolHailer.poolHailerStatus === "cancelled"){
        await updateDoc(poolHailerRef,{
          poolHailerStatus:"accepted"
        })
      }
     
  };

  const cancelRide = async() => {
   
    setIsDisabled(true)
     const poolStatus= poolType === "carpool" && {carpoolId: "pending"} || {poolId: "pending"}
     const poolCollection = collection(db,"pool")
     const poolDoc = doc(poolCollection,poolingId)
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
                await updateDoc(userEventDocRef,poolStatus)
                const eventRejectedRidesRef = collection(userEventDocRef,"rejectedRides")
                const eventRejectedRideDocRef = doc(eventRejectedRidesRef,poolingId)
                await setDoc(eventRejectedRideDocRef,{id:poolingId, reason:"unknown"})
              }
 
            }
        }else{
          if(poolHailer.poolHailerStatus === "accepted"){
            await updateDoc(poolHailerDocREf,{
              poolHailerStatus: "cancelled"
              })
          }
          //rejected by poolee when the pooler removes or reject you 
          console.log(userEventDocRef)
          await updateDoc(userEventDocRef,poolStatus)
          
          const eventRejectedRidesRef = collection(userEventDocRef,"rejectedRides")
          const eventRejectedRideDocRef = doc(eventRejectedRidesRef,poolingId)

          if(poolHailer.poolHailerStatus === "rejected"){
            
            await setDoc(eventRejectedRideDocRef,{id:poolingId, reason: "rejected"})
          }else if(poolHailer.poolHailerStatus === "removed"){
            await setDoc(eventRejectedRideDocRef,{id:poolingId, reason: "removed"})
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

  const saveShortMsg = async() => {
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
        setTextareaValue("")
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

      
      isWaiting && <div>Waiting.....</div> ||
       
     <>
     {
        openChat 
          &&  
          <div className='nav-block alt-nav' onClick={()=>setOpenChat(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8.00006 6.93945L1.6361 0.575439L0.575439 1.6361L6.93936 8.00005L0.575439 14.364L1.6361 15.4247L8.00006 9.06075L14.3641 15.4247L15.4247 14.364L9.06076 8.00005L15.4247 1.6361L14.3641 0.575439L8.00006 6.93945Z" fill="white"/>
            </svg>
          </div>

       }
       {
        poolHailer?.poolHailerStatus !== "accepted"
          &&  
          <div className='nav-block alt-nav' onClick={()=>setSwitchScreen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9.41412 11.9999L16.4141 4.9999L14.9999 3.58569L6.58569 11.9999L14.9999 20.4141L16.4141 18.9999L9.41412 11.9999Z" fill="white"/>
            </svg>
          </div>

       }
      <div className="island">
      
       
       {
        
         <>
         <div className="message-div">
            <h4 className="page-title" style={{fontSize:"15px"}}>{`Hi ${user.displayName},`}</h4>
            <p className="popping-300-normal">{validateMessage}</p>
            {validate && leaveAMsg &&<input style={{width:"100%", borderRadius:"10px"}} value={textareaValue} onChange={onChangeTextArea} className="leave-a-msg" placeholder="I can meet you at Berger busstop"></input> }
            {validate && !leaveAMsg && <button style={{width:"100%"}} className="purple-btn" onClick={joinCarpoolGroup}>open chat</button>}
         </div>

        { textareaValue.length > 10 && textareaValue.length < 50 && <button style={{borderRadius:"10px", width:"100%"}} className={ !validate || isDisabled ? "inactive":"purple-btn"} onClick={saveShortMsg} disabled={!validate || isDisabled } >
          
           {validate  && "send" } 
          
         </button>
        }
         <button style={{width:"100%"}} className={isDisabled && "inactive" || "danger-btn"} onClick={cancelRide}  disabled={!poolId || isDisabled}>
           Cancel Ride
         </button>
         </>
 
       }
     
       
       {
         !validate && 
         <p>{validateMessage}</p>
       }
      

      

      </div>
      
      {
        openChat && <ChatApp poolMsgs={poolMsgs} poolMsgsRef={poolMsgsRef} setOpenChat={setOpenChat} poolId={poolingId}/>
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