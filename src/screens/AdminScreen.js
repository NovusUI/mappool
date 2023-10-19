import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contextAPI/AuthContext";
import "../index.css"




    const AdminScreen = ()=>{
       
        const {user, updateRole, setUser,token} = useAuth()
        const [poolRequests, setpoolRequests] = useState([])
        const [magodoLength, setmagodoLength] = useState(0)
        const [carpoolRequests, setcarpoolRequests] = useState([])
        const [carpoolOffers, setcarpoolOffers] = useState([])

        const getRequests = async() => { 
         
            try {
                const requestCollection = collection(db, "request")
                const statusQuery = query(requestCollection, where("status", "==", "created"));
                const querySnapshot = await getDocs(statusQuery)

                const poolRequests = [];
                const carpoolRequests = []
                const carpoolOffers =[]
                let magodoCount =0
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    
                    if(data.poolType === "pool")
                        poolRequests.push({ id: doc.id, ...data })
                    else if(data.poolType === "carpool")
                        carpoolRequests.push({ id: doc.id, ...data })
                    else if(data.poolType === "carpoolOffer") 
                        carpoolOffers.push({id: doc.id, ...data})

                    if(data.poolerLoc.toLowerCase().trim() === "magodo")
                        magodoCount++
                });

                setmagodoLength(magodoCount)
                setpoolRequests(poolRequests)
                setcarpoolRequests(carpoolRequests)
                setcarpoolOffers(carpoolOffers)

            } catch (error) {
                 console.log(error)
            }
            
            
        }
    
        useEffect(()=>{
            getRequests()
        },[])
       
 
 
   
    const pooMatchAlgorithm = async()=>{

        if(poolRequests.length > 1){
        await axios
                .post("https://mappool.onrender.com/api/v1/manual-process-pool-request",
                        {
                            payload: poolRequests
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    )
        }
    }

    const carpoolMatchAlgorithm =  async()=>{

        if(carpoolOffers.length > 0 && carpoolRequests.length >0 ){
            await axios
            .post("http://localhost:3004/api/v1/manual-process-ride-request",
                    {
                        payload: {
                            offers: carpoolOffers,
                            requests: carpoolRequests,
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )

        }

    }


        return(
            // <>
            // <table>
                 
            //      {
            //         poolRequests.map(entity=>{
            //             return(
            //                 <tr>
            //                     <td>{entity.requestType}</td>
            //                     <td>{entity.poolType}</td>
            //                     <td>{entity.status}</td>
            //                     <td>{entity.poolerLoc}</td>
            //                     <td>{entity.convPULoc}</td>
            //                 </tr>
            //             )
            //         })
            //      }

            // </table>
            // <br/>
            // <button disabled={poolRequests.length<10} onClick={pooMatchAlgorithm}>Create Pool</button>
            // </>
            <>
             <h1>{poolRequests.length} pool requests</h1>
             <h1>{magodoLength} mogodo residents</h1>
             <h1>{carpoolRequests.length} carpool requests</h1>
             <h1>{carpoolOffers.length} carpool offers</h1>
             <button className={poolRequests.length>10? "group-btn":"inactive"}  disabled={poolRequests.length<10} onClick={pooMatchAlgorithm}>Create Pool</button>
             <button className={(carpoolRequests.length>0 && carpoolOffers.length >0)? "group-btn":"inactive"}  disabled={!(carpoolRequests.length>0 && carpoolOffers.length >0 ) } onClick={carpoolMatchAlgorithm}>Create carpool</button>
            {/* (carpoolRequests==0 && carpoolOffers ==0) || (carpoolRequests>0 && carpoolOffers ==0) || (carpoolRequests == 0 && carpoolOffers >0) */}
            </>
           
        )
      }

export default AdminScreen