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

    return (
        <div className="App">
            <Navbar />
            <h1>Hello, {username} craving something?</h1>
            <div>
                <h2>Random Product:</h2>
                {randomRecipe && (
                    <div className="card">
                        <img
                            src={randomRecipe.image}
                            className="card-img-top img-fluid"
                            alt={randomRecipe.title}
                            style={{ height: "200px", objectFit: "contain" }}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{randomRecipe.title}</h5>
                            <p className="card-text">{randomRecipe.ingredients}</p>
                            <p className="card-text">{randomRecipe.instructions}</p>
                            <p className="card-text">{randomRecipe.category}</p>
                        </div>
                    </div>
                )}
                <button onClick={handlePrevClick}>←</button>
                <button onClick={handleNextClick}>→</button>
                <button onClick={handleCreateRecipe}>Create Recipe</button>
            </div>
        </div>
    );
}

export default Homepage;
