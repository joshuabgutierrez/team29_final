import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      
      try {
          const response = await fetch('http://localhost:5000/api/users/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }), // Use email instead of username
          });
  
          if (response.ok) {
              // Login successful
              const responseData = await response.json();
              const { username, email, token } = responseData;

              Cookies.set("token", token);
              Cookies.set("username", username);
              Cookies.set("email", email);

              console.log("Login", token, username, email);
              navigate('/homepage');
              
          } else {
              // Login failed, show error message
              const errorData = await response.json();
              alert(errorData.message || 'Login failed');
          }
      } catch (error) {
          console.error('Error during login:', error);
          alert('An error occurred while logging in. Please try again later.');
      }
  };
  

    return (
        <div className="App">
          <h2>LOGIN</h2>
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
            <button type="submit" onClick={handleLoginSubmit}>Login</button>
          <br />
          <Link to="/register">Don't have an account? Register here.</Link>
        </div>
      );
}

export default Login;