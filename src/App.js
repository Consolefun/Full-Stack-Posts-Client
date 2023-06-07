import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Registration from './pages/Registration';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword';


import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from 'react';

import axios from 'axios';
import { flattenOptionGroups } from '@mui/base';

// export const withNavigation = (Component: Component) => {
//   return props => <Component {...props} navigate={useNavigate()} />;
// }

function App() {

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false
  });

  const [currentUser, setCurrentUser] = useState({
    username: authState.username,
    profilePicture: "",
  });

  //const navigate = useNavigate();
  //const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = () => {
    localStorage.removeItem("accessToken");

    setAuthState({ username: "", id: 0, status: false });
    window.location.replace("/Login");

  };
  const userProfile = () => {
    window.location.replace(`/Profile/${authState.id}`);
  }

  const userSetting = () => {
    window.location.replace("/ChangePassword");
  }

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    });


    axios.get(`http://localhost:3001/auth/basicinfo/${authState.id}`)
      .then((response) => {
        //setUsername(response.data.username);


        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
        const imageUrl = response.data.profilePicture.substr(76);
        //console.log(authState.username);
        setCurrentUser({ ...currentUser, profilePicture: imageUrl });

      });


    // if (!isLoggedIn) {
    //   navigate("/login");
    // }

  }, [authState.id]);

  // window.addEventListener('scroll', function () {
  //   var scrollPosition = window.pageYOffset;
  //   if (scrollPosition > 200) {
  //     var opacityValue = 1 - (scrollPosition - 200) / 200;
  //     document.querySelector(".navbar").style.opacity = opacityValue.toString();
  //   }
  // })

  var previousScrollPosition = window.pageYOffset;

  window.addEventListener('scroll', function () {
    var scrollPosition = window.pageYOffset;
    var direction;
    if (scrollPosition > previousScrollPosition) {
      direction = 'down';
      document.querySelector('.navbar').classList.remove('scroll-up');
    } else {
      direction = 'up';
      document.querySelector('.navbar').classList.add('scroll-up');
    }
    previousScrollPosition = scrollPosition;
  });


  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className='links'>

              {!authState.status ? (
                <>

                  <Link to="/login"> Login </Link>
                  <Link to="/registration"> Registration </Link>

                </>
              ) : (
                <>
                  <Link to="/"> Home Page </Link>
                  <Link to="/createpost"> Create A Post </Link>

                  <div className='loggedInContainer'>

                    <div className='dropdown'>
                      <img src={`http://localhost:3000/${currentUser.profilePicture}`} alt="User Profile" />

                      <div className='dropdown-content'>
                        <button className='usernamebtn' onClick={userProfile}>{authState.username}</button>
                        <button className='settingbtn' onClick={userSetting}>Setting</button>
                        {authState.status && <button className='logoutbtn' onClick={logout}>Logout</button>}
                      </div>


                    </div>
                  </div>

                </>
              )}


            </div>
          </div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path='/createpost' exact element={<CreatePost />} />
            <Route path='/post/:id' exact element={<Post />} />
            <Route path='/registration' exact element={<Registration />} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/profile/:id' exact element={<Profile />} />
            <Route path='/changepassword' exact element={<ChangePassword />} />


            <Route path='*' exact element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}


export default App;
