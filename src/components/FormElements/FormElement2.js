import React from 'react'

function FormElement2({title, inputText}) {
  return (
    <div>
  
    <h4>{title}</h4>
    <textarea placeholder={inputText}></textarea>
   
    </div>
  )
}

export default FormElement2
