import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function Account() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const usernameResponse = Cookies.get('username');
    const emailResponse = Cookies.get('email');

    useEffect(() => {

        if (token) {
            const decodedToken = jwtDecode(token); // so i can retrieve id of user. 
            setUsername(usernameResponse);
            setEmail(emailResponse);
            setUserId(decodedToken.userId);
        }
        else {
            navigate('/login'); 
        }
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();

        Cookies.remove('token');
        Cookies.remove('username');
        Cookies.remove('email');

        navigate('/login');
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        
        try {
            await fetch(`http://localhost:5000/api/users/delete/${userId}`, {
                method: 'DELETE',
                headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
                body: JSON.stringify({ "_id": userId })
            });
            Cookies.remove('token');
            Cookies.remove('username');
            Cookies.remove('email');    
            alert("User deleted!");
            navigate('/login');
        } catch (error) {
            alert("An error has occured.");
            console.error('ERROR:', error);
        }
    };


    return (
        <div>
            <Navbar />
            <h1> Account Information</h1>
            <h2> {username} </h2>
            <h2> {email} </h2>
            <button onClick={handleLogout}>Log Out</button>
            <button onClick={handleDelete}>Delete Account</button>
        </div>
    );
}

export default Account;