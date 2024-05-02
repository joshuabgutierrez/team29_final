import React from 'react';
import "../styles/Landing.css";
import {useNavigate} from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid p-0 my-background">
      <div className="row no-gutters align-items-center landing-container m-0">
        <div className="col-12 col-md-6 d-flex justify-content-start">
          <div className="text-wrapper p-4">
            <h1>The Easiest Way To Make Your Favorite Meal</h1>
            <p>Discover 1000+ recipes in your hand with the bet recipe. 
              Help you to find the easiest way to cook.</p>
            <button className="btn btn-success" onClick={() => navigate("/login")}>Explore Recipes</button>
          </div>
        </div>
        <div className="col-12 col-md-6">
        </div>
      </div>
    </div>
  )
};

export default Landing;