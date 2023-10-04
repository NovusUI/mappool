import React from 'react';

import { AuthProvider } from './contextAPI/AuthContext';
import Nav from './components/Nav';
import "./App.css"



function App() {
  return (
    <div id='app'>
    <AuthProvider>

      <Nav/>
    </AuthProvider>
    </div>
  )
}

export default App;
