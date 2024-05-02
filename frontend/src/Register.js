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
      <div className="container">
          <div className="row justify-content-center mt-5">
              <div className="col-md-6">
                  <div className="card">
                      <div className="card-body">
                          <h2 className="text-center mb-4">Join In To Start Sharing & Finding</h2>
                          <form onSubmit={handleRegisterSubmit}>
                              <div className="form-group">
                                  <label>Username:</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}
                                      required
                                  />
                              </div>
                              <div className="form-group">
                                  <label>Email:</label>
                                  <input
                                      type="text"
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
                              <div className="form-group">
                                  <label>Confirm Password:</label>
                                  <input
                                      type="password"
                                      className="form-control"
                                      value={confirmPassword}
                                      onChange={(e) => setConfirmPassword(e.target.value)}
                                      required
                                  />
                              </div>
                              <div className="text-center mt-3">
                                <button type="submit" className="btn btn-success btn-block">Register</button>
                              </div>
                          </form>
                          <div className="text-center mt-3">
                              <Link to="/login">Already have an account? Login!</Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default Register;