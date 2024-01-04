import React from 'react'
import FormError from '../FormError'

const CalenderForm = ({title, placeHolder, inputRef,error}) => {
  return (
    <div className='form-type-1'>
        <h4 className='inter-400'>{title}</h4>
        <input type='date' className='form-type-1-input poppins-heavy' placeholder={placeHolder} ref={inputRef} />
        <FormError error={error}/>
    </div>
  )
}

export default CalenderForm
