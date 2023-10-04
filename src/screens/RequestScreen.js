import "../index.css"
import MovingSVG from "../components/MovingSVG"

const Request = ()=>{

    return(
    !false ?
       <>
    
    <div className="container">
        <h3>You are being paired</h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48.75" stroke="url(#paint0_linear_7_243)" stroke-width="2.5"/>
        <defs>
        <linearGradient id="paint0_linear_7_243" x1="78.5" y1="75.5" x2="93.5" y2="66" gradientUnits="userSpaceOnUse">
        <stop stop-color="#1FD431"/>
        <stop offset="0.95568" stop-color="#1FD431" stop-opacity="0"/>
        </linearGradient>
        </defs>
        </svg>
        <h5>You will be notified once we pair you</h5>
    </div>
    </>
    :
    <>
    <div className="container">
        <h3>Request has been saved</h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="49" stroke="#1FD431" stroke-width="2"/>
        </svg>
        
    </div>
    <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button>Next</button>
        <button className="danger-btn">Go back</button>
    </div>
    </>
    )
}

export default Request