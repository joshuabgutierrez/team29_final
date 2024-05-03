import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    // TEST
    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => setRecipes(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleSearchChange = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setSearchInput(inputValue);
    }

    const filteredRecipes = recipes.filter((recipe) => {
        return recipe.title.toLowerCase().includes(searchInput);
    });

    const handleViewUsers = (e) => {
        e.preventDefault();
        navigate('/viewusers');
    }

    return (
        <div className="App">
            <Navbar />
            <div>
                <div className="row">
                <div className="searchBar my-2 d-flex justify-content-center">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for any recipes"
              onChange={handleSearchChange}
              value={searchInput} />
          </div>
          <button className="btn btn-success mr-2" onClick={handleViewUsers}>Find Users</button>
        </div>
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div className="card">
                                <img
                                    src={recipe.image}
                                    className="card-img-top img-fluid"
                                    alt={recipe.title}
                                    style={{ height: "200px", objectFit: "contain" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{recipe.title}</h5>
                                    <p className="card-text">{recipe.description}</p>
                                    <p className="card-text">${recipe.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ); 
}

export default Recipes;
