import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useParams } from "react-router-dom";

function RecipesInfo() {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState([]);
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
                setRecipe(data.recipe); // Corrected to set individual recipe
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRecipes();
    }, [recipeId, token]); // Include recipeId and token as dependencies


    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mt-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        style={{ maxHeight: "200px", maxWidth: "205%", objectFit: "contain" }}
                      />
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-12 mb-4 mt-4">
                      <div className="card-body">
                        <h5 className="card-title">{recipe.title}</h5>
                        {<p className="card-text">Recipe by: {recipe.createdBy.username}</p>}
                        <p className="card-text">Category: {recipe.category}</p>
                        <h5 className="card-text">Ingredients:</h5>
                        <ul>
                          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card-body">
                        <div className="col-lg-12 mb-4 mt-4">
                          <h5 className="card-title text-center">Instructions:</h5> 
                          <p className="card-text">{recipe.instructions}</p>
                        </div>
                        <div className="col-lg-12">
                          <h5 className="card-title text-center">Comments:</h5>
                          {recipe.comments && recipe.comments.length > 0 ? (
                            recipe.comments.map((comment, index) => (
                            <div key={index}>
                              <p className='text-center'><strong>{comment.user ? comment.user : 'Deleted User'}:</strong> {comment.text}</p>
                            </div>
                          ))
                        ) : (
                        <p className='text-center'>No comments available</p>
                        )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );     
}

export default RecipesInfo;
