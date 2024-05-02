import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import Navbar from './Navbar';

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
                    ingredients, 
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
        <div className="App">
            <Navbar />
          <h2>Create Recipe</h2>
          <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <br />
          <label>
              Ingredients:
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
              />
            </label>
            <br />
          <label>
              Instructions:
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Category:
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Image:
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit" onClick={handleCreateRecipe}>Create</button>
          <br />
        </div>
      );
}

export default CreateRecipe;