import React, { useEffect, useState } from 'react';

const DownloadPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default browser prompt
      event.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(event);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

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
      });
    }
  };

  return (
    <div>
      <p>This app is installable!</p>
      <button onClick={handleInstallClick}>Install App</button>
    </div>
  );
};

export default DownloadPrompt;
