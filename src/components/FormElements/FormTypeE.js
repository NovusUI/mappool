import React from 'react'
import FormError from '../FormError'

function FormTypeE({title, placeHolder, inputRef,error}) {
  return (
    <div className='form-type-1'>
    <h4 className='poppins-heavy'>{title}</h4>
    <textarea  rows="5" className='form-type-E-input inter-400' placeholder={placeHolder} ref={inputRef}/>
    <FormError error={error}/>
    </div>
  )
}

export default FormTypeE
