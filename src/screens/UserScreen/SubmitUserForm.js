
const onNext = async(e)=>{
    e.preventDefault()
    setRequesting(true)
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
        return
    }
    
    const data = {
        waNum: waNumRef.current.value,
        email: emailRef.current.value,
        location: locationRef.current.value,
        convPULoc: convPULocRef.current.value,
        addInfo: addInfoRef.current.value,
        role: updateRole
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
            ...data
            
        }))
        console.log(user)
        // if(user.role){
        
        //check if a userEvent subcat doc exista
        const userEvents = collection(userDoc,"userevents")
        const userEventDoc = doc(userEvents,eventDetails.eventId)
        const userEventDocSnapshot = await getDoc(userEventDoc)
        const userEventDocData = userEventDocSnapshot.exists() ? userEventDocSnapshot.data():null
        
        //execute if userrole doesnt exist or userevents subcollection component "poolId" doesn't exist for role poolee or userevents subcollection component "yourpoolId" doesnt exist for role pooler
        if( (updateRole === "poolee" && !userEventDocData?.hasOwnProperty("poolId")) || (updateRole === "pooler" && !userEventDocData?.hasOwnProperty("yourPoolId")) || !userEventDocSnapshot.exists() ){
            
            // poolinfo : common data
            let poolInfo = {
                ...eventDetails,
                poolerLoc: data.location,
                convPULoc: data.convPULoc,
                requesterId: user.id,
                status: "created",
            }
            
            // create the pool request in db
            const requestCollection = collection(db,"request")
            const requestDoc = doc(requestCollection)
           
            
            if(updateRole === "poolee"){
                //poolee specific data
                poolInfo = {
                    ...poolInfo,
                    seats: 4,
                    poolType: "pool",   
                }
                // create or update new userEvent
                 await setDoc(userEventDoc,{poolId:"pending", eventName: eventDetails.eventName},{ merge: true })
                 
                 
                // send pool request
                await setDoc(requestDoc,poolInfo)
 
                //send carpool request
                poolInfo.poolType = "carpool"
                delete poolInfo.seats
                await setDoc(requestDoc,poolInfo)
                
                //temp
                // await randomRequests()
                
                // poolInfo.requestId = requestDoc.id
                // send queue request to backend server
                //   for(let x = 0; x < 8; x++){
             
                // const res = await axios.post("https://mappool.onrender.com/api/v1/process-pool-request",
                // {
                //     ...poolInfo
                // },
                // {
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //         'Content-Type': 'application/json',
                //     },
                // })
                //   }
            }

            if(updateRole  ==="pooler"){
                // pooler specific data
                poolInfo = {
                    ...poolInfo,
                    seats: Number(data.seatsAvail),
                    costPerSeat: 0,
                    poolType: "carpoolOffer",
                }

                // create or update new userEvent
                await setDoc(userEventDoc,{yourPoolId:"pending", eventName: eventDetails.eventName},{ merge: true })                        
               
                await setDoc(requestDoc,poolInfo)
            }

            console.log(token)

           navigate("/",{state: {requesting:true}}) 
            return
        } else {
            navigate("/")
        }
    } catch (error) {
        console.log(error)
    }
}

export default onNext