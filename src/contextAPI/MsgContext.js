import React, { createContext, useContext, useState } from 'react';


const MsgContext = createContext();

export const MsgProvider = ({ children }) => {
  
const [msgType,setMsgType] = useState("normal")

 

  return (
    <MsgContext.Provider value={{msgType,setMsgType}}>
      {children}
    </MsgContext.Provider>
  );
};

export const useMsg = () => {
  return useContext(MsgContext);
};
