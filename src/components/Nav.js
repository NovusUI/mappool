
import { BrowserRouter as Router, Route, Routes, useNavigation } from 'react-router-dom';
import ContactYourRide from '../screens/ContactYourRide/ContactYourRideScreen';
import Login from '../screens/LoginScreen';
import Request from '../screens/RequestScreen';
import Role from "../screens/RoleScreen"
import SignUp from "../screens/SignUpScreen"
import UserInfo from "../screens/UserScreen/UserScreen"
import SwipeableContactYourRide from "../screens/ContactYourRide/SwipeableContactYourRide"
import { useAuth } from '../contextAPI/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db, messaging } from '../firebase/config';

import { onAuthStateChanged } from 'firebase/auth';
import AdminScreen from '../screens/AdminScreen';
import { completelyRandomPath } from '../util.js';
import EventScreen from '../screens/EventsScreen/EventScreens';
import ClearToken from './ClearAuthToken';
import { getToken } from 'firebase/messaging';
import NotPermittedScreen from '../screens/NotPermittedScreen';
import NavBar from './NavBar';

const Nav = ()=>{

    const {isLoggedIn, setUser, user, setIsLoggedIn, setToken, setUpdateRole, updateRole,setMsgToken} = useAuth()
    const [loading, setLoading] = useState(true)
    console.log(localStorage.getItem("updateRole"))
    
    const requestPermission = (currentToken)=> {
      console.log('Requesting permission...');
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setMsgToken(currentToken)
          console.log('Notification permission granted.');
        }
      })
    }

    useEffect(() => {

      
        onAuthStateChanged(auth, user => {
          if (user) {
        
            const userRef = doc(db, "users", user.uid);
             
            user.getIdToken().then((token)=>{
              console.log(token)
              setToken(token)
            })
    
            getDoc(userRef)
            .then((docSnapshot) => {
              if (docSnapshot.exists()) {
                // Document data is available in docSnapshot.data()
                const userData = docSnapshot.data();
                setLoading(false)
                 console.log(userData)
                setUser(userData)
                setIsLoggedIn(true)
                
                setUpdateRole(localStorage.getItem("updateRole"))
              } else {
                setLoading(false)
              }
            })
            .catch((error) => {
              console.error("Error getting document:", error);
            });
            
            getToken(messaging, { vapidKey: 'BI-cNvqtp_6OCpSOw-T2e2udGJjOPseTfYsY44J6UbIa52NR_cE0X-OThAMxoSiiNjxdzLmQ7MNMBhmZryyB5i8' }).then((currentToken) => {
              if (currentToken) {
                // Send the token to your server and update the UI if necessary
                console.log(currentToken)
                setMsgToken(currentToken)
               
                // ...
              } else {
                // Show permission request UI
                requestPermission(currentToken)
                // ...
              }
            }).catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
              // ...
            });
    
          } else {
            setLoading(false)
          }
        });
      }, []);

      if (loading) {	
        return (	
         <></>
        )	
      }

    return (
        <Router>
         <NavBar/>
        { !isLoggedIn ? 
        (
            
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="signup" element={<SignUp/>}/>
        </Routes>
        ) : (
          <Routes>
          <Route exact path="/userinfo" element={<UserInfo/>} />
          <Route path="/request"  element={<Request/>} />
          <Route path={updateRole ?'/events':"/"} element={<EventScreen/>}/>
          <Route path='/role' element={<Role/>}/>
          <Route path='/ct' element={<ClearToken/>}/>
          <Route path ={"/"} element={<ContactYourRide/>}/>
          <Route path="/swipeable-contact-your-ride" element={<SwipeableContactYourRide />} />
          <Route path={completelyRandomPath} element={<AdminScreen/>}/>
          <Route path={"/admin"} element={user.role === "admin" && <AdminScreen/> || <NotPermittedScreen/>}/>
          </Routes>
          
        )}
    
      </Router>
    )
}

export default Nav