import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null)
  const [updateRole, setUpdateRole] = useState("")
 

  const popupLogin = async() => {
     try {
        const userCred = await signInWithPopup(auth, new GoogleAuthProvider())
        console.log(userCred)

        const uid = userCred.user.uid
        const email = userCred.user.email
        const displayName = userCred.user.displayName

        const data = {
             id: uid,
             email,
             displayName,
               };


        console.log(data)

        
        
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection, uid);

        const docSnapShot = await getDoc(userDoc)

           //before setting data check if user already exists
        if(docSnapShot.exists()){
            return
        }
               
        console.log(userDoc)

     
        setDoc(userDoc, data)
            .then(() => {
                  
                setIsLoggedIn(true);
                setUser(data)
                
            })
            .catch((error) => {
                    alert(error);
            });
        
     } catch (error) {
        console.log(error)
     }
     
    // Implement your login logic here
    
  };

  const logout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, popupLogin, logout, user, setUser,setIsLoggedIn, updateRole,setUpdateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
