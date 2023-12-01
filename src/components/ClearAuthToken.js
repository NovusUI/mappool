import React, { useEffect } from 'react';
import 'firebase/auth';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
const ClearToken = () => {
  useEffect(() => {
    const clearAuthToken = async () => {
      try {
        await signOut(auth)
        console.log('User signed out successfully');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    // Call the function to clear the authentication token when the component mounts
    clearAuthToken();

    // Optionally, you can add a cleanup function if needed
    // return () => {
    //   // Cleanup code
    // };
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  // Your component rendering logic here

  return (
    <div>
      {/* Your component content */}
    </div>
  );
};

export default ClearToken;
