import React, { createContext, useContext, useState } from 'react';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  
  const [userSelectedEvent, setUserSelectedEvent] = useState(null)
  const [updateRole, setUpdateRole] = useState(null)
  
  const [chosenEvent, setChosenEvent] = useState(null)
  const [eventData, setEventData] = useState(null)
  const [carpoolId, setCarpoolId] = useState(null)
  const [poolId, setPoolId] = useState(null)
  const [yourPoolId, setYourPoolId] = useState(null)
  const [userEventDocRef,setUserEventDocRef] = useState(null)

  return (
    <AppContext.Provider value={{userSelectedEvent, setUserSelectedEvent , 
                                updateRole, setUpdateRole,
                                chosenEvent, setChosenEvent,
                                eventData, setEventData,
                                carpoolId, setCarpoolId,
                                poolId, setPoolId,
                                yourPoolId, setYourPoolId,
                                userEventDocRef,setUserEventDocRef
                                }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};
