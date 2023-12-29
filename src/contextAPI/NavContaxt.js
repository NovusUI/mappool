import React, { createContext, useContext, useState } from 'react';


const NavContext = createContext();

export const NavProvider = ({ children }) => {
  
const [showNav, setShowNav] = useState(true)
const [ title, setTitle] = useState("")

 

  return (
    <NavContext.Provider value={{showNav, setShowNav, title, setTitle}}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  return useContext(NavContext);
};
