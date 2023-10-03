import { useAuth } from "../contextAPI/AuthContext"


const Login = ()=>{

     const {popupLogin} = useAuth()


    return(
      <div>
        <button onClick={()=>popupLogin()}>Login</button>
      </div>
    )
    
}

export default Login