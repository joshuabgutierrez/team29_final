import React, { useState, useEffect  } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Recipes from './Recipes';
import CreateRecipe from './CreateRecipe';
import Updates from './Updates';
import ViewRecipes from './ViewRecipes';
import Register from './Register';
import Account from './Account';
import UpdateAccount from './UpdateAccount';
import About from './About';
import Login from './Login';
import Landing from './components/Landing';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Login setUsername={setUsername}/>} />
        <Route path="/homepage" element={<Homepage  />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/createrecipe" element={<CreateRecipe />} />
        <Route path="/viewrecipes" element={<ViewRecipes />} />
        <Route path="/createrecipe" element={<CreateRecipe />} />
        <Route path="/updates/:recipeId" element={<Updates />} />
        <Route path="/account" element={<Account username={username} email={email} />} />
        <Route path="/updateaccount" element={<UpdateAccount />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login setUsername={setUsername}/>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
