import React, {  useState } from 'react';

const DownloadPrompt = (setShowInstallButton,deferredPrompt,setDeferredPrompt) => {
    
   console.log(deferredPrompt)
  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Trigger the browser prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }

        // Reset the deferredPrompt variable
        setDeferredPrompt(null);

        // Hide the install button
        setShowInstallButton(false);
      });
    }
  };

  return (
    <div>
     
        <div>
          <p>This app is installable!</p>
          <button onClick={handleInstallClick}>Install App</button>
        </div>
    
    </div>
  );
};

export default DownloadPrompt;
