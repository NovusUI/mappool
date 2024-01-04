import React from 'react'

const DropDownForm = ({title, placeHolder, inputRef} ) => {
   
    const styles = {
        dropDown: {
            backgroundColor: "#202024",
            color: "#FFF",
            fontFamily: "Poppins",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 500,
            ineHeight: "normal",
            border: "none",
            outline: "none"
        }
    }
  
  return (
    <div className='form-type-1' >
        <h4 className='inter-400'>{title}</h4>
        {/* <input type='dropdown' className='form-type-1-input poppins-heavy' placeholder={placeHolder}>{inputText}</input>  */}
        <select id="repeat" name="repeat" ref={inputRef} onChange={()=>console.log(inputRef.current.value)} style={styles.dropDown}>
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
        </select>
    </div>
  )
}

export default DropDownForm
