import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Cookies from 'js-cookie';

function Account() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        const usernameResponse = Cookies.get('username');
        const emailResponse = Cookies.get('email');

        if (token) {
            setUsername(usernameResponse);
            setEmail(emailResponse);
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

    return (
        <div>
            <Navbar />
            <h1> Account Information</h1>
            <h2> {username} </h2>
            <h2> {email} </h2>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}

export default Account;