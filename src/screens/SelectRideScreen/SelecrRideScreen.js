
const SelectRideScreen = () => {

    return (
   
        <>
           <div className="container">
           <h3>Request has been saved</h3>
           <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
           <circle cx="50" cy="50" r="49" stroke="#1FD431" stroke-width="2"/>
           </svg>
           
       </div>
       <div className="container" style={{backgroundColor:"#2F2F2F"}}>
          <button onClick={()=>{setRequesting(false)}}>Next</button>
           <button  className="danger-btn" onClick={()=>navigate("/userinfo")}>Go back</button>
       </div>
        </>  
       
       )
}


export default SelectRideScreen