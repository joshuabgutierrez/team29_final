import React, { useState, useEffect  } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Recipes from './Recipes';
import CreateRecipe from './CreateRecipe';
import Register from './Register';
import Account from './Account';
import UpdateAccount from './UpdateAccount';
import Login from './Login';

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
        <Route path="/" element={<Login setUsername={setUsername}/>} />
        <Route path="/homepage" element={<Homepage  />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/createrecipe" element={<CreateRecipe />} />
        <Route path="/account" element={<Account username={username} email={email} />} />
        <Route path="/updateaccount" element={<UpdateAccount />} />
        <Route path="/login" element={<Login setUsername={setUsername}/>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
