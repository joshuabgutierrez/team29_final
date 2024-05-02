import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function UpdateAccount() {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newBio, setNewBio] = useState('');

    const token = Cookies.get('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        } else {
            navigate('/login');
        }
    }, []);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = {
                username: newUsername,
                email: newEmail,
                bio: newBio 
            };
    
            await fetch(`http://localhost:5000/api/users/update/${userId}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedUser)
            });

            alert("Your information has been updated.");
            localStorage.setItem('username', newUsername);
            localStorage.setItem('username', newEmail);
            navigate('/account'); 
        } catch (error) {
            console.error('ERROR:', error);
        }

    };

    

    return (
        <div>
            <Navbar />
            <h1>Update Account</h1>
            <form onSubmit={handleUpdateUser}>
                <label>
                    Username:
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </label>
                <label>
                    Bio:
                    <input type="text" value={newBio} onChange={(e) => setNewBio(e.target.value)} />
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UpdateAccount;