
import { BrowserRouter as Router, Route, Routes, useNavigation } from 'react-router-dom';
import ContactYourRide from '../screens/CotactYourRideScreen';
import Login from '../screens/LoginScreen';
import Request from '../screens/RequestScreen';
import Role from "../screens/RoleScreen"
import SignUp from "../screens/SignUpScreen"
import UserInfo from "../screens/UserScreen"
import { useAuth } from '../contextAPI/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';


const Nav = ()=>{

    const {isLoggedIn, setUser, user, setIsLoggedIn} = useAuth()
    const [loading, setLoading] = useState(true)
   
 

    useEffect(() => {

      
        onAuthStateChanged(auth, user => {
          if (user) {
        
            const userRef = doc(db, "users", user.uid);
          
    
            getDoc(userRef)
            .then((docSnapshot) => {
              if (docSnapshot.exists()) {
                // Document data is available in docSnapshot.data()
                const userData = docSnapshot.data();
                setLoading(false)
                setUser(userData)
                setIsLoggedIn(true)
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
          <Route path ={user.role? "/":"/contactride"} element={<ContactYourRide/>}/>
          <Route path={user.role ?'/role':"/"} element={<Role/>}/>
          </Routes>
          
        )}
    
      </Router>
    )
}

export default Nav