import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
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
            <h1>Update Recipe</h1>
            <form onSubmit={handleUpdateRecipe}>
                <label>
                    Title:
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                </label>
                <label>
                    Ingredients:
                    <input type="text" value={newIngredients} onChange={(e) => setNewIngredients(e.target.value)} />
                </label>
                <label>
                    Instructions:
                    <input type="text" value={newInstructions} onChange={(e) => setNewInstructions(e.target.value)} />
                </label>
                <label>
                    Category:
                    <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                </label>
                <label>
                    Image:
                    <input type="text" value={newInstructions} onChange={(e) => setNewImage(e.target.value)} />
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    );
      
}

export default Updates; 