
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
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import AdminScreen from '../screens/AdminScreen';
import { completelyRandomPath } from '../util.js';
import EventScreen from '../screens/EventsScreen/EventScreens';
import ClearToken from './ClearAuthToken';

const Nav = ()=>{

    const {isLoggedIn, setUser, user, setIsLoggedIn, setToken, setUpdateRole, updateRole} = useAuth()
    const [loading, setLoading] = useState(true)
   
 

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
          </Routes>
          
        )}
    
      </Router>
    )
}

export default Nav