
import { useLocation, useNavigate } from "react-router-dom"
import "../../index.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../contextAPI/AuthContext"
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/config"

const Contact = ()=>{

    const location = useLocation()
    const[requesting, setRequesting] = useState(false)
    const [poolId, setPoolId] = useState(null)
    const [poolRef, setPoolRef] = useState(null)
    const {user, updateRole} = useAuth() 
    const [type, setType] = useState(null)
    const [validate, setValidate] = useState(false)
    const [validateMessage, setValidateMessage] = useState("")
    const [poolStatus, setPoolStatus] = useState(null)
    const [eventDocRef, seteventDocRef] = useState(null)
    const [confirmedReject, setConfirmedReject] = useState(true)
    const [leaveAMsg,setLeaveAMsg] = useState(false)
    const [showTextArea, setShowTextArea] = useState(false)
    const [textareaValue, setTextareaValue] = useState('');
    const [buttonMsg, setButtonMsg] = useState("Too short")
    const [poolHailerStatus, setPoolHailerStatus] = useState(null)
    const navigate = useNavigate()
   

    
    
   
    useEffect(()=>{
       console.log("heres")
      const getEventDoc = async()=>{

          const usersCollection = collection(db, "users")
          const userDoc = doc(usersCollection,user.id)
          const userEvents = collection(userDoc,"userevents")
          const userEventDoc = doc(userEvents,localStorage.getItem("eventId"))

          seteventDocRef(userEventDoc)
          const userEventDocData= await getDoc(userEventDoc)
          const data = userEventDocData.data()
          if(data){
          
            const poolStatus = data.poolId;
            const carPoolStatus = data.carpoolId;
           
            if (poolStatus && poolStatus !== 'pending') {
              // Handle the case where the "status" field changes from "pending"
              setType("pool")
              setPoolId(poolStatus)

            }
            else if( carPoolStatus && carPoolStatus !== "pending"){
              setType("carpool")
              setPoolId(carPoolStatus)
            }

          }else{
              console.log('Document does not exist');
    
            }

      }
    
      getEventDoc()
      
   
    },[])


   useEffect(()=>{
       //listen to update in pool collection
   
      if(poolId){ 
        console.log(poolId)
        const poolCollection = collection(db,"pool")
        const poolDoc = doc(poolCollection,poolId)
     
       setPoolRef(poolDoc)
       const  unsubscribePool = onSnapshot(poolDoc,(docSnapshot)=>{
         if(docSnapshot.exists()){

           const data  = docSnapshot.data()
           const poolStatus = data.status
          
           
           setPoolStatus(poolStatus)
           if((poolStatus === "created" || poolStatus === "closed") && poolHailerStatus === "accepted" ){
              setValidate(true)
              setLeaveAMsg(false)
           }
           else if(poolHailerStatus === "rejected"){
            setValidate(false)
            setLeaveAMsg(false)
            setValidateMessage("Pooler rejected your offer! Maybe not a macth")
           }
           else if(poolStatus == "created"){
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
       })

       return ()=> unsubscribePool()
      
      }
      
      
   
   },[poolId,poolHailerStatus])


   useEffect(()=>{

    if(poolId){
      
      const poolCollection = collection(db,"pool")
      const poolDoc = doc(poolCollection,poolId)
      const poolHailersSubcollection = collection(poolDoc, 'poolHailers') 
      const poolHailerDoc = doc(poolHailersSubcollection, user.id)
        const unsubscribeHaillers = onSnapshot(poolHailerDoc,(snapshot)=>{
          
           if(snapshot.exists()){
            
            const data  = snapshot.data()
            console.log(data)
            const status = data.poolHailerStatus
            if(status){
              console.log(status)
              setPoolHailerStatus(status)
            }
           }
        })


    return ()=> unsubscribeHaillers()
    }


   },[poolId])


   const joinCarpoolGroup = ()=>{
     if(leaveAMsg){
        setShowTextArea(true)
     }else{
       console.log("joining...")
     }
     
  };

  const cancelRide = async() => {

     const poolStatus= type === "carpool" && {carpoolId: "pending"} || {poolId: "pending"}
     const poolCollection = collection(db,"pool")
     const poolDoc = doc(poolCollection,poolId)
     const poolHailersSubcollection = collection(poolDoc, 'poolHailers') 
     const poolHailerDocREf = doc(poolHailersSubcollection,user.id)

     await deleteDoc(poolHailerDocREf)

     if(type){
        if(validate){
            if(confirmedReject){
          
                await updateDoc(eventDocRef,poolStatus)
            
            }
        }else{
            await updateDoc(eventDocRef,poolStatus)
  
       }
       
     }
     navigate("/")
     

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
      console.log("yas")
      const poolHailersSubcollection = collection(poolRef, 'poolHailers')
      const newHailerDocRef = doc(poolHailersSubcollection, user.id);

      
  
              //create data for hailer
  
      const hailerData = {
        shortMsg: textareaValue
      }
      
      console.log(hailerData)
  
      await updateDoc(newHailerDocRef, hailerData)
       
       setShowTextArea(false)
    }
     
   

  }


    return(
     <>
     
      <div className="container">
      <h3>Contact your {type === 'carpool' ? 'ride' : 'pool group'}</h3>
       
       {
        showTextArea &&
         <>
         <textarea value={textareaValue} onChange={onChangeTextArea} className="leave-a-msg" placeholder="I can meet you at Berger busstop"></textarea>

         </>
         ||
         <>
         <button className={(validate) ? "group-btn":"inactive"} onClick={joinCarpoolGroup} disabled={!validate} >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
           <path fill-rule="evenodd" clip-rule="evenodd" d="M0.184299 19.3314C0.102479 19.6284 0.372969 19.9025 0.671019 19.8247L5.27836 18.6213C6.73272 19.409 8.37012 19.8275 10.0372 19.8275H10.0422C15.5282 19.8275 20.0001 15.3815 20.0001 9.9163C20.0001 7.26735 18.9661 4.77594 17.0864 2.90491C15.2066 1.03397 12.7085 0 10.0421 0C4.55619 0 0.0842292 4.44605 0.0842292 9.9114C0.0835992 11.65 0.542519 13.3582 1.41491 14.8645L0.184299 19.3314ZM2.86104 15.2629C2.96786 14.8752 2.91449 14.4608 2.71293 14.1127C1.97278 12.8348 1.5837 11.3855 1.58423 9.9114C1.58423 5.28158 5.3775 1.5 10.0421 1.5C12.312 1.5 14.4297 2.37698 16.0282 3.96805C17.6249 5.55737 18.5001 7.66611 18.5001 9.9163C18.5001 14.5459 14.7069 18.3275 10.0422 18.3275H10.0372C8.62072 18.3275 7.22875 17.9718 5.99278 17.3023C5.65826 17.1211 5.26738 17.0738 4.89928 17.17L2.13688 17.8915L2.86104 15.2629Z" fill="white"/>
           </svg>
           {validate && ( leaveAMsg && "Leave a message"||"Join group" ) || "oops!"}
         </button>

         </>
 
       }
       {
        showTextArea &&
         <button className={(textareaValue.length <10 || textareaValue.length>50) && "inactive"} onClick={saveShortMsg} disabled={textareaValue.length <10 || textareaValue.length>50}>{buttonMsg}</button>
         ||
         <>
         <button className={"danger-btn"} onClick={cancelRide}  disabled={!poolId}>
             { !validate && "Back" || "Cancel Ride"}
         </button>
   
         </>
 
       }
       
       {
         !validate &&
         <p>{validateMessage}</p>
       }
       {
        showTextArea &&
        <p>You can leave a message for the pooler to stand a better chance of being picked. The shorter the better</p>
       }

      </div>
      </>
    )

}

export default Contact