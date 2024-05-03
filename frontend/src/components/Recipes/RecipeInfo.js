import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useParams } from "react-router-dom";

function RecipesInfo() {
    const { recipeId } = useParams();
    const [recipes, setRecipes] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }

                const data = await response.json();
                console.log(data);
                setRecipes(data.recipe); // Corrected to set individual recipe
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRecipes();
    }, [recipeId, token]); // Include recipeId and token as dependencies

    return (
        <div className="App">
            <Navbar />
            <div>
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div className="card">
                            <img
                                src={recipes.image}
                                className="card-img-top img-fluid"
                                alt={recipes.title}
                                style={{ height: "200px", objectFit: "contain" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{recipes.title}</h5>
                                <p className="card-text">Category: {recipes.category}</p>
                                <p className="card-text">Created By: {recipes.createdBy}</p>
                                <p className="card-text">Ingredients:</p>
                                <ul>
                                    {recipes.ingredients && recipes.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipesInfo;
