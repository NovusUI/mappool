import "./switchbox.css"

const SwitchBox = ({type, setPoolType})=>{
    

    return(
        <div className="switch-container">
            <div onClick={()=>setPoolType("carpool")} className={type == "carpool" ? "switch-active":"switch"}></div>
            <div onClick={()=>setPoolType("pool")} className={type == "pool" ? "switch-active":"switch"}></div>
        </div>
    )
}

export default SwitchBox