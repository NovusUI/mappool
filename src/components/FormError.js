import React from 'react'


const style = {
  color: "#FF3A3A",
  width: "100%"
}

const FormError = ({error}) => {
  return (
    <div style={style}>{error}</div>
  )
}

export default FormError
