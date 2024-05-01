import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    //const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    
    const handleRegisterSubmit = async (e) => {
      e.preventDefault();
      
      // Check if passwords match
      if (password !== confirmPassword) {
          alert("Passwords don't match");
          return;
      }
      
      try {
          const response = await fetch('http://localhost:5000/api/users/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({username, email, password }),
          });

          if (response.ok) {
              // Registration successful, redirect to homepage
              navigate('/login');
          } else {
              // Registration failed, show error message
              const errorData = await response.json();
              alert(errorData.message || 'Registration failed');
          }
      } catch (error) {
          console.error('Error during registration:', error);
          alert('An error occurred while registering. Please try again later.');
      }
    };

    return (
        <div className="App">
          <h2>REGISTER</h2>
          <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <br />
          <label>
              Email:
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <br />
          <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit" onClick={handleRegisterSubmit}>Register</button>
            <Link to="/login">Have an account? Login!.</Link>
          <br />
        </div>
      );
}

export default Register;