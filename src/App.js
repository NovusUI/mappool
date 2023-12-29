import React from 'react';

import { AuthProvider } from './contextAPI/AuthContext';
import Nav from './components/Nav';
import "./App.css"
import "./fonts.css"
import "./buttons.css"
import "./layout.css"
import { AppProvider } from './contextAPI/AppContext';
import { MsgProvider } from './contextAPI/MsgContext';
import { NavProvider } from './contextAPI/NavContaxt';



function App() {
  return (
    <div id='app'>
      
    <AuthProvider>
      <MsgProvider>
      <AppProvider>
        <NavProvider>
        <Nav/>
        </NavProvider>
      </AppProvider>
      </MsgProvider>
    </AuthProvider>
    </div>
  )
}

export default App;
