import React from 'react';

import { AuthProvider } from './contextAPI/AuthContext';
import Nav from './components/Nav';
import "./App.css"
import { AppProvider } from './contextAPI/AppContext';



function App() {
  return (
    <div id='app'>
      
    <AuthProvider>
      <AppProvider>
        <Nav/>
      </AppProvider>
    </AuthProvider>
    </div>
  )
}

export default App;
