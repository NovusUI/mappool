import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(()=>{
     
  },[])

  const popupLogin = async() => {
     try {
        const userCred = await signInWithPopup(auth, new GoogleAuthProvider())
        console.log(userCred)
        setIsLoggedIn(true);
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
    <AuthContext.Provider value={{ isLoggedIn, popupLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
