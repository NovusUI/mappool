import React, { useEffect } from 'react'
import { useNav } from '../contextAPI/NavContaxt'

const ComingsoonPage = () => {

    const {setShowNav, setTitle} = useNav()

    useEffect(()=>{
        
        setTitle("Coming soon")
    },[])
  return (
    <div className='island'>
   
      <p className='page-sub-title'>We are working on some
new features.</p>
     
    </div>

  )
}

export default ComingsoonPage
