import "../index.css"

const UserInfo = ()=>{



    return (
       !false ?
        <>   
    
         <div className="container" >
            <h3>Let's pair you</h3>
            <input placeholder="Whatsapp number"></input>
            <input placeholder="Email"></input>
            <input placeholder="Location"></input>
            <input placeholder="Convenient pick-up location"></input>
            <input placeholder="Additional info"></input>

        </div>
        <div className="container" style={{backgroundColor:"#2F2F2F"}}>
            <button>Next</button>
            <button>Change Role</button>
        </div>
         
        </>
        :
        <>   
    
        <div className="container" >
           <h3>Let's pair you</h3>
           <input placeholder="Whatsapp number"></input>
           <input placeholder="Email"></input>
           <input placeholder="Location"></input>
           <input placeholder="Convenient pick-up location"></input>
           <input placeholder="Sits available"></input>
           <input placeholder="Additional info"></input>

       </div>
       <div className="container" style={{backgroundColor:"#2F2F2F"}}>
           <button>Next</button>
           <button>Change Role</button>
       </div>
        
       </>
        
        

     
    )
    
}

export default UserInfo