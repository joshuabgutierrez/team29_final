import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar';
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function RecipesInfo() {
    const { recipeId } = useParams();
    const [userId, setUserId] = useState('');
    const [recipe, setRecipe] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (token) {
        const decodedToken = jwtDecode(token);

        setUserId(decodedToken.userId);
    } else {
        navigate('/login');
    }

    fetchRecipes();
    }, [location, token]); // Include token as a dependency
  
        const fetchRecipes = async () => {
          console.log("Hello")
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
                console.log("Data", data);
                setRecipe(data.recipe); // Corrected to set individual recipe
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
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
              // Update the recipe state to reflect the like
              setRecipe(prevRecipe => ({
                ...prevRecipe,
                likes: [...prevRecipe.likes, userId] // Add the user ID to the likes array
              }));
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
                'Authorization': `Bearer ${token}` // Include the user's JWT token for authentication
              }
            });
        
            if (response.ok) {
              console.log('Unliked successfully');
              // Update the recipe state to reflect the unlike
              setRecipe(prevRecipe => ({
                ...prevRecipe,
                likes: prevRecipe.likes.filter(likeUserId => likeUserId !== userId) // Remove the user ID from the likes array
              }));
            } else {
              const errorData = await response.json();
              console.error('Unliked error:', errorData.message || 'Failed to follow user');
            }
          } catch (error) {
            console.error('Error unliking recipe:', error);
          }
        };
        


    if (loading) {
        return <div>Loading...</div>;
    }
  
    if (error) {
        return <div>Error: {error}</div>;
    }

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
                      <div className="text-center mt-2">
                        {recipe.likes.includes(userId) ? (
                          <button className="btn btn-danger" onClick={() => handleUnlike(recipe._id)}>Unlike</button>
                        ) : (
                          <button className="btn btn-success" onClick={() => handleLike(recipe._id)}>Like</button>
                        )}
                      </div>
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
                          <p className="card-text text-center">{recipe.instructions}</p>
                        </div>
                        <div className="col-lg-12">
                          <h5 className="card-title text-center">Comments:</h5>
                          {recipe.comments && recipe.comments.length > 0 ? (
                            recipe.comments.map((comment, index) => (
                              <div key={index}>
                                <p className='text-center'><strong>{comment.user.username ? comment.user.username : 'Deleted User'}:</strong> {comment.text}</p>
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
