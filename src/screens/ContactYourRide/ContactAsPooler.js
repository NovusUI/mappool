
import { useEffect, useState } from "react"
import "../../index.css"
import { useNavigate } from "react-router-dom"
import { db } from "../../firebase/config"
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useAuth } from "../../contextAPI/AuthContext"

const ContactAsPooler = ()=>{
    const navigate = useNavigate()
    const [carpoolCreated, setCarPoolCreated] = useState(false)
    const [poolWhatsAppLink, setPoolWhatsAppLink] = useState(null)
    const [showWhatsAppInput, setShowWhatsAppInput] = useState(false)
    const [whatsappInput, setWhatsAppInput] = useState("")
    const [poolId, setPoolId] = useState(null)
    const {user} = useAuth()

    //usereventref

    
    // listen to update in userevents doc snapshot

    const usersCollection = collection(db, "users")
    const userDoc = doc(usersCollection,user.id)
    const userEvents = collection(userDoc,"userevents")
    const userEventDoc = doc(userEvents,"B7zLmJxJM5ZAgA6Tzn9M")

    const unsubscribeUserEvents = onSnapshot(userEventDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const yourPoolStatus = data.yourPoolId;
        
         
          
      
          if (yourPoolStatus  && yourPoolStatus  !== 'pending') {
            // Handle the case where the "status" field changes from "pending"
            setCarPoolCreated(true)
            setPoolId(yourPoolStatus)

          }
   
        } else {
          console.log('Document does not exist');
          setCarPoolCreated(false)
        }
      });

      useEffect(()=>{
        //listen to update in pool collection
       if(poolId){ 
         console.log(poolId)
        const poolCollection = collection(db,"pool")
        const poolDoc = doc(poolCollection,poolId)
        const  unsubscribePool = onSnapshot(poolDoc,(docSnapshot)=>{
          if(docSnapshot.exists()){
 
            const data  = docSnapshot.data()
            const whatsappLink = data.whatsappLink
 
            if(whatsappLink){
             setShowWhatsAppInput(false)
             setPoolWhatsAppLink(whatsappLink)
        
            }
          }else{
           
          }
        })}
 
    
    },[poolId])


    const handleInputChange = (event) => {
        const newValue = event.target.value; // Get the new input value
        setWhatsAppInput(newValue); // Update the state with the new value
      };

     const onSubmitLinkPool = async()=>{
        alert("clicked")
        if(poolWhatsAppLink){
         setShowWhatsAppInput(false)
          window.open(poolWhatsAppLink, '_blank');
        }
        else if(showWhatsAppInput && whatsappInput.length > 10){
         setShowWhatsAppInput(false)
         const poolCollection = collection(db,"pool")
         const poolDoc = doc(poolCollection,poolId)
         
         await updateDoc(poolDoc,{whatsappLink: whatsappInput})
         
        }else{
         setShowWhatsAppInput(true)
        }
      }
  
    return(
        <>
        <div className="container">
            <h3>Contact your pool</h3>
            {
            showWhatsAppInput && !poolWhatsAppLink && <input placeholder="paste whatsapp link here" value={whatsappInput} onChange={handleInputChange} required></input>
            }
            <button className="social-login-btn" style={ carpoolCreated ? {backgroundColor:"#78A9FA"}:{backgroundColor:"#3F4246"}} disabled={!carpoolCreated} onClick={onSubmitLinkPool}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.184299 19.3314C0.102479 19.6284 0.372969 19.9025 0.671019 19.8247L5.27836 18.6213C6.73272 19.409 8.37012 19.8275 10.0372 19.8275H10.0422C15.5282 19.8275 20.0001 15.3815 20.0001 9.9163C20.0001 7.26735 18.9661 4.77594 17.0864 2.90491C15.2066 1.03397 12.7085 0 10.0421 0C4.55619 0 0.0842292 4.44605 0.0842292 9.9114C0.0835992 11.65 0.542519 13.3582 1.41491 14.8645L0.184299 19.3314ZM2.86104 15.2629C2.96786 14.8752 2.91449 14.4608 2.71293 14.1127C1.97278 12.8348 1.5837 11.3855 1.58423 9.9114C1.58423 5.28158 5.3775 1.5 10.0421 1.5C12.312 1.5 14.4297 2.37698 16.0282 3.96805C17.6249 5.55737 18.5001 7.66611 18.5001 9.9163C18.5001 14.5459 14.7069 18.3275 10.0422 18.3275H10.0372C8.62072 18.3275 7.22875 17.9718 5.99278 17.3023C5.65826 17.1211 5.26738 17.0738 4.89928 17.17L2.13688 17.8915L2.86104 15.2629Z" fill="white"/>
                </svg>
                {(showWhatsAppInput) ? "Submit": poolWhatsAppLink ? "Join Group":"Create group" }
            </button>
            {carpoolCreated && !poolWhatsAppLink &&

            <p>We found some people that would Love to join you! 
               They are waiting for you to create a group 😊
            </p> 
            }
            {carpoolCreated && poolWhatsAppLink &&

            <p>
                Join the group to connect with others.
            </p> 
            }
            
            {
                !carpoolCreated &&
                <p>You'll receive a notification once we find
            a match.</p> 
            }

            {/* <button className="danger-btn" >Deactivate ride</button> */}
        </div> 
        <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button onClick={()=> navigate("/role")}>Switch Role</button>
        </div> 
        
        </>
    )
}

export default ContactAsPooler