
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactYourRide from '../screens/CotactYourRideScreen';
import Login from '../screens/LoginScreen';
import Request from '../screens/RequestScreen';
import Role from "../screens/RoleScreen"
import SignUp from "../screens/SignUpScreen"
import UserInfo from "../screens/UserScreen"
import { useAuth } from '../contextAPI/AuthContext';


const Nav = ()=>{

    const {isLoggedIn} = useAuth()

    return (
        <Router>
        { !isLoggedIn ? (
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="signup" element={<SignUp/>}/>
        </Routes>
        ) : (
          <Routes>
          <Route exact path="/" element={<UserInfo/>} />
          <Route path="/request" element={<Request/>} />
          <Route path ="/contactride" element={<ContactYourRide/>}/>
          <Route path='/role' element={<Role/>}/>
          </Routes>
        )}
      </Router>
    )
}

export default Nav