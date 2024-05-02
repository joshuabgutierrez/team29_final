import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

function Login({ setUsername }) {
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
              localStorage.setItem('username', username);
              localStorage.setItem('email', email);
              //Cookies.set("username", username);
              //Cookies.set("email", email);

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
    <div className="container">
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h2 className="text-center mb-4">Find Your Recipes!</h2>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="text-center mt-3">
                              <button type="submit" className="btn btn-success btn-block">Login</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <Link to="/register">Don't have an account? Register here.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

export default Login;