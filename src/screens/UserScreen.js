import { useRef, useEffect, useState } from "react"
import { useAuth } from "../contextAPI/AuthContext"
import "../index.css"
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useNavigate } from "react-router-dom"

const UserInfo = ()=>{
    
    const {user, updateRole, setUser} = useAuth()
    const [requesting, setRequesting] = useState(false)
    console.log(updateRole)
    const {waNum, email, location, convPULoc, addInfo,sitsAvail} = user 
    
    const navigate = useNavigate()
    
    const eventDetails = {
        eventId : "sundayservice",
        eventName: "CCI sunday service"  ,        
        eventDate: "sundays",     
        eventTime: "10am",
        eventLocation : "cci church",
    }
 
    //form ref

  

    const waNumRef = useRef();
    const emailRef = useRef();
    const locationRef = useRef();
    const convPULocRef = useRef();
    const addInfoRef = useRef();
    const sitsAvailRef = useRef();

     useEffect(() => {

        if( updateRole == "pooler"  || (!updateRole && user.role == "pooler" ))
            sitsAvailRef.current.value = sitsAvail || "";

        waNumRef.current.value = waNum || "" ;
        emailRef.current.value = email;
        locationRef.current.value = location || "";
        convPULocRef.current.value = convPULoc || "";
        addInfoRef.current.value = addInfo || "";
        
      }, []);


    // submit user info update 
     const onNext = async(e)=>{
         e.preventDefault()
         
        
        const data = {
          waNum: waNumRef.current.value,
          email: emailRef.current.value,
          location: locationRef.current.value,
          convPULoc: convPULocRef.current.value,
          addInfo: addInfoRef.current.value,
          role: updateRole || user.role
        }

        if(updateRole =="pooler")
            data.sitsAvail = sitsAvailRef.current.value

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

                console.log(user.role)
                if( (user.role === "poolee" && !userEventDocData?.hasOwnProperty("poolId")) || (user.role === "pooler" && !userEventDocData?.hasOwnProperty("yourPoolId")) || !userEventDocSnapshot.exists() ){
                    setRequesting(true)
                    console.log("pooooolerrrr")
                    let poolInfo = {
                        ...eventDetails,
                        poolerLoc: data.location,
                        convPULoc: data.convPULoc,
                        poolOwnerId: user.id,
                        status: "created",
                        createdAt: serverTimestamp()
                    }

                    const poolCollection = collection(db,"pool")
                    const poolDoc = doc(poolCollection)
                         
                      // create new pool
                    await setDoc(poolDoc,poolInfo)

                    if(user.role === "poolee"){

                        poolInfo = {
                            ...poolInfo,
                            seats: 4,
                            passangerId: [user.id],
                            poolType: "pool",
                            
                        }
                        // create or update new userEvent
                    await setDoc(userEventDoc,{poolId:poolDoc.id, eventName: eventDetails.eventName},{ merge: true })
                    }
    
                  
                    if(user.role ==="pooler"){
                        
                        poolInfo = {
                            ...poolInfo,
                            seats: data.sitsAvail,
                            costPerSeat: 0,
                            poolType: "carpool",
                        }

                        // create or update new userEvent
                       await setDoc(userEventDoc,{yourPoolId:poolDoc.id, eventName: eventDetails.eventName},{ merge: true })
                       
                    }

                   
                    
                    
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
            
            <input placeholder="Whatsapp number" ref={waNumRef} required></input>
            <input placeholder="Email" ref={emailRef} required></input>
            <input placeholder="Location" ref={locationRef} required></input>
            <input placeholder="Convenient pick-up location" ref={convPULocRef} required></input>
            <input placeholder="Additional info" ref={addInfoRef} required></input>
            

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
           <input placeholder="Whatsapp number" ref={waNumRef} required></input>
            <input placeholder="Email" ref={emailRef} required></input>
            <input placeholder="Location" ref={locationRef} required></input>
            <input placeholder="Convenient pick-up location" ref={convPULocRef} required></input>
            <input placeholder="Additional info" ref={addInfoRef} required></input>
            <input placeholder="Sits available" ref={sitsAvailRef} required></input>
           

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