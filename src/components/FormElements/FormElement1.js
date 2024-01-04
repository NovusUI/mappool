import React from 'react'
import FormError from '../FormError'

const styles = {
  padding: {
    paddingBottom: "5px"
  }
}
function FormElement1({title, placeHolder, inputRef,error}) {

  return (
    <div className='form-type-1'style={styles.padding} >
    <h4 className='inter-400'>{title}</h4>
    <textarea className='form-type-1-input poppins-heavy' placeholder={placeHolder} ref={inputRef}/>
    <FormError error={error}/>
    </div>
  )
}

export default FormElement1
