import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link me-3" aria-current="page" to="/Homepage" end>
                Homepage
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link me-3" aria-current="page" to="/recipes" end>
                Recipes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link me-3" to="/">
                About
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink className="nav-link" to="/account">
                Account
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  )
}

export default Navbar;