import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import Navbar from '../Navbar';

function CreateRecipe() {
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        } else {
            navigate('/login');
        }
    }, [token]);

    const handleCreateRecipe = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/recipes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    title, 
                    ingredients: ingredients.split('\n').map(ingredient => ingredient.trim()),
                    instructions, 
                    image,
                    category,
                    createdBy: userId
                 })
            });

            if (response.ok) {
                alert('Recipe created successfully!');
                navigate('/homepage'); 
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to create recipe');
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            alert('An error occurred while creating recipe. Please try again later.');
        }
    };


    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="row mt-5">
              <div className="col">
                  <h2 className="text-center mb-3">Create Recipe</h2>
                  <form onSubmit={handleCreateRecipe}>
                      <div className="form-group mb-2"> 
                          <label htmlFor="title">Title:</label>
                          <input
                              type="text"
                              className="form-control"
                              id="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                              style={{ minHeight: "50px" }} 
                          />
                      </div>
                      <div className="form-group mb-2"> 
                          <label htmlFor="ingredients">Ingredients:</label>
                          <textarea
                              className="form-control"
                              id="ingredients"
                              value={ingredients}
                              onChange={(e) => setIngredients(e.target.value)}
                              required
                              style={{ minHeight: "120px" }} 
                          />
                      </div>
                      <div className="form-group mb-2"> 
                          <label htmlFor="instructions">Instructions:</label>
                          <textarea
                              className="form-control"
                              id="instructions"
                              value={instructions}
                              onChange={(e) => setInstructions(e.target.value)}
                              required
                              style={{ minHeight: "120px" }} 
                          />
                      </div>
                      <div className="form-group mb-2"> 
                          <label htmlFor="category">Category:</label>
                          <input
                              type="text"
                              className="form-control"
                              id="category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              required
                              style={{ minHeight: "50px" }} 
                          />
                      </div>
                      <div className="form-group mb-2"> {/* Added mb-3 for margin-bottom */}
                          <label htmlFor="image">Image:</label>
                          <input
                              type="text"
                              className="form-control"
                              id="image"
                              value={image}
                              onChange={(e) => setImage(e.target.value)}
                              required
                              style={{ minHeight: "50px" }} 
                          />
                      </div>
                      <div className="text-center mt-3">
                          <button type="submit" className="btn btn-success btn-block">Create</button>
                      </div>
                  </form>
              </div>
          </div>
        </div>
      </div>
    );
}

export default CreateRecipe;