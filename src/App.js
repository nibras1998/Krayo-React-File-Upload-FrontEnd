import React, { useState, useEffect } from 'react';
import { GoogleLogin, useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import Home from './Home';
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedProfile = JSON.parse(localStorage.getItem('profile'));

    if (storedUser && storedProfile) {
      setUser(storedUser);
      setProfile(storedProfile);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (user && profile) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('profile', JSON.stringify(profile));
      setIsLoggedIn(true);
    }
  }, [user, profile]);


  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile(res.data);

        })
        .catch((err) => console.log(err));
    }
  },
    [user]
  );

  profile && console.log(profile)

  const handleSuccess = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      console.log(codeResponse);
      setIsLoggedIn(true);

    }

  });


  const handleError = () => {
    console.log('Login Failed');
  };

  const handleSignOut = (e) => {
    e.preventDefault()
    setIsLoggedIn(false);
    googleLogout();
    setUser(null)
    setProfile(null);
    localStorage.clear();
  };

  return (
    <div className="App">
      <h1 className='heading'>React File Uploader</h1>
      {isLoggedIn ? (
        <>
          {profile && <Home profile={profile} />}
          <button id='logoutBtn' onClick={handleSignOut}>Logout</button>
        </>
      ) : (
        <>
          <h3>Login using your Google account</h3>
          <div className='signIn'>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
            /></div>
        </>
      )}
    </div>
  )
}

export default App;
