import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from './Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function Account() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const token = Cookies.get('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
            setUsername(localStorage.getItem('username') || '');
            setEmail(localStorage.getItem('email') || '');
        } else {
            navigate('/login');
        }
    }, [token, location]);

    const handleLogout = async (e) => {
        e.preventDefault();

        Cookies.remove('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');

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
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            alert("User deleted!");
            navigate('/login');
        } catch (error) {
            alert("An error has occurred.");
            console.error('ERROR:', error);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        navigate('/updateaccount');
    }

    return (
        <div>
            <Navbar />
            <h1> Account Information</h1>
            <h2> {username} </h2>
            <h2> {email} </h2>
            <button onClick={handleLogout}>Log Out</button>
            <button onClick={handleDelete}>Delete Account</button>
            <button onClick={handleUpdate}>Update Account</button>
        </div>
    );
}

export default Account;
