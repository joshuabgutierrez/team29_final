import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
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
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        } else {
            navigate('/login');
        }
        fetchRecipes();
    }, [location, token]); 
  
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
            setRecipe(data.recipe); 
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
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.ok) {
                console.log('Liked successfully');

                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    likes: [...prevRecipe.likes, userId] 
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
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                console.log('Unliked successfully');
               
                setRecipe(prevRecipe => ({
                    ...prevRecipe,
                    likes: prevRecipe.likes.filter(likeUserId => likeUserId !== userId) 
                }));

            } else {
                const errorData = await response.json();
                console.error('Unliked error:', errorData.message || 'Failed to follow user');
            }
        } catch (error) {
            console.error('Error unliking recipe:', error);
        }
    };

    const handlePostComment = async (targetRecipeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/recipes/${targetRecipeId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ text: comment })
            });

            if (response.ok) {
                console.log('Commented successfully');
                fetchRecipes();
                setShowModal(false);
            } else {
                const errorData = await response.json();
                console.error('Comment error:', errorData.message || 'Failed to comment :(');
            }
        } catch (error) {
            console.error('Error commenting recipe:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
      try {
          const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/comment`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ commentId }) // Send the commentId in the request body
          });

          if (response.ok) {
              console.log('Comment deleted!');
              fetchRecipes();
          } else {
              const errorData = await response.json();
              console.error('Comment deletion error:', errorData.message || 'Failed to delete comment');
          }
      } catch (error) {
          console.error('Error deleting comment:', error);
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
                                            <button className="btn btn-success" onClick={() => setShowModal(true)}>Comment</button>
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
                                                      <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                      <p style={{ flex: 1 }}>
                                                          <strong>{comment.user.username ? comment.user.username : 'Deleted User'}:</strong> {comment.text}
                                                      </p>
                                                      {comment.user._id === userId && (
                                                           <button className="btn btn-sm btn-success" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                                      )}
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

            <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Comment</h5>
                        </div>
                        <div className="modal-body">
                            <p>Add a comment</p>
                            <input type="text" className="form-control mb-3" placeholder="Type your comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={() => handlePostComment(recipe._id)}>Yes</button>
                            <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default RecipesInfo;
