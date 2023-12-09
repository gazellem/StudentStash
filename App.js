import './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//import { Link, useNavigate } from 'react-router-dom';
//import Dashboard from './pages/Dashboard';


function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Replace these with your actual hardcoded email and password
    const hardcodedEmail = 'user@example.com';
    const hardcodedPassword = 'password123';

    if (email === hardcodedEmail && password === hardcodedPassword) {
      console.log('Login successful! Redirecting to dashboard...');
      // Navigate to the Dashboard.js component
      navigate('/dashboard'); // Adjust the path accordingly
    } else {
      console.error('Error logging in: Invalid email or password');
    }
  };

  return (
    <div className="parent-container">
      <div id="firstColumn">
        <h2>Login Page</h2>
      </div>
      <div id="secondColumn">
        <label htmlFor="emailInput">Enter Email</label>
        <input type="text"
          id="emailInput"
          value={email}
          onChange={handleEmailChange} />

        <label htmlFor="passwordInput">Enter Password</label>
        <input type="password"
          id="passwordInput"
          value={password}
          onChange={handlePasswordChange} />

        <button type="button" id="login-button" className="btn" onClick={handleLogin}>
          Log In
        </button>
      </div>
    </div>
  );
}

export default App;
