import React, { useEffect } from 'react'
import { useAuth } from '../contextAPI/AuthContext'

const PermissionCard = () => {

  const {user} = useAuth()

 const onCopyLink = async()=>{
  try {
    // Attempt to write the link to the clipboard
    await navigator.clipboard.writeText(`https://${window.location.hostname}/admin?uid=${user.id}`)
    alert('Link copied to clipboard!');
  } catch (err) {
    // Handle errors, such as permissions issues
    console.error('Unable to copy link to clipboard', err);
  }
 }

  return (
    <div className='container'>
      <h1>Share to Admin</h1>
      <button onClick={onCopyLink}>Click to Copy link</button>
      <p>Share link to admin for approval</p>
    </div>
  )
}

export default PermissionCard
