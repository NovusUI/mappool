import { useRef, useEffect, useState } from "react"
import { useAuth } from "../contextAPI/AuthContext"
import "../index.css"
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const UserInfo = ()=>{
    
    const {user, updateRole, setUser} = useAuth()
    const [requesting, setRequesting] = useState(false)
    const [waNumError, setWaNumError] = useState(null)
    const [emailError, setEmailError] = useState(null)
    const [locationError, setLocationError] = useState(null)
    const [convPULocError, setConvPULocError] = useState(null)
    const [addInfoError, setAddInfoError] = useState(null)
    const [seatsAvailError, setSeatsAvailError] = useState(null)
    console.log(updateRole)
    const {waNum, email, location, convPULoc, addInfo,sitsAvail: seatsAvail} = user 
    
    const navigate = useNavigate()
    
    const eventDetails = {
        eventId : "sundayservice",
        eventName: "CCI sunday service"  ,        
        eventDate: "sundays",     
        eventTime: "10am",
        eventLocation : "cci church",
    }
    
    //form ref
    
    const waNumRef = useRef()
    const emailRef = useRef()
    const locationRef = useRef()
    const convPULocRef = useRef()
    const addInfoRef = useRef()
    const seatsAvailRef = useRef()
    
    useEffect(() => {
        
        if( updateRole == "pooler"  || (!updateRole && user.role == "pooler" ))
        seatsAvailRef.current.value = seatsAvail || ""
        
        waNumRef.current.value = waNum || "" 
        emailRef.current.value = email
        locationRef.current.value = location || ""
        convPULocRef.current.value = convPULoc || ""
        addInfoRef.current.value = addInfo || ""
        
    }, [])
    
    function validateWhatsAppNumber(value) {
        if (!value.match(/^\d{10}$/)) {
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
        if (value.trim() === '') {
            return 'Convenient pick-up location is required'
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
    
    // submit user info update 
    const onNext = async(e)=>{
        e.preventDefault()

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

        const seatsAvailError = validateAdditionalInfo(seatsAvailRef.current.value)
        setSeatsAvailError(seatsAvailError)

        // If any error exists, prevent form submission
        if (waNumError || emailError || locationError || convPULocError || addInfoError) {
            return
        }
        
        const data = {
            waNum: waNumRef.current.value,
            email: emailRef.current.value,
            location: locationRef.current.value,
            convPULoc: convPULocRef.current.value,
            addInfo: addInfoRef.current.value,
            role: updateRole || user.role
        }
        
        if(updateRole == "pooler") {
            data.seatsAvail = seatsAvailRef.current.value
            if (seatsAvailError) {
                return
            }
        }
        
        const usersCollection = collection(db, "users")
        
        const userDoc = doc(usersCollection,user.id)
        
        try {
            // await setDoc(userDoc, data) 
            // update user info
            await updateDoc(userDoc,data)
            //update user in AuthContext
            console.log(updateRole, user.role)
            setUser((prev)=>({
                ...prev,
                role: updateRole || user.role
            }))
            console.log(user)
            // if(user.role){
            
            //check if a userEvent subcat doc exista
            const userEvents = collection(userDoc,"userevents")
            const userEventDoc = doc(userEvents,"sundayService")
            const userEventDocSnapshot = await getDoc(userEventDoc)
            const userEventDocData = userEventDocSnapshot.exists() ? userEventDocSnapshot.data():null
            
            //execute if userrole doesnt exist or userevents subcollection component "poolId" doesn't exist for role poolee or userevents subcollection component "yourpoolId" doesnt exist for role pooler
            if( (user.role === "poolee" && !userEventDocData?.hasOwnProperty("poolId")) || (user.role === "pooler" && !userEventDocData?.hasOwnProperty("yourPoolId")) || !userEventDocSnapshot.exists() ){
                setRequesting(true)
                
                // poolinfo : common data
                let poolInfo = {
                    ...eventDetails,
                    poolerLoc: data.location,
                    convPULoc: data.convPULoc,
                    poolOwnerId: user.id,
                    status: "created",
                    createdAt: serverTimestamp()
                }
                  
                if(user.role === "poolee"){
                    //poolee specific data
                    poolInfo = {
                        ...poolInfo,
                        seats: 4,
                        passangerId: [user.id],
                        poolType: "pool",
                        
                    }
                    // create or update new userEvent
                    const requestCollection = collection(db,"pool")
                    const requestDoc = doc(requestCollection)
                    
                    // create new pool
                    await setDoc(requestDoc,poolInfo)
                    await setDoc(userEventDoc,{poolId:"pending", eventName: eventDetails.eventName},{ merge: true })
                    
                    poolInfo.requestType = "pool"
                    // send queue request to backend server    
                }
                    
                if(user.role ==="pooler"){
                    // pooler specific data
                    poolInfo = {
                        ...poolInfo,
                        seats: data.sitsAvail,
                        costPerSeat: 0,
                        poolType: "carpool",
                    }
                    
                    const poolCollection = collection(db,"pool")
                    const poolDoc = doc(poolCollection)
                    
                    // create new pool
                    await setDoc(poolDoc,poolInfo)
          
                    // create or update new userEvent
                    await setDoc(userEventDoc,{yourPoolId:poolDoc.id, eventName: eventDetails.eventName},{ merge: true })
                    
                    poolInfo.requestType = "ride"
                }
                
                const res = await axios.post("localhost:4000/api/vi/poolrequest",
                {
                    poolInfo
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.getIdToken()}`,
                        'Content-Type': 'application/json',
                    },
                })

                user.role ? navigate("/",{state: {requesting:true}}) : navigate("/contactride", {state: {requesting:true}})
                return
                
            }else{
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    //switch to role screen
    const onChangeRole = async()=>{
        user.role ? navigate("/role") : navigate("/")
    }

    return (    
        requesting ?
        <div className="container">
        <h3>You are being paired</h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48.75" stroke="url(#paint0_linear_7_243)" stroke-width="2.5"/>
        <defs>
        <linearGradient id="paint0_linear_7_243" x1="78.5" y1="75.5" x2="93.5" y2="66" gradientUnits="userSpaceOnUse">
        <stop stop-color="#1FD431"/>
        <stop offset="0.95568" stop-color="#1FD431" stop-opacity="0"/>
        </linearGradient>
        </defs>
        </svg>
        <h5>You will be notified once we pair you</h5>
        </div>
        :
        updateRole == "poolee"  || (!updateRole && user.role == "poolee" ) ?
        <>   
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
        
        
        </div>
        <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button>Next</button>
        <button onClick={onChangeRole}>Change Role</button>
        </div>
        </form>
        </>
        :
        <>   
        <form  onSubmit={onNext}>
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

        <input placeholder="Seats available" ref={seatsAvailRef} required/>
        <div className="error-message">{seatsAvailError}</div>
        
        
        </div>
        <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button>Next</button>
        <button onClick={onChangeRole}>Change Role</button>
        </div>
        </form>
        </>
    )
}
    
export default UserInfo