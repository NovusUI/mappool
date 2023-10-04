import "../index.css"

const Role = ()=>{

    return<>
        <div className="container">
            <h3>Choose Role</h3>
            <button>Pooler</button>
            <button>Poolee</button>
        </div>
        <div  className="container" style={{backgroundColor:"#2F2F2F"}}>
            <button>Next</button>
        </div>
    </>
}

export default Role