import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function AccountView() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [followedUsers, setFollowedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const { userId } = useParams();
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedInUser(decodedToken.userId);
        } 
        else {
            navigate('/login');
        }
        fetchUsers();
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

    // For following 
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/all', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            
            const data = await response.json();
            setUsers(data || []);
            
            const followingUsers = data.filter(user => user.followers.includes(loggedInUser));
        
            setFollowedUsers(followingUsers || []);
            console.log(followedUsers)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleFollow = async (targetUserId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/follow/${targetUserId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the user's JWT token for authentication
                }
            });

            setUsers(prevUsers => {
                return prevUsers.map(user => {
                    if (user._id === targetUserId) {
                        return { ...user, followers: [...user.followers, loggedInUser] };
                    }
                    return user;
                });
            });
    
            if (response.ok) {
                setUser(prevUser => ({ ...prevUser, followers: [...prevUser.followers, loggedInUser] }));
                console.log('User followed successfully');
            } else {
                const errorData = await response.json();
                console.error('Follow user error:', errorData.message || 'Failed to follow user');
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async (targetUserId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/unfollow/${targetUserId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the user's JWT token for authentication
                }
            });

            setUsers(prevUsers => {
                return prevUsers.map(user => {
                    if (user._id === targetUserId) {
                        return { ...user, followers: user.followers.filter(id => id !== loggedInUser) };
                    }
                    return user;
                });
            });
    
            if (response.ok) {
                setUser(prevUser => ({ ...prevUser, followers: prevUser.followers.filter(id => id !== loggedInUser) }));
                console.log('User unfollowed successfully');
            } else {
                const errorData = await response.json();
                console.error('Unfollow user error:', errorData.message || 'Failed to unfollow user');
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
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
                                {user && user._id !== loggedInUser ? (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                    <button
                                        className={`btn ${user.followers.includes(loggedInUser) ? "btn-danger" : "btn-success"}`}
                                        onClick={() => user.followers.includes(loggedInUser) ? handleUnfollow(user._id) : handleFollow(user._id)}
                                        style={{ width: "100px", marginTop: "10px" }}
                                    >
                                        {user.followers.includes(loggedInUser) ? "Unfollow" : "Follow"}
                                    </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default AccountView;
