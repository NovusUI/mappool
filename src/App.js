import React from 'react';

import { AuthProvider } from './contextAPI/AuthContext';
import Nav from './components/Nav';




function App() {
  return (
    <AuthProvider>
      <Nav/>
    </AuthProvider>
  )
}

export default App;
