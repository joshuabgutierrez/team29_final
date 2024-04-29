import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        navigate('/homepage');
    };

    return (
        <div className="App">
          <h2>LOGIN</h2>
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