import React from 'react'
import FormError from '../FormError'

const MapForm = ({title, placeHolder, inputRef, error}) => {
  return (
    <div className='form-type-1' style={{paddingBottom: "10px"}}>
        <h4 className='inter-400'>{title}</h4>
        <input type='map' className='form-type-1-input poppins-heavy' placeholder={placeHolder} ref={inputRef} />
        <FormError error={error}/>
    </div>
  )
}

export default MapForm
