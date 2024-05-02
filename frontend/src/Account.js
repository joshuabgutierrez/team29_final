import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from './Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function Account() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [pfp, setPfp] = useState('');
    const [password, setPassword] = useState('');
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
            setBio(localStorage.getItem('bio') || '');
            setPfp(localStorage.getItem('profilePicture') || '');
        } else {
            navigate('/login');
        }
    }, [token, location]);

    const handleLogout = async (e) => {
        e.preventDefault();

        Cookies.remove('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('bio');
        localStorage.removeItem('profilePicture');

        navigate('/login');
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        // Call the login API to check the password before proceeding with deletion
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                // Password verified, proceed with account deletion
                const responseData = await response.json();
                await fetch(`http://localhost:5000/api/users/delete/${userId}`, {
                    method: 'DELETE',
                    headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
                    body: JSON.stringify({ "_id": userId })
                });
                Cookies.remove('token');

                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.removeItem('bio');
                localStorage.removeItem('profilePicture');

                alert("User deleted!");
                navigate('/login');
            } else {
                // Password incorrect, show error message
                const errorData = await response.json();
                alert(errorData.message || 'Password incorrect');
            }
        } catch (error) {
            alert("An error has occurred.");
            console.error('ERROR:', error);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        navigate('/updateaccount');
    }

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <div>
            <Navbar />
            <h1> Account Information</h1>
            <div style={{ textAlign: "center" }}>
                <img
                    src={pfp}
                    className="rounded-circle"
                    alt={username}
                    style={{ height: "205px", width: "250px", objectFit: "cover" }}
                />
            </div>
            <h2> {username} </h2>
            <h2> {email} </h2>
            <h2> {bio} </h2>
            <button onClick={handleLogout}>Log Out</button>
            <button onClick={() => setShowModal(true)}>Delete Account</button>
            <button onClick={handleUpdate}>Update Account</button>

            <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete your account?</p>
                            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Yes</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
