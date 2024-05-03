import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function Homepage() {
    const [recipes, setRecipes] = useState([]);
    const [randomRecipe, setRandomRecipe] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const token = Cookies.get('token');

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

    useEffect(() => {
        if (!token) {
            navigate('/login'); 
        } else {
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }
    }, []);

    useEffect(() => {
        if (recipes.length > 0 && !randomRecipe) {
            const randomIndex = Math.floor(Math.random() * recipes.length);
            setRandomRecipe(recipes[randomIndex]);
        }
    }, [recipes, randomRecipe]);

    const handleNextClick = () => {
        const nextIndex = (currentIndex + 1) % recipes.length;
        setCurrentIndex(nextIndex);
        setRandomRecipe(recipes[nextIndex]);
    };

    const handlePrevClick = () => {
        const prevIndex = (currentIndex - 1 + recipes.length) % recipes.length;
        setCurrentIndex(prevIndex);
        setRandomRecipe(recipes[prevIndex]);
    };

    const handleCreateRecipe = (e) => {
        e.preventDefault();
        navigate('/createrecipe');
    };

    // This is for your OWN recipes.
    const handleViewRecipes = (e) => {
        e.preventDefault();
        navigate('/viewrecipes');
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row mt-5">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1>Hello, {username} craving something?</h1>
                            <div>
                                <button className="btn btn-success mr-2" onClick={handleCreateRecipe}>Create Recipe</button>
                                <button className="btn btn-success mr-2" onClick={handleViewRecipes}>View Your Recipes</button>
                            </div>
                        </div>
                        {randomRecipe && (
                            <div className="card text-center" style={{ maxWidth: "400px", margin: "0 auto" }}>
                                <img
                                    src={randomRecipe.image}
                                    className="card-img-top img-fluid"
                                    alt={randomRecipe.title}
                                    style={{ height: "200px", objectFit: "contain" }}
                                />
                                <div className="card-body">
                                    <div className="mt-2">
                                        <button className="btn btn-success mr-2" onClick={handlePrevClick}>←</button>
                                        <button className="btn btn-success mr-2" onClick={handleNextClick}>→</button>
                                    </div>
                                    <div className="mt-2">
                                        <button className="btn btn-success" onClick={() => navigate(`/recipesinfo/${randomRecipe._id}`)}>View</button>
                                    </div>
                                    <div className="mt-3">
                                        <h5 className="card-title">{randomRecipe.title}</h5>
                                        <p className="card-text">Recipe By: {randomRecipe.creatorInfo.username}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
