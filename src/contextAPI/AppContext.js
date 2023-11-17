import React, { createContext, useContext, useState } from 'react';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  
  const [userSelectedEvent, setUserSelectedEvent] = useState(null)
  const [updateRole, setUpdateRole] = useState(null)
 

  return (
    <AppContext.Provider value={{userSelectedEvent, setUserSelectedEvent , updateRole, setUpdateRole}}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};
