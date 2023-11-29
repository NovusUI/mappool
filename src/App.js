import React from 'react';

import { AuthProvider } from './contextAPI/AuthContext';
import Nav from './components/Nav';
import "./App.css"
import { AppProvider } from './contextAPI/AppContext';
import { MsgProvider } from './contextAPI/MsgContext';



function App() {
  return (
    <div id='app'>
      
    <AuthProvider>
      <MsgProvider>
      <AppProvider>
        <Nav/>
      </AppProvider>
      </MsgProvider>
    </AuthProvider>
    </div>
  )
}

export default App;
