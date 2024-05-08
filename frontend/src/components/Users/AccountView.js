import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function AccountView() {
    const { userId } = useParams();
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } 
        fetchUserData();
    }, [token, location]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            
            const data = await response.json();
            setUser(data.user);

            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h1 className="card-title text-center mb-4">Account Information</h1>
                                {user && (
                                    <div className="text-center">
                                        <img
                                            src={user.profilePicture}
                                            className="rounded-circle img-fluid mb-4"
                                            alt={user.username}
                                            style={{ maxHeight: "200px", maxWidth: "330px", objectFit: "cover" }}
                                        />
                                        <h2 className="text-center mb-3">{user.username}</h2>
                                        <p className="text-center mb-4">{user.bio}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default AccountView;
