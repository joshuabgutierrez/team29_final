import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ViewRecipes() {
    const [recipeIdToDelete, setRecipeIdToDelete] = useState(null); // State to store the ID of the recipe to be deleted
    const [recipes, setRecipes] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchRecipes();
    }, [token]); // Include token as a dependency

    const handleDelete = async (recipeId) => {
        try {
            await fetch(`http://localhost:5000/api/recipes/delete/${recipeId}`, {
                method: 'DELETE',
                headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
                body: JSON.stringify({ "_id": recipeId })
            });
            alert("Recipe deleted!");
            fetchRecipes();
        } catch (error) {
            alert("An error has occurred.");
            console.error('ERROR:', error);
        }
    };
  
    useEffect(() => {
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

        fetchRecipes();
    }, [token]); // Include token as a dependency

    const handleSearchChange = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setSearchInput(inputValue);
    }

    // Ensure recipes is an array before filtering
    const filteredRecipes = Array.isArray(recipes) ? recipes.filter((recipe) => {
        return recipe.title.toLowerCase().includes(searchInput);
    }) : [];

    const openModal = (recipeId) => {
        setRecipeIdToDelete(recipeId); // Store the recipe ID in state
        setShowModal(true);
    };
    
    const closeModal = () => setShowModal(false);

    const confirmDelete = async () => {
        if (!recipeIdToDelete) return; // Check if recipeIdToDelete is set
    
        try {
            await handleDelete(recipeIdToDelete);
            closeModal(); // Close the modal after successful deletion
        } catch (error) {
            console.error('ERROR:', error);
        }
    };

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
                                placeholder="Search for your recipes"
                                onChange={handleSearchChange}
                                value={searchInput} />
                        </div>
                    </div>
                    {filteredRecipes.map(recipe => (
                        <div key={recipe._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div className="card">
                                <img
                                    src={recipe.image}
                                    className="card-img-top img-fluid"
                                    alt={recipe.title}
                                    style={{ height: "200px", objectFit: "contain" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{recipe.title}</h5>
                                    <p className="card-text">{recipe.ingredients}</p>
                                    <p className="card-text">{recipe.instructions}</p>
                                    <p className="card-text">{recipe.category}</p>
                                    <button onClick={() => navigate(`/updates/${recipe._id}`)}>Update</button>
                                    <button className="btn btn-danger" onClick={() => openModal(recipe._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this product?</p>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={confirmDelete}>Yes</button>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default ViewRecipes;
