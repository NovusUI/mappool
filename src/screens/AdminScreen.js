import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";

import "../index.css"
import { useNavigate } from "react-router-dom";




    const AdminScreen = ()=>{
       
     
        const [permissionRequests, setpermissionRequests] = useState([])
        const [uid,setUid] = useState(null)
        const permissionCollectionRef = collection(db,"permissions")
        const navigate = useNavigate()
        const getPermissionRequests = async() => { 
         
            try {

                
                const permissionQuery = query(permissionCollectionRef, where("approved", "==", false))
                const permissionSnapShot = await getDocs(permissionQuery)
                setpermissionRequests([]);
                permissionSnapShot.forEach((doc) => {
                    const data = doc.data()
                    console.log(uid)
                    if(uid === doc.id || uid === null){
                      setpermissionRequests((prev=>[...prev,{...data, id:doc.id}]))
                    }
                });
            } catch (error) {
                 console.log(error)
            } 
        }
        useEffect(()=>{
            const urlParams = new URLSearchParams(window.location.search);
            // Accessing individual parameters
            const uid = urlParams.get('uid');
            setUid(uid)
        },[])
        useEffect(()=>{
           
            if(uid)
             getPermissionRequests()
        },[uid])
        
        const approveRequest = async (uid) => {
            console.log(uid)
            try {
                console.log("approvap")
                const persmissionDocRef = doc(permissionCollectionRef,uid)
                await updateDoc(persmissionDocRef,{
                    approved:true
                })
                
                const userCollectionRef = collection(db,"users")
                const userDocRef = doc(userCollectionRef, uid)
                await updateDoc(userDocRef,{approved:true})

            } catch (error) {
                console.log(error)
            }
        }
        return(
            <>
            {permissionRequests.map(request=>(
                <div className="container">
                  <p>{request.name}</p>
                  <p>{request.role}</p>
                  <button onClick={()=>approveRequest(request.id)}>Approve Request</button>
                  
                </div>
                
            )) 
            }
            {permissionRequests.length == 0 && <div>Nothing to see Here</div>}
            <button onClick={()=>navigate('/')}>Home</button>
           </>
        )
      }

export default AdminScreen