import { useAuth } from "../contextAPI/AuthContext"
import "../index.css"

const Login = ()=>{

     const {popupLogin} = useAuth()


    return(
      <div className="container">
        <h2>Login</h2>
        <input placeholder="Email"></input>
        <input placeholder="password"></input>
        <button>Next</button>
        <h3>OR</h3>
        <button className="social-login-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                <path d="M12.1906 5.84963C12.221 4.90752 12.4805 3.51967 13.3836 2.60792C14.222 1.76158 15.2425 1.3491 15.8781 1.16052C16.1235 1.08773 16.359 1.27277 16.3469 1.52845C16.3044 2.43033 16.0672 3.77552 15.4553 4.49617C14.8785 5.1755 13.9507 6.07635 12.5917 6.22792C12.3692 6.25273 12.1834 6.07334 12.1906 5.84963Z" fill="black"/>
                <path d="M14.5178 23.0932C15.1704 23.3432 15.8302 23.596 16.4274 23.596C17.7049 23.596 21.4248 20.6485 21.5588 17.5873C21.5657 17.4301 21.4718 17.2897 21.3345 17.2128C20.3882 16.6833 18.843 15.3649 18.7893 13.4469C18.7266 11.2117 19.8489 9.43624 20.6983 8.70184C20.8895 8.53656 20.9551 8.24512 20.7845 8.05873C20.0117 7.21477 18.4569 6.05388 17.0384 6.08238C16.0064 6.10311 15.0766 6.48753 14.2786 6.81742C13.6665 7.0705 13.132 7.29148 12.6885 7.29148C12.2685 7.29148 11.7644 7.07192 11.1857 6.81993C10.4065 6.48057 9.4921 6.08238 8.4664 6.08238C6.56647 6.08238 2.81252 7.65788 2.81251 13.74C2.81251 16.9643 6.14101 23.6816 8.94971 23.596C9.55621 23.596 10.2044 23.3449 10.8475 23.0957C11.4809 22.8503 12.1094 22.6068 12.6885 22.6068C13.2477 22.6068 13.8793 22.8486 14.5178 23.0932Z" fill="black"/>
            </svg>
            continue with apple id
        </button>
        <button className="social-login-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                <rect width="11.3636" height="11.3636" fill="#FF3A3A"/>
                <rect x="13.6364" width="11.3636" height="11.3636" fill="#4DE55C"/>
                <rect x="13.6364" y="13.6364" width="11.3636" height="11.3636" fill="#F4B400"/>
                <rect y="13.6364" width="11.3636" height="11.3636" fill="#3AA0FF"/>
            </svg>
            continue with microsoft
        </button>
        <button onClick={()=>popupLogin()} className="social-login-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                <path d="M21.1644 10.7143C21.2639 10.7143 21.3497 10.7845 21.3671 10.8824C21.4647 11.4301 21.5179 12.0195 21.5179 12.5893C21.5179 14.9909 20.6146 17.1818 19.1293 18.8406C19.0551 18.9233 18.9288 18.9306 18.844 18.8589L16.2965 16.7026C16.2036 16.6241 16.1979 16.4832 16.28 16.3937C16.7872 15.8408 17.1855 15.1863 17.4412 14.4643H12.3512C12.2361 14.4643 12.1429 14.3711 12.1429 14.2559V10.9226C12.1429 10.8075 12.2361 10.7143 12.3512 10.7143H21.1644Z" fill="#0F9D58"/>
                <path d="M15.4716 17.2535C15.5482 17.2137 15.6416 17.2228 15.7075 17.2785L18.3821 19.5418C18.4836 19.6278 18.4798 19.7857 18.3719 19.8635C16.8312 20.9741 14.9399 21.6284 12.8958 21.6284C9.60216 21.6284 6.70498 19.9296 5.03281 17.3604C4.97442 17.2707 4.9961 17.1515 5.08089 17.0862L7.73223 15.0434C7.83435 14.9648 7.98251 14.9969 8.04804 15.108C9.02653 16.766 10.8313 17.8784 12.8958 17.8784C13.8249 17.8784 14.7004 17.6528 15.4716 17.2535Z" fill="#4285F4"/>
                <path d="M6.68956 13.7825C6.70302 13.8605 6.67342 13.9398 6.61084 13.9881L3.76226 16.1828C3.6532 16.2668 3.49404 16.2239 3.4459 16.0948C3.06524 15.0747 2.85714 13.9706 2.85714 12.8178C2.85714 11.6173 3.08285 10.4694 3.49415 9.41435C3.54301 9.28905 3.69735 9.24654 3.8058 9.32608L6.65173 11.4132C6.71946 11.4628 6.75038 11.5483 6.73274 11.6305C6.65046 12.0132 6.60714 12.4105 6.60714 12.8178C6.60714 13.1468 6.63538 13.4691 6.68956 13.7825Z" fill="#F4B400"/>
                <path d="M7.77485 9.27514C7.87471 9.34838 8.01581 9.31862 8.08234 9.21417C9.08081 7.64686 10.8341 6.60715 12.8299 6.60715C14.1931 6.60715 15.4395 7.09611 16.4126 7.90362C16.4975 7.97407 16.6225 7.97074 16.7005 7.89272L19.0607 5.53255C19.1442 5.44916 19.1419 5.31306 19.0539 5.23463C17.3979 3.75996 15.2217 2.85715 12.8299 2.85715C9.58005 2.85715 6.71619 4.51111 5.03425 7.02312C4.9731 7.11446 4.99617 7.23732 5.08481 7.30232L7.77485 9.27514Z" fill="#DB4437"/>
            </svg>
            continue with google
        </button>
       
      </div>
    )
    
}



export default Login