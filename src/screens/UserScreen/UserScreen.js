import { useRef, useEffect, useState } from "react"
import { useAuth } from "../../contextAPI/AuthContext"
import "../../index.css"
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useMsg } from "../../contextAPI/MsgContext"
// import { randomRequests } from "../util.mjs"

const UserInfo = ()=>{
    
    const {user, updateRole, setUser,token,setUpdateRole} = useAuth()
    // const [requesting, setRequesting] = useState(false)
    const [waNumError, setWaNumError] = useState(null)
    const [emailError, setEmailError] = useState(null)
    const [locationError, setLocationError] = useState(null)
    const [convPULocError, setConvPULocError] = useState(null)
    const [addInfoError, setAddInfoError] = useState(null)
    const [seatsAvailError, setSeatsAvailError] = useState(null)
    const [seatCostError, setSeatCostError] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)

    const {waNum, email, location, convPULoc, addInfo, seatsAvail: seatsAvail, seatsCost: seatsCost} = user 
    
    const navigate = useNavigate()
    const eventId = localStorage.getItem("eventId")
    const eventName = localStorage.getItem("eventName") 
    const eventRole = localStorage.getItem("updateRole")
    const {setMsgType} = useMsg()

    const eventDetails = {
        eventId,
        eventName,       
    }
    
    //form ref
    
    const waNumRef = useRef()
    const emailRef = useRef()
    const locationRef = useRef()
    const convPULocRef = useRef()
    const addInfoRef = useRef()
    const seatsAvailRef = useRef()
    const seatCostRef = useRef()
    
    useEffect(() => {

        setMsgType("normal")

        if(!eventId || !eventName || !eventRole){
            navigate("/notfound")
        }
        
        // removed user.role
         setUpdateRole(eventRole)
         //|| localStorage.getItem("updateRole") == "pooler"


        if( updateRole == "pooler") {
          
            seatsAvailRef.current.value = seatsAvail || ""
            seatCostRef.current.value = seatsCost || ""
        }
        waNumRef.current.value = waNum || "" 
        emailRef.current.value = email
        locationRef.current.value = location || ""
        convPULocRef.current.value = convPULoc || ""
        addInfoRef.current.value = addInfo || ""

        
        
    }, [])
    
    function validateWhatsAppNumber(value) {
        if (!value.match(/^\d{11}$/)) {
            return 'WhatsApp number must be 10 digits'
        }
        return null
    }
    
    
    function validateEmail(value) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if (!value.match(emailRegex)) {
            return 'Invalid email address'
        }
        return null
    }
    
    function validateLocation(value) {
        if (value.trim() === '') {
            return 'Location is required'
        }
        return null
    }
    
    function validateConvenientPickUpLocation(value) {
        // Remove leading and trailing whitespace from the input
        value = value.trim();
        
        // Split the input by comma and trim each part
        const locations = value.split(',').map(part => part.trim());
      
        // Check if there are more than 3 locations
        if (locations.length > 3) {
          return 'You can only specify up to 3 convenient pickup locations separated by a comma';
        }
      
        return null
      }            
    
    function validateAdditionalInfo(value) {
        if (value.length > 200) {
            return 'Additional info should not exceed 200 characters'
        }
        return null
    }

    function validateSeatsAvailable(value) {
        if (isNaN(value)) {
            return 'Seats available must be a number';
          }
        return null
    }

    function validateSeatCost(value) {
        if (isNaN(value)) {
            return 'Seats available must be a number';
          }
        return null
    }
    
    // submit user info update 
    const onNext = async(e)=>{
        e.preventDefault()
        
        setIsDisabled(true)
        // Validate WhatsApp number
        const waNumError = validateWhatsAppNumber(waNumRef.current.value)
        setWaNumError(waNumError)

        // Validate email
        const emailError = validateEmail(emailRef.current.value)
        setEmailError(emailError)

        // Validate location
        const locationError = validateLocation(locationRef.current.value)
        setLocationError(locationError)

        // Validate convenient pick-up location
        const convPULocError = validateConvenientPickUpLocation(convPULocRef.current.value)
        setConvPULocError(convPULocError)

        // Validate additional info
        const addInfoError = validateAdditionalInfo(addInfoRef.current.value)
        setAddInfoError(addInfoError)

        // If any error exists, prevent form submission
        if (waNumError || emailError || locationError || convPULocError || addInfoError) {
            setIsDisabled(false)
            return
        }
        
        const data = {
            waNum: waNumRef.current.value,
            email: emailRef.current.value,
            location: locationRef.current.value,
            convPULoc: convPULocRef.current.value,
            addInfo: addInfoRef.current.value,
        }
        
        if(updateRole == "pooler") {
            data.seatsAvail = seatsAvailRef.current.value
            data.seatsCost = seatCostRef.current.value
            const seatsAvailError = validateSeatsAvailable(seatsAvailRef.current.value)
            setSeatsAvailError(seatsAvailError)

            const seatCostError = validateSeatCost(seatCostRef.current.value)
            setSeatCostError(seatCostError)
            if (seatsAvailError || seatCostError) {
                return
            }
        }
        // setRequesting(true)
        const usersCollection = collection(db, "users")
        
        const userDoc = doc(usersCollection,user.id)


        
        try {
            // await setDoc(userDoc, data) 
            // update user info
            
            if(!user.approved && user.approved !== false){
                 //create permision

                const permissionCollectionRef = collection(db,"permissions")
                const permisionRef = doc(permissionCollectionRef,user.id)

                await setDoc(permisionRef,{
                    name: user.displayName,
                    role: updateRole,
                    approved: false
                })
            } 
            await updateDoc(userDoc,data)
            //update user in AuthContext

            
            setUser((prev)=>({
                ...prev,
                ...data
                
            }))
            console.log(user)
            // if(user.role){
            
            //check if a userEvent subcat doc exista
        const userEvents = collection(userDoc,"userevents")
        const userEventDoc = doc(userEvents,eventDetails.eventId)
        const userEventDocSnapshot = await getDoc(userEventDoc)
        const userEventDocData = userEventDocSnapshot.exists() ? userEventDocSnapshot.data():null
        
        // poolinfo : common data
        let poolInfo = {
            ...eventDetails,
            poolerLoc: data.location,
            convPULoc: data.convPULoc,
            poolAdmin: user.id,
            status: "created",
        }
         // create the pool request in db
         const poolCollection = collection(db,"pool")
         const poolDoc = doc(poolCollection)
        
 

        if(updateRole === "poolee" && (!userEventDocData?.hasOwnProperty("poolId") || !userEventDocData?.hasOwnProperty("carpoolId")) ){
           
            if(!userEventDocData?.hasOwnProperty("poolId") && !userEventDocData?.hasOwnProperty("carpoolId")){
                if(!userEventDocSnapshot.exists()){
                    // create or update new userEvent
                    await setDoc(userEventDoc,{poolId:"pending",carpoolId:"pending", role: updateRole, eventName: eventDetails.eventName},{ merge: true })
                }else{
                    await setDoc(userEventDoc,{poolId:"pending",carpoolId:"pending",role: updateRole},{ merge: true })
                }

                
            }
            
            else if(!userEventDocData?.hasOwnProperty("poolId") ){
               

                // if user events doesnt exist, create one, else update existing event

                if(!userEventDocSnapshot.exists()){
                    // create or update new userEvent
                    await setDoc(userEventDoc,{poolId:"pending", eventName: eventDetails.eventName, role: updateRole,},{ merge: true })
                }else{
                    await setDoc(userEventDoc,{poolId:"pending",role: updateRole,},{ merge: true })
                }
                 //implement maybe later
                // poolInfo = {
                //     ...poolInfo,
                //     seats: 4,
                //     poolType: "pool",   
                // } 
                //implement later
                // await setDoc(poolDoc,poolInfo)

            }
            else if(!userEventDocData?.hasOwnProperty("carpoolId")){
               

                // if user events doesnt exist, create one, else update existing event

                if(!userEventDocSnapshot.exists()){
                    // create or update new userEvent
                    await setDoc(userEventDoc,{carpoolId:"pending", eventName: eventDetails.eventName,role: updateRole},{ merge: true })
                }else{
                    await setDoc(userEventDoc,{carpoolId:"pending",role: updateRole},{ merge: true })
                }
             
                 //implement maybe later
                // poolInfo = {
                //     ...poolInfo,
                //     poolType: "carpool",   
                // } 
                //implement maybe later
                // await setDoc(poolDoc,poolInfo)
            }
            navigate("/") 

        }else if(updateRole === "pooler" && !userEventDocData?.hasOwnProperty("yourPoolId")){
            // pooler specific data
            poolInfo = {
                ...poolInfo,
                seats: Number(data.seatsAvail),
                costPerSeat: 0,
                poolType: "carpoolOffer",
            }
            
            if(!userEventDocSnapshot.exists()){
            // create or update new userEvent
                await setDoc(userEventDoc,{yourPoolId:poolDoc.id, eventName: eventDetails.eventName,role: updateRole},{ merge: true })                        
            }
            else{
                await setDoc(userEventDoc,{yourPoolId:poolDoc.id, role: updateRole},{ merge: true }) 
            }
            await setDoc(poolDoc,poolInfo)
            navigate("/") 

        }else{
            console.log(updateRole)
            await setDoc(userEventDoc,{role: updateRole},{ merge: true })   
            navigate("/")
        }

           
            
            //execute if userrole doesnt exist or userevents subcollection component "poolId" doesn't exist for role poolee or userevents subcollection component "yourpoolId" doesnt exist for role pooler
            // if( (updateRole === "poolee" && !userEventDocData?.hasOwnProperty("poolId")) || (updateRole === "pooler" && !userEventDocData?.hasOwnProperty("yourPoolId")) || !userEventDocSnapshot.exists() ){
                
            //     // poolinfo : common data
            //     let poolInfo = {
            //         ...eventDetails,
            //         poolerLoc: data.location,
            //         convPULoc: data.convPULoc,
            //         requesterId: user.id,
            //         status: "created",
            //     }
                
            //     // create the pool request in db
            //     const poolCollection = collection(db,"request")
            //     const poolDoc = doc(poolCollection)
               
                
            //     if(updateRole === "poolee"){
            //         //poolee specific data
            //         poolInfo = {
            //             ...poolInfo,
            //             seats: 4,
            //             poolType: "pool",   
            //         }
            //         // create or update new userEvent
            //          await setDoc(userEventDoc,{poolId:"pending", eventName: eventDetails.eventName},{ merge: true })
                     
                     
            //         // send pool request
            //         await setDoc(poolDoc,poolInfo)
     
            //         //send carpool request
            //         poolInfo.poolType = "carpool"
            //         delete poolInfo.seats
            //         await setDoc(poolDoc,poolInfo)
                    
            //         //temp
            //         // await randomRequests()
                    
            //         // poolInfo.requestId = poolDoc.id
            //         // send queue request to backend server
            //         //   for(let x = 0; x < 8; x++){
                 
            //         // const res = await axios.post("https://mappool.onrender.com/api/v1/process-pool-request",
            //         // {
            //         //     ...poolInfo
            //         // },
            //         // {
            //         //     headers: {
            //         //         'Authorization': `Bearer ${token}`,
            //         //         'Content-Type': 'application/json',
            //         //     },
            //         // })
            //         //   }
            //     }

            //     if(updateRole  ==="pooler"){
            //         // pooler specific data
            //         poolInfo = {
            //             ...poolInfo,
            //             seats: Number(data.seatsAvail),
            //             costPerSeat: 0,
            //             poolType: "carpoolOffer",
            //         }

            //         // create or update new userEvent
            //         await setDoc(userEventDoc,{yourPoolId:"pending", eventName: eventDetails.eventName},{ merge: true })                        
                   
            //         await setDoc(poolDoc,poolInfo)
            //     }

            //     console.log(token)

            //    navigate("/",{state: {requesting:true}}) 
            //     return
            // } else {
            //     navigate("/")
            // }
        } catch (error) {
            console.log(error)
            setMsgType("failure")
            setIsDisabled(false)
        }
    }
    
    //switch to role screen
    const onChangeRole = async()=>{
         navigate("/role")
    }

    return (    
        // requesting ?
  
        // <div className="container">
        // <h3>You are being paired</h3>
        // <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
        // <circle cx="50" cy="50" r="48.75" stroke="url(#paint0_linear_7_243)" stroke-width="2.5"/>
        // <defs>
        // <linearGradient id="paint0_linear_7_243" x1="78.5" y1="75.5" x2="93.5" y2="66" gradientUnits="userSpaceOnUse">
        // <stop stop-color="#1FD431"/>
        // <stop offset="0.95568" stop-color="#1FD431" stop-opacity="0"/>
        // </linearGradient>
        // </defs>
        // </svg>
        // <h5>You will be notified once we pair you</h5>
        // </div>
     
        // :
        <>
        <h3>{eventName}</h3>
        <form onSubmit={onNext}>
        <div className="container" >
            <h3>Let's pair you</h3>
            
            <input placeholder="Whatsapp number" ref={waNumRef} required/>
            <div className="error-message">{waNumError}</div>
            
            <input placeholder="Email" ref={emailRef} required/>
            <div className="error-message">{emailError}</div>

            <input placeholder="Location" ref={locationRef} required/>
            <div className="error-message">{locationError}</div>

            <input placeholder="Convenient pick-up location" ref={convPULocRef} required/>
            <div className="error-message">{convPULocError}</div>

            <input placeholder="Additional info" ref={addInfoRef} required/>
            <div className="error-message">{addInfoError}</div>
           
            {
            (updateRole == "pooler" || localStorage.getItem("updateRole")  == "pooler"  )&& 
            <>
                <input placeholder="Seats available" ref={seatsAvailRef} required/>
                <div className="error-message">{seatsAvailError}</div>

                <input placeholder="How much would a seat cost?" ref={seatCostRef} required/>
                <div className="error-message">{seatCostError}</div>
            </>
            }
        </div>
        <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button className={isDisabled && "inactive"} disabled={isDisabled}>Looks Good</button>
        <button className={isDisabled && "inactive"} onClick={onChangeRole} disabled={isDisabled}>Change Role</button>
        </div>
        </form>  
        </>   
    )
}
    
export default UserInfo
