import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Updates() {
    const { recipeId } = useParams();
    const [userId, setUserId] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newIngredients, setNewIngredients] = useState('');
    const [newInstructions, setNewInstructions] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        } else {
            navigate('/login');
        }
    }, []);

    const handleUpdateRecipe = async (e) => {
        e.preventDefault();
        try {
            const updatedRecipe = {
                title: newTitle,
                ingredients: newIngredients,
                instructions: newInstructions,
                category: newCategory,
                image: newImage 
            };
    
            await fetch(`http://localhost:5000/api/recipes/update/${recipeId}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedRecipe)
            });

            alert("Your recipe has been updated.");
            navigate('/viewrecipes'); 
        } catch (error) {
            console.error('ERROR:', error);
        }

    };

    return (
        <div>
          <Navbar />
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-6 mx-auto">
                    <h2 className="text-center mb-3">Update Recipe</h2>
                    <form onSubmit={handleUpdateRecipe}>
                      <div className="mb-3"> 
                        <label htmlFor="title" className="form-label">Title:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </div>
                      <div className="mb-3"> 
                        <label htmlFor="ingredients" className="form-label">Ingredients:</label>
                        <textarea
                          className="form-control"
                          id="ingredients"
                          value={newIngredients}
                          onChange={(e) => setNewIngredients(e.target.value)}
                          rows="5"
                        />
                      </div>
                      <div className="mb-3"> 
                        <label htmlFor="instructions" className="form-label">Instructions:</label>
                        <textarea
                          className="form-control"
                          id="instructions"
                          value={newInstructions}
                          onChange={(e) => setNewInstructions(e.target.value)}
                          rows="5"
                        />
                      </div>
                      <div className="mb-3"> 
                        <label htmlFor="category" className="form-label">Category:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                      </div>
                      <div className="mb-3"> 
                        <label htmlFor="image" className="form-label">Image:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="image"
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                        />
                      </div>
                      <div className="text-center mt-3">
                        <button type="submit" className="btn btn-success btn-block">Update</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
      );
      
}

export default Updates; 