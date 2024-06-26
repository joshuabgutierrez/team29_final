import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes();
    }, [token]); // Include token as a dependency

    const fetchRecipes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recipes/all', {
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
            setRecipes(data.recipes || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const handleLike = async (targetRecipeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/recipes/${targetRecipeId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the user's JWT token for authentication
                }
            });

            if (response.ok) {
                console.log('Liked successfully');
                fetchRecipes();
            } else {
                const errorData = await response.json();
                console.error('Like error:', errorData.message || 'Failed to like recipe');
            }
        } catch (error) {
            console.error('Error liking recipe:', error);
        }
    };

    const handleUnlike = async (targetRecipeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/recipes/${targetRecipeId}/unlike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.ok) {
                console.log('Unliked successfully');
                fetchRecipes();
            } else {
                const errorData = await response.json();
                console.error('Unliked error:', errorData.message || 'Failed to follow user');
            }
        } catch (error) {
            console.error('Error Unliked recipe:', error);
        }
    };
    


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

    const noRecipesMessage = !recipes.length && (
        <p className='text-center'>No recipes available. Find and follow users to see other recipes</p>
    );

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
                                <h4 className="card-text text-center">Likes: {recipe.likesCount}</h4>
                                <div className="card-body text-center">
                                    <h5 className="card-title">{recipe.title}</h5>
                                    <p className="card-text">Recipe by: {recipe.creatorInfo.username}</p>
                                    {recipe.isLikedbyMe ? (
                                        <button className="btn btn-danger" onClick={() => handleUnlike(recipe._id)}>Unlike</button>
                                    ) : (
                                        <button className="btn btn-success" onClick={() => handleLike(recipe._id)}>Like</button>
                                    )}
                                    <button className="btn btn-primary ml-2" onClick={() => navigate(`/recipesinfo/${recipe._id}`)}>View</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {noRecipesMessage}
                </div>
            </div>
        </div>
    );
}

export default Recipes;
