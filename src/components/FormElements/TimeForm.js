import React from 'react'
import FormError from '../FormError'

const TimeForm = ({title, placeHolder, inputRef,error}) => {
  const styles = {
   padding: {
      paddingLeft:"10px",
      paddingBottom: "5px"
    }
}
  return (
    <div className='form-type-1' style={styles.padding}>
        <h4 className='inter-400'>{title}</h4>
        <input type='time' className='form-type-1-input poppins-heavy' placeholder={placeHolder} ref={inputRef} onChange={()=>console.log(inputRef.current.value)}/>
        <FormError error={error}/>
    </div>
  )
}

export default TimeForm
